#!/usr/bin/env bash
set -euo pipefail

PORT=8080

if [ "${CODESPACES:-}" = "true" ] && [ -n "${CODESPACE_NAME:-}" ]; then
  DOMAIN="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
  DOMAIN="${DOMAIN#.}"
  APP_URL="https://${CODESPACE_NAME}-${PORT}.${DOMAIN}"
else
  APP_URL="http://localhost:${PORT}"
fi

if [ -f .env ]; then
  sed -i "s|^APP_URL=.*|APP_URL=${APP_URL}|" .env

  if [ "${CODESPACES:-}" = "true" ]; then
    sed -i 's/^LINK_POLICY=.*/LINK_POLICY=force/' .env
  fi
fi

php artisan config:clear --quiet 2>/dev/null || true
php artisan cache:clear --quiet 2>/dev/null || true

echo "APP_URL=${APP_URL}"
