#!/usr/bin/env bash
set -euo pipefail

app_port=8080

if curl -fsS "http://127.0.0.1:${app_port}/" >/dev/null 2>&1; then
    exit 0
fi

exec bash "$(dirname "$0")/post-start.sh"
