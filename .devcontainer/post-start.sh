#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Set APP_URL for Codespaces or local dev, then refresh cached config.
bash .devcontainer/configure-app-url.sh

app_url="$(grep '^APP_URL=' .env | tail -n1 | cut -d= -f2- | tr -d '\r')"

# Ensure php-fpm (www-data) can write to storage and bootstrap/cache.
chmod -R ug+rwX storage bootstrap/cache database 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Start the web stack using the image's nginx config (listen 80, root /var/www/html).
nginx -t

: > storage/logs/web-server.log
php-fpm -D 2>>storage/logs/web-server.log
nginx -g "daemon on;" >>storage/logs/web-server.log 2>&1

# Wait up to 15 seconds for nginx to serve /_health.
deadline=$((SECONDS + 15))
until curl -fsS http://127.0.0.1/_health >/dev/null 2>&1; do
    if (( SECONDS >= deadline )); then
        echo "October CMS failed to start. Check storage/logs/web-server.log" >&2
        exit 1
    fi
    sleep 0.5
done

echo "October CMS is running at ${app_url}"
