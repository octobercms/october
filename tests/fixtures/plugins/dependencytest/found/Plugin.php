<?php namespace DependencyTest\Found;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public $require = [
        'DependencyTest.Dependency'
    ];

    public function pluginDetails()
    {
        return [
            'name' => 'Dependency Test - Found',
            'description' => 'This is a test plugin with a dependency that exists.',
            'author' => 'Ben Thomson'
        ];
    }
}
