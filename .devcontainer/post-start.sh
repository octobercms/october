#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html
bash .devcontainer/configure-app-url.sh

app_url="$(grep '^APP_URL=' .env | tail -n1 | cut -d= -f2- | tr -d '\r')"

chmod -R ug+rwX storage bootstrap/cache database 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

nginx -t

: > storage/logs/web-server.log
php-fpm -D 2>>storage/logs/web-server.log
nginx -g "daemon on;" >>storage/logs/web-server.log 2>&1

ready=false
for _ in $(seq 1 30); do
    if curl -fsS http://127.0.0.1/_health >/dev/null 2>&1; then
        ready=true
        break
    fi
    sleep 0.5
done

if ! $ready; then
    echo "October CMS failed to start. Check storage/logs/web-server.log" >&2
    tail -n 20 storage/logs/web-server.log >&2 || true
    exit 1
fi

echo "October CMS is running at ${app_url}"
