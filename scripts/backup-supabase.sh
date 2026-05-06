#!/bin/bash
# backup-supabase.sh — Daily Supabase database backup
#
# Usage: Run via cron daily
#   0 3 * * * /path/to/scripts/backup-supabase.sh
#
# Requires:
#   - SUPABASE_DB_URL env var (postgres connection string)
#   - pg_dump installed
#   - BACKUP_DIR env var (defaults to ./backups)
#
# Retention: 30 days (older backups are deleted)

set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-./backups}"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/kleo_backup_${TIMESTAMP}.sql.gz"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Check required env var
if [ -z "${SUPABASE_DB_URL:-}" ]; then
  echo "ERROR: SUPABASE_DB_URL environment variable is not set."
  echo "Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"
  exit 1
fi

echo "[$(date)] Starting backup..."

# Run pg_dump and compress
pg_dump "$SUPABASE_DB_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --exclude-table='auth.*' \
  --exclude-table='storage.*' \
  --exclude-table='supabase_functions.*' \
  | gzip > "$BACKUP_FILE"

FILESIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup saved: $BACKUP_FILE ($FILESIZE)"

# Clean old backups (older than 30 days)
DELETED=$(find "$BACKUP_DIR" -name "kleo_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete -print | wc -l)
if [ "$DELETED" -gt 0 ]; then
  echo "[$(date)] Deleted $DELETED backup(s) older than $RETENTION_DAYS days."
fi

echo "[$(date)] Backup complete."
