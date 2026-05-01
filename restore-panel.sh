#!/bin/bash
set -euo pipefail

# HostPanel Pro Panel Restore Script
# Restores the panel from a backup archive

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }
info()  { echo -e "${BLUE}[STEP]${NC}  $*"; }

APP_DIR="/opt/hostpanel"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/hostpanel}"
RESTORE_DIR="/tmp/hostpanel-restore-$$"

check_root() {
  if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root"
    exit 1
  fi
}

find_latest_backup() {
  info "Looking for latest backup..."
  local FILE
  FILE=$(ls -1t "$BACKUP_DIR"/hostpanel-panel-backup-*.tar.gz* 2>/dev/null | head -1)
  
  if [[ -z "$FILE" ]]; then
    error "No backups found in $BACKUP_DIR"
    exit 1
  fi
  
  echo "$FILE"
}

list_backups() {
  info "Available backups:"
  echo ""
  ls -1th "$BACKUP_DIR"/hostpanel-panel-backup-*.tar.gz* 2>/dev/null | head -20 || echo "  (none found)"
  echo ""
}

select_backup() {
  local BACKUP_FILE="${BACKUP_FILE:-}"
  
  if [[ -n "$BACKUP_FILE" ]]; then
    if [[ -f "$BACKUP_FILE" ]]; then
      echo "$BACKUP_FILE"
      return
    else
      error "Backup file not found: $BACKUP_FILE"
      exit 1
    fi
  fi
  
  if [[ "${AUTO_LATEST:-no}" == "yes" ]]; then
    find_latest_backup
    return
  fi
  
  list_backups
  local latest
  latest=$(find_latest_backup)
  log "Latest backup: $(basename "$latest")"
  
  read -rp "Enter backup filename to restore (or press Enter for latest): " choice
  if [[ -z "$choice" ]]; then
    echo "$latest"
  elif [[ -f "$BACKUP_DIR/$choice" ]]; then
    echo "$BACKUP_DIR/$choice"
  elif [[ -f "$choice" ]]; then
    echo "$choice"
  else
    error "Backup not found: $choice"
    exit 1
  fi
}

confirm_restore() {
  echo ""
  echo -e "${RED}╔══════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  WARNING: Restoring will overwrite       ║${NC}"
  echo -e "${RED}║  current panel data!                     ║${NC}"
  echo -e "${RED}║  Backup file: $1                         ║${NC}"
  echo -e "${RED}╚══════════════════════════════════════════╝${NC}"
  echo ""
  
  if [[ "${FORCE:-no}" != "yes" ]]; then
    read -rp "Type 'yes' to confirm restore: " answer
    if [[ "$answer" != "yes" ]]; then
      error "Restore cancelled"
      exit 1
    fi
  fi
}

decrypt_backup() {
  local FILE="$1"
  if [[ "$FILE" =~ \.enc$ ]]; then
    info "Decrypting backup..."
    if [[ -n "${BACKUP_ENCRYPTION_KEY:-}" ]]; then
      local DECRYPTED="${FILE%.enc}"
      openssl enc -aes-256-gcm -d -in "$FILE" -out "$DECRYPTED" -k "$BACKUP_ENCRYPTION_KEY" 2>/dev/null
      echo "$DECRYPTED"
    else
      error "Encrypted backup but BACKUP_ENCRYPTION_KEY not set"
      exit 1
    fi
  else
    echo "$FILE"
  fi
}

extract_backup() {
  local FILE="$1"
  info "Extracting backup..."
  mkdir -p "$RESTORE_DIR"
  tar -xzf "$FILE" -C "$RESTORE_DIR" 2>/dev/null
  log "Backup extracted to $RESTORE_DIR"
}

verify_backup() {
  info "Verifying backup integrity..."
  if [[ -f "$RESTORE_DIR/"*/checksums.sha256 ]]; then
    cd "$(dirname "$RESTORE_DIR/"*/checksums.sha256)"
    sha256sum -c checksums.sha256 2>/dev/null | tail -5
    log "Checksums verified"
  else
    warn "No checksum file found - skipping verification"
  fi
}

stop_services() {
  info "Stopping services..."
  systemctl stop hostpanel-api 2>/dev/null || true
  systemctl stop hostpanel-worker 2>/dev/null || true
  log "Services stopped"
}

restore_database() {
  info "Restoring database..."
  if [[ -f "$RESTORE_DIR/"*/database.sql ]]; then
    local DB_FILE
    DB_FILE=$(ls "$RESTORE_DIR/"*/database.sql | head -1)
    
    # Drop and recreate database
    su - postgres -c "dropdb hostpanel" 2>/dev/null || true
    su - postgres -c "createdb hostpanel -O hostpanel" 2>/dev/null
    
    # Restore
    su - postgres -c "psql hostpanel" < "$DB_FILE" 2>/dev/null
    log "Database restored from $(basename "$DB_FILE") ($(wc -c < "$DB_FILE") bytes)"
  else
    warn "No database dump found in backup"
  fi
}

restore_config() {
  info "Restoring configuration..."
  local SRC
  SRC=$(ls -d "$RESTORE_DIR/"*/ 2>/dev/null | head -1)
  
  if [[ -f "$SRC.env" ]]; then
    cp "$SRC.env" "$APP_DIR/.env"
    log "Environment restored"
  fi
  
  if [[ -f "$SRC.redis-dump.rdb" ]]; then
    cp "$SRC.redis-dump.rdb" /var/lib/redis/dump.rdb
    chown redis:redis /var/lib/redis/dump.rdb
    log "Redis data restored"
  fi
  
  if [[ -f "$SRC.agent.conf" ]]; then
    mkdir -p /etc/hostpanel
    cp "$SRC.agent.conf" /etc/hostpanel/agent.conf
    log "Agent config restored"
  fi
  
  if [[ -d "$SRC.systemd" ]]; then
    cp "$SRC.systemd"/*.service /etc/systemd/system/
    systemctl daemon-reload
    log "Systemd services restored"
  fi
}

restore_custom_data() {
  info "Restoring custom data..."
  local SRC
  SRC=$(ls -d "$RESTORE_DIR/"*/ 2>/dev/null | head -1)
  
  if [[ -d "$SRC.extensions" ]]; then
    cp -r "$SRC.extensions" "$APP_DIR/"
    log "Extensions restored"
  fi
  
  if [[ -d "$SRC.templates" ]]; then
    cp -r "$SRC.templates" "$APP_DIR/infra/"
    log "Templates restored"
  fi
}

reinstall_deps() {
  info "Reinstalling dependencies..."
  sudo -u hostpanel bash -c "cd $APP_DIR && npm ci" 2>&1 | tail -1
  log "Dependencies reinstalled"
}

run_migrations() {
  info "Running pending migrations..."
  sudo -u hostpanel bash -c "cd $APP_DIR && npm run db:migrate" 2>&1 | tail -3
  log "Migrations applied"
}

start_services() {
  info "Starting services..."
  systemctl start hostpanel-api
  systemctl start hostpanel-worker
  sleep 3
  
  # Check health
  local health
  if health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null); then
    if [[ "$health" == "200" ]]; then
      log "Services started and healthy"
    else
      warn "API started but health check returned $health"
    fi
  else
    warn "Could not verify API health"
  fi
}

cleanup() {
  info "Cleaning up..."
  rm -rf "$RESTORE_DIR"
  log "Temporary files removed"
}

finish() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  Panel Restored Successfully             ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
  echo ""
  echo "  Check:    systemctl status hostpanel-api"
  echo "  Logs:     journalctl -u hostpanel-api -f"
  echo ""
}

main() {
  echo ""
  echo "============================================"
  echo "   HostPanel Pro - Panel Restore"
  echo "============================================"
  echo ""

  check_root

  local BACKUP_FILE
  BACKUP_FILE=$(select_backup)
  
  confirm_restore "$BACKUP_FILE"

  local DECRYPTED_FILE
  DECRYPTED_FILE=$(decrypt_backup "$BACKUP_FILE")

  stop_services
  extract_backup "$DECRYPTED_FILE"
  verify_backup
  restore_database
  restore_config
  restore_custom_data
  reinstall_deps
  run_migrations
  start_services
  cleanup

  finish
}

main "$@"