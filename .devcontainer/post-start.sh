#!/usr/bin/env bash
set -euo pipefail

app_port=8080
workspace="${containerWorkspaceFolder:-$(pwd)}"
web_log="${workspace}/storage/logs/web-server.log"

app_url="$(bash "${workspace}/.devcontainer/configure-app-url.sh" | tail -n1 | sed 's/^APP_URL=//')"

web_ready() {
    curl -fsS "http://127.0.0.1:${app_port}/" >/dev/null 2>&1
}

if web_ready; then
    echo "October CMS is running at ${app_url}"
    exit 0
fi

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

echo "October CMS is running at ${app_url}"
