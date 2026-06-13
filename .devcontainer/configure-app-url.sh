#!/usr/bin/env bash
set -euo pipefail

workspace="${containerWorkspaceFolder:-$(pwd)}"
app_port=8080
env_file="${workspace}/.env"

if [[ ! -f "${env_file}" ]]; then
    exit 0
fi

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
    link_policy="${LINK_POLICY:-force}"
elif [[ -n "${CODESPACE_NAME:-}" && -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]]; then
    APP_URL="https://${CODESPACE_NAME}-${app_port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
    link_policy=force
else
    APP_URL="http://127.0.0.1:${app_port}"
    link_policy=detect
fi

set_env APP_URL "${APP_URL}"
set_env LINK_POLICY "${link_policy}"

php artisan config:clear --quiet 2>/dev/null || true
php artisan cache:clear --quiet 2>/dev/null || true

echo "APP_URL=${APP_URL}"
