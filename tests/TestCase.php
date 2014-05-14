<?php

class TestCase extends Illuminate\Foundation\Testing\TestCase 
{

    /**
     * Creates the application.
     *
     * @return Symfony\Component\HttpKernel\HttpKernelInterface
     */
    public function createApplication()
    {
        $unitTesting = true;

        $testEnvironment = 'testing';

        $result = require __DIR__.'/../bootstrap/start.php';

        /*
         * Use the array driver during the unit testing
         */
        Config::set('cache.driver', 'array');

        App::setLocale('en');

        return $result;
    }

}
