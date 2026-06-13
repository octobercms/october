#!/usr/bin/env bash
set -euo pipefail

workspace="${containerWorkspaceFolder:-$(pwd)}"
app_port=8080
env_file="${workspace}/.env"

[[ -f "${env_file}" ]] || exit 0

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

echo "APP_URL=${app_url}"
