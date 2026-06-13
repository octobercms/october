#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
web_log="${workspace}/storage/logs/web-server.log"
env_file="${workspace}/.env"
app_url=""

configure_app_url() {
    [[ -f "${env_file}" ]] || return 0

    cd "${workspace}"

    set_env() {
        local key=$1
        local value=$2

        if grep -q "^${key}=" "${env_file}"; then
            sed -i "s|^${key}=.*|${key}=${value}|" "${env_file}"
        else
            echo "${key}=${value}" >> "${env_file}"
        fi
    }

    if [[ -n "${APP_URL:-}" ]]; then
        app_url="${APP_URL}"
        link_policy="${LINK_POLICY:-force}"
    elif [[ -n "${CODESPACE_NAME:-}" && -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]]; then
        app_url="https://${CODESPACE_NAME}-${app_port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
        link_policy=force
    else
        app_url="http://127.0.0.1:${app_port}"
        link_policy=detect
    fi

    set_env APP_URL "${app_url}"
    set_env LINK_POLICY "${link_policy}"

    php artisan config:clear --quiet 2>/dev/null || true
    php artisan cache:clear --quiet 2>/dev/null || true
}

web_ready() {
    curl -fsS "http://127.0.0.1:${app_port}/" >/dev/null 2>&1
}

set_port_public() {
    [[ -n "${CODESPACE_NAME:-}" && -n "${GITHUB_TOKEN:-}" ]] || return 0
    command -v gh >/dev/null 2>&1 || return 0

    export GH_TOKEN="${GITHUB_TOKEN}"
    gh codespace ports visibility "${app_port}:public" --codespace "${CODESPACE_NAME}" >/dev/null 2>&1 \
        || gh codespace ports visibility "${app_port}:org" --codespace "${CODESPACE_NAME}" >/dev/null 2>&1 \
        || true
}

configure_app_url
app_url="${app_url:-http://127.0.0.1:${app_port}}"

if ! web_ready; then
    pkill -f "artisan serve --host=0.0.0.0 --port=${app_port}" 2>/dev/null || true

    cd "${workspace}"
    php artisan serve --host=0.0.0.0 --port="${app_port}" >>"${web_log}" 2>&1 &

    for _ in $(seq 1 30); do
        web_ready && break
        sleep 0.5
    done

    if ! web_ready; then
        echo "October CMS failed to start. Check ${web_log}" >&2
        tail -n 20 "${web_log}" >&2 || true
        exit 1
    fi
fi

set_port_public

echo "October CMS is running at ${app_url}"
