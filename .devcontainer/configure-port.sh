#!/usr/bin/env bash
set -euo pipefail

app_port="${1:-8080}"

if [[ -z "${CODESPACE_NAME:-}" ]]; then
    exit 0
fi

public_url="https://${CODESPACE_NAME}-${app_port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/"

port_visibility() {
    if ! command -v gh >/dev/null 2>&1; then
        return 1
    fi

    gh codespace ports --codespace "${CODESPACE_NAME}" 2>/dev/null \
        | awk -v port="${app_port}" '$1 == port { print $2; exit }'
}

set_port_visibility() {
    local visibility=$1
    local token="${GITHUB_TOKEN:-}"

    if [[ -z "${token}" ]] && command -v gh >/dev/null 2>&1; then
        token="$(gh auth token 2>/dev/null || true)"
    fi

    if [[ -n "${token}" ]]; then
        local status
        status="$(curl -sS -o /tmp/codespace-port-response.json -w '%{http_code}' \
            -X PATCH \
            -H "Authorization: Bearer ${token}" \
            -H "Accept: application/vnd.github+json" \
            -H "X-GitHub-Api-Version: 2022-11-28" \
            "https://api.github.com/user/codespaces/${CODESPACE_NAME}/ports/${app_port}" \
            -d "{\"visibility\":\"${visibility}\"}")"

        if [[ "${status}" == "200" ]]; then
            return 0
        fi

        echo "GitHub API returned ${status} for visibility=${visibility}:" >&2
        cat /tmp/codespace-port-response.json >&2 || true
    fi

    if command -v gh >/dev/null 2>&1; then
        gh codespace ports visibility "${app_port}:${visibility}" --codespace "${CODESPACE_NAME}" && return 0
    fi

    return 1
}

public_url_ready() {
    local status
    status="$(curl -sS -o /dev/null -w '%{http_code}' "${public_url}" 2>/dev/null || echo "000")"
    [[ "${status}" == "200" ]]
}

for visibility in public org; do
    for _ in $(seq 1 15); do
        current="$(port_visibility || true)"

        if [[ "${current}" == "public" || "${current}" == "org" ]] && public_url_ready; then
            echo "Port ${app_port} is ${current}."
            echo "Open: ${public_url}"
            exit 0
        fi

        if set_port_visibility "${visibility}"; then
            sleep 2

            if public_url_ready; then
                echo "Port ${app_port} set to ${visibility}."
                echo "Open: ${public_url}"
                exit 0
            fi
        fi

        sleep 2
    done
done

echo "Port ${app_port} is still private. Open it from the Ports panel globe icon while signed in to Codespaces." >&2
echo "If public ports are blocked by your organization, ask an admin to allow forwarded port visibility." >&2
echo "Preview URL: ${public_url}" >&2
exit 1
