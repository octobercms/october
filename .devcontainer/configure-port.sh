#!/usr/bin/env bash
set -euo pipefail

app_port="${1:-8080}"

if [[ -z "${CODESPACE_NAME:-}" ]]; then
    exit 0
fi

public_url="https://${CODESPACE_NAME}-${app_port}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}/"

if ! command -v gh >/dev/null 2>&1; then
    echo "Install GitHub CLI to configure port visibility automatically." >&2
    exit 1
fi

export GH_TOKEN="${GITHUB_TOKEN:-${GH_TOKEN:-}}"

port_is_forwarded() {
    gh codespace ports --codespace "${CODESPACE_NAME}" --json sourcePort 2>/dev/null \
        | grep -q "\"sourcePort\":${app_port}"
}

set_port_visibility() {
    local visibility=$1

    gh codespace ports visibility "${app_port}:${visibility}" --codespace "${CODESPACE_NAME}" 2>&1
}

public_url_ready() {
    local status
    status="$(curl -sS -o /dev/null -w '%{http_code}' "${public_url}" 2>/dev/null || echo "000")"
    [[ "${status}" == "200" ]]
}

if ! port_is_forwarded; then
    echo "Port ${app_port} is not forwarded yet. Check the Ports panel." >&2
    exit 1
fi

for visibility in public org; do
    if set_port_visibility "${visibility}"; then
        for _ in $(seq 1 10); do
            if public_url_ready; then
                echo "Port ${app_port} is ${visibility}."
                echo "Open: ${public_url}"
                exit 0
            fi
            sleep 1
        done
    fi
done

echo "Could not make port ${app_port} reachable at ${public_url}" >&2
echo "In the Ports panel, set port ${app_port} visibility to Public (do not set HTTPS)." >&2
exit 1
