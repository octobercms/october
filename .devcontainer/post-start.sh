#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
env_file="${workspace}/.env"
web_log="${workspace}/storage/logs/web-server.log"

read_env_var() {
    local key=$1
    grep "^${key}=" "${env_file}" 2>/dev/null | tail -n1 | cut -d= -f2- || true
}

cd "${workspace}"
env -u APP_URL bash "${workspace}/.devcontainer/configure-app-url.sh" >/dev/null

app_url="$(read_env_var APP_URL)"
link_policy="$(read_env_var LINK_POLICY)"

# Fallback if configure-app-url could not update .env yet.
if [[ -n "${CODESPACE_NAME:-}" ]]; then
    forwarding_domain="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
    forwarding_domain="${forwarding_domain#.}"
    app_url="${app_url:-https://${CODESPACE_NAME}-${app_port}.${forwarding_domain}}"
    link_policy="${link_policy:-force}"
else
    app_url="${app_url:-http://127.0.0.1:${app_port}}"
    link_policy="${link_policy:-detect}"
fi

export APP_URL="${app_url}"
export LINK_POLICY="${link_policy}"

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

pkill -f "artisan serve --host=0.0.0.0 --port=${app_port}" 2>/dev/null || true

# artisan serve strips env vars from the PHP server process unless --no-reload
# is set, so LINK_POLICY=force and APP_URL would otherwise be ignored.
env APP_URL="${app_url}" LINK_POLICY="${link_policy}" \
    php artisan serve --host=0.0.0.0 --port="${app_port}" --no-reload >>"${web_log}" 2>&1 &

for _ in $(seq 1 30); do
    web_ready && break
    sleep 0.5
done

if ! web_ready; then
    echo "October CMS failed to start. Check ${web_log}" >&2
    tail -n 20 "${web_log}" >&2 || true
    exit 1
fi

set_port_public

echo "October CMS is running at ${app_url}"
