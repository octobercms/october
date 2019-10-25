<?php namespace Backend\Facades;

use October\Rain\Support\Facade;

class Backend extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @see \Backend\Helpers\Backend
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'backend.helper';
    }
}
