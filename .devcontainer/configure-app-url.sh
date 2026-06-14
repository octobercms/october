#!/usr/bin/env bash
set -euo pipefail

cd /var/www/html

[[ -f .env ]] || exit 0

forwarding_domain="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
forwarding_domain="${forwarding_domain#.}"

# In Codespaces, always derive the public URL from CODESPACE_NAME. Do not trust
# APP_URL from the environment or .env — it is often still http://localhost.
if [[ -n "${CODESPACE_NAME:-}" ]]; then
    app_url="https://${CODESPACE_NAME}-80.${forwarding_domain}"
else
    app_url="http://127.0.0.1"
fi

sed -i "s|^APP_URL=.*|APP_URL=${app_url}|" .env
sed -i 's|^LINK_POLICY=.*|LINK_POLICY=force|' .env

php artisan config:clear --quiet 2>/dev/null || true
php artisan cache:clear --quiet 2>/dev/null || true
php artisan config:cache --quiet 2>/dev/null || true

echo "APP_URL=${app_url}"
