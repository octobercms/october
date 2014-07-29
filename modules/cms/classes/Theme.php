<?php namespace Cms\Classes;

use URL;
use File;
use Lang;
use Cache;
use Event;
use Config;
use DbDongle;
use October\Rain\Support\Yaml;
use System\Models\Parameters;
use System\Classes\SystemException;
use DirectoryIterator;

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
     * @var mixed Keeps the cached configuration file values.
     */
    protected $configCache = null;

    /**
     * Loads the theme.
     */
    public function load($dirName)
    {
        $this->dirName = $dirName;
    }

    /**
     * Returns the absolute theme path.
     * @param  string $dirName Optional theme directory. Defaults to $this->getDirName()
     * @return string
     */
    public function getPath($dirName = null)
    {
        if (!$dirName)
            $dirName = $this->getDirName();

        return base_path().Config::get('cms.themesDir').'/'.$dirName;
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
     * Determines if a theme with given directory name exists
     * @param string $dirName The theme directory
     * @return bool
     */
    public static function exists($dirName)
    {
        $theme = new static;
        $path = $theme->getPath($dirName);

        return File::isDirectory($path);
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
        $paramKey = 'cms::theme.active';
        $activeTheme = Config::get('cms.activeTheme');

        if (DbDongle::hasDatabase()) {
            $dbResult = Parameters::findRecord($paramKey)
                ->remember(1440, $paramKey)
                ->pluck('value')
            ;

            if ($dbResult !== null)
                $activeTheme = $dbResult;
        }

        $apiResult = Event::fire('cms.activeTheme', [], true);
        if ($apiResult !== null)
            $activeTheme = $apiResult;

        if (!strlen($activeTheme))
            throw new SystemException(Lang::get('cms::lang.theme.active.not_set'));

        $theme = new static;
        $theme->load($activeTheme);
        if (!File::isDirectory($theme->getPath()))
            return null;

        return $theme;
    }

    /**
     * Sets the active theme.
     * The active theme code is stored in the database and overrides the configuration cms.activeTheme parameter. 
     * @param string $code Specifies the  active theme code.
     */
    public static function setActiveTheme($code)
    {
        $paramKey = 'cms::theme.active';
        Parameters::set($paramKey, $code);
        Cache::forget($paramKey);
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
            $editTheme = static::getActiveTheme()->getDirName();

        $apiResult = Event::fire('cms.editTheme', [], true);
        if ($apiResult !== null)
            $editTheme = $apiResult;

        if (!strlen($editTheme))
            throw new SystemException(Lang::get('cms::lang.theme.edit.not_set'));

        $theme = new static;
        $theme->load($editTheme);
        if (!File::isDirectory($theme->getPath()))
            return null;

        return $theme;
    }

    /**
     * Returns a list of all themes.
     * @return array Returns an array of the Theme objects.
     */
    public static function all()
    {
        $path = base_path().Config::get('cms.themesDir');

        $it = new DirectoryIterator($path);
        $it->rewind();

        $result = [];
        foreach ($it as $fileinfo) {
            if (!$fileinfo->isDir() || $fileinfo->isDot())
                continue;

            $theme = new static;
            $theme->load($fileinfo->getFilename());
            $result[] = $theme;
        }

        return $result;
    }

    /**
     * Reads the theme.yaml file and returns the theme configuration values.
     * @return array Returns the parsed configuration file values.
     */
    public function getConfig()
    {
        if ($this->configCache !== null)
            return $this->configCache;

        $path = $this->getPath().'/theme.yaml';
        if (!File::exists($path))
            return $this->configCache = [];

        return $this->configCache = Yaml::parseFile($path);
    }

    /**
     * Returns a value from the theme configuration file by its name.
     * @param string $name Specifies the configuration parameter name.
     * @param mixed $default Specifies the default value to return in case if the parameter doesn't exist in the configuration file.
     * @return mixed Returns the parameter value or a default value
     */ 
    public function getConfigValue($name, $default = null) 
    {
        $config = $this->getConfig();
        if (isset($config[$name]))
            return $config[$name];

        return $default;
    }

    /**
     * Returns the theme preview image URL.
     * If the image file doesn't exist returns the placeholder image URL.
     * @return string Returns the image URL.
     */
    public function getPreviewImageUrl()
    {
        $previewPath = '/assets/images/theme-preview.png';
        $path = $this->getPath().$previewPath;
        if (!File::exists($path))
            return URL::asset('modules/cms/assets/images/default-theme-preview.png');

        return URL::asset('themes/'.$this->getDirName().$previewPath);
    }
}
