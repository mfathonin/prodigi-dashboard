#!/bin/bash

# Create the backups directory if it doesn't exist
mkdir -p supabase/backups

# Generate timestamp in migration file format
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Set the filename with timestamp prefix
if [ -z "$1" ]; then
  FILENAME="${TIMESTAMP}_backup.sql"
else
  FILENAME="${TIMESTAMP}_$1.sql"
fi

# Create the file
touch "supabase/backups/$FILENAME"

# Export the filename as an environment variable
export BACKUP_FILENAME="$FILENAME"

echo "Prepareing backup file for: $SUPABASE_DB_URL"
echo "Backup file prepared: $BACKUP_FILENAME"

# For asking confirmation
read -p "Continue Backup? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi