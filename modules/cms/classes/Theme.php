<?php namespace Cms\Classes;

use File;
use Lang;
use Event;
use Config;
use System\Classes\SystemException;

/**
 * This class represents the CMS theme. 
 * CMS theme is a directory that contains all CMS objects - pages, layouts, partials and asset files..
 * The theme parameters are specified in the theme.ini file in the theme root directory.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Theme
{
    /**
     * @var string Specifies the theme directory name.
     */
    protected $dirName;

    /**
     * Loads the theme.
     */
    public function load($dirName)
    {
        $this->dirName = $dirName;
    }

    /**
     * Returns the absolute theme path.
     */
    public function getPath()
    {
        return base_path().Config::get('cms.themesDir').'/'.$this->dirName;
    }

    /**
     * Returns the theme directory name.
     * @return string
     */
    public function getDirName()
    {
        return $this->dirName;
    }

    /**
     * Returns a list of pages in the theme.
     * This method is used internally in the routing process and in the back-end UI.
     * @param boolean $skipCache Indicates if the pages should be reloaded from the disk bypassing the cache.
     * @return array Returns an array of \Cms\Classes\Page objects.
     */
    public function listPages($skipCache = false)
    {
        return Page::listInTheme($this, $skipCache);
    }

    /**
     * Returns the active theme.
     * By default the active theme is loaded from the cms.activeTheme parameter,
     * but this behavior can be overridden by the cms.activeTheme event listeners.
     * @return \Cms\Classes\Theme Returns the loaded theme object.
     * If the theme doesn't exist, returns null.
     */
    public static function getActiveTheme()
    {
        $activeTheme = Config::get('cms.activeTheme');

        $apiResult = Event::fire('cms.activeTheme', [], true);
        if ($apiResult !== null)
            $activeTheme = $apiResult;

        if (!strlen($activeTheme))
            throw new SystemException(Lang::get('cms::lang.theme.active.not_set'));

        $theme = new self();
        $theme->load($activeTheme);
        if (!File::isDirectory($theme->getPath()))
            return null;

        return $theme;
    }

    /**
     * Returns the edit theme.
     * By default the edit theme is loaded from the cms.editTheme parameter,
     * but this behavior can be overridden by the cms.editTheme event listeners.
     * If the edit theme is not defined in the configuration file, the active theme
     * is returned.
     * @return \Cms\Classes\Theme Returns the loaded theme object.
     * If the theme doesn't exist, returns null.
     */
    public static function getEditTheme()
    {
        $editTheme = Config::get('cms.editTheme');
        if (!$editTheme)
            $editTheme = Config::get('cms.activeTheme');

        $apiResult = Event::fire('cms.editTheme', [], true);
        if ($apiResult !== null)
            $editTheme = $apiResult;

        if (!strlen($editTheme))
            throw new SystemException(Lang::get('cms::lang.theme.edit.not_set'));

        $theme = new self();
        $theme->load($editTheme);
        if (!File::isDirectory($theme->getPath()))
            return null;

        return $theme;
    }
}