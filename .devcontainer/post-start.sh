#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
web_log="${workspace}/storage/logs/web-server.log"

while IFS='=' read -r key value; do
    case "${key}" in
        APP_URL) app_url="${value}" ;;
        LINK_POLICY) link_policy="${value}" ;;
    esac
done < <(env -u APP_URL bash "${workspace}/.devcontainer/configure-app-url.sh" | grep -E '^(APP_URL|LINK_POLICY)=')

app_url="${app_url:-http://127.0.0.1:${app_port}}"
link_policy="${link_policy:-detect}"

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

cd "${workspace}"
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
