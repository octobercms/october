<?php
/*
|--------------------------------------------------------------------------
| Server file for "php artisan serve" command
|--------------------------------------------------------------------------
|
| Adapted from https://github.com/laravel/laravel/blob/master/server.php (2014-05-14)
| by Allan Freitas (allanfreitasci@gmail.com)
| Github/Twitter @allanfreitas
*/

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$uri = urldecode($uri);

$paths = require __DIR__.'/bootstrap/paths.php';

$requested = __DIR__.$uri;

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a Laravel
// application without having installed a "real" web server software here.
if ($uri !== '/' and file_exists($requested))
{
    return false;
}

require_once 'index.php';