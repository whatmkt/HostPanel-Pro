#!/bin/bash
set -euo pipefail

# HostPanel Pro Panel Backup Script
# Backs up the panel itself (not websites/hosting data)

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
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="hostpanel-panel-backup-${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

check_root() {
  if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root"
    exit 1
  fi
}

create_dirs() {
  mkdir -p "$BACKUP_PATH"
}

backup_database() {
  info "Backing up PostgreSQL database..."
  if command -v pg_dump &>/dev/null; then
    su - postgres -c "pg_dump hostpanel" > "$BACKUP_PATH/database.sql" 2>/dev/null
    log "Database backup: $(wc -c < "$BACKUP_PATH/database.sql") bytes"
  else
    warn "pg_dump not found, copying PostgreSQL data directory instead"
    cp -r /var/lib/postgresql "$BACKUP_PATH/postgresql-data" 2>/dev/null || true
  fi
}

backup_config() {
  info "Backing up configuration..."
  cp "$APP_DIR/.env" "$BACKUP_PATH/.env" 2>/dev/null || true
  cp "$APP_DIR/.env.example" "$BACKUP_PATH/.env.example" 2>/dev/null || true
  
  # Redis data
  if [[ -d /var/lib/redis ]]; then
    cp /var/lib/redis/dump.rdb "$BACKUP_PATH/redis-dump.rdb" 2>/dev/null || true
  fi
  
  # nginx config
  cp -r /etc/nginx/sites-available/hostpanel "$BACKUP_PATH/nginx-hostpanel.conf" 2>/dev/null || true
  
  # systemd services
  if [[ -d /etc/systemd/system ]]; then
    mkdir -p "$BACKUP_PATH/systemd"
    cp /etc/systemd/system/hostpanel-*.service "$BACKUP_PATH/systemd/" 2>/dev/null || true
  fi
  
  # Agent config if exists
  if [[ -f /etc/hostpanel/agent.conf ]]; then
    cp /etc/hostpanel/agent.conf "$BACKUP_PATH/agent.conf" 2>/dev/null || true
  fi

  log "Configuration backed up"
}

backup_custom_data() {
  info "Backing up custom data..."
  
  # Extension data
  if [[ -d "$APP_DIR/extensions" ]]; then
    cp -r "$APP_DIR/extensions" "$BACKUP_PATH/extensions" 2>/dev/null || true
  fi
  
  # Custom templates
  if [[ -d "$APP_DIR/infra/templates" ]]; then
    cp -r "$APP_DIR/infra/templates" "$BACKUP_PATH/templates" 2>/dev/null || true
  fi

  # Logs (last 7 days)
  if [[ -d /var/log/hostpanel ]]; then
    mkdir -p "$BACKUP_PATH/logs"
    find /var/log/hostpanel -type f -mtime -7 -exec cp {} "$BACKUP_PATH/logs/" \; 2>/dev/null || true
  fi

  log "Custom data backed up"
}

create_manifest() {
  info "Creating manifest..."
  cat > "$BACKUP_PATH/manifest.json" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "timestamp": "$(date -Iseconds)",
  "hostname": "$(hostname)",
  "panel_version": "${HOSTPANEL_VERSION:-1.0.0}",
  "os": "$(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)",
  "components": {
    "database": true,
    "config": true,
    "custom_data": true
  },
  "checksums": {}
}
EOF
  log "Manifest created"
}

generate_checksums() {
  info "Generating checksums..."
  cd "$BACKUP_PATH"
  find . -type f ! -name "manifest.json" ! -name "checksums.sha256" -exec sha256sum {} \; > checksums.sha256
  log "SHA-256 checksums generated"
}

create_archive() {
  info "Creating compressed archive..."
  cd "$BACKUP_DIR"
  tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME" 2>/dev/null
  local size
  size=$(du -h "${BACKUP_NAME}.tar.gz" | cut -f1)
  log "Backup archive: ${BACKUP_NAME}.tar.gz ($size)"
}

encrypt_backup() {
  if [[ "${ENCRYPT:-no}" == "yes" ]]; then
    info "Encrypting backup..."
    if [[ -n "${BACKUP_ENCRYPTION_KEY:-}" ]]; then
      openssl enc -aes-256-gcm -salt -in "${BACKUP_PATH}.tar.gz" -out "${BACKUP_PATH}.tar.gz.enc" -k "$BACKUP_ENCRYPTION_KEY" 2>/dev/null
      rm "${BACKUP_PATH}.tar.gz"
      log "Backup encrypted: ${BACKUP_NAME}.tar.gz.enc"
    else
      warn "BACKUP_ENCRYPTION_KEY not set, skipping encryption"
    fi
  fi
}

cleanup_temp() {
  info "Cleaning up temporary files..."
  rm -rf "$BACKUP_PATH"
  log "Temporary files cleaned"
}

copy_to_remote() {
  local REMOTE="${BACKUP_REMOTE:-}"
  if [[ -n "$REMOTE" ]]; then
    info "Copying backup to remote destination..."
    local FILE
    FILE=$(ls -t "${BACKUP_DIR}"/${BACKUP_NAME}.tar.gz* | head -1)
    
    if [[ "$REMOTE" =~ ^sftp:// ]]; then
      warn "SFTP destination (requires sshpass or key): $REMOTE"
      # scp "$FILE" user@host:/path/
    elif [[ "$REMOTE" =~ ^s3:// ]]; then
      warn "S3 destination: $REMOTE"
      # aws s3 cp "$FILE" "$REMOTE"
    else
      warn "Unknown remote protocol: $REMOTE"
    fi
  fi
}

apply_retention() {
  local KEEP="${BACKUP_RETENTION:-7}"
  info "Applying retention policy (keeping last $KEEP backups)..."
  local count
  count=$(ls -1 "$BACKUP_DIR"/hostpanel-panel-backup-*.tar.gz* 2>/dev/null | wc -l)
  
  if [[ $count -gt $KEEP ]]; then
    ls -1t "$BACKUP_DIR"/hostpanel-panel-backup-*.tar.gz* | tail -n +$((KEEP + 1)) | xargs rm -f
    log "Removed old backups (kept $KEEP)"
  else
    log "$count backups, within retention limit"
  fi
}

finish() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  Panel Backup Completed Successfully     ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
  echo ""
  
  local FILE
  FILE=$(ls -1t "$BACKUP_DIR"/hostpanel-panel-backup-*.tar.gz* 2>/dev/null | head -1)
  echo "  Backup: $FILE"
  echo "  Size:   $(du -h "$FILE" | cut -f1)"
  echo ""
}

main() {
  echo ""
  echo "============================================"
  echo "   HostPanel Pro - Panel Backup"
  echo "============================================"
  echo ""

  check_root
  create_dirs
  backup_database
  backup_config
  backup_custom_data
  create_manifest
  generate_checksums
  create_archive
  encrypt_backup
  cleanup_temp
  copy_to_remote
  apply_retention
  finish
}

main "$@"