<?php namespace Backend\Facades;

use October\Rain\Support\Facade;

class BackendMenu extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * Resolves to:
     * - Backend\Classes\NavigationManager
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'backend.menu';
    }
}
