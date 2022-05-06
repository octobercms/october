<?php namespace October\Demo;

use System\Classes\PluginBase;

/**
 * The plugin.php file (called the plugin initialization script) defines the plugin information class.
 */
class Plugin extends PluginBase
{

    public function pluginDetails()
    {
        return [
            'name' => 'October Demo',
            'description' => 'Provides features used by the provided demonstration theme.',
            'author' => 'Alexey Bobkov, Samuel Georges',
            'icon' => 'icon-leaf'
        ];
    }

    public function registerComponents()
    {
        return [
            \October\Demo\Components\Todo::class => 'demoTodo',
            \October\Demo\Components\BackendLink::class => 'backendLink'
        ];
    }
}
