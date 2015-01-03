<?php namespace Backend\Classes;

use URL;
use Config;
use Request;
use October\Rain\Router\Helper as RouterHelper;

/**
 * Backend Helper
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BackendHelper
{
    /**
     * Returns a URL in context of the Backend
     */
    public function url($path = null, $parameters = array(), $secure = null)
    {
        $backendUri = Config::get('cms.backendUri');
        return URL::to($backendUri . '/' . $path, $parameters, $secure);
    }

    /**
     * Returns a URL in context of the active Backend skin
     */
    public function skinAsset($path = null)
    {
        $skinPath = Skin::getActive()->getPath($path, true);
        return URL::asset($skinPath);
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
}
