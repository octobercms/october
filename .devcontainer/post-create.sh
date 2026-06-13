#!/usr/bin/env bash
set -euo pipefail

app_root="$(pwd)"

[ -f .env ] || cp .env.example .env

sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i "s|^DB_DATABASE=.*|DB_DATABASE=${app_root}/database/database.sqlite|" .env

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

composer install --no-interaction
php artisan key:generate --force
php artisan october:migrate --force
php artisan tailor:migrate
php artisan theme:seed demo

php artisan tinker --execute="
if (!System\Models\SiteDefinition::query()->exists()) {
    \$site = new System\Models\SiteDefinition;
    \$site->name = 'Default';
    \$site->code = 'default';
    \$site->theme = 'demo';
    \$site->locale = 'en';
    \$site->is_enabled = true;
    \$site->is_primary = true;
    \$site->is_host_restricted = false;
    \$site->save();
}
"

bash .devcontainer/configure-app-url.sh >/dev/null || true
