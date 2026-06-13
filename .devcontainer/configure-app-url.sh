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

forwarding_domain="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
forwarding_domain="${forwarding_domain#.}"

if [[ -n "${APP_URL:-}" ]]; then
    app_url="${APP_URL}"
    link_policy="${LINK_POLICY:-force}"
elif [[ "${CODESPACES:-}" == "true" && -n "${CODESPACE_NAME:-}" ]]; then
    app_url="https://${CODESPACE_NAME}-${app_port}.${forwarding_domain}"
    link_policy=force
elif [[ -n "${CODESPACE_NAME:-}" && -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]]; then
    app_url="https://${CODESPACE_NAME}-${app_port}.${forwarding_domain}"
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
echo "LINK_POLICY=${link_policy}"
