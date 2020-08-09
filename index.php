<?php
/**
 * October - The PHP platform that gets back to basics.
 *
 * @package  October
 * @author   Alexey Bobkov, Samuel Georges
 */

/*
|--------------------------------------------------------------------------
| Register composer
|--------------------------------------------------------------------------
|
| Composer provides a generated class loader for the application.
|
*/

require __DIR__.'/bootstrap/autoload.php';

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
