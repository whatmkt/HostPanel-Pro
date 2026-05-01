# Security Guide

## Authentication

### Password Policy
- Minimum 12 characters
- Require uppercase, lowercase, numbers, symbols
- No common passwords
- Password expiry: 90 days (configurable)

### Two-Factor Authentication (2FA)
- TOTP-based (Google Authenticator, Authy compatible)
- Required for admin accounts
- Backup codes provided

### Session Management
- JWT access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- HttpOnly, Secure, SameSite=Strict cookies
- Remote session termination
- Login audit trail

### Brute Force Protection
- 5 failed attempts = 15 min lockout
- Increasing delays per attempt
- IP-based rate limiting
- Account lock notification

## API Security

- All endpoints require authentication (except login/setup)
- Permission checks on every request
- Input validation via Zod schemas
- Rate limiting: 100 req/min per IP, 1000 req/min per user
- CORS restricted to panel domain
- CSRF tokens for state-changing operations

## Agent Security

The agent is the ONLY component with system privileges.

### Principles
- Never execute arbitrary commands
- Whitelist of allowed operations
- Input validation and sanitization
- Path traversal protection
- Configuration validation before apply
- Automatic rollback on failure
- Full audit trail

### Communication
- Internal network only (localhost or private network)
- Token-based authentication
- TLS encryption (mutual TLS planned)

## Data Protection

### Secrets
- Passwords: bcrypt hashed
- API keys: AES-256-GCM encrypted at rest
- JWT secrets: environment variables only
- No secrets in code, configs, or logs

### Backups
- AES-256 encrypted
- Integrity verification (SHA-256)
- Secure transfer (SFTP/TLS)

## Infrastructure Security

### Firewall
- Default deny inbound
- Allow only necessary ports
- Anti-lockout protection (never block admin's IP)

### Fail2Ban
- SSH protection
- Panel login protection
- nginx/Apache auth protection
- Email auth protection
- WordPress wp-login protection

### Hardening
- Disable root SSH login
- SSH key-only authentication
- Keep system updated
- Remove unnecessary services
- Secure file permissions

## Monitoring & Response

### Alerts
- Failed login attempts
- Service failures
- Disk space warnings
- SSL expiry
- Malware detection
- Configuration changes

### Audit Logs
- All authentication events
- All destructive actions
- Permission changes
- Configuration modifications
- Agent operations

### Incident Response
1. Identify affected systems
2. Isolate if necessary
3. Review audit logs
4. Restore from clean backup
5. Patch vulnerability
6. Document incident