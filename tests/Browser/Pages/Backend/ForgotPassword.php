<?php namespace October\Core\Tests\Browser\Pages\Backend;

use Laravel\Dusk\Browser;
use October\Core\Tests\Browser\Pages\Page;

class ForgotPassword extends Page
{
    /**
     * Get the URL for the page.
     *
     * @return string
     */
    public function url()
    {
        return '/backend/backend/auth/restore';
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
            ->assertMissing('input[name="password"]')
            ->assertPresent('@submitButton')
            ->assertPresent('@cancelLink')
            ->assertSeeIn('@submitButton', 'Restore');
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
            '@submitButton' => 'button[type="submit"]',
            '@cancelLink' => 'p.forgot-password > a',
        ];
    }
}
