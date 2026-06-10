#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  cp .env.example .env
fi

sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$(pwd)/database/database.sqlite|" .env
bash .devcontainer/configure-app-url.sh

mkdir -p \
  database \
  bootstrap/cache \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/views \
  storage/logs \
  storage/app/public \
  storage/temp/public \
  storage/cms \
  storage/system

touch database/database.sqlite
chmod -R ug+rwx database storage bootstrap/cache

composer install --no-interaction

if grep -q '^APP_KEY=$' .env || grep -q '^APP_KEY=""$' .env; then
  php artisan key:generate --force
fi

php artisan october:migrate --force
php artisan tailor:migrate
php artisan theme:seed demo
