<?php namespace System;

use October\Rain\Support\ModuleServiceProvider;

class ServiceProvider extends ModuleServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        parent::register('system');

        $this->registerConsoleCommand('october.build', \System\Console\OctoberBuild::class);
        $this->registerConsoleCommand('october.install', \System\Console\OctoberInstall::class);
        $this->registerConsoleCommand('october.migrate', \System\Console\OctoberMigrate::class);
    }

    /**
     * Bootstrap the module events.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot('system');
    }
}
