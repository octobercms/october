<?php namespace Backend\Helpers;

use Url;
use File;
use Html;
use Config;
use Request;
use Redirect;
use October\Rain\Router\Helper as RouterHelper;
use System\Helpers\DateTime as DateTimeHelper;
use Backend\Classes\Skin;
use Backend\Helpers\Exception\DecompileException;

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

    /**
     * Proxy method for dateTime() using "date" format alias.
     * @return string
     */
    public function date($dateTime, $options = [])
    {
        return $this->dateTime($dateTime, $options + ['formatAlias' => 'date']);
    }

    /**
     * Returns the HTML for a date formatted in the backend.
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
            'ignoreTimezone' => false,
        ], $options));

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

        if ($ignoreTimezone) {
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
     * Decompiles the compilation asset files
     *
     * This is used to load each individual asset file, as opposed to using the compilation assets. This is useful only
     * for development, to allow developers to test changes without having to re-compile assets.
     *
     * @param string $file The compilation asset file to decompile
     * @param boolean $skinAsset If true, will load decompiled assets from the "skins" directory.
     * @throws DecompileException If the compilation file cannot be decompiled
     * @return array
     */
    public function decompileAsset(string $file, bool $skinAsset = false)
    {
        $assets = $this->parseAsset($file, $skinAsset);

        return array_map(function ($asset) use ($skinAsset) {
            // Resolve relative asset paths
            if ($skinAsset) {
                $assetPath = base_path(substr(Skin::getActive()->getPath($asset, true), 1));
            } else {
                $assetPath = base_path($asset);
            }
            $relativePath = File::localToPublic(realpath($assetPath));

            return Url::asset($relativePath);
        }, $assets);
    }

    /**
     * Parse the provided asset file to get the files that it includes
     *
     * @param string $file The compilation asset file to parse
     * @param boolean $skinAsset If true, will load decompiled assets from the "skins" directory.
     * @return array
     */
    protected function parseAsset($file, $skinAsset)
    {
        if ($skinAsset) {
            $assetFile = base_path(substr(Skin::getActive()->getPath($file, true), 1));
        } else {
            $assetFile = base_path($file);
        }

        $results = [$file];

        if (!file_exists($assetFile)) {
            throw new DecompileException('File ' . $file . ' does not exist to be decompiled.');
        }
        if (!is_readable($assetFile)) {
            throw new DecompileException('File ' . $file . ' cannot be decompiled. Please allow read access to the file.');
        }

        $contents = file_get_contents($assetFile);

        // Find all assets that are compiled in this file
        preg_match_all('/^=require\s+([A-z0-9-_+\.\/]+)$/m', $contents, $matches, PREG_SET_ORDER);

        // Determine correct asset path
        $directory = str_replace(basename($file), '', $file);

        if (count($matches)) {
            $results = array_map(function ($match) use ($directory) {
                return $directory . $match[1];
            }, $matches);

            foreach ($results as $i => $result) {
                $nested = $this->parseAsset($result, $skinAsset);
                array_splice($results, $i, 1, $nested);
            }
        }

        return $results;
    }
}
