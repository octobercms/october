<?php namespace DependencyTest\WrongCase;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public $require = [
        'Dependencytest.dependency'
    ];

    public function pluginDetails()
    {
        return [
            'name' => 'Dependency Test - Wrong Case',
            'description' => 'This is a test plugin with a dependency that exists, but is using the wrong letter case.',
            'author' => 'Ben Thomson'
        ];
    }
}
