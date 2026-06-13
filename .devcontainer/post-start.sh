#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
env_file="${workspace}/.env"
web_log="${workspace}/storage/logs/web-server.log"
nginx_conf="/etc/nginx/conf.d/default.conf"

read_env_var() {
    local key=$1
    grep "^${key}=" "${env_file}" 2>/dev/null | tail -n1 | cut -d= -f2- | tr -d '\r' || true
}

stop_web_stack() {
    pkill -f "artisan serve --host=0.0.0.0 --port=${app_port}" 2>/dev/null || true
    nginx -s quit 2>/dev/null || pkill -x nginx 2>/dev/null || true
    pkill -x php-fpm 2>/dev/null || true
}

configure_nginx_site() {
    local app_url="${1}"

    sed -i \
        -e "s|^\([[:space:]]*listen \)[0-9]\+;|\1${app_port};|" \
        -e "s|^\([[:space:]]*listen \)[0-9]\+ default_server;|\1${app_port} default_server;|" \
        -e "s|^\([[:space:]]*root \).*;|\1${workspace};|" \
        "${nginx_conf}"

    # Codespaces port forwarding often opens https://localhost; redirect to APP_URL
    # so guest redirects never store a localhost URL in session('url.intended').
    if [[ -n "${CODESPACE_NAME:-}" ]] && [[ -n "${app_url}" ]]; then
        local marker="october-codespace-localhost-redirect"
        local redirect_base="${app_url%/}"

        sed -i "/# ${marker}/d" "${nginx_conf}"
        sed -i "/server {/a\\
    if (\$host ~* ^(localhost|127\\.0\\.0\\.1)(:.*)?\$) { return 301 ${redirect_base}\$request_uri; } # ${marker}" \
            "${nginx_conf}"
    fi

    nginx -t
}

prepare_app_permissions() {
    mkdir -p storage/logs
    chmod -R ug+rwX storage bootstrap/cache database 2>/dev/null || true
    chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
}

cd "${workspace}"

env -u APP_URL bash "${workspace}/.devcontainer/configure-app-url.sh" >/dev/null

app_url="$(read_env_var APP_URL)"
link_policy="$(read_env_var LINK_POLICY)"

export APP_URL="${app_url}" CMS_URL="${app_url}" LINK_POLICY="${link_policy}"

php artisan config:clear --quiet 2>/dev/null || true
php artisan config:cache --quiet 2>/dev/null || true

stop_web_stack
configure_nginx_site "${app_url}"
prepare_app_permissions

: > "${web_log}"
php-fpm -D 2>>"${web_log}"
nginx -g "daemon on;" >>"${web_log}" 2>&1

web_ready() {
    local curl_args=( -fsS )

    if [[ -n "${CODESPACE_NAME:-}" ]] && [[ -n "${app_url}" ]]; then
        curl_args+=( -H "Host: $(php -r "echo parse_url('${app_url}', PHP_URL_HOST);")" )
    fi

    curl "${curl_args[@]}" "http://127.0.0.1:${app_port}/_health" >/dev/null 2>&1
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
