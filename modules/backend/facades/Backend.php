<?php namespace Backend\Facades;

use October\Rain\Support\Facade;

/**
 * Backend facade
 *
 * @package october\backend
 *
 * @method static string uri()
 * @method static string url(string $path = null, array $parameters = [], bool $secure = null)
 * @method static string baseUrl(string $path = null)
 * @method static string skinAsset(string $path = null)
 * @method static \Illuminate\Http\RedirectResponse redirect(string $path, int $status = 302, array $headers = [], bool $secure = null)
 * @method static \Illuminate\Http\RedirectResponse redirectGuest(string $path, int $status = 302, array $headers = [], bool $secure = null)
 * @method static \Illuminate\Http\RedirectResponse redirectIntended(string $path, int $status = 302, array $headers = [], bool $secure = null)
 * @method static string date($dateTime, array $options = [])
 * @method static string dateTime($dateTime, array $options = [])
 */
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
