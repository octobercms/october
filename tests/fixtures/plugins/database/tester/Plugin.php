<?php namespace Database\Tester;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{

    public function pluginDetails()
    {
        return [
            'name' => 'Database Tester Plugin',
            'description' => 'Plugin for loading tests that involve the database.',
            'author' => 'Alexey Bobkov, Samuel Georges'
        ];
    }

}