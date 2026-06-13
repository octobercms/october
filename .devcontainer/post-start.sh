#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
app_root=/var/www/html
web_log="${workspace}/storage/logs/web-server.log"
web_pid=/tmp/october-web.pid

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

web_ready() {
    curl -fsS "http://127.0.0.1:${app_port}/" >/dev/null 2>&1
}

stop_web_server() {
    if [[ -f "${web_pid}" ]] && kill -0 "$(cat "${web_pid}")" 2>/dev/null; then
        kill "$(cat "${web_pid}")" 2>/dev/null || true
    fi

    pkill -f "artisan serve --host=0.0.0.0 --port=${app_port}" 2>/dev/null || true
    nginx -s quit 2>/dev/null || true

    for _ in $(seq 1 20); do
        port_open "${app_port}" || return 0
        sleep 0.1
    done
}

start_web_server() {
    stop_web_server

    cd "${app_root}"
    php artisan serve --host=0.0.0.0 --port="${app_port}" >>"${web_log}" 2>&1 &
    echo $! > "${web_pid}"
}

if port_open "${app_port}" && web_ready; then
    if [[ -n "${app_url}" ]]; then
        echo "October CMS is already running at ${app_url}"
    fi
    bash "${workspace}/.devcontainer/configure-port.sh" "${app_port}" || true
    exit 0
fi

if [[ -n "${app_url}" ]]; then
    echo ""
    echo "Starting October CMS at ${app_url}"
    echo ""
fi

# Codespaces auto-forwards ports detected from localhost URLs in terminal output.
echo "Server running on [http://127.0.0.1:${app_port}]"

start_web_server

for _ in $(seq 1 30); do
    if web_ready; then
        break
    fi
    sleep 0.5
done

if ! web_ready; then
    echo "October CMS failed to start on port ${app_port}." >&2
    echo "Check logs: ${web_log}" >&2
    tail -n 20 "${web_log}" >&2 || true
    exit 1
fi

bash "${workspace}/.devcontainer/configure-port.sh" "${app_port}" || true

if [[ -n "${app_url}" ]]; then
    echo ""
    echo "October CMS is running. Open from the Ports panel:"
    echo "  ${app_url}"
    echo ""
fi
