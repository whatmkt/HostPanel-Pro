# API Reference

## Base URL

```
http://localhost:3001/api/v1
```

## Authentication

All endpoints (except login, setup, and health) require a Bearer token.

```
Authorization: Bearer <jwt_token>
```

## OpenAPI / Swagger

Available at `http://localhost:3001/api/docs` when the API is running.

## Endpoints

### Auth

| Method | Path | Description | Permissions |
|---|---|---|---|
| POST | /auth/login | User login | Public |
| POST | /auth/logout | User logout | Authenticated |
| POST | /auth/refresh | Refresh JWT token | Authenticated |
| POST | /auth/setup | Initial admin setup | Public (if no users) |
| GET | /auth/me | Get current user | Authenticated |
| POST | /auth/2fa/enable | Enable 2FA TOTP | Authenticated |
| POST | /auth/2fa/verify | Verify 2FA code | Authenticated |
| POST | /auth/password-reset/request | Request password reset | Public |
| POST | /auth/password-reset/confirm | Confirm password reset | Public |

### Users

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /users | List users | manage_users |
| GET | /users/:id | Get user details | manage_users |
| POST | /users | Create user | manage_users |
| PATCH | /users/:id | Update user | manage_users |
| DELETE | /users/:id | Delete user | manage_users |
| POST | /users/:id/sessions/revoke | Revoke user sessions | manage_users |

### Roles

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /roles | List roles | manage_users |
| POST | /roles | Create role | manage_users |
| PATCH | /roles/:id | Update role | manage_users |
| DELETE | /roles/:id | Delete role | manage_users |

### Clients

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /clients | List clients | manage_clients |
| POST | /clients | Create client | manage_clients |
| GET | /clients/:id | Get client | manage_clients |
| PATCH | /clients/:id | Update client | manage_clients |
| DELETE | /clients/:id | Delete client | manage_clients |

### Hosting Plans

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /plans | List plans | manage_plans |
| POST | /plans | Create plan | manage_plans |
| PATCH | /plans/:id | Update plan | manage_plans |
| DELETE | /plans/:id | Delete plan | manage_plans |

### Subscriptions

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /subscriptions | List subscriptions | manage_subscriptions |
| POST | /subscriptions | Create subscription | manage_subscriptions |
| PATCH | /subscriptions/:id | Update subscription | manage_subscriptions |
| DELETE | /subscriptions/:id | Cancel subscription | manage_subscriptions |

### Domains & Websites

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /domains | List domains | view_domains |
| POST | /domains | Create domain | create_domain |
| GET | /domains/:id | Get domain | view_domains |
| PATCH | /domains/:id | Update domain | edit_domain |
| DELETE | /domains/:id | Delete domain | delete_domain |
| POST | /domains/:id/suspend | Suspend domain | edit_domain |
| POST | /domains/:id/unsuspend | Unsuspend domain | edit_domain |
| GET | /domains/:id/subdomains | List subdomains | view_domains |
| POST | /domains/:id/subdomains | Create subdomain | create_domain |
| GET | /domains/:id/aliases | List aliases | view_domains |
| POST | /domains/:id/aliases | Create alias | create_domain |

### SSL/TLS

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /ssl | List certificates | manage_ssl |
| POST | /ssl/issue | Issue Let's Encrypt certificate | manage_ssl |
| POST | /ssl/upload | Upload custom certificate | manage_ssl |
| DELETE | /ssl/:id | Revoke certificate | manage_ssl |
| POST | /ssl/:id/renew | Force renewal | manage_ssl |

### DNS

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /dns/zones | List DNS zones | manage_dns |
| POST | /dns/zones | Create zone | manage_dns |
| GET | /dns/zones/:id | Get zone | manage_dns |
| PATCH | /dns/zones/:id | Update zone | manage_dns |
| DELETE | /dns/zones/:id | Delete zone | manage_dns |
| GET | /dns/zones/:id/records | List records | manage_dns |
| POST | /dns/zones/:id/records | Create record | manage_dns |
| PATCH | /dns/records/:id | Update record | manage_dns |
| DELETE | /dns/records/:id | Delete record | manage_dns |

### Email

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /mail/domains | List mail domains | manage_email |
| POST | /mail/domains | Create mail domain | manage_email |
| GET | /mail/domains/:id/mailboxes | List mailboxes | manage_email |
| POST | /mail/mailboxes | Create mailbox | manage_email |
| PATCH | /mail/mailboxes/:id | Update mailbox | manage_email |
| DELETE | /mail/mailboxes/:id | Delete mailbox | manage_email |
| POST | /mail/mailboxes/:id/password | Change password | manage_email |

### Databases

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /databases | List databases | manage_databases |
| POST | /databases | Create database | manage_databases |
| DELETE | /databases/:id | Delete database | manage_databases |
| GET | /databases/:id/users | List DB users | manage_databases |
| POST | /databases/:id/users | Create DB user | manage_databases |
| DELETE | /databases/:id/users/:uid | Delete DB user | manage_databases |
| POST | /databases/:id/import | Import SQL | manage_databases |
| POST | /databases/:id/export | Export SQL | manage_databases |

### Files

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /files | List files | manage_files |
| POST | /files/upload | Upload file | manage_files |
| POST | /files/directory | Create directory | manage_files |
| PATCH | /files/rename | Rename file | manage_files |
| POST | /files/copy | Copy file | manage_files |
| POST | /files/move | Move file | manage_files |
| DELETE | /files | Delete file | manage_files |
| POST | /files/compress | Compress files | manage_files |
| POST | /files/extract | Extract archive | manage_files |
| PATCH | /files/chmod | Change permissions | manage_files |
| GET | /files/search | Search files | manage_files |

### FTP/SFTP

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /ftp | List FTP accounts | manage_ftp |
| POST | /ftp | Create FTP account | manage_ftp |
| PATCH | /ftp/:id | Update FTP account | manage_ftp |
| DELETE | /ftp/:id | Delete FTP account | manage_ftp |

### Backups

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /backups | List backups | manage_backups |
| POST | /backups | Create backup | manage_backups |
| POST | /backups/:id/restore | Restore backup | restore_backups |
| DELETE | /backups/:id | Delete backup | manage_backups |
| GET | /backups/:id/download | Download backup | manage_backups |

### Security

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /security/status | Get security status | manage_security |
| GET | /security/malware/scans | List malware scans | manage_security |
| POST | /security/malware/scan | Run malware scan | manage_security |
| GET | /security/firewall/rules | List firewall rules | manage_firewall |
| POST | /security/firewall/rules | Create rule | manage_firewall |
| DELETE | /security/firewall/rules/:id | Delete rule | manage_firewall |
| GET | /security/fail2ban/jails | List jails | manage_security |
| POST | /security/fail2ban/jails/:name/toggle | Toggle jail | manage_security |

### Performance

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /performance/status | Get performance status | manage_performance |
| POST | /performance/optimize | Apply optimizations | manage_performance |
| POST | /performance/cache/purge | Purge cache | manage_cache |

### Monitoring

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /monitoring/metrics | Get system metrics | view_dashboard |
| GET | /monitoring/services | Get service status | view_dashboard |
| GET | /monitoring/alerts | Get alerts | view_dashboard |

### Logs

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /logs | List logs | view_logs |
| GET | /logs/:service | Get service logs | view_logs |

### Cron

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /cron | List cron jobs | execute_cron |
| POST | /cron | Create cron job | execute_cron |
| PATCH | /cron/:id | Update cron job | execute_cron |
| DELETE | /cron/:id | Delete cron job | execute_cron |
| POST | /cron/:id/run | Run job now | execute_cron |

### Git Deployments

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /git | List deployments | manage_files |
| POST | /git | Create deployment | manage_files |
| DELETE | /git/:id | Delete deployment | manage_files |
| POST | /git/:id/deploy | Deploy now | manage_files |

### Docker

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /docker/containers | List containers | manage_server |
| POST | /docker/containers | Create container | manage_server |
| POST | /docker/containers/:id/start | Start container | manage_server |
| POST | /docker/containers/:id/stop | Stop container | manage_server |
| DELETE | /docker/containers/:id | Delete container | manage_server |

### Dashboard

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /dashboard/summary | Dashboard summary | view_dashboard |
| GET | /dashboard/charts | Chart data | view_dashboard |
| GET | /dashboard/notifications | Recent notifications | view_dashboard |

### Extensions

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /extensions | List extensions | manage_extensions |
| POST | /extensions | Install extension | manage_extensions |
| PATCH | /extensions/:id/toggle | Toggle extension | manage_extensions |
| DELETE | /extensions/:id | Remove extension | manage_extensions |

### Settings

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /settings | Get settings | manage_server |
| PATCH | /settings | Update settings | manage_server |

### Audit

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /audit | List audit entries | manage_server |
| GET | /audit/:id | Get audit entry | manage_server |

### Notifications

| Method | Path | Description | Permissions |
|---|---|---|---|
| GET | /notifications | List notifications | Authenticated |
| PATCH | /notifications/:id/read | Mark as read | Authenticated |
| PATCH | /notifications/read-all | Mark all as read | Authenticated |

## Error Format

All errors follow this format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Pagination

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 25,
    "totalItems": 150,
    "totalPages": 6
  }
}
```

Query params: `?page=1&perPage=25&sort=createdAt&order=desc`