<?php namespace Cms\Traits;

use File;
use Cache;
use Config;
use Cms\Classes\Page;
use Cms\Classes\Controller;
use ApplicationException;

/**
 * URL Maker Trait
 *
 * Useful in models for generating a "url" attribute, automatically linked
 * to a primary component used in the active theme. For example:
 *
 *    use \Cms\Traits\UrlMaker;
 *
 *    protected $urlComponentName = 'blogPost';
 *
 * When declared in a model, the above will result in `$model->url` magically
 * linking to the component that declares `isPrimary = 1` in configuration.
 *
 *    [blogPost]
 *    isPrimary = "1"
 *
 * The parameters passed to the component are supplied when overriding the
 * method `getUrlParams` also within the model.
 *
 *    public function getUrlParams()
 *    {
 *        return [
 *            'id' => $this->id,
 *            'hash' => $this->hash,
 *        ];
 *    }
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait UrlMaker
{
    //
    // Properties to declare
    //

    /**
     * @var string The component to use for generating URLs.
     */
    // protected $urlComponentName = 'testArchive';

    /**
     * @var string The property name to determine a primary component.
     */
    // protected $urlComponentProperty = 'isPrimary';

    /**
     * Returns an array of values to use in URL generation.
     * @return @array
     */
    // public function getUrlParams()
    // {
    //     return [
    //         'id' => $this->id,
    //         'slug' => $this->slug
    //     ];
    // }

    //
    // Internal properties
    //

    /**
     * @var string URL cache
     */
    protected $url;

    /**
     * @var string Page where detected component is found.
     */
    protected static $urlPageName;

    /**
     * Changes the component used for generating the URLs dynamically.
     *
     * @param string $name
     * @param string $property
     * @return void
     */
    public function resetUrlComponent($name, $property = null)
    {
        $this->urlComponentName = $name;

        if ($property) {
            $this->urlComponentProperty = $property;
        }

        static::$urlPageName = $this->url = null;
    }

    /**
     * Mutator for the "url" attribute. Returns the URL detected by the component.
     * @return string
     */
    public function getUrlAttribute()
    {
        if ($this->url === null) {
            $this->url = $this->makeUrl();
        }

        return $this->url;
    }

    /**
     * Explicitly set the URL for this model.
     * @param string $value
     * @return void
     */
    public function setUrlAttribute($value)
    {
        $this->url = $value;
    }

    /**
     * Explicitly set the CMS Page to link to.
     * @param string $pageName
     * @return void
     */
    public function setUrlPageName($pageName)
    {
        static::$urlPageName = $pageName;
    }

    /**
     * Locates the page name where the detected component is found. This method
     * uses the Cache service to improve performance.
     * @return string
     */
    public function getUrlPageName()
    {
        if (static::$urlPageName !== null) {
            return static::$urlPageName;
        }

        /*
         * Cache
         */
        $key = 'urlMaker'.$this->urlComponentName.crc32(get_class($this));

        $cached = Cache::get($key, false);
        if ($cached !== false && ($cached = @unserialize($cached)) !== false) {
            $filePath = array_get($cached, 'path');
            $mtime = array_get($cached, 'mtime');
            if (!File::isFile($filePath) || ($mtime != File::lastModified($filePath))) {
                $cached = false;
            }
        }

        if ($cached !== false) {
            return static::$urlPageName = array_get($cached, 'fileName');
        }

        /*
         * Fallback
         */
        $page = null;
        $useProperty = property_exists($this, 'urlComponentProperty');

        if ($useProperty) {
            $page = Page::whereComponent($this->urlComponentName, $this->urlComponentProperty, '1')->first();
        }

        if (!$useProperty || !$page) {
            $page = Page::withComponent($this->urlComponentName)->first();
        }

        if (!$page) {
            throw new ApplicationException(sprintf(
                'Unable to a find a primary component "%s" for generating a URL in %s.',
                $this->urlComponentName,
                get_class($this)
            ));
        }

        $baseFileName = $page->getBaseFileName();
        $filePath = $page->getFilePath();

        $cached = [
            'path'     => $filePath,
            'fileName' => $baseFileName,
            'mtime'    => @File::lastModified($filePath)
        ];

        $expiresAt = now()->addMinutes(Config::get('cms.parsedPageCacheTTL', 1440));
        Cache::put($key, serialize($cached), $expiresAt);

        return static::$urlPageName = $baseFileName;
    }

    /**
     * Generates a real URL based on the page, detected by the primary component.
     * The CMS Controller is used for this process passing the declared params.
     * @return string
     */
    protected function makeUrl()
    {
        $controller = Controller::getController() ?: new Controller;

        return $controller->pageUrl($this->getUrlPageName(), $this->getUrlParams());
    }
}
