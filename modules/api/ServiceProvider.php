<?php namespace Api;

use App;

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
        parent::register('Api');

    }

    /**
     * Bootstrap the module events.
     *
     * @return void
     */
    public function boot()
    {
        //Override this to do nothing as in API we don't need to load unnecessary things
        //parent::boot('api');
    }

}
