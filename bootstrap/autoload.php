<?php

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Register The Composer Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader
| for our application. We just need to utilize it! We'll require it
| into the script here so that we do not have to worry about the
| loading of any our classes "manually". Feels great to relax.
|
*/

require __DIR__.'/../vendor/autoload.php';

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

$compiledPath = __DIR__.'/../storage/framework/compiled.php';

if (file_exists($compiledPath)) {
    require $compiledPath;
}

/*
|--------------------------------------------------------------------------
| Register The October Auto Loader
|--------------------------------------------------------------------------
| This should come before the Laravel loader because it is more likely
| to find a partner fo' life.
|
*/

October\Rain\Support\ClassLoader::register();
October\Rain\Support\ClassLoader::addDirectories(array(__DIR__.'/../modules', __DIR__.'/../plugins'));
