<?php namespace Cms\Facades;

use October\Rain\Support\Facade;

/**
 * Cms facade
 *
 * @package october\cms
 *
 * @method static string url(string $path = null)
 */
class Cms extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @see \Cms\Helpers\Cms
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'cms.helper';
    }
}
