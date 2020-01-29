<?php namespace October\Core\Tests\Browser\Pages;

abstract class BackendPage extends Page
{
    /**
     * Get the global element shortcuts for the site.
     *
     * @return array
     */
    public static function siteElements()
    {
        return [
            '@mainMenu' => '#layout-mainmenu',
            '@accountMenu' => '#layout-mainmenu .mainmenu-account > a',
        ];
    }
}
