<?php namespace System\Facades;

use October\Rain\Support\Facade;

/**
 * Manifest facade
 *
 * @method static bool has(string $name)
 * @method static mixed get(string $key, mixed $default = null)
 * @method static void put(string $key, mixed $value)
 * @method static void forget(string $name)
 * @method static void build()
 *
 * @see \System\Classes\ManifestCache
 */
class Manifest extends Facade
{
    /**
     * getFacadeAccessor returns the registered name of the component
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'system.manifest';
    }
}
