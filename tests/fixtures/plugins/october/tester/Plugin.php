<?php namespace October\Tester;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{

    public function pluginDetails()
    {
        return [
            'name' => 'October Test Plugin',
            'description' => 'Test plugin used by unit tests.',
            'author' => 'Alexey Bobkov, Samuel Georges'
        ];
    }

    public function registerComponents()
    {
        return [
            'October\Tester\Components\Archive' => 'testArchive',
            'October\Tester\Components\Post' => 'testPost'
        ];
    }

}