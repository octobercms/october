#!/usr/bin/env bash
set -euo pipefail

workspace="${containerWorkspaceFolder:-$(pwd)}"
app_root=/var/www/html

if [[ "$(readlink -f "${app_root}" 2>/dev/null || true)" != "$(readlink -f "${workspace}")" ]]; then
    rm -rf "${app_root}"
    ln -sfn "${workspace}" "${app_root}"
fi

storage_dirs=(
    storage/app
    storage/framework/cache
    storage/framework/sessions
    storage/framework/views
    storage/logs
    storage/cms
    storage/system
    storage/temp
    bootstrap/cache
    database
)

for dir in "${storage_dirs[@]}"; do
    path="${workspace}/${dir}"
    mkdir -p "${path}"

    if id www-data >/dev/null 2>&1; then
        chown -R www-data:www-data "${path}"
    fi
done

app_url="$(bash "${workspace}/.devcontainer/configure-app-url.sh" | tail -n1 | sed 's/^APP_URL=//')"

port_open() {
    (echo >/dev/tcp/127.0.0.1/"$1") 2>/dev/null
}

if ! port_open 9000; then
    php-fpm -D
fi

if port_open 80; then
    nginx -s reload 2>/dev/null || nginx
else
    nginx
fi

if [[ -n "${app_url}" ]]; then
    echo ""
    echo "October CMS is running. Open in your browser:"
    echo "  ${app_url}"
    echo ""
    echo "Use port 80 (nginx), not port 9000 (php-fpm)."
    echo ""
fi
