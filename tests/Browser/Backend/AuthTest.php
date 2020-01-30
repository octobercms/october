<?php namespace October\Core\Tests\Browser\Backend;

use Laravel\Dusk\Browser;
use October\Core\Tests\Browser\Pages\Backend\Dashboard;
use October\Core\Tests\Browser\Pages\Backend\ForgotPassword;
use October\Core\Tests\Browser\Pages\Backend\Login;

class AuthTest extends \October\Core\Tests\BrowserTestCase
{
    public function testSignInAndOut()
    {
        $this->browse(function (Browser $browser) {
            $browser
                ->visit(new Login)
                ->pause(500)
                ->type('@loginField', 'admin')
                ->type('@passwordField', 'admin1234')
                ->click('@submitButton');

            $browser
                ->on(new Dashboard)
                ->click('@accountMenu')
                ->clickLink('Sign out');

            $browser
                ->on(new Login);
        });
    }

    public function testPasswordReset()
    {
        $this->browse(function (Browser $browser) {
            $browser
                ->visit(new Login)
                ->pause(500)
                ->click('@forgotPasswordLink')
                ->screenshot('after-click');

            $browser
                ->on(new ForgotPassword)
                ->type('@loginField', 'admin')
                ->click('@submitButton');

            $browser
                ->on(new Login)
                ->waitFor('.flash-message')
                ->assertSeeIn('.flash-message', 'Message sent to your email address');
        });
    }
}
