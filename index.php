<?php
/**
 * October - The PHP platform that gets back to basics.
 *
 * @package  October
 * @author   Alexey Bobkov, Samuel Georges
 */

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

$helperPath = __DIR__.'/vendor/october/rain/src/Support/helpers.php';

if (!file_exists($helperPath)) {
    echo 'Missing vendor files, try running "composer install" or use the Wizard installer.'.PHP_EOL;
    exit(1);
}

require $helperPath;

/*
|--------------------------------------------------------------------------
| Register composer
|--------------------------------------------------------------------------
|
| Composer provides a generated class loader for the application.
|
*/

require __DIR__.'/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Load framework
|--------------------------------------------------------------------------
|
| This bootstraps the framework and loads up this application.
|
*/

$app = require_once __DIR__.'/bootstrap/app.php';

/*
|--------------------------------------------------------------------------
| Process request
|--------------------------------------------------------------------------
|
| Execute the request and send the response back to the client.
|
*/

$kernel = $app->make('Illuminate\Contracts\Http\Kernel');

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

$response->send();

$kernel->terminate($request, $response);
