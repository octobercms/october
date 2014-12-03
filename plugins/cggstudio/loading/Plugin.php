<?php namespace CGGStudio\Loading;

class Plugin extends \System\Classes\PluginBase
{
    public function pluginDetails()
    {
        return [
            'name' => 'cggstudio.loading::lang.plugin.name',
            'description' => "cggstudio.loading::lang.plugin.description",
            'author' => 'Carlos González Gurrea',
            'icon' => 'icon-refresh'
        ];
    }

    public function registerComponents()
    {
        return [
            '\CGGStudio\Loading\Components\Loading' => 'Loading'
        ];
    }
}
?>