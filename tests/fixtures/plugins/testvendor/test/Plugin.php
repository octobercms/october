<?php namespace TestVendor\Test;

use System\Classes\PluginBase;

class Plugin extends PluginBase
{
    public function pluginDetails()
    {
        return [
            'name' => 'Another Test Plugin',
            'description' => 'Test plugin used by unit tests with the same name.',
            'author' => 'Test Vendor'
        ];
    }

    public function registerFormWidgets()
    {
        return [
            'TestVendor\Test\FormWidgets\Sample' => [
                'label' => 'Sample',
                'code'  => 'sample'
            ]
        ];
    }
}
