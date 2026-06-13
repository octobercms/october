#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
env_file="${workspace}/.env"
web_log="${workspace}/storage/logs/web-server.log"
nginx_conf="/etc/nginx/conf.d/default.conf"
public_root="${workspace}"

read_env_var() {
    local key=$1
    grep "^${key}=" "${env_file}" 2>/dev/null | tail -n1 | cut -d= -f2- | tr -d '\r' || true
}

stop_web_stack() {
    pkill -f "artisan serve --host=0.0.0.0 --port=${app_port}" 2>/dev/null || true
    nginx -s quit 2>/dev/null || pkill -x nginx 2>/dev/null || true
    pkill -x php-fpm 2>/dev/null || true
}

configure_nginx_localhost_redirect() {
    local marker="october-codespace-localhost-redirect"
    local redirect_base="${app_url%/}"

    sed -i "/# ${marker}/d" "${nginx_conf}"

    sed -i "/server {/a\\
    if (\$host ~* ^(localhost|127\\.0\\.0\\.1)(:.*)?\$) { return 301 ${redirect_base}\$request_uri; } # ${marker}" \
        "${nginx_conf}"
}

configure_nginx_fastcgi_params() {
    local marker="october-codespace-fastcgi-params"

    sed -i \
        -e '/fastcgi_param HTTP_HOST \$host;/d' \
        -e '/fastcgi_param HTTPS on;/d' \
        -e '/fastcgi_param SERVER_PORT 443;/d' \
        -e '/fastcgi_param REQUEST_SCHEME https;/d' \
        -e '/fastcgi_param HTTP_X_FORWARDED_PROTO https;/d' \
        -e '/fastcgi_param HTTP_X_FORWARDED_SSL on;/d' \
        -e '/fastcgi_param HTTP_X_FORWARDED_HOST \$host;/d' \
        -e '/fastcgi_param HTTP_X_FORWARDED_PORT 443;/d' \
        "${nginx_conf}"

    sed -i "/# ${marker}/d" "${nginx_conf}"

    sed -i "/include fastcgi_params;/a\\
        fastcgi_param HTTP_HOST \$http_host; # ${marker}\\
        fastcgi_param HTTPS \$https if_not_empty; # ${marker}\\
        fastcgi_param SERVER_PORT \$server_port; # ${marker}\\
        fastcgi_param REQUEST_SCHEME \$scheme; # ${marker}\\
        fastcgi_param HTTP_X_FORWARDED_PROTO \$scheme; # ${marker}\\
        fastcgi_param HTTP_X_FORWARDED_HOST \$http_host; # ${marker}\\
        fastcgi_param HTTP_X_FORWARDED_PORT \$server_port; # ${marker}" \
        "${nginx_conf}"
}

configure_nginx_site() {
    sed -i \
        -e "s|^\([[:space:]]*listen \)[0-9]\+;|\1${app_port};|" \
        -e "s|^\([[:space:]]*root \).*;|\1${public_root};|" \
        "${nginx_conf}"

    if [[ -n "${CODESPACE_NAME:-}" ]] && [[ -n "${app_url:-}" ]]; then
        configure_nginx_localhost_redirect
    fi

    configure_nginx_fastcgi_params

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

if [[ -n "${CODESPACE_NAME:-}" ]]; then
    forwarding_domain="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
    forwarding_domain="${forwarding_domain#.}"
    app_url="${app_url:-https://${CODESPACE_NAME}-${app_port}.${forwarding_domain}}"
    link_policy=force
else
    app_url="${app_url:-http://127.0.0.1:${app_port}}"
    link_policy="${link_policy:-detect}"
fi

export APP_URL="${app_url}"
export CMS_URL="${app_url}"
export LINK_POLICY="${link_policy}"

php artisan config:clear --quiet 2>/dev/null || true
php artisan config:cache --quiet 2>/dev/null || true

stop_web_stack
configure_nginx_site
prepare_app_permissions

: > "${web_log}"
php-fpm -D 2>>"${web_log}"
nginx -g "daemon on;" >>"${web_log}" 2>&1

web_ready() {
    local curl_args=( -fsS )

    if [[ -n "${CODESPACE_NAME:-}" ]] && [[ -n "${app_url:-}" ]]; then
        local health_host
        health_host="$(php -r "echo parse_url('${app_url}', PHP_URL_HOST);")"
        curl_args+=( -H "Host: ${health_host}" )
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