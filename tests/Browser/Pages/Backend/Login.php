<?php namespace October\Core\Tests\Browser\Pages\Backend;

use Laravel\Dusk\Browser;
use October\Core\Tests\Browser\Pages\Page;

class Login extends Page
{
    /**
     * Get the URL for the page.
     *
     * @return string
     */
    public function url()
    {
        return '/backend/backend/auth/signin';
    }

    /**
     * Assert that the browser is on the page.
     *
     * @param  \Laravel\Dusk\Browser  $browser
     * @return void
     */
    public function assert(Browser $browser)
    {
        $browser
            ->assertTitle('Administration Area')
            ->assertPresent('@loginField')
            ->assertPresent('@passwordField')
            ->assertPresent('@submitButton')
            ->assertPresent('@forgotPasswordLink')
            ->assertSeeIn('@submitButton', 'Login');
    }

    /**
     * Get the global element shortcuts for the site.
     *
     * @return array
     */
    public function elements()
    {
        return [
            '@loginField' => 'input[name="login"]',
            '@passwordField' => 'input[name="password"]',
            '@submitButton' => 'button[type="submit"]',
            '@forgotPasswordLink' => 'p.forgot-password > a',
        ];
    }
}
