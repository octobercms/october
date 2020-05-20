<?php namespace Cms\Classes;

use App;
use Url;
use File;
use Yaml;
use Lang;
use Cache;
use Event;
use Config;
use Exception;
use SystemException;
use DirectoryIterator;
use ApplicationException;
use Cms\Models\ThemeData;
use System\Models\Parameter;
use October\Rain\Halcyon\Datasource\DbDatasource;
use October\Rain\Halcyon\Datasource\FileDatasource;
use October\Rain\Halcyon\Datasource\DatasourceInterface;

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
    protected $configCache;

    /**
     * @var mixed Active theme cache in memory
     */
    protected static $activeThemeCache = false;

    /**
     * @var mixed Edit theme cache in memory
     */
    protected static $editThemeCache = false;

    const ACTIVE_KEY = 'cms::theme.active';
    const EDIT_KEY = 'cms::theme.edit';

    /**
     * Loads the theme.
     * @return self
     */
    public static function load($dirName)
    {
        $theme = new static;
        $theme->setDirName($dirName);
        $theme->registerHalcyonDatasource();

        return $theme;
    }

    /**
     * Returns the absolute theme path.
     * @param  string $dirName Optional theme directory. Defaults to $this->getDirName()
     * @return string
     */
    public function getPath($dirName = null)
    {
        if (!$dirName) {
            $dirName = $this->getDirName();
        }

        return themes_path().'/'.$dirName;
    }

    /**
     * Sets the theme directory name.
     * @return void
     */
    public function setDirName($dirName)
    {
        $this->dirName = $dirName;
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
     * Helper for {{ theme.id }} twig vars
     * Returns a unique string for this theme.
     * @return string
     */
    public function getId()
    {
        return snake_case(str_replace('/', '-', $this->getDirName()));
    }

    /**
     * Determines if a theme with given directory name exists
     * @param string $dirName The theme directory
     * @return bool
     */
    public static function exists($dirName)
    {
        $theme = static::load($dirName);
        $path = $theme->getPath();

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
     * Returns true if this theme is the chosen active theme.
     */
    public function isActiveTheme()
    {
        $activeTheme = self::getActiveTheme();

        return $activeTheme && $activeTheme->getDirName() == $this->getDirName();
    }

    /**
     * Returns the active theme code.
     * By default the active theme is loaded from the cms.activeTheme parameter,
     * but this behavior can be overridden by the cms.theme.getActiveTheme event listener.
     * @return string
     * If the theme doesn't exist, returns null.
     */
    public static function getActiveThemeCode()
    {
        $activeTheme = Config::get('cms.activeTheme');
        $themes = static::all();
        $havingMoreThemes = count($themes) > 1;
        $themeHasChanged = !empty($themes[0]) && $themes[0]->dirName !== $activeTheme;
        $checkDatabase = $havingMoreThemes || $themeHasChanged;

        if ($checkDatabase && App::hasDatabase()) {
            try {
                try {
                    $dbResult = Cache::remember(self::ACTIVE_KEY, 1440, function () {
                        return Parameter::applyKey(self::ACTIVE_KEY)->value('value');
                    });
                }
                catch (Exception $ex) {
                    // Cache failed
                    $dbResult = Parameter::applyKey(self::ACTIVE_KEY)->value('value');
                }
            }
            catch (Exception $ex) {
                // Database failed
                $dbResult = null;
            }

            if ($dbResult !== null && static::exists($dbResult)) {
                $activeTheme = $dbResult;
            }
        }

        /**
         * @event cms.theme.getActiveTheme
         * Overrides the active theme code.
         *
         * If a value is returned from this halting event, it will be used as the active
         * theme code. Example usage:
         *
         *     Event::listen('cms.theme.getActiveTheme', function () {
         *         return 'mytheme';
         *     });
         *
         */
        $apiResult = Event::fire('cms.theme.getActiveTheme', [], true);
        if ($apiResult !== null) {
            $activeTheme = $apiResult;
        }

        if (!strlen($activeTheme)) {
            throw new SystemException(Lang::get('cms::lang.theme.active.not_set'));
        }

        return $activeTheme;
    }


    /**
     * Returns the active theme object.
     * @return \Cms\Classes\Theme Returns the loaded theme object.
     * If the theme doesn't exist, returns null.
     */
    public static function getActiveTheme()
    {
        if (self::$activeThemeCache !== false) {
            return self::$activeThemeCache;
        }

        $theme = static::load(static::getActiveThemeCode());

        if (!File::isDirectory($theme->getPath())) {
            return self::$activeThemeCache = null;
        }

        return self::$activeThemeCache = $theme;
    }

    /**
     * Sets the active theme.
     * The active theme code is stored in the database and overrides the configuration cms.activeTheme parameter.
     * @param string $code Specifies the  active theme code.
     */
    public static function setActiveTheme($code)
    {
        self::resetCache();

        Parameter::set(self::ACTIVE_KEY, $code);

        /**
         * @event cms.theme.setActiveTheme
         * Fires when the active theme has been changed.
         *
         * If a value is returned from this halting event, it will be used as the active
         * theme code. Example usage:
         *
         *     Event::listen('cms.theme.setActiveTheme', function ($code) {
         *         \Log::info("Theme has been changed to $code");
         *     });
         *
         */
        Event::fire('cms.theme.setActiveTheme', compact('code'));
    }

    /**
     * Returns the edit theme code.
     * By default the edit theme is loaded from the cms.editTheme parameter,
     * but this behavior can be overridden by the cms.theme.getEditTheme event listeners.
     * If the edit theme is not defined in the configuration file, the active theme
     * is returned.
     * @return string
     */
    public static function getEditThemeCode()
    {
        $editTheme = Config::get('cms.editTheme');
        if (!$editTheme) {
            $editTheme = static::getActiveThemeCode();
        }

        /**
         * @event cms.theme.getEditTheme
         * Overrides the edit theme code.
         *
         * If a value is returned from this halting event, it will be used as the edit
         * theme code. Example usage:
         *
         *     Event::listen('cms.theme.getEditTheme', function () {
         *         return "the-edit-theme-code";
         *     });
         *
         */
        $apiResult = Event::fire('cms.theme.getEditTheme', [], true);
        if ($apiResult !== null) {
            $editTheme = $apiResult;
        }

        if (!strlen($editTheme)) {
            throw new SystemException(Lang::get('cms::lang.theme.edit.not_set'));
        }

        return $editTheme;
    }

    /**
     * Returns the edit theme.
     * @return \Cms\Classes\Theme Returns the loaded theme object.
     */
    public static function getEditTheme()
    {
        if (self::$editThemeCache !== false) {
            return self::$editThemeCache;
        }

        $theme = static::load(static::getEditThemeCode());

        if (!File::isDirectory($theme->getPath())) {
            return self::$editThemeCache = null;
        }

        return self::$editThemeCache = $theme;
    }

    /**
     * Returns a list of all themes.
     * @return array Returns an array of the Theme objects.
     */
    public static function all()
    {
        $it = new DirectoryIterator(themes_path());
        $it->rewind();

        $result = [];
        foreach ($it as $fileinfo) {
            if (!$fileinfo->isDir() || $fileinfo->isDot()) {
                continue;
            }

            $theme = static::load($fileinfo->getFilename());

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
        if ($this->configCache !== null) {
            return $this->configCache;
        }

        $path = $this->getPath().'/theme.yaml';
        if (!File::exists($path)) {
            return $this->configCache = [];
        }

        $config = Yaml::parseFile($path);

        /**
         * @event cms.theme.extendConfig
         * Extend basic theme configuration supplied by the theme by returning an array.
         *
         * Note if planning on extending form fields, use the `cms.theme.extendFormConfig`
         * event instead.
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.extendConfig', function ($themeCode, &$config) {
         *          $config['name'] = 'October Theme';
         *          $config['description'] = 'Another great theme from October CMS';
         *     });
         *
         */
        Event::fire('cms.theme.extendConfig', [$this->getDirName(), &$config]);

        return $this->configCache = $config;
    }

    /**
     * Themes have a dedicated `form` option that provide form fields
     * for customization, this is an immutable accessor for that and
     * also an solid anchor point for extension.
     * @return array
     */
    public function getFormConfig()
    {
        $config = $this->getConfigArray('form');

        /**
         * @event cms.theme.extendFormConfig
         * Extend form field configuration supplied by the theme by returning an array.
         *
         * Note if you are planning on using `assetVar` to inject CSS variables from a
         * plugin registration file, make sure the plugin has elevated permissions.
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.extendFormConfig', function ($themeCode, &$config) {
         *          array_set($config, 'tabs.fields.header_color', [
         *              'label'           => 'Header Colour',
         *              'type'            => 'colorpicker',
         *              'availableColors' => [#34495e, #708598, #3498db],
         *              'assetVar'        => 'header-bg',
         *              'tab'             => 'Global'
         *          ]);
         *     });
         *
         */
        Event::fire('cms.theme.extendFormConfig', [$this->getDirName(), &$config]);

        return $config;
    }

    /**
     * Returns a value from the theme configuration file by its name.
     * @param string $name Specifies the configuration parameter name.
     * @param mixed $default Specifies the default value to return in case if the parameter
     *                       doesn't exist in the configuration file.
     * @return mixed Returns the parameter value or a default value
     */
    public function getConfigValue($name, $default = null)
    {
        return array_get($this->getConfig(), $name, $default);
    }

    /**
     * Returns an array value from the theme configuration file by its name.
     * If the value is a string, it is treated as a YAML file and loaded.
     * @param string $name Specifies the configuration parameter name.
     * @return array
     */
    public function getConfigArray($name)
    {
        $result = array_get($this->getConfig(), $name, []);

        if (is_string($result)) {
            $fileName = File::symbolizePath($result);

            if (File::isLocalPath($fileName)) {
                $path = $fileName;
            }
            else {
                $path = $this->getPath().'/'.$result;
            }

            if (!File::exists($path)) {
                throw new ApplicationException('Path does not exist: '.$path);
            }

            $result = Yaml::parseFile($path);
        }

        return (array) $result;
    }

    /**
     * Writes to the theme.yaml file with the supplied array values.
     * @param array $values Data to write
     * @param array $overwrite If true, undefined values are removed.
     * @return void
     */
    public function writeConfig($values = [], $overwrite = false)
    {
        if (!$overwrite) {
            $values = $values + (array) $this->getConfig();
        }

        $path = $this->getPath().'/theme.yaml';
        if (!File::exists($path)) {
            throw new ApplicationException('Path does not exist: '.$path);
        }

        $contents = Yaml::render($values);
        File::put($path, $contents);
        $this->configCache = $values;

        self::resetCache();
    }

    /**
     * Returns the theme preview image URL.
     * If the image file doesn't exist returns the placeholder image URL.
     * @return string Returns the image URL.
     */
    public function getPreviewImageUrl()
    {
        $previewPath = $this->getConfigValue('previewImage', 'assets/images/theme-preview.png');

        if (File::exists($this->getPath().'/'.$previewPath)) {
            return Url::asset('themes/'.$this->getDirName().'/'.$previewPath);
        }

        return Url::asset('modules/cms/assets/images/default-theme-preview.png');
    }

    /**
     * Resets any memory or cache involved with the active or edit theme.
     * @return void
     */
    public static function resetCache()
    {
        self::$activeThemeCache = false;
        self::$editThemeCache = false;

        Cache::forget(self::ACTIVE_KEY);
        Cache::forget(self::EDIT_KEY);
    }

    /**
     * Returns true if this theme has form fields that supply customization data.
     * @return bool
     */
    public function hasCustomData()
    {
        return $this->getConfigValue('form', false);
    }

    /**
     * Returns data specific to this theme
     * @return Cms\Models\ThemeData
     */
    public function getCustomData()
    {
        return ThemeData::forTheme($this);
    }

    /**
     * Remove data specific to this theme
     * @return bool
     */
    public function removeCustomData()
    {
        if ($this->hasCustomData()) {
            return $this->getCustomData()->delete();
        }

        return true;
    }

    /**
     * Checks to see if the database layer has been enabled
     *
     * @return boolean
     */
    public static function databaseLayerEnabled()
    {
        $enableDbLayer = Config::get('cms.databaseTemplates', false);
        if (is_null($enableDbLayer)) {
            $enableDbLayer = !Config::get('app.debug', false);
        }

        return $enableDbLayer && App::hasDatabase();
    }

    /**
     * Ensures this theme is registered as a Halcyon datasource.
     * @return void
     */
    public function registerHalcyonDatasource()
    {
        $resolver = App::make('halcyon');

        if (!$resolver->hasDatasource($this->dirName)) {
            if (static::databaseLayerEnabled()) {
                $datasource = new AutoDatasource([
                    'database'   => new DbDatasource($this->dirName, 'cms_theme_templates'),
                    'filesystem' => new FileDatasource($this->getPath(), App::make('files')),
                ]);
            } else {
                $datasource = new FileDatasource($this->getPath(), App::make('files'));
            }

            $resolver->addDatasource($this->dirName, $datasource);
        }
    }

    /**
     * Get the theme's datasource
     *
     * @return DatasourceInterface
     */
    public function getDatasource()
    {
        $resolver = App::make('halcyon');
        return $resolver->datasource($this->getDirName());
    }

    /**
     * Implements the getter functionality.
     * @param  string  $name
     * @return void
     */
    public function __get($name)
    {
        if ($this->hasCustomData()) {
            return $this->getCustomData()->{$name};
        }

        return null;
    }

    /**
     * Determine if an attribute exists on the object.
     * @param  string  $key
     * @return void
     */
    public function __isset($key)
    {
        if ($this->hasCustomData()) {
            $theme = $this->getCustomData();
            return $theme->offsetExists($key);
        }

        return false;
    }
}
