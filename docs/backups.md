# Backup System

## Overview

HostPanel Pro includes a comprehensive backup system for complete server protection.

## Backup Types

### Full Server Backup
- All websites
- All databases
- All mail data
- All DNS zones
- Panel configuration
- SSL certificates

### Per-Client Backup
- All resources belonging to a specific client

### Per-Subscription Backup
- Resources within a specific subscription

### Per-Domain Backup
- Single website files
- Associated database(s)
- Email for that domain
- DNS zone
- SSL certificate

### Partial Backups
- Files only
- Database only
- Email only
- DNS only
- Any combination

## Backup Content

```
backup_[date]_[id].tar.gz
├── manifest.json           # Backup metadata
├── files/
│   └── [domain]/
│       └── htdocs/          # Website files
├── databases/
│   └── [db_name].sql.gz    # Database dump
├── mail/
│   └── [domain]/
│       └── Maildir/         # Email data
├── dns/
│   └── [zone].json          # DNS zone export
├── ssl/
│   └── [domain].pem         # SSL certificates
└── checksums.sha256         # Integrity verification
```

## Backup Destinations

### Local
- `/var/backups/hostpanel/`
- Configurable path
- Retention policy enforced

### SFTP (Phase 2)
- Remote server via SFTP
- SSH key authentication
- Encrypted transfer

### S3 Compatible (Phase 3)
- AWS S3
- MinIO
- DigitalOcean Spaces
- Backblaze B2
- Wasabi

### Google Drive (Phase 4)

## Scheduling

```json
{
  "schedule": "daily",
  "time": "03:00",
  "retention": {
    "daily": 7,
    "weekly": 4,
    "monthly": 3
  }
}
```

### Retentions
- **Daily**: Last 7 days
- **Weekly**: Last 4 Sundays
- **Monthly**: Last 3 first-of-month

## Backup Process

1. Lock domain to prevent changes
2. Dump database(s) with --single-transaction
3. Copy website files
4. Export DNS zone
5. Export certificates
6. Create manifest
7. Generate checksums
8. Compress and encrypt
9. Transfer to destination(s)
10. Verify integrity
11. Unlock domain
12. Apply retention policy
13. Log result
14. Send notification

## Encryption

- AES-256-GCM encryption
- Per-backup random key
- Key encrypted with master key
- Master key stored securely

## Restore Process

### Full Restore
1. Select backup
2. Verify integrity
3. Confirm overwrite warning
4. Restore files
5. Restore databases
6. Restore DNS
7. Restore mail
8. Restore SSL
9. Reload services
10. Verify site accessibility

### Partial Restore
1. Select backup
2. Choose components to restore
3. Confirm overwrite
4. Restore selected components
5. Reload if needed

## Integrity Verification

- SHA-256 checksums stored with backup
- Automatic verification on restore
- Manual verification option
- Periodic integrity checks

## Pre-Backup Hooks

Actions performed automatically before backup:

### WordPress Sites
- Optional database optimization
- Optional cache purge
- Optional maintenance mode

### WooCommerce Sites
- Abandoned cart cleanup (optional)
- Session cleanup (optional)
- Temp data cleanup (optional)

## Post-Backup Hooks

Actions performed after successful backup:

- Send notification
- Update backup history
- Cleanup temporary files
- Release domain lock

## Disk Space Protection

- Check available space before backup
- Warning at 85% disk usage
- Block new backups at 95%
- Auto-cleanup old backups beyond retention
- Alert on low disk space

## Notifications

| Event | Notification |
|---|---|
| Backup started | Info |
| Backup completed | Success |
| Backup failed | Critical alert |
| Restore started | Info |
| Restore completed | Success |
| Restore failed | Critical alert |
| Disk warning | Warning |
| Integrity check failed | Critical alert |

## CLI Commands

```bash
# Manual backup
hostpanel backup create --domain example.com --full

# List backups
hostpanel backup list --domain example.com

# Restore backup
hostpanel backup restore --id backup_20260101_001

# Verify integrity
hostpanel backup verify --id backup_20260101_001

# Cleanup old backups
hostpanel backup cleanup --domain example.com
```

## Best Practices

1. **Schedule daily backups** during low-traffic hours
2. **Keep at least 7 days** of daily backups
3. **Store backups off-server** (SFTP/S3)
4. **Test restores regularly** on staging
5. **Monitor backup notifications**
6. **Encrypt all backups**
7. **Verify integrity** before relying on backups
8. **Document restore procedures**

## Troubleshooting

### Backup Fails
1. Check disk space: `df -h`
2. Check permissions: `/var/backups/hostpanel/`
3. Review logs: `/var/log/hostpanel/backup.log`
4. Test database connectivity
5. Verify destination reachable

### Restore Fails
1. Verify backup integrity
2. Check destination disk space
3. Verify database exists (or will be created)
4. Check file permissions
5. Check service status

### Slow Backups
1. Consider incremental backups (planned)
2. Exclude cache/temp directories
3. Optimize databases before backup
4. Schedule during off-peak hours
5. Check disk I/O performance