<?php namespace Tests;

trait CreatesApplication
{
    public function createApplication()
    {
        /**
         * Creates the application.
         *
         * @return \Illuminate\Foundation\Application
         */
        $app = require __DIR__ . '/../bootstrap/app.php';
        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
        $app['cache']->setDefaultDriver('array');
        $app->setLocale('en');
        return $app;
    }
}