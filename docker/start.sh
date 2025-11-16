#!/bin/sh

set -e

echo "Starting JobTrackr application..."

# Create supervisor log directory
mkdir -p /var/log/supervisor

# Wait for database to be ready
echo "Waiting for database connection..."
until php /var/www/html/artisan db:show 2>/dev/null; do
    echo "Database is unavailable - sleeping"
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
