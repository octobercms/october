<?php

class UiTestCase extends PHPUnit_Extensions_SeleniumTestCase
{

    protected function setUp()
    {
        /*
         * Look for selenium configuration
         */
        if (file_exists($seleniumEnv = __DIR__.'/../selenium.php'))
            require_once $seleniumEnv;

        /*
         * Configure selenium
         */
        if (!defined('TEST_SELENIUM_URL'))
            return $this->markTestSkipped('Selenium skipped');

        if (defined('TEST_SELENIUM_HOST')) $this->setHost(TEST_SELENIUM_HOST);
        if (defined('TEST_SELENIUM_PORT')) $this->setPort(TEST_SELENIUM_PORT);
        if (defined('TEST_SELENIUM_BROWSER')) $this->setBrowser(TEST_SELENIUM_BROWSER);
        $this->setBrowserUrl(TEST_SELENIUM_URL);
    }

    protected function signInToBackend()
    {
        $this->open('backend');
        $this->type("name=login", TEST_SELENIUM_USER);
        $this->type("name=password", TEST_SELENIUM_PASS);
        $this->click("//button[@type='submit']");
        $this->waitForPageToLoad("30000");
    }

    protected function waitForElementPresent($target, $timeout = 60)
    {
        for ($second = 0; ; $second++) {
            if ($second >= $timeout)
                $this->fail('timeout');

            try {
                if ($this->isElementPresent($target)) break;
            }
            catch (Exception $e) {}

            sleep(1);
        }
    }

    protected function waitForElementNotPresent($target, $timeout = 60)
    {
        for ($second = 0; ; $second++) {
            if ($second >= $timeout)
                $this->fail('timeout');

            try {
                if (!$this->isElementPresent($target)) break;
            }
            catch (Exception $e) {}

            sleep(1);
        }
    }


}
