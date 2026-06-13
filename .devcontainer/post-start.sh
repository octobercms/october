#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
app_root=/var/www/html
nginx_conf=/etc/nginx/conf.d/default.conf

if [[ "$(readlink -f "${app_root}" 2>/dev/null || true)" != "$(readlink -f "${workspace}")" ]]; then
    rm -rf "${app_root}"
    ln -sfn "${workspace}" "${app_root}"
fi

storage_dirs=(
    storage/app
    storage/framework/cache
    storage/framework/sessions
    storage/framework/views
    storage/logs
    storage/cms
    storage/system
    storage/temp
    bootstrap/cache
    database
)

for dir in "${storage_dirs[@]}"; do
    path="${workspace}/${dir}"
    mkdir -p "${path}"

    if id www-data >/dev/null 2>&1; then
        chown -R www-data:www-data "${path}"
    fi
done

app_url="$(bash "${workspace}/.devcontainer/configure-app-url.sh" | tail -n1 | sed 's/^APP_URL=//')"

port_open() {
    (echo >/dev/tcp/127.0.0.1/"$1") 2>/dev/null
}

if ! port_open 9000; then
    php-fpm -D
fi

sed -i "s/listen [0-9]\+;/listen ${app_port};/" "${nginx_conf}"

if [[ -f /run/nginx.pid ]]; then
    nginx -s quit 2>/dev/null || true

    for _ in $(seq 1 20); do
        port_open "${app_port}" || break
        sleep 0.1
    done
fi

nginx

for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${app_port}/_health" >/dev/null 2>&1; then
        break
    fi
    sleep 0.5
done

if ! curl -fsS "http://127.0.0.1:${app_port}/_health" >/dev/null 2>&1; then
    echo "October CMS failed to start on port ${app_port}." >&2
    echo "Check nginx logs: /var/log/nginx/error.log" >&2
    exit 1
fi

if [[ -n "${app_url}" ]]; then
    echo ""
    echo "October CMS is running. Open in your browser:"
    echo "  ${app_url}"
    echo ""
fi
