#!/bin/bash
set -euo pipefail

# HostPanel Pro Uninstaller

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*"; }

check_root() {
  if [[ $EUID -ne 0 ]]; then
    error "This script must be run as root"
    exit 1
  fi
}

CONFIRM="${CONFIRM:-}"

confirm() {
  if [[ "$CONFIRM" == "yes" ]]; then
    return 0
  fi
  
  echo ""
  echo -e "${RED}╔══════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  WARNING: This will remove HostPanel Pro  ║${NC}"
  echo -e "${RED}║  All panel data, configs, and services    ║${NC}"
  echo -e "${RED}║  will be permanently deleted.            ║${NC}"
  echo -e "${RED}║  Websites and databases ARE NOT affected. ║${NC}"
  echo -e "${RED}╚══════════════════════════════════════════╝${NC}"
  echo ""
  read -rp "Type 'yes' to confirm uninstall: " answer
  
  if [[ "$answer" != "yes" ]]; then
    error "Uninstall cancelled"
    exit 1
  fi
}

stop_services() {
  log "Stopping HostPanel services..."
  systemctl stop hostpanel-api 2>/dev/null || true
  systemctl stop hostpanel-worker 2>/dev/null || true
  systemctl disable hostpanel-api 2>/dev/null || true
  systemctl disable hostpanel-worker 2>/dev/null || true
  rm -f /etc/systemd/system/hostpanel-api.service
  rm -f /etc/systemd/system/hostpanel-worker.service
  systemctl daemon-reload
}

remove_nginx() {
  log "Removing nginx configuration..."
  rm -f /etc/nginx/sites-enabled/hostpanel
  rm -f /etc/nginx/sites-available/hostpanel
  systemctl reload nginx 2>/dev/null || true
}

remove_app() {
  log "Removing application files..."
  rm -rf /opt/hostpanel
}

remove_backups() {
  warn "Removing panel backups..."
  rm -rf /var/backups/hostpanel
}

remove_logs() {
  warn "Removing panel logs..."
  rm -rf /var/log/hostpanel
}

remove_user() {
  log "Removing system user..."
  userdel hostpanel 2>/dev/null || true
}

drop_database() {
  local DROP_DB="${DROP_DB:-}"
  
  if [[ "$DROP_DB" == "yes" ]]; then
    warn "Dropping HostPanel database..."
    su - postgres -c "dropdb hostpanel" 2>/dev/null || true
  else
    warn "Database preserved. Use DROP_DB=yes to also drop the database."
  fi
}

remove_docker_containers() {
  if command -v docker &>/dev/null; then
    warn "Removing Docker containers..."
    docker compose -f /opt/hostpanel/docker-compose.yml down --volumes 2>/dev/null || true
    docker compose -f /opt/hostpanel/docker-compose.prod.yml down --volumes 2>/dev/null || true
  fi
}

finish() {
  echo ""
  echo -e "${GREEN}HostPanel Pro has been uninstalled.${NC}"
  echo "Websites, databases, and user data remain untouched."
}

main() {
  echo ""
  echo "============================================"
  echo "   HostPanel Pro Uninstaller v1.0.0"
  echo "============================================"
  echo ""

  check_root
  confirm
  stop_services
  remove_nginx
  remove_app
  remove_backups
  remove_logs
  remove_user
  drop_database
  finish

  echo ""
}

main "$@"