#!/bin/bash

# Automated backup script dengan encryption
# Schedule dengan cron untuk daily backup

BACKUP_STORAGE="/backups/pn-nangabulik"
LOG_FILE="/var/log/pn-nangabulik-backup.log"
RETENTION_DAYS=30
DOCKER_CONTAINER="pn-nangabulik-db"

mkdir -p $BACKUP_STORAGE
mkdir -p $(dirname $LOG_FILE)

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

log "========== Starting Backup =========="

# Check if database container is running
if ! docker ps | grep -q $DOCKER_CONTAINER; then
    log "ERROR: Database container is not running"
    exit 1
fi

# Create backup
BACKUP_FILE="$BACKUP_STORAGE/backup_$(date +%Y%m%d_%H%M%S).sql.gz"

log "Creating backup: $BACKUP_FILE"

docker-compose -f /var/www/pn-nangabulik/docker-compose.yml \
    exec -T postgres pg_dump \
    -U nanganek pn_nangabulik | \
    gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    log "✅ Backup created successfully ($SIZE)"
else
    log "ERROR: Backup failed"
    exit 1
fi

# Encrypt backup (optional)
# openssl enc -aes-256-cbc -salt -in "$BACKUP_FILE" -out "$BACKUP_FILE.enc" -k "your-password"
# rm "$BACKUP_FILE"

# Upload to remote storage (optional)
# aws s3 cp "$BACKUP_FILE" s3://your-bucket/backups/
# Or use:
# scp "$BACKUP_FILE" user@backup-server:/path/to/backups/

# Cleanup old backups
log "Cleaning up old backups (older than $RETENTION_DAYS days)"
find $BACKUP_STORAGE -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

BACKUP_COUNT=$(ls -1 $BACKUP_STORAGE/backup_*.sql.gz 2>/dev/null | wc -l)
log "Current backups: $BACKUP_COUNT"

log "========== Backup Complete =========="
