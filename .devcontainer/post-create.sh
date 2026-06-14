#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

# Copy .env and configure SQLite for the devcontainer
[ -f .env ] || cp .env.example .env

sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i 's|^DB_DATABASE=.*|DB_DATABASE=/var/www/html/database/database.sqlite|' .env
sed -i 's|^LINK_POLICY=.*|LINK_POLICY=force|' .env

# Create directories not tracked by git
mkdir -p \
  database \
  bootstrap/cache \
  storage/framework/cache/data \
  storage/app/public \
  storage/system

touch database/database.sqlite

# Install dependencies and bootstrap a fresh October instance with the demo theme
composer install --no-interaction
php artisan key:generate --force
php artisan october:migrate --force
php artisan tailor:migrate
php artisan theme:seed demo
