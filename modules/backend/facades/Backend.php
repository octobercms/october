<?php namespace Backend\Facades;

use October\Rain\Support\Facade;

class Backend extends Facade
{
    /**
     * Get the registered name of the component.
     * 
     * Resolves to:
     * - Backend\Classes\BackendHelper
     * 
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'backend.helper';
    }
}
