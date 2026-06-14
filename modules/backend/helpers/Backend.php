<?php namespace Backend\Helpers;

use Url;
use Html;
use Config;
use System;
use Request;
use Redirect;
use October\Rain\Router\Helper as RouterHelper;
use System\Helpers\DateTime as DateTimeHelper;
use Backend\Classes\Skin;
use Exception;

/**
 * Backend Helper
 *
 * @package october\backend
 * @see \Backend\Facades\Backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Backend
{
    /**
     * assetVersion returns a unique identifier to cache bust backend assets. A salted
     * hash is used to prevent guessing of the current build number
     */
    public function assetVersion(): string
    {
        return hash('crc32', filemtime(base_path('vendor/autoload.php')) . System::VERSION);
    }

    /**
     * uri returns the backend URI segment
     */
    public function uri(): string
    {
        return ltrim(Config::get('backend.uri', Config::get('cms.backendUri', 'backend')), '/');
    }

    /**
     * url returns a URL in context of the backend
     */
    public function url($path = null, $parameters = [], $secure = null)
    {
        return Url::to($this->uri() . '/' . $path, $parameters, $secure);
    }

    /**
     * baseUrl returns the base backend URL
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
     * skinAsset returns a URL in context of the active Backend skin
     */
    public function skinAsset($path = null)
    {
        $skinPath = Skin::getActive()->getPath($path, true);
        return Url::asset($skinPath);
    }

    /**
     * redirect creates a new redirect response to a given backend path
     */
    public function redirect($path, $status = 302, $headers = [], $secure = null)
    {
        return Redirect::to($this->uri() . '/' . $path, $status, $headers, $secure);
    }

    /**
     * redirectGuest creates a new backend redirect response, placing current URL in the session
     */
    public function redirectGuest($path, $status = 302, $headers = [], $secure = null)
    {
        return Redirect::guest($this->uri() . '/' . $path, $status, $headers, $secure);
    }

    /**
     * redirectIntended creates a new redirect response to the previously intended backend location
     */
    public function redirectIntended($path, $status = 302, $headers = [], $secure = null)
    {
        return Redirect::intended($this->uri() . '/' . $path, $status, $headers, $secure);
    }

    /**
     * makeCarbon converts mixed inputs to a Carbon object and sets the backend timezone
     * @return \Carbon\Carbon
     */
    public static function makeCarbon($value, $throwException = true)
    {
        $carbon = DateTimeHelper::makeCarbon($value, $throwException);

        try {
            // Find user preference
            $carbon->setTimezone(\Backend\Models\Preference::get('timezone'));
        }
        catch (Exception $ex) {
            // Use system default
            $carbon->setTimezone(Config::get('backend.timezone', Config::get('app.timezone')));
        }

        return $carbon;
    }

    /**
     * date is a proxy method for dateTime() using "date" format alias
     * @return string
     */
    public function date($dateTime, $options = [])
    {
        return $this->dateTime($dateTime, $options + ['formatAlias' => 'date']);
    }

    /**
     * dateTime returns the HTML for a date formatted in the backend
     *
     * Supported for formatAlias:
     *   time             -> 6:28 AM
     *   timeLong         -> 6:28:01 AM
     *   date             -> 04/23/2016
     *   dateMin          -> 4/23/2016
     *   dateLong         -> April 23, 2016
     *   dateLongMin      -> Apr 23, 2016
     *   dateTime         -> April 23, 2016 6:28 AM
     *   dateTimeMin      -> Apr 23, 2016 6:28 AM
     *   dateTimeLong     -> Saturday, April 23, 2016 6:28 AM
     *   dateTimeLongMin  -> Sat, Apr 23, 2016 6:29 AM
     * @return string
     */
    public function dateTime($dateTime, $options = [])
    {
        extract(array_merge([
            'defaultValue' => '',
            'format' => null,
            'formatAlias' => null,
            'jsFormat' => null,
            'timeTense' => false,
            'timeSince' => false,
            'useTimezone' => true,
            // @deprecated API
            'ignoreTimezone' => false,
        ], $options));

        // @deprecated API
        if ($ignoreTimezone) {
            $useTimezone = false;
        }

        if (!$dateTime) {
            return '';
        }

        $carbon = DateTimeHelper::makeCarbon($dateTime);

        if ($jsFormat !== null) {
            $format = $jsFormat;
        }
        else {
            $format = DateTimeHelper::momentFormat($format);
        }

        $attributes = [
            'datetime' => $carbon,
            'data-datetime-control' => 1,
        ];

        if (!$useTimezone) {
            $attributes['data-ignore-timezone'] = true;
        }

        if ($timeTense) {
            $attributes['data-time-tense'] = 1;
        }
        elseif ($timeSince) {
            $attributes['data-time-since'] = 1;
        }
        elseif ($format) {
            $attributes['data-format'] = $format;
        }
        elseif ($formatAlias) {
            $attributes['data-format-alias'] = $formatAlias;
        }

        return '<time'.Html::attributes($attributes).'>'.e($defaultValue).'</time>'.PHP_EOL;
    }

    /**
     * sizeToPixels converts a size name, e.g. large, small to a pixel size
     */
    public function sizeToPixels($size): int
    {
        if (is_numeric($size)) {
            return (int) $size;
        }

        switch ($size) {
            case 'tiny':
                return 400;
            case 'small':
                return 500;
            case 'medium':
                return 600;
            case 'large':
                return 750;
            case 'huge':
                return 950;
            case 'giant':
                return 1200;
        }

        return 0;
    }
}
