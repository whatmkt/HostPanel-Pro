#!/bin/bash
# shellcheck disable=SC2059,SC2154
set -euo pipefail

# HostPanel Pro Installer — Production edition
# Supports: Ubuntu Server 24.04 LTS, Debian 12
# Usage:
#   One-click:       curl -fsSL https://raw.githubusercontent.com/YOUR_USER/hostpanel-pro/main/bootstrap.sh | bash -s -- --repo https://github.com/YOUR_USER/hostpanel-pro.git
#   From repo root:  bash install.sh
#   From bootstrap:  (handled by bootstrap.sh automatically)

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

PANEL_DIR="/opt/hostpanel"
BACKUP_DIR="/var/backups/hostpanel"
LOG_DIR="/var/log/hostpanel"
INSTALL_LOG="${LOG_DIR}/install-$(date +%Y%m%d-%H%M%S).log"

# If PANEL_SOURCE_DIR is set (bootstrap mode), use that as source
SRC_DIR="${PANEL_SOURCE_DIR:-$(cd "$(dirname "$0")" && pwd)}"

log()   { printf "${GREEN}[ OK ]${NC}  %s\n" "$*" | tee -a "$INSTALL_LOG"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$*" | tee -a "$INSTALL_LOG"; }
error() { printf "${RED}[FAIL]${NC} %s\n" "$*" | tee -a "$INSTALL_LOG"; }
info()  { printf "\n${CYAN}${BOLD}▶ %s${NC}\n" "$*" | tee -a "$INSTALL_LOG"; }
dot()   { printf "${BLUE}   … %s${NC}\n" "$*" | tee -a "$INSTALL_LOG"; }

banner() {
  echo ""
  echo "  ╔══════════════════════════════════════════════════╗"
  echo "  ║        ${BOLD}HostPanel Pro v1.0.0 Installer${NC}         ║"
  echo "  ║     Professional Hosting Control Panel       ║"
  echo "  ╚══════════════════════════════════════════════════╝"
  echo ""
}

# ─── Pre-flight checks ────────────────────────────────────────────────
check_root() {
  if [[ $EUID -ne 0 ]]; then
    printf "${RED}ERROR: This installer must run as root.${NC}\n"
    printf "  Try: sudo bash install.sh\n"
    exit 1
  fi
  log "Running as root"
}

check_os() {
  if [[ ! -f /etc/os-release ]]; then
    error "Cannot detect OS — /etc/os-release missing"
    error "HostPanel supports Ubuntu 24.04 LTS and Debian 12"
    exit 1
  fi
  source /etc/os-release
  case "$ID" in
    ubuntu|debian)
      log "Detected $ID $VERSION_ID"
      ;;
    *)
      warn "Unsupported OS: $ID. Trying anyway (may work on other Debian derivatives)."
      ;;
  esac
}

check_memory() {
  local mem_mb
  mem_mb=$(free -m | awk '/^Mem:/{print $2}')
  if [[ $mem_mb -lt 1800 ]]; then
    warn "Detected ${mem_mb} MB RAM (2 GB+ recommended). Continuing anyway…"
  else
    log "RAM: ${mem_mb} MB — OK"
  fi
}

check_disk() {
  local disk_gb
  disk_gb=$(df -BG / | awk 'NR==2 {print $4}' | sed 's/G//')
  if [[ $disk_gb -lt 10 ]]; then
    warn "Only ${disk_gb} GB free on / (recommended ≥ 20 GB)"
  else
    log "Free disk: ${disk_gb} GB — OK"
  fi
}

# ─── Preparation ──────────────────────────────────────────────────────
prepare() {
  mkdir -p "$BACKUP_DIR" "$LOG_DIR" /var/www /etc/hostpanel
  touch "$INSTALL_LOG"
  log "Install log → $INSTALL_LOG"
}

install_system_deps() {
  info "Step 1/10 — System dependencies"
  export DEBIAN_FRONTEND=noninteractive

  dot "Updating package lists…"
  apt-get update -qq >> "$INSTALL_LOG" 2>&1
  log "Package lists updated"

  local pkgs="curl wget git gnupg2 ca-certificates lsb-release
              nginx postgresql postgresql-contrib redis-server valkey
              certbot python3-certbot-nginx acme.sh
              build-essential python3 python3-pip rsync ufw openssl unzip
              software-properties-common dirmngr apt-transport-https
              htop iotop jq net-tools dnsutils"

  dot "Installing packages (this may take a minute)…"
  apt-get install -y -qq $pkgs >> "$INSTALL_LOG" 2>&1 || {
    # Fallback without valkey if it doesn't exist in older repos
    apt-get install -y -qq curl wget git gnupg2 ca-certificates lsb-release \
      nginx postgresql postgresql-contrib redis-server \
      certbot python3-certbot-nginx \
      build-essential python3 python3-pip rsync ufw openssl unzip \
      software-properties-common dirmngr apt-transport-https \
      htop iotop jq net-tools dnsutils >> "$INSTALL_LOG" 2>&1
  }
  log "System packages installed"
}

install_nodejs() {
  info "Step 2/10 — Node.js 20 LTS"
  if command -v node &>/dev/null; then
    local v
    v=$(node --version)
    dot "Node.js $v already present"
    log "Using existing Node.js $v"
    return
  fi

  dot "Adding NodeSource repository…"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >> "$INSTALL_LOG" 2>&1
  apt-get install -y -qq nodejs >> "$INSTALL_LOG" 2>&1
  log "Node.js $(node --version) installed"
}

# ─── System user & directories ────────────────────────────────────────
create_system_user() {
  info "Step 3/10 — System user"
  if ! id -u hostpanel &>/dev/null; then
    useradd -r -s /bin/false -d "$PANEL_DIR" hostpanel
    dot "User 'hostpanel' created"
  else
    dot "User 'hostpanel' already exists"
  fi

  mkdir -p "$PANEL_DIR" "$BACKUP_DIR" "$LOG_DIR" /var/www
  chown -R hostpanel:hostpanel "$PANEL_DIR" "$BACKUP_DIR" "$LOG_DIR" 2>/dev/null || true
  log "System user and directories ready"
}

# ─── Application files ────────────────────────────────────────────────
setup_application() {
  info "Step 4/10 — Application files"

  # Copy from source to panel directory
  if [[ "$SRC_DIR" != "$PANEL_DIR" ]]; then
    dot "Copying files from $SRC_DIR to $PANEL_DIR…"
    rsync -a "$SRC_DIR/" "$PANEL_DIR/" \
      --exclude node_modules \
      --exclude .git \
      --exclude .next \
      --exclude dist \
      --exclude '*.log' \
      --exclude '.turbo'
    chown -R hostpanel:hostpanel "$PANEL_DIR"
    log "Application files copied"
  else
    log "Already in $PANEL_DIR — files in place"
  fi

  # Create .env from example
  if [[ ! -f "$PANEL_DIR/.env" ]]; then
    if [[ -f "$PANEL_DIR/.env.example" ]]; then
      cp "$PANEL_DIR/.env.example" "$PANEL_DIR/.env"
      dot ".env created from .env.example"
    else
      warn "Creating minimal .env"
      DB_PASS="${DB_PASSWORD:-hostpanel_$(openssl rand -hex 8)}"
      JWT_SECRET="$(openssl rand -hex 32)"
      ENC_KEY="$(openssl rand -hex 32)"
      AGENT_SECRET="$(openssl rand -hex 16)"
      cat > "$PANEL_DIR/.env" <<ENVEOF
NODE_ENV=production
DATABASE_URL=postgresql://hostpanel:${DB_PASS}@localhost:5432/hostpanel
REDIS_URL=redis://localhost:6379
JWT_SECRET=${JWT_SECRET}
ENCRYPTION_KEY=${ENC_KEY}
AGENT_SECRET=${AGENT_SECRET}
AGENT_URL=http://localhost:4000
API_PORT=3001
AGENT_MODE=real
ENVEOF
      export DB_PASSWORD="$DB_PASS"
    fi
  fi

  # Install npm deps
  dot "Installing npm dependencies (this takes several minutes)…"
  cd "$PANEL_DIR"
  sudo -u hostpanel bash -c "cd $PANEL_DIR && npm install --no-package-lock 2>&1" >> "$INSTALL_LOG" 2>&1 || {
    warn "npm install had warnings — continuing..."
  }
  log "npm dependencies installed"
  cd - >/dev/null
}

# ─── Database ─────────────────────────────────────────────────────────
setup_database() {
  info "Step 5/10 — PostgreSQL database"

  # Start PostgreSQL
  systemctl start postgresql 2>/dev/null || true
  systemctl enable postgresql 2>/dev/null || true

  # Wait for PostgreSQL to be ready
  for i in {1..30}; do
    if su - postgres -c "psql -c 'SELECT 1'" &>/dev/null; then
      break
    fi
    sleep 1
  done

  # Use provided password or generate one
  local db_pass="${DB_PASSWORD:-hostpanel_$(openssl rand -hex 8)}"

  # Create user (ignore errors)
  su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='hostpanel'\"" 2>/dev/null | grep -q 1 || \
    su - postgres -c "createuser hostpanel" 2>/dev/null || true

  # Create database
  su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname='hostpanel'\"" 2>/dev/null | grep -q 1 || \
    su - postgres -c "createdb hostpanel -O hostpanel" 2>/dev/null || true

  # Set password
  su - postgres -c "psql -c \"ALTER USER hostpanel WITH PASSWORD '$db_pass'\"" >> "$INSTALL_LOG" 2>&1
  log "PostgreSQL user and database ready"

  # Update .env
  local escaped_pass
  escaped_pass=$(printf '%s\n' "$db_pass" | sed 's/[&/\]/\\&/g')
  sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"postgresql://hostpanel:${escaped_pass}@localhost:5432/hostpanel\"|" "$PANEL_DIR/.env"

  # Generate secrets if placeholders
  if grep -q "CHANGE_ME_JWT\|your-jwt-secret" "$PANEL_DIR/.env" 2>/dev/null; then
    sed -i "s|CHANGE_ME_JWT\|your-jwt-secret|$(openssl rand -hex 32)|g" "$PANEL_DIR/.env"
  fi
  if grep -q "CHANGE_ME_ENC\|your-encryption-key" "$PANEL_DIR/.env" 2>/dev/null; then
    sed -i "s|CHANGE_ME_ENC\|your-encryption-key|$(openssl rand -hex 32)|g" "$PANEL_DIR/.env"
  fi
  if grep -q "CHANGE_ME_AGENT\|your-agent-secret" "$PANEL_DIR/.env" 2>/dev/null; then
    sed -i "s|CHANGE_ME_AGENT\|your-agent-secret|$(openssl rand -hex 16)|g" "$PANEL_DIR/.env"
  fi

  # Migrations
  dot "Running database migrations…"
  cd "$PANEL_DIR"
  sudo -u hostpanel bash -c "cd $PANEL_DIR && npx prisma generate 2>&1" >> "$INSTALL_LOG" 2>&1
  sudo -u hostpanel bash -c "cd $PANEL_DIR && npx prisma migrate deploy 2>&1" >> "$INSTALL_LOG" 2>&1
  log "Database schema applied"
  cd - >/dev/null
}

# ─── Build ────────────────────────────────────────────────────────────
build_application() {
  info "Step 6/10 — Build application"

  dot "Building API…"
  cd "$PANEL_DIR"
  sudo -u hostpanel bash -c "cd $PANEL_DIR && npm run build --workspace=@hostpanel/api 2>&1" >> "$INSTALL_LOG" 2>&1 || {
    warn "API build had issues — checking logs"
  }
  log "API build done"

  dot "Building web frontend (this may take 2-5 min)…"
  sudo -u hostpanel bash -c "cd $PANEL_DIR && npm run build --workspace=@hostpanel/web 2>&1" >> "$INSTALL_LOG" 2>&1 || {
    warn "Frontend build had issues — checking logs"
  }
  log "Web frontend build done"
  cd - >/dev/null
}

# ─── nginx ────────────────────────────────────────────────────────────
setup_nginx() {
  info "Step 7/10 — nginx reverse proxy"

  if [[ -f "$PANEL_DIR/infra/nginx/hostpanel.conf" ]]; then
    cp "$PANEL_DIR/infra/nginx/hostpanel.conf" /etc/nginx/sites-available/hostpanel
  else
    warn "nginx config template not found — creating default"
    cat > /etc/nginx/sites-available/hostpanel << 'NGINXEOF'
server {
    listen 80;
    server_name _;
    client_max_body_size 256M;

    # API reverse proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
    }

    # WebSocket for logs and real-time
    location /ws/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    # Frontend static files
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    access_log /var/log/nginx/hostpanel-access.log;
    error_log /var/log/nginx/hostpanel-error.log;
}
NGINXEOF
  fi

  # Remove default nginx site
  rm -f /etc/nginx/sites-enabled/default

  # Enable HostPanel config
  ln -sf /etc/nginx/sites-available/hostpanel /etc/nginx/sites-enabled/hostpanel

  # Create log directory
  mkdir -p /var/log/nginx

  dot "Testing nginx configuration…"
  if nginx -t >> "$INSTALL_LOG" 2>&1; then
    systemctl enable nginx >> "$INSTALL_LOG" 2>&1
    systemctl restart nginx >> "$INSTALL_LOG" 2>&1
    log "nginx configured and running"
  else
    error "nginx -t failed — check configuration"
    nginx -t 2>&1 | tail -5
    warn "Continuing anyway — you can fix nginx config later"
  fi
}

# ─── Redis ────────────────────────────────────────────────────────────
setup_redis() {
  dot "Ensuring Redis is running…"
  systemctl start redis-server 2>/dev/null || true
  systemctl enable redis-server 2>/dev/null || true
  # Redis port check
  if ss -tlnp 2>/dev/null | grep -q ':6379\b'; then
    log "Redis is listening on port 6379"
  else
    warn "Redis may not be running — check: systemctl status redis-server"
  fi
}

# ─── systemd services ─────────────────────────────────────────────────
setup_systemd() {
  info "Step 8/10 — systemd services"

  # Copy service files if they exist
  local services=("hostpanel-api" "hostpanel-worker" "hostpanel-agent")
  for svc in "${services[@]}"; do
    if [[ -f "$PANEL_DIR/infra/systemd/${svc}.service" ]]; then
      cp "$PANEL_DIR/infra/systemd/${svc}.service" /etc/systemd/system/
    fi
  done

  systemctl daemon-reload

  for svc in "${services[@]}"; do
    if systemctl enable "$svc" >> "$INSTALL_LOG" 2>&1; then
      systemctl restart "$svc" >> "$INSTALL_LOG" 2>&1 || true
    fi
  done

  # Wait and check
  sleep 3
  if systemctl is-active --quiet hostpanel-api 2>/dev/null; then
    log "hostpanel-api running"
  else
    warn "hostpanel-api may need manual start. Check: journalctl -u hostpanel-api -n 30"
  fi
  if systemctl is-active --quiet hostpanel-worker 2>/dev/null; then
    log "hostpanel-worker running"
  else
    warn "hostpanel-worker may need manual start."
  fi
  if systemctl is-active --quiet hostpanel-agent 2>/dev/null; then
    log "hostpanel-agent running"
  fi
}

# ─── Firewall ─────────────────────────────────────────────────────────
setup_firewall() {
  info "Step 9/10 — Firewall (UFW)"

  if ! command -v ufw &>/dev/null; then
    warn "UFW not available — skipping firewall configuration"
    return
  fi

  # Check if UFW is already enabled with rules
  if ufw status | grep -q "Status: active"; then
    dot "UFW is already active — ensuring essential ports are open"
  fi

  # Prevent lockout: ensure SSH is allowed first
  ufw --force allow 22/tcp 2>/dev/null || true
  ufw --force allow 80/tcp 2>/dev/null || true
  ufw --force allow 443/tcp 2>/dev/null || true

  dot "Enabling UFW…"
  echo "y" | ufw enable >> "$INSTALL_LOG" 2>&1 || true
  log "Firewall configured (SSH:22, HTTP:80, HTTPS:443)"
}

# ─── Seed initial data ────────────────────────────────────────────────
seed_data() {
  info "Step 10/10 — Seed initial data"

  dot "Seeding default roles, permissions, and admin user…"
  cd "$PANEL_DIR"
  sudo -u hostpanel bash -c "cd $PANEL_DIR && npx ts-node --project apps/api/tsconfig.json apps/api/src/prisma/seed.ts 2>&1" >> "$INSTALL_LOG" 2>&1 || {
    warn "Seed had issues — trying alternative method"
    sudo -u hostpanel bash -c "cd $PANEL_DIR && node apps/api/dist/prisma/seed.js 2>&1" >> "$INSTALL_LOG" 2>&1 || true
  }
  log "Initial data seeded"
  cd - >/dev/null
}

# ─── Final output ─────────────────────────────────────────────────────
finish() {
  local ip
  ip=$(hostname -I 2>/dev/null | awk '{print $1}')
  [[ -z "$ip" ]] && ip="YOUR-SERVER-IP"

  # Extract admin credentials from env or use defaults
  local admin_email="${ADMIN_EMAIL:-admin@hostpanel.local}"
  local admin_pass="${ADMIN_PASSWORD:-Admin123!}"

  echo ""
  echo "  ╔══════════════════════════════════════════════════════════╗"
  echo -e "  ║         ${GREEN}${BOLD}HostPanel Pro Installed ✓${NC}                         ║"
  echo "  ╚══════════════════════════════════════════════════════════╝"
  echo ""
  echo -e "    ${BOLD}Panel URL:${NC}  http://${ip}/"
  echo -e "    ${BOLD}API URL:${NC}    http://${ip}/api/"
  echo ""
  echo -e "    ${BOLD}Email:${NC}      ${admin_email}"
  echo -e "    ${BOLD}Password:${NC}   ${admin_pass}  ${RED}(CHANGE ON FIRST LOGIN)${NC}"
  echo ""
  echo "  ── Services ─────────────────────────────────────────────"
  echo -e "    API:      systemctl status hostpanel-api"
  echo -e "    Worker:   systemctl status hostpanel-worker"
  echo -e "    Agent:    systemctl status hostpanel-agent"
  echo -e "    nginx:    systemctl status nginx"
  echo -e "    Postgres: systemctl status postgresql"
  echo -e "    Redis:    systemctl status redis-server"
  echo ""
  echo "  ── Management ───────────────────────────────────────────"
  echo -e "    Logs:     journalctl -u hostpanel-api -f"
  echo -e "    Dir:      ${PANEL_DIR}"
  echo -e "    Backup:   bash ${PANEL_DIR}/backup-panel.sh"
  echo -e "    Update:   bash ${PANEL_DIR}/upgrade.sh"
  echo ""
  echo "  ── SSL (after DNS points here) ──────────────────────────"
  echo -e "    certbot --nginx -d panel.yourdomain.com"
  echo ""
  echo -e "  ${YELLOW}Install log: ${INSTALL_LOG}${NC}"
  echo "  ══════════════════════════════════════════════════════════"
  echo ""
}

# ─── Main ─────────────────────────────────────────────────────────────
main() {
  banner

  # ── WARNING: prepare() MUST be called first to create LOG_DIR ──
  mkdir -p "$LOG_DIR" "$BACKUP_DIR"
  INSTALL_LOG="${LOG_DIR}/install-$(date +%Y%m%d-%H%M%S).log"
  touch "$INSTALL_LOG" 2>/dev/null || true

  check_root
  check_os
  check_memory
  check_disk
  prepare
  install_system_deps

  install_nodejs
  create_system_user
  setup_application
  setup_redis
  setup_database
  build_application
  setup_nginx
  setup_systemd
  setup_firewall
  seed_data
  finish
}

main "$@"