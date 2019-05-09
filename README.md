# About

Repository for the OctoberCMS-powered Example.com.
Active development in develop branch; features in feature branches.
Develop locally using Homestead.
Pushes to develop are automatically deployed on the [dev server](https://dev.example.com/).

## Setup

1. Clone the repo
2. Copy .env.example to .env and configure accordingly (APP_URL and DB credentials)
3. Run the deployment script below, with the exception that `php artisan key:generate` needs to be run after `composer install`

## Deployment Script
```shell
# Install dependencies from composer.lock
composer install;

# Enable maintenance mode
php artisan down;

# Run any pending migrations
php artisan october:up;

# Remove and regenerate the symlinked public directory for whitelist approach to clean out
# any references that may have been removed and add any new ones that may have been added
rm -rf public;
php artisan october:mirror public --relative;

# Disable maintenance mode
php artisan up;
```