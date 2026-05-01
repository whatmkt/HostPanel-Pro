#!/bin/bash
# =====================================================================
# HostPanel Pro — One-Click Installer
# =====================================================================
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/YOUR_USER/hostpanel-pro/main/bootstrap.sh | bash
#
# Or if you have the repo locally:
#   bash bootstrap.sh
# =====================================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log()   { printf "${GREEN}[✓]${NC}  %s\n" "$*"; }
warn()  { printf "${YELLOW}[!]${NC}  %s\n" "$*"; }
error() { printf "${RED}[✗]${NC} %s\n" "$*"; }
info()  { printf "\n${CYAN}${BOLD}▸ %s${NC}\n" "$*"; }
dot()   { printf "${BLUE}   · %s${NC}\n" "$*"; }

banner() {
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════╗"
  echo "  ║           ${BOLD}HostPanel Pro — One-Click Install${NC}            ║"
  echo "  ║       Professional Web Hosting Control Panel v1.0        ║"
  echo "  ╚══════════════════════════════════════════════════════════╝"
  echo ""
}

# ── Parse arguments ──────────────────────────────────────────────────────
GIT_REPO=""
PANEL_VERSION="main"
INSTALL_DIR="/opt/hostpanel"
SKIP_CLONE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) GIT_REPO="$2"; shift 2 ;;
    --version) PANEL_VERSION="$2"; shift 2 ;;
    --dir) INSTALL_DIR="$2"; shift 2 ;;
    --skip-clone) SKIP_CLONE=true; shift ;;
    --help)
      echo "Usage: bash bootstrap.sh [options]"
      echo ""
      echo "Options:"
      echo "  --repo <url>       GitHub repo URL (default: auto-detect)"
      echo "  --version <tag>    Git tag/branch to install (default: main)"
      echo "  --dir <path>       Installation directory (default: /opt/hostpanel)"
      echo "  --skip-clone       Skip git clone (use local files)"
      exit 0
      ;;
    *) error "Unknown option: $1"; exit 1 ;;
  esac
done

# ── Auto-detect repo if not specified ───────────────────────────────────
if [[ -z "$GIT_REPO" && "$SKIP_CLONE" == false ]]; then
  # Try to determine from current git remote if we're in a repo
  if git rev-parse --git-dir &>/dev/null 2>&1; then
    GIT_REPO=$(git remote get-url origin 2>/dev/null || true)
  fi
  # Fallback — will be set by the curl pipe automatically
  if [[ -z "$GIT_REPO" ]]; then
    # When running via curl, the repo URL is embedded by the user
    warn "No --repo specified. Please provide your GitHub repo URL."
    warn "Example: curl -fsSL https://raw.githubusercontent.com/YOUR_USER/hostpanel-pro/main/bootstrap.sh | bash -s -- --repo https://github.com/YOUR_USER/hostpanel-pro.git"
    exit 1
  fi
fi

# ── Pre-flight ───────────────────────────────────────────────────────────
check_prerequisites() {
  if [[ $EUID -ne 0 ]]; then
    error "Must run as root. Use: sudo bash bootstrap.sh"
    exit 1
  fi
  log "Running as root"

  # Detect OS
  if [[ -f /etc/os-release ]]; then
    source /etc/os-release
    case "$ID" in
      ubuntu|debian) log "OS: $ID $VERSION_ID" ;;
      *) warn "Unsupported OS: $ID (may still work)" ;;
    esac
  fi

  # Check essential commands
  for cmd in curl wget git; do
    if ! command -v "$cmd" &>/dev/null; then
      dot "Installing $cmd..."
      apt-get update -qq && apt-get install -y -qq "$cmd" 2>/dev/null
    fi
  done
  log "Prerequisites satisfied"
}

# ── Clone or copy repo ───────────────────────────────────────────────────
setup_repo() {
  if [[ "$SKIP_CLONE" == true ]]; then
    # Running from local checkout — just ensure we're in the right place
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [[ -f "$SCRIPT_DIR/install.sh" ]]; then
      log "Using local files from $SCRIPT_DIR"
      export PANEL_SOURCE_DIR="$SCRIPT_DIR"
    else
      error "install.sh not found in $SCRIPT_DIR"
      exit 1
    fi
    return
  fi

  info "Step 1/2 — Downloading HostPanel Pro"

  # Create install directory
  mkdir -p "$INSTALL_DIR"

  # Remove old clone if it exists
  if [[ -d "$INSTALL_DIR/.git" ]]; then
    dot "Updating existing installation from $GIT_REPO ($PANEL_VERSION)..."
    cd "$INSTALL_DIR"
    git fetch origin 2>/dev/null || true
    git checkout "$PANEL_VERSION" 2>/dev/null || true
    git pull origin "$PANEL_VERSION" 2>/dev/null || true
    cd - >/dev/null
  else
    dot "Cloning $GIT_REPO (branch: $PANEL_VERSION)..."
    if [[ -d "$INSTALL_DIR" && "$(ls -A "$INSTALL_DIR" 2>/dev/null)" ]]; then
      # Directory exists but not a git repo — warn and backup
      warn "$INSTALL_DIR not empty, moving contents to ${INSTALL_DIR}.bak..."
      mv "$INSTALL_DIR" "${INSTALL_DIR}.bak.$(date +%s)"
      mkdir -p "$INSTALL_DIR"
    fi
    git clone --depth 1 --branch "$PANEL_VERSION" "$GIT_REPO" "$INSTALL_DIR" 2>&1 || {
      error "Git clone failed. Check the repo URL and your internet connection."
      error "Repo: $GIT_REPO"
      error "Branch: $PANEL_VERSION"
      exit 1
    }
  fi

  export PANEL_SOURCE_DIR="$INSTALL_DIR"
  log "Source code ready at $INSTALL_DIR"
}

# ── Run the real installer ──────────────────────────────────────────────
run_installer() {
  info "Step 2/2 — Running HostPanel installer"

  if [[ ! -f "$PANEL_SOURCE_DIR/install.sh" ]]; then
    error "install.sh not found in $PANEL_SOURCE_DIR"
    error "The repository may be incomplete or corrupted."
    exit 1
  fi

  chmod +x "$PANEL_SOURCE_DIR/install.sh"
  cd "$PANEL_SOURCE_DIR"

  # Pass through any user-provided env vars
  export DB_PASSWORD="${DB_PASSWORD:-}"
  export ADMIN_EMAIL="${ADMIN_EMAIL:-admin@hostpanel.local}"
  export ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin123!}"

  bash "$PANEL_SOURCE_DIR/install.sh"
}

# ── Main ─────────────────────────────────────────────────────────────────
main() {
  banner
  check_prerequisites
  setup_repo
  run_installer
}

main "$@"