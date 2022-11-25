<?php

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Register Core Helpers
|--------------------------------------------------------------------------
|
| We cannot rely on Composer's load order when calculating the weight of
| each package. This line ensures that the core global helpers are
| always given priority one status.
|
*/

$helperPath = __DIR__ . '/../vendor/october/rain/src/Support/helpers.php';

if (!file_exists($helperPath)) {
    echo 'Missing vendor files, try running "composer install" to install October CMS' . PHP_EOL;
    exit(1);
}

require $helperPath;

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

require __DIR__ . '/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Include The Compiled Class File
|--------------------------------------------------------------------------
|
| To dramatically increase your application's performance, you may use a
| compiled class file which contains all of the classes commonly used
| by a request. The Artisan "optimize" is used to create this file.
|
*/

$compiledPath = __DIR__ . '/../storage/framework/compiled.php';

if (file_exists($compiledPath)) {
    require $compiledPath;
}
