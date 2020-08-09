<?php
class AuthTest extends UiTestCase
{
    public function testSignInAndOut()
    {
        $this->open('backend');

        $cssLogoutLink = '#layout-mainmenu .mainmenu-accountmenu > ul > li:first-child > a';

        try {
            $this->assertTitle('Administration Area');
            $this->assertTrue($this->isElementPresent("name=login"));
            $this->assertTrue($this->isElementPresent("name=password"));
            $this->assertTrue($this->isElementPresent("//button[@type='submit']"));
            $this->verifyText("//button[@type='submit']", "Login");
        }
        catch (PHPUnit_Framework_AssertionFailedError $e) {
            array_push($this->verificationErrors, $e->toString());
        }

        /*
         * Sign in
         */
        $this->type("name=login", TEST_SELENIUM_USER);
        $this->type("name=password", TEST_SELENIUM_PASS);
        $this->click("//button[@type='submit']");
        $this->waitForPageToLoad("30000");

        try {
            $this->assertTitle('Dashboard | October CMS');
            $this->assertTrue($this->isElementPresent('css='.$cssLogoutLink));
        }
        catch (PHPUnit_Framework_AssertionFailedError $e) {
            array_push($this->verificationErrors, $e->toString());
        }

        $this->verifyText('css='.$cssLogoutLink, "Sign out");

        /*
         * Log out
         */
        $this->click('css='.$cssLogoutLink);
        $this->waitForPageToLoad("30000");

        try {
            $this->assertTitle('Administration Area');
        }
        catch (PHPUnit_Framework_AssertionFailedError $e) {
            array_push($this->verificationErrors, $e->toString());
        }
    }

    public function testPasswordReset()
    {
        $this->open('backend');

        try {
            $this->assertTrue($this->isElementPresent("link=exact:Forgot your password?"));
        }
        catch (PHPUnit_Framework_AssertionFailedError $e) {
            array_push($this->verificationErrors, $e->toString());
        }

        $this->click('link=exact:Forgot your password?');
        $this->waitForPageToLoad("30000");

        try {
            $this->assertTrue($this->isElementPresent("//button[@type='submit']"));
            $this->verifyText("//button[@type='submit']", "Restore");
            $this->assertTrue($this->isElementPresent("link=Cancel"));
        }
        catch (PHPUnit_Framework_AssertionFailedError $e) {
            array_push($this->verificationErrors, $e->toString());
        }

        $this->type("name=login", TEST_SELENIUM_USER);
        sleep(1);
        $this->click("//button[@type='submit']");
        $this->waitForPageToLoad("30000");

        try {
            $this->assertTitle('Administration Area');
            $this->assertTrue($this->isElementPresent("css=p.flash-message.success"));
            $this->verifyText("css=p.flash-message.success", "An email has been sent to your email address with password restore instructions.×");
        }
        catch (PHPUnit_Framework_AssertionFailedError $e) {
            array_push($this->verificationErrors, $e->toString());
        }
    }
}
