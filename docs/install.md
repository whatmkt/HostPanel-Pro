# Installation Guide

## Supported Systems

- Ubuntu Server 24.04 LTS (primary)
- Debian 12 (supported)
- AlmaLinux/Rocky Linux (planned)

## Automated Installation

```bash
curl -sSL https://cdn.hostpanel.pro/install.sh | sudo bash
```

## Manual Installation

### 1. System Requirements

- 2+ CPU cores
- 2+ GB RAM
- 20+ GB disk
- Root access
- Fresh or minimal install recommended

### 2. Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git nginx postgresql redis-server \
  certbot python3-certbot-nginx nodejs npm
```

### 3. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4. Create System User

```bash
sudo useradd -r -s /bin/false -d /opt/hostpanel hostpanel
sudo mkdir -p /opt/hostpanel
sudo chown -R hostpanel:hostpanel /opt/hostpanel
```

### 5. Clone & Configure

```bash
sudo -u hostpanel git clone <repo> /opt/hostpanel
cd /opt/hostpanel
cp .env.example .env
# Edit .env with your settings
sudo -u hostpanel npm ci
sudo -u hostpanel npm run build
```

### 6. Database Setup

```bash
sudo -u postgres createuser hostpanel
sudo -u postgres createdb hostpanel -O hostpanel
sudo -u postgres psql -c "ALTER USER hostpanel WITH PASSWORD 'your-password';"
cd /opt/hostpanel
sudo -u hostpanel npm run db:migrate
sudo -u hostpanel npm run db:seed
```

### 7. nginx Configuration

```bash
sudo cp /opt/hostpanel/infra/nginx/hostpanel.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/hostpanel.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 8. Systemd Services

```bash
sudo cp /opt/hostpanel/infra/systemd/*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now hostpanel-api hostpanel-worker
```

### 9. Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 4000/tcp  # Agent port
sudo ufw enable
```

### 10. Access Panel

Open `https://your-server-ip` and complete setup wizard.

## Docker Installation

```bash
curl -fsSL https://get.docker.com | sudo bash
sudo usermod -aG docker $USER
```

## SSL Certificate

```bash
sudo certbot --nginx -d panel.yourdomain.com
```

## Verification

```bash
systemctl status hostpanel-api hostpanel-worker
curl http://localhost:3001/health