#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html
env -u APP_URL bash .devcontainer/configure-app-url.sh >/dev/null

app_url="$(grep '^APP_URL=' .env 2>/dev/null | tail -n1 | cut -d= -f2- | tr -d '\r' || true)"

php artisan config:cache --quiet 2>/dev/null || true

chmod -R ug+rwX storage bootstrap/cache database 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

nginx -t

: > storage/logs/web-server.log
php-fpm -D 2>>storage/logs/web-server.log
nginx -g "daemon on;" >>storage/logs/web-server.log 2>&1

for _ in $(seq 1 30); do
    curl -fsS http://127.0.0.1/_health >/dev/null 2>&1 && break
    sleep 0.5
done

if ! curl -fsS http://127.0.0.1/_health >/dev/null 2>&1; then
    echo "October CMS failed to start. Check storage/logs/web-server.log" >&2
    tail -n 20 storage/logs/web-server.log >&2 || true
    exit 1
fi

echo "October CMS is running at ${app_url}"
