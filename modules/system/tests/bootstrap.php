<?php

/*
 * Common classes
 */
require 'TestCase.php';
require 'PluginTestCase.php';

/*
 * October CMS autoloader
 */
require __DIR__ . '/../../../bootstrap/autoload.php';

/*
 * Fallback autoloader
 */
October\Rain\Composer\ClassLoader::configure(dirname(__DIR__, 3))
    ->withNamespace('App\\', '')
    ->withDirectories([
        'modules',
        'plugins'
    ])
    ->register();
