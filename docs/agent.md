# HostPanel Agent

## Overview

The HostPanel Agent (`hostpanel-agent`) is a separate service that runs on managed servers with controlled system privileges. It is the ONLY component with access to execute system-level operations.

## Architecture

```
┌─────────────┐      HTTPS       ┌─────────────┐
│   API       │◄────────────────►│   Agent     │
│  (NestJS)  │   Bearer Token    │  (Server)   │
└──────┬──────┘                   └──────┬──────┘
       │                                 │
       │ Redis Queue (BullMQ)           │ sudo + validation
       │                                 │
┌──────▼──────┐                   ┌──────▼──────┐
│   Worker    │                   │   System    │
│  (BullMQ)   │                   │  (Linux)    │
└─────────────┘                   └─────────────┘
```

## Communication

- The API enqueues jobs in Redis
- The Worker processes jobs and calls the Agent
- The Agent executes validated operations
- Results flow back through Worker → API → Frontend

## Authentication

```bash
# Agent token stored in /etc/hostpanel/agent.conf
AGENT_TOKEN="long-random-token-here"
API_URL="http://api:3001/api/v1"
AGENT_PORT=4000
```

The Agent validates every request with a Bearer token that matches the configured token.

## Security Model

### Principle of Least Privilege

The Agent runs as a dedicated system user with specific sudo permissions:

```
hostpanel ALL=(ALL) NOPASSWD: /usr/sbin/nginx -t
hostpanel ALL=(ALL) NOPASSWD: /usr/sbin/nginx -s reload
hostpanel ALL=(ALL) NOPASSWD: /bin/systemctl restart *
hostpanel ALL=(ALL) NOPASSWD: /bin/systemctl reload *
hostpanel ALL=(ALL) NOPASSWD: /usr/bin/certbot *
hostpanel ALL=(ALL) NOPASSWD: /usr/bin/acme.sh *
```

### No Arbitrary Commands

The Agent NEVER executes:
- Raw shell commands from API requests
- User-supplied paths without validation
- Unvalidated configuration data

### Input Validation

All inputs are validated:
- Paths must be within allowed directories
- File names must not contain traversal sequences
- Configuration values are validated against schemas
- IP addresses and domains must be well-formed

### Configuration Rollback

Before applying any configuration:
1. Backup current configuration
2. Write new configuration
3. Validate configuration syntax
4. If validation fails, restore backup
5. If validation passes, reload service
6. If service fails, restore backup and report

## Development Mock Agent

For development, `apps/mock-agent/` provides a mock agent that:

- Returns realistic simulated responses
- Does NOT perform any system operations
- Can be used for frontend/API development
- Runs on port 4000

See `docker-compose.yml` for mock agent configuration.

## Real Agent Implementation (Phase 2)

The real agent will be implemented in:

1. **Node.js/Express** - Simpler, matches stack
2. **Go** - Better performance, single binary, better for system ops

### Required Operations (Phase 2)

- Web server configuration (nginx/Apache)
- PHP-FPM pool management
- SSL certificate issuance and renewal
- Database creation and management
- File operations with path validation
- Service management (systemd)
- Backup execution
- Malware scanning
- Firewall rule application
- DNS zone management

### Operation Validation Rules

Each operation type has strict validation:

```
nginx_config:
  - path must be under /etc/nginx/
  - must pass "nginx -t" before reload
  - backup before overwrite

php_pool:
  - must be under /etc/php/*/
  - pool name must match [a-zA-Z0-9_-]+
  - validate php-fpm config syntax

ssl_cert:
  - domain must be valid FQDN
  - path must be under /etc/letsencrypt/
  - must verify ownership before issue

database:
  - name must match [a-zA-Z0-9_]+
  - must escape all identifiers
  - limit permissions to database scope

file_ops:
  - base path must be within user's home
  - prevent path traversal
  - validate file types for uploads

firewall:
  - never block the panel's own IP
  - never block port 22 completely
  - validate CIDR notation
  - confirm before applying

service:
  - only whitelisted services
  - only whitelisted actions (start/stop/restart/reload/status)
```

## Agent API

```
GET  /health                  - Health check
GET  /system/metrics          - System metrics
GET  /system/services         - Service status
POST /system/services/:svc/:action  - Service control
GET  /websites               - List websites
POST /websites               - Create website
DELETE /websites/:domain      - Delete website
GET  /ssl                    - List certificates
POST /ssl/issue              - Issue certificate
GET  /dns/zones              - List DNS zones
GET  /mail/domains           - List mail domains
GET  /databases              - List databases
GET  /files?path=/           - List files
GET  /backups                - List backups
GET  /firewall/rules          - List firewall rules
GET  /fail2ban/jails          - List fail2ban jails
GET  /logs/:service           - View logs
GET  /wordpress/sites         - List WordPress sites
GET  /docker/containers       - List Docker containers
GET  /php/versions            - PHP versions
GET  /performance/status       - Performance status
GET  /cron/jobs               - Cron jobs
GET  /git/deployments          - Git deployments
GET  /security/malware/scan    - Malware scan status
GET  /notifications            - Notifications
GET  /system/updates           - System updates
```

## Error Handling

```json
{
  "status": "error",
  "code": "VALIDATION_FAILED",
  "message": "Configuration validation failed",
  "details": "nginx: [emerg] invalid parameter at line 12"
}
```

## Logging

Agent logs are written to:
- `/var/log/hostpanel/agent.log` - Agent operations
- `/var/log/hostpanel/agent-error.log` - Errors
- Syslog/journal - System integration

## Monitoring

The Worker monitors agent health:
- Periodic health checks
- Timeout detection
- Automatic restart if hung
- Alerts on failure