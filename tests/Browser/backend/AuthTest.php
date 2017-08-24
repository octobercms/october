<?php namespace Tests\Browser\Backend;

use Laravel\Dusk\Browser;

class AuthTest extends \UiTestCase
{
    /**
     * @group auth
     */
    public function testSignInAndOut()
    {
        $this->signInToBackend();

        $cssOpenLogoutLink = '#layout-mainmenu .mainmenu-account > a:first-child';
        $cssLogoutLink = '#layout-mainmenu .mainmenu-accountmenu > ul > li:last-child > a';
        $this->browse(function (Browser $browser) use ($cssLogoutLink, $cssOpenLogoutLink) {

            $browser->assertTitle('Dashboard | OctoberCMS');

            //Log out
            $browser->element($cssOpenLogoutLink)->click();
            $logoutLinkEl = $browser->element($cssLogoutLink);
            $this->assertNotNull($logoutLinkEl);
            $this->assertEquals('Sign out', $this->getTextFromElement($logoutLinkEl));
            $logoutLinkEl->click();

            $browser->waitFor(".login-button")
                ->assertTitle('Administration Area');
        });
    }

    /**
     * @group auth
     */
    public function testPasswordReset()
    {
        $this->browse(function(Browser $browser){
            $browser->visit('backend');

            $browser->assertSee('Forgot your password?');
            $browser->clickLink('Forgot your password?');
            $browser->waitFor('.restore-button');
            $browser->assertSeeIn('.restore-button','Restore');

            $browser->assertSeeLink('Cancel');
            $browser->type('login','admin');
            $browser->press('Restore');

            $browser->assertTitle('Administration Area');
            $browser->waitFor('p.flash-message.success');
            $browser->assertSeeIn('p.flash-message.success','Message sent to your email address with instructions.');
        });
    }
}