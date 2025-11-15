#!/bin/sh

set -e

echo "Starting JobTrackr application..."

# Create supervisor log directory
mkdir -p /var/log/supervisor

# Verify environment variables are set
echo "Checking environment variables..."
echo "DB_CONNECTION: ${DB_CONNECTION}"
echo "DB_HOST: ${DB_HOST}"
echo "DB_DATABASE: ${DB_DATABASE}"

# Wait for database to be ready
echo "Waiting for database connection..."
MAX_RETRIES=30
RETRY_COUNT=0
until php /var/www/html/artisan db:show 2>/dev/null; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "Failed to connect to database after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "Database is unavailable - sleeping (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
php /var/www/html/artisan migrate --force --no-interaction

# Clear and cache config
echo "Optimizing application..."
php /var/www/html/artisan config:cache
php /var/www/html/artisan route:cache
php /var/www/html/artisan view:cache

# Generate API documentation
echo "Generating API documentation..."
php /var/www/html/artisan l5-swagger:generate || echo "Swagger generation skipped"

# Start supervisor
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
