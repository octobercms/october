<?php namespace DependencyTest\Dependency;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name' => 'Dependency Test - Dependency',
            'description' => 'This is a test plugin that will act as a dependency for the other test plugins in this
                namespace.',
            'author' => 'Ben Thomson'
        ];
    }
}
