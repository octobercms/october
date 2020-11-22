<?php namespace Cms\Facades;

use October\Rain\Support\Facade;

/**
 * @method static string url(string $path = null)
 *
 * @see \Cms\Helpers\Cms
 */
class Cms extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'cms.helper';
    }
}
