<?php

use Laravel\Dusk\Browser;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UiTestCase extends \Tests\DuskTestCase
{
    use DatabaseTransactions;

    private $env;

    public function setUp()
    {
        $this->createApplication();

        /*
         * Ensure system is up to date
         */
        $this->runOctoberUpCommand();

        Browser::$baseUrl = $this->baseUrl();

        Browser::$storeScreenshotsAt = base_path('tests/Browser/screenshots');

        Browser::$storeConsoleLogAt = base_path('tests/Browser/console');

        Browser::$userResolver = function () {
            return $this->user();
        };
        $this->setEnvToDusk();
    }

    protected function runOctoberUpCommand()
    {
        Artisan::call('october:up');
    }

    protected function setEnvToDusk()
    {
        $this->env = file_get_contents('.env');
        file_put_contents('.env', 'APP_ENV=dusk');
    }

    protected function revertEnv()
    {
        file_put_contents('.env', $this->env);
    }

    //
    // OctoberCMS Helpers
    //

    protected function signInToBackend()
    {
        $this->browse(function ($browser) {
            $browser->visit('backend')
                ->assertTitle('Administration Area')
                ->type("login", 'admin')
                ->type("password", 'admin')
                ->press("Login")
                ->waitFor(".nav")
                ->assertPathIs('/backend');
        });
    }

    protected function getTextFromElement($element)
    {
        return trim($element->getAttribute('innerHTML'));
    }

    public function tearDown()
    {
        parent::tearDown();
        $this->revertEnv();
    }

}