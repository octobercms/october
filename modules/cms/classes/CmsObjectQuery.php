<?php namespace Cms\Classes;

use ApplicationException;

/**
 * This class provides helper methods to make the CmsObject behave like a Model
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsObjectQuery
{
    protected $useCache = false;

    protected $cmsObject;

    protected $theme;

    public function __construct($cmsObject, $theme = null)
    {
        $this->cmsObject = $cmsObject;
        $this->theme = $theme;
    }

    /**
     * Set the theme to a specific one.
     * @return self
     */
    public function inTheme($theme)
    {
        $this->theme = $theme;
        return $this;
    }

    /**
     * Set the theme to the editing one.
     * @return self
     */
    public function inEditTheme()
    {
        return $this->inTheme(Theme::getEditTheme());
    }

    /**
     * Set the theme to the activated one.
     * @return self
     */
    public function inActiveTheme()
    {
        return $this->inTheme(Theme::getActiveTheme());
    }

    /**
     * Enable or disable cache
     * @param  boolean $value
     * @return self
     */
    public function useCache($value = true)
    {
        $this->useCache = $value;
        return $this;
    }

    /**
     * Finds a single Cms Object by its file name
     * @param  string $fileName
     * @return CmsObject
     */
    public function find($fileName)
    {
        if (!$this->theme) {
            $this->inEditTheme();
        }

        if ($this->useCache) {
            return forward_static_call([$this->cmsObject, 'loadCached'], $this->theme, $fileName);
        }
        else {
            return forward_static_call([$this->cmsObject, 'load'], $this->theme, $fileName);
        }
    }

    /**
     * Returns all CMS objects for the set theme
     * @return CmsObjectCollection
     */
    public function all()
    {
        if (!$this->theme) {
            $this->inEditTheme();
        }

        $collection = forward_static_call([$this->cmsObject, 'listInTheme'], $this->theme, !$this->useCache);
        $collection = new CmsObjectCollection($collection);
        return $collection;
    }

    /**
     * Handle dynamic method calls into the method.
     * @param  string  $method
     * @param  array   $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        if (method_exists('Cms\Classes\CmsObjectCollection', $method)) {
            $collection = $this->all();
            return call_user_func_array(array($collection, $method), $parameters);
        }

        $className = get_class($this);
        throw new \BadMethodCallException("Call to undefined method {$className}::{$method}()");
    }
}
