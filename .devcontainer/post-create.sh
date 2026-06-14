#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

[ -f .env ] || cp .env.example .env

sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i 's|^DB_DATABASE=.*|DB_DATABASE=/var/www/html/database/database.sqlite|' .env

mkdir -p \
  database \
  bootstrap/cache \
  storage/framework/cache/data \
  storage/app/public \
  storage/system

touch database/database.sqlite

composer install --no-interaction
php artisan key:generate --force
php artisan october:migrate --force
php artisan tailor:migrate
php artisan theme:seed demo
