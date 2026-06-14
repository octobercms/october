#!/usr/bin/env bash
set -euo pipefail

web_log=storage/logs/web-server.log

read_env_var() {
    local key=$1
    grep "^${key}=" .env 2>/dev/null | tail -n1 | cut -d= -f2- | tr -d '\r' || true
}

cd /var/www/html
env -u APP_URL bash .devcontainer/configure-app-url.sh >/dev/null

app_url="$(read_env_var APP_URL)"
link_policy="$(read_env_var LINK_POLICY)"

if [[ -n "${CODESPACE_NAME:-}" ]]; then
    forwarding_domain="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
    forwarding_domain="${forwarding_domain#.}"
    app_url="${app_url:-https://${CODESPACE_NAME}-80.${forwarding_domain}}"
    link_policy=force
else
    app_url="${app_url:-http://127.0.0.1}"
    link_policy="${link_policy:-detect}"
fi

export APP_URL="${app_url}"
export CMS_URL="${app_url}"
export LINK_POLICY="${link_policy}"

php artisan config:clear --quiet 2>/dev/null || true
php artisan config:cache --quiet 2>/dev/null || true

# prepare app permissions
mkdir -p storage/logs
chmod -R ug+rwX storage bootstrap/cache database 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

nginx -t

: > "${web_log}"
php-fpm -D 2>>"${web_log}"
nginx -g "daemon on;" >>"${web_log}" 2>&1

web_ready() {
    curl -fsS "http://127.0.0.1/_health" >/dev/null 2>&1
}

for _ in $(seq 1 30); do
    web_ready && break
    sleep 0.5
done

if ! web_ready; then
    echo "October CMS failed to start. Check ${web_log}" >&2
    tail -n 20 "${web_log}" >&2 || true
    exit 1
fi

echo "October CMS is running at ${app_url}"
