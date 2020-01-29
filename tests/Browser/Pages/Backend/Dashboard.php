<?php namespace October\Core\Tests\Browser\Pages\Backend;

use Laravel\Dusk\Browser;
use October\Core\Tests\Browser\Pages\BackendPage;

class Dashboard extends BackendPage
{
    /**
     * Get the URL for the page.
     *
     * @return string
     */
    public function url()
    {
        return '/backend';
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
            ->assertTitleContains('Dashboard')
            ->assertPresent('@mainMenu')
            ->assertPresent('@accountMenu')
            ->waitFor('.report-widget')
            ->assertSee('Welcome');
    }

    /**
     * Get the global element shortcuts for the site.
     *
     * @return array
     */
    public function elements()
    {
        return [
        ];
    }
}
