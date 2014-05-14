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

if (file_exists($compiled = __DIR__.'/compiled.php'))
{
	require $compiled;
}

/*
|--------------------------------------------------------------------------
| Setup Patchwork UTF-8 Handling
|--------------------------------------------------------------------------
|
| The Patchwork library provides solid handling of UTF-8 strings as well
| as provides replacements for all mb_* and iconv type functions that
| are not available by default in PHP. We'll setup this stuff here.
|
*/

Patchwork\Utf8\Bootup::initMbstring();

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

/*
|--------------------------------------------------------------------------
| Register The Laravel Auto Loader
|--------------------------------------------------------------------------
|
| We register an auto-loader "behind" the Composer loader that can load
| model classes on the fly, even if the autoload files have not been
| regenerated for the application. We'll add it to the stack here.
|
*/

Illuminate\Support\ClassLoader::register();


