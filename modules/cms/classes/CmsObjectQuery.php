<?php namespace Cms\Classes;

use System\Classes\ApplicationException;

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

    public function __construct($cmsObject, $theme)
    {
        $this->cmsObject = $cmsObject;

        if ($theme)
            $this->theme = $theme;
        else
            $this->inEditTheme();
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
     * Returns all CMS objects for the set theme
     * @return CmsObjectCollection
     */
    public function all()
    {
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
        $collection = $this->all();
        return call_user_func_array(array($collection, $method), $parameters);
    }

}