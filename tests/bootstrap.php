<?php

/*
 * October autoloader
 */
require __DIR__ . '/../bootstrap/autoload.php';

/*
 * Fallback autoloader
 */
October\Rain\Support\ClassLoader::register();
October\Rain\Support\ClassLoader::addDirectories([
    __DIR__.'/../modules',
    __DIR__.'/../plugins'
]);
