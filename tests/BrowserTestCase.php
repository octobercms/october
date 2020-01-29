<?php namespace October\Core\Tests;

use Facebook\WebDriver\Chrome\ChromeOptions;
use Facebook\WebDriver\Remote\RemoteWebDriver;
use Facebook\WebDriver\Remote\DesiredCapabilities;
use Laravel\Dusk\Browser;
use Laravel\Dusk\TestCase as DuskTestCase;
use October\Core\Tests\Concerns\CreatesApplication;
use October\Core\Tests\Concerns\InteractsWithAuthentication;
use October\Core\Tests\Concerns\RunsMigrations;
use October\Core\Tests\Concerns\TestsPlugins;

abstract class BrowserTestCase extends DuskTestCase
{
    use CreatesApplication;
    use InteractsWithAuthentication;
    use RunsMigrations;
    use TestsPlugins;

    /**
     * Prepare for Dusk test execution.
     *
     * @beforeClass
     * @return void
     */
    public static function prepare()
    {
        static::startChromeDriver();
    }

    /**
     * Create the RemoteWebDriver instance.
     *
     * @return \Facebook\WebDriver\Remote\RemoteWebDriver
     */
    protected function driver()
    {
        $options = (new ChromeOptions)->addArguments([
            '--disable-gpu',
            '--headless',
            '--window-size=1920,1080',
        ]);

        return RemoteWebDriver::create(
            'http://localhost:9515',
            DesiredCapabilities::chrome()->setCapability(
                ChromeOptions::CAPABILITY,
                $options
            )
        );
    }

    public function setUp(): void
    {
        $this->resetManagers();

        parent::setUp();

        // Ensure system is up to date
        if ($this->usingTestDatabase) {
            $this->runOctoberUpCommand();
        }

        // Detect a plugin and autoload it, if necessary
        $this->detectPlugin();

        // Disable mailer
        \Mail::pretend();

        Browser::$baseUrl = $this->baseUrl();
        Browser::$storeScreenshotsAt = base_path('tests/Browser/screenshots');
        Browser::$storeConsoleLogAt = base_path('tests/Browser/console');
        Browser::$userResolver = function () {
            return $this->user();
        };
    }

    public function tearDown(): void
    {
        if ($this->usingTestDatabase && isset($this->testDatabasePath)) {
            unlink($this->testDatabasePath);
        }

        parent::tearDown();
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

    /**
     * Similar to the native getConfirmation() function
     */
    protected function getSweetConfirmation($expectedText = null, $clickOk = true)
    {
        $this->waitForElementPresent("xpath=(//div[@class='sweet-alert showSweetAlert visible'])[1]");

        if ($expectedText) {
            $this->verifyText("//div[@class='sweet-alert showSweetAlert visible']//h4", $expectedText);
        }

        $this->verifyText("//div[@class='sweet-alert showSweetAlert visible']//button[@class='confirm btn btn-primary']", "OK");

        if ($clickOk) {
            $this->click("xpath=(//div[@class='sweet-alert showSweetAlert visible']//button[@class='confirm btn btn-primary'])[1]");
        }
    }
}
