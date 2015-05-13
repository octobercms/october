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
     * Returns the backend URI segment.
     */
    public function uri()
    {
        return Config::get('cms.backendUri', 'backend');
    }

    /**
     * Returns a URL in context of the Backend
     */
    public function url($path = null, $parameters = [], $secure = null)
    {
        return Url::to($this->uri() . '/' . $path, $parameters, $secure);
    }

    /**
     * Returns the base backend URL
     */
    public function baseUrl($path = null)
    {
        $backendUri = $this->uri();
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
        return Redirect::to($this->uri() . '/' . $path, $status, $headers, $secure);
    }

    /**
     * Create a new backend redirect response, while putting the current URL in the session.
     */
    public function redirectGuest($path, $status = 302, $headers = [], $secure = null)
    {
        return Redirect::guest($this->uri() . '/' . $path, $status, $headers, $secure);
    }

    /**
     * Create a new redirect response to the previously intended backend location.
     */
    public function redirectIntended($path, $status = 302, $headers = [], $secure = null)
    {
        return Redirect::intended($this->uri() . '/' . $path, $status, $headers, $secure);
    }
}
