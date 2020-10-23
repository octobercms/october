<?php namespace DependencyTest\NotFound;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public $require = [
        'DependencyTest.Missing'
    ];

    public function pluginDetails()
    {
        return [
            'name' => 'Dependency Test - Not Found',
            'description' => 'This is a test plugin with a dependency that does not exist.',
            'author' => 'Ben Thomson'
        ];
    }
}
