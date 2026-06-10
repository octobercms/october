#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

bash .devcontainer/configure-app-url.sh

exec php artisan serve --host=0.0.0.0 --port=8080
