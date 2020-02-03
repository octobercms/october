<?php namespace October\Core\Tests\Browser\Pages\Backend;

use Laravel\Dusk\Browser;
use October\Core\Tests\Browser\Pages\BackendPage;

class Cms extends BackendPage
{
    /**
     * Get the URL for the page.
     *
     * @return string
     */
    public function url()
    {
        return '/backend/cms';
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
            ->assertTitleContains('CMS |')
            ->assertPresent('@mainMenu')
            ->assertPresent('@sideNav')
            ->assertPresent('@accountMenu');
    }
}
