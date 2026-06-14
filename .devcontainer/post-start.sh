#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

[[ -f .env ]] || exit 1

forwarding_domain="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
forwarding_domain="${forwarding_domain#.}"

# In Codespaces, always derive the public URL from CODESPACE_NAME. Do not trust
# APP_URL from the environment or .env — it is often still http://localhost.
if [[ -n "${CODESPACE_NAME:-}" ]]; then
    app_url="https://${CODESPACE_NAME}-80.${forwarding_domain}"
else
    app_url="http://127.0.0.1"
fi

sed -i "s|^APP_URL=.*|APP_URL=${app_url}|" .env

# Pick up the new APP_URL — config:cache avoids stale values on subsequent requests.
php artisan config:clear --quiet 2>/dev/null || true
php artisan cache:clear --quiet 2>/dev/null || true
php artisan config:cache --quiet 2>/dev/null || true

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
