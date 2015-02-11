<?php namespace Backend\Helpers;

use Url;
use Config;
use Request;
use Redirect;
use October\Rain\Router\Helper as RouterHelper;
use Backend\Classes\Skin;

/**
 * Backend Helper
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Backend
{
    /**
     * Returns a URL in context of the Backend
     */
    public function url($path = null, $parameters = [], $secure = null)
    {
        $backendUri = Config::get('cms.backendUri');
        return Url::to($backendUri . '/' . $path, $parameters, $secure);
    }

    /**
     * Returns the base backend URL
     */
    public function baseUrl($path = null)
    {
        $backendUri = Config::get('cms.backendUri');
        $baseUrl = Request::getBaseUrl();

        if ($path === null) {
            return $baseUrl . '/' . $backendUri;
        }

        $path = RouterHelper::normalizeUrl($path);
        return $baseUrl . '/' . $backendUri . $path;
    }

    /**
     * Returns a URL in context of the active Backend skin
     */
    public function skinAsset($path = null)
    {
        $skinPath = Skin::getActive()->getPath($path, true);
        return Url::asset($skinPath);
    }

    /**
     * Create a new redirect response to a given backend path.
     */
    public function redirect($path, $status = 302, $headers = [], $secure = null)
    {
        $backendUri = Config::get('cms.backendUri');
        return Redirect::to($backendUri . '/' . $path, $status, $headers, $secure);
    }

    /**
     * Create a new backend redirect response, while putting the current URL in the session.
     */
    public function redirectGuest($path, $status = 302, $headers = [], $secure = null)
    {
        $backendUri = Config::get('cms.backendUri');
        return Redirect::guest($backendUri . '/' . $path, $status, $headers, $secure);
    }

    /**
     * Create a new redirect response to the previously intended backend location.
     */
    public function redirectIntended($path, $status = 302, $headers = [], $secure = null)
    {
        $backendUri = Config::get('cms.backendUri');
        return Redirect::intended($backendUri . '/' . $path, $status, $headers, $secure);
    }
}
