<?php

/*
 * October autoloader
 */
require __DIR__ . '/../bootstrap/autoload.php';

/*
 * Fallback autoloader
 */
$loader = new October\Rain\Support\ClassLoader(
    new October\Rain\Filesystem\Filesystem,
    __DIR__ . '/../',
    __DIR__ . '/../storage/framework/classes.php'
);

$loader->register();
$loader->addDirectories([
    'modules',
    'plugins'
]);
