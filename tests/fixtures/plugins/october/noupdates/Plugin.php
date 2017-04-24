<?php namespace October\NoUpdates;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{

    public function pluginDetails()
    {
        return [
            'name' => 'October Empty Plugin',
            'description' => 'Empty plugin used by unit tests.',
            'author' => 'Alexey Bobkov, Samuel Georges'
        ];
    }

}
