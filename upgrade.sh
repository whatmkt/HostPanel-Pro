#!/bin/bash
set -euo pipefail

# HostPanel Pro Upgrader

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
BACKUP_DIR="/var/backups/hostpanel"
LOG_FILE="/var/log/hostpanel/upgrade.log"

check_root() {
  if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root"
    exit 1
  fi
}

backup_before_upgrade() {
  info "Creating backup before upgrade..."
  mkdir -p "$BACKUP_DIR/upgrade-$(date +%Y%m%d-%H%M%S)"
  local bk="$BACKUP_DIR/upgrade-$(date +%Y%m%d-%H%M%S)"

  # Backup database
  if command -v pg_dump &>/dev/null; then
    su - postgres -c "pg_dump hostpanel" > "$bk/database.sql" 2>/dev/null || true
  fi

  # Backup config
  cp "$APP_DIR/.env" "$bk/.env" 2>/dev/null || true

  # Backup important dirs
  cp -r "$APP_DIR/infra" "$bk/infra" 2>/dev/null || true

  log "Backup saved to $bk"
  echo "$bk" > /tmp/hostpanel_upgrade_backup_path
}

enter_maintenance_mode() {
  info "Entering maintenance mode..."
  touch "$APP_DIR/.maintenance"
  log "Maintenance mode enabled"
}

exit_maintenance_mode() {
  info "Exiting maintenance mode..."
  rm -f "$APP_DIR/.maintenance"
  log "Maintenance mode disabled"
}

stop_services() {
  info "Stopping services..."
  systemctl stop hostpanel-api 2>/dev/null || true
  systemctl stop hostpanel-worker 2>/dev/null || true
  log "Services stopped"
}

start_services() {
  info "Starting services..."
  systemctl start hostpanel-api
  systemctl start hostpanel-worker
  log "Services started"
}

update_code() {
  info "Updating codebase..."
  if [[ -d "$APP_DIR/.git" ]]; then
    sudo -u hostpanel git -C "$APP_DIR" pull origin main
  else
    warn "No git repository found, skipping pull"
  fi
}

install_deps() {
  info "Installing dependencies..."
  sudo -u hostpanel bash -c "cd $APP_DIR && npm ci" 2>&1 | tail -1
  log "Dependencies updated"
}

run_migrations() {
  info "Running database migrations..."
  sudo -u hostpanel bash -c "cd $APP_DIR && npm run db:migrate" 2>&1 | tail -3
  log "Migrations applied"
}

build_app() {
  info "Building application..."
  sudo -u hostpanel bash -c "cd $APP_DIR && npm run build" 2>&1 | tail -3
  log "Build complete"
}

check_health() {
  info "Checking API health..."
  sleep 3
  local health
  if health=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null); then
    if [[ "$health" == "200" ]]; then
      log "API health check passed"
      return 0
    fi
  fi
  error "API health check failed (HTTP $health)"
  return 1
}

rollback() {
  error "UPGRADE FAILED - Rolling back..."
  local bk
  bk=$(cat /tmp/hostpanel_upgrade_backup_path 2>/dev/null || echo "")

  if [[ -n "$bk" && -f "$bk/database.sql" ]]; then
    warn "Restoring database backup..."
    su - postgres -c "psql hostpanel < $bk/database.sql" 2>/dev/null || true
  fi

  if [[ -n "$bk" && -f "$bk/.env" ]]; then
    cp "$bk/.env" "$APP_DIR/.env"
  fi

  exit_maintenance_mode
  start_services
  error "Rollback complete. Check logs for details."
  exit 1
}

finish() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  HostPanel Pro Upgraded Successfully     ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
  echo ""
  log "Check status: systemctl status hostpanel-api"
}

# ─── Main ────────────────────────────────────────────────────────────
main() {
  echo ""
  echo "============================================"
  echo "   HostPanel Pro Upgrader v1.0.0"
  echo "============================================"
  echo ""

  check_root

  backup_before_upgrade
  enter_maintenance_mode
  stop_services

  if ! update_code; then
    rollback
  fi

  if ! install_deps; then
    rollback
  fi

  if ! run_migrations; then
    rollback
  fi

  if ! build_app; then
    rollback
  fi

  start_services

  if ! check_health; then
    rollback
  fi

  exit_maintenance_mode
  finish
}

main "$@" 2>&1 | tee -a "$LOG_FILE"