#!/bin/sh

# Check if required environment variables are set
if [ -z "$POCKETBASE_ADMIN_EMAIL" ]; then
    echo "Error: POCKETBASE_ADMIN_EMAIL environment variable is required"
    exit 1
fi

if [ -z "$POCKETBASE_ADMIN_PASSWORD" ]; then
    echo "Error: POCKETBASE_ADMIN_PASSWORD environment variable is required"
    exit 1
fi

# Create superuser
echo "Creating/updating superuser..."
/usr/local/bin/pocketbase superuser upsert --dir=/pb_data "$POCKETBASE_ADMIN_EMAIL" "$POCKETBASE_ADMIN_PASSWORD"

# Start PocketBase server
echo "Starting PocketBase server..."
exec /usr/local/bin/pocketbase serve --http=0.0.0.0:8090 --dir=/pb_data --publicDir=/pb_public --hooksDir=/pb_hooks --migrationsDir=/pb_migrations --encryptionEnv ENCRYPTION

