#!/usr/bin/env bash
set -euo pipefail

app_root=/var/www/html

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
    path="${app_root}/${dir}"
    mkdir -p "${path}"

    if id www-data >/dev/null 2>&1; then
        chown -R www-data:www-data "${path}"
    fi
done

bash .devcontainer/configure-app-url.sh

port_open() {
    (echo >/dev/tcp/127.0.0.1/"$1") 2>/dev/null
}

if port_open 9000; then
    :
else
    php-fpm -D
fi

if port_open 80; then
    nginx -s reload
else
    nginx
fi
