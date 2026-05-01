# HostPanel Pro

**Professional Web Hosting Control Panel**

**One command to install on any Ubuntu 24.04 / Debian 12 VPS.**

HostPanel Pro is a modern, secure, and feature-complete alternative to Plesk — a professional web hosting control panel for Linux servers. It provides a clean web interface to manage websites, domains, SSL, DNS, email, databases, files, backups, security, performance, WordPress, Docker, and much more.

---

## 🚀 One-Click Install

### On a fresh VPS (Ubuntu 24.04 / Debian 12):

```bash
# As root — this single command installs everything:
curl -fsSL https://raw.githubusercontent.com/YOUR_USER/hostpanel-pro/main/bootstrap.sh | bash -s -- --repo https://github.com/YOUR_USER/hostpanel-pro.git
```

That's it. The installer will:

1. ✅ Detect your OS and verify requirements
2. ✅ Clone the repo from GitHub
3. ✅ Install all system dependencies (nginx, PostgreSQL, Redis, Certbot, etc.)
4. ✅ Install Node.js 20 LTS
5. ✅ Create the `hostpanel` system user
6. ✅ Copy all application files
7. ✅ Configure PostgreSQL database + run migrations
8. ✅ Build the API and frontend
9. ✅ Configure nginx as a reverse proxy
10. ✅ Set up systemd services (api, worker, agent)
11. ✅ Configure UFW firewall (SSH:22, HTTP:80, HTTPS:443)
12. ✅ Seed default roles, permissions, and admin user

After ~5-10 minutes, open **http://YOUR_SERVER_IP/** in your browser.

**Default login:**
- Email: `admin@hostpanel.local`
- Password: `Admin123!` **(change immediately)**

> ⚠️ Replace `YOUR_USER` with your actual GitHub username in the command above.

### With custom admin credentials:

```bash
curl -fsSL https://raw.githubusercontent.com/YOUR_USER/hostpanel-pro/main/bootstrap.sh | \
  bash -s -- --repo https://github.com/YOUR_USER/hostpanel-pro.git
```

### Development Setup (Docker)

```bash
git clone https://github.com/your-org/hostpanel-pro.git
cd hostpanel-pro
cp .env.example .env
docker compose up -d
# Open http://localhost:3000
```

---

## Features

### Server Management
- nginx web server (Apache optional)
- PHP-FPM multi-version with configurable pools
- MariaDB/MySQL & PostgreSQL database management
- Redis caching and queuing
- Postfix & Dovecot email server with Roundcube
- DNS zone management (A, AAAA, CNAME, MX, TXT, SRV, CAA, NS)
- Let's Encrypt SSL/TLS with auto-renewal
- FTP/SFTP account management

### Website Tools
- Domain, subdomain & alias management
- **WordPress Toolkit** - install, manage, update, staging, hardening
- **WooCommerce Safe Optimizer** - cache modes safe for ecommerce
- Git deployments with webhooks
- Docker & Docker Compose management
- File manager with editor, archive, permissions
- phpMyAdmin / Adminer database access

### Security
- **Firewall** (UFW) with visual rule editor
- **Fail2Ban** jail configuration (SSH, panel, nginx, Postfix, WordPress)
- **ClamAV antivirus** - scheduled scans, quarantine
- **Malware scanner** - PHP shell detection, suspicious files
- **2FA TOTP** authentication
- **Role-based access control (RBAC)** - superadmin, admin, reseller, client
- **Comprehensive audit logging** - every action tracked
- Brute force protection
- Password policies, login rate limiting

### Performance & Caching
- OPcache configuration
- nginx FastCGI cache
- **Brotli** & gzip compression
- Browser cache / Cache-Control / Expires headers
- **5 optimization modes**: Safe, WordPress, WooCommerce, Maximum, Custom
- WooCommerce-safe caching (never cache cart/checkout/my-account)
- HTTP/2, HSTS, OCSP stapling
- PHP-FPM pool tuning (pm, memory, execution time)
- Database optimization recommendations
- Auto-detection of caching plugins (WP Rocket, LiteSpeed, W3 Total, etc.)
- **Revert button** — rollback any optimization

### Backup & Recovery
- Full server, per-client, per-domain backups
- File, database, email, DNS backups
- Scheduled automatic backups
- Local, SFTP, and S3-compatible storage
- Encrypted backups with integrity verification
- One-click restore

### Monitoring & Logs
- Real-time CPU, RAM, disk, network graphs
- Service status monitoring (nginx, PHP, PostgreSQL, Redis, Postfix, etc.)
- Centralized log viewer with real-time tail
- SSL certificate expiry alerts
- Email, webhook, Telegram, Slack alert channels
- 4xx/5xx error monitoring

---

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend API | NestJS, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Cache/Queue | Redis + BullMQ |
| Worker | Node.js background job processor |
| Agent | Node.js (mock) / Go (real) |
| Infrastructure | Docker, Docker Compose, nginx, systemd |

---

## Project Structure

```
hostpanel-pro/
├── apps/
│   ├── web/          # Next.js frontend (30+ pages)
│   ├── api/          # NestJS backend API (25+ modules)
│   ├── worker/       # BullMQ background job processor
│   ├── mock-agent/   # Mock server agent for development
│   └── agent/        # Real server agent (Go — upcoming)
├── packages/
│   ├── types/        # Shared TypeScript types (30+ entities)
│   ├── config/       # Shared configuration
│   ├── ui/           # Shared UI components
│   ├── sdk/          # Client SDK for API integration
│   └── validation/   # Zod validation schemas
├── infra/
│   ├── docker/       # Dockerfiles for all apps
│   ├── nginx/        # nginx configuration templates
│   ├── systemd/      # systemd service files
│   ├── scripts/      # Utility scripts
│   └── templates/    # Config templates
├── docs/             # Full documentation (8 files)
├── bootstrap.sh      # 🔥 One-click installer entry point
├── install.sh        # Full production installer
├── uninstall.sh
├── upgrade.sh
├── backup-panel.sh
├── restore-panel.sh
├── docker-compose.yml
└── docker-compose.prod.yml
```

---

## Services Overview

| Service | Port | Description |
|---|---|---|
| Panel (Next.js) | :3000 | Web frontend |
| API (NestJS) | :3001 | REST API + Swagger |
| Worker | - | Background job processor |
| Agent | :4000 | Server command executor |
| PostgreSQL | :5432 | Main database |
| Redis | :6379 | Cache & job queues |
| nginx | :80/:443 | Reverse proxy (production) |

---

## Documentation

- [Architecture](docs/architecture.md) — System design, component diagram, data flow
- [Installation](docs/install.md) — Production setup guide
- [Development](docs/development.md) — Local dev environment setup
- [Security](docs/security.md) — Security architecture, hardening guidelines
- [API Reference](docs/api.md) — All endpoints, authentication, permissions
- [Agent](docs/agent.md) — How the server agent works, security model
- [Backups](docs/backups.md) — Backup strategies, restore procedures
- [Troubleshooting](docs/troubleshooting.md) — Common issues and solutions

---

## Security

- **No shell commands from frontend** — all server actions go through the agent
- **Backend API and privileged agent are separated** — principle of least privilege
- All inputs validated and sanitized
- JWT-based authentication with refresh tokens + CSRF protection
- TOTP 2FA support
- Rate limiting on auth endpoints
- HttpOnly, Secure, SameSite cookies
- Path traversal, command injection, XSS, SSRF protection
- Comprehensive audit logging with before/after state
- All destructive operations require confirmation
- Rollback mechanism for failed configuration changes

---

## License

Proprietary. All rights reserved.

---

## Status

**Phase 1 — Functional Foundation** ✅ Complete

- [x] Monorepo architecture (Turborepo)
- [x] Docker Compose development environment
- [x] Next.js frontend — all 30+ module pages
- [x] NestJS API — 25+ modules, auth, RBAC
- [x] PostgreSQL database — 40+ entity models (Prisma)
- [x] Redis + BullMQ worker for background jobs
- [x] Mock agent for development
- [x] Full documentation
- [x] Production installer (one-click bash)
- [x] Backup/restore/upgrade scripts
- [x] systemd service files
- [x] nginx configuration

**Phase 2 — Real Server Integration** (Upcoming)

**Phase 3 — Advanced Features** (Upcoming)

**Phase 4 — Complete Product** (Upcoming)