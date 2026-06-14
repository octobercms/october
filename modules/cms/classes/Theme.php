<?php namespace Cms\Classes;

use Db;
use App;
use File;
use Lang;
use Site;
use Event;
use Config;
use Session;
use Exception;
use BackendAuth;
use SystemException;
use DirectoryIterator;
use ApplicationException;
use Cms\Models\ThemeData;
use Backend\Models\UserPreference;
use October\Rain\Halcyon\Datasource\DbDatasource;
use October\Rain\Halcyon\Datasource\AutoDatasource;
use October\Rain\Halcyon\Datasource\FileDatasource;
use October\Rain\Halcyon\Datasource\DatasourceInterface;
use October\Contracts\Twig\CallsMethods;

/**
 * Theme class represents the CMS theme
 * CMS theme is a directory that contains all CMS objects - pages, layouts, partials and asset files..
 * The theme parameters are specified in the theme.ini file in the theme root directory.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Theme implements CallsMethods
{
    use \Cms\Classes\Theme\HasCacheLayer;
    use \Cms\Classes\Theme\HasConfiguration;

    /**
     * @var const keys
     */
    const EDIT_KEY = 'cms::theme.edit';

    /**
     * @var string dirName specifies the theme directory name
     */
    protected $dirName;

    /**
     * @var mixed activeThemeCache in memory
     */
    protected static $activeThemeCache = false;

    /**
     * @var mixed editThemeCache in memory
     */
    protected static $editThemeCache = false;

    /**
     * load the theme
     */
    public static function load($dirName): Theme
    {
        $theme = new static;

        $theme->setDirName((string) $dirName);

        $theme->registerHalcyonDatasource();

        return $theme;
    }

    /**
     * exists determines if a theme with given directory name exists
     */
    public static function exists(string $dirName): bool
    {
        return static::load($dirName)->isValid();
    }

    /**
     * isValid checks if this theme has a valid directory name and exists on disk
     */
    public function isValid(): bool
    {
        $dirName = $this->getDirName();

        if (!$dirName || !preg_match('/^[a-z0-9\_\-]+$/i', $dirName)) {
            return false;
        }

        return File::isDirectory($this->getPath());
    }

    /**
     * getPath returns the absolute theme path.
     */
    public function getPath(?string $dirName = null): string
    {
        if (!$dirName) {
            $dirName = $this->getDirName();
        }

        return themes_path($dirName);
    }

    /**
     * setDirName sets the theme directory name
     */
    public function setDirName(string $dirName): void
    {
        $this->dirName = $dirName;
    }

    /**
     * getDirName returns the theme directory name
     */
    public function getDirName(): string
    {
        return (string) $this->dirName;
    }

    /**
     * getId is a helper for {{ theme.id }} twig vars that returns a unique
     * string for this theme
     */
    public function getId(): string
    {
        return snake_case(str_replace('/', '-', $this->getDirName()));
    }

    /**
     * listPages returns a list of pages in the theme
     * This method is used internally in the routing process and in the backend UI.
     * Skipping cache indicates if the pages should be reloaded from the disk bypassing the cache.
     */
    public function listPages(bool $skipCache = false)
    {
        return Page::listInTheme($this, $skipCache);
    }

    /**
     * isActiveTheme returns true if this theme is the chosen active theme
     */
    public function isActiveTheme(): bool
    {
        if ($activeThemeCode = self::getActiveThemeCode()) {
            return $activeThemeCode === $this->getDirName();
        }

        return false;
    }

    /**
     * getActiveThemeCode returns the active theme code.
     *
     * By default the active theme is loaded from the cms.active_theme config item.
     * If there's a back-end user session, loads the theme code from the CMS Editor
     * Edit Theme user preference.
     *
     * This behavior can be overridden by the cms.theme.getActiveTheme event listener.
     */
    public static function getActiveThemeCode(): ?string
    {
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
            return $apiResult;
        }

        // System edit site override, used for setting the active theme in the backend
        if (App::runningInBackend() && ($siteTheme = Config::get('cms.edit_theme'))) {
            return $siteTheme;
        }

        // Backend preference override, used for setting the preview theme in the editor
        // @todo add a get variable check (_editor_preview)
        if ($prefTheme = self::getEditThemeCodeFromPreference()) {
            return $prefTheme;
        }

        // Config value, used for rendering the frontend
        $activeTheme = Config::get('cms.active_theme');
        if (!$activeTheme) {
            throw new SystemException(Lang::get('cms::lang.theme.active.not_set'));
        }

        return $activeTheme;
    }

    /**
     * getActiveTheme returns the active theme object
     */
    public static function getActiveTheme(): ?Theme
    {
        if (self::$activeThemeCache !== false) {
            return self::$activeThemeCache;
        }

        $theme = static::load($themeCode = static::getActiveThemeCode());

        if ($theme->isLocked()) {
            throw new ApplicationException(Lang::get('cms::lang.theme.active.is_locked', ['theme' => $themeCode]));
        }

        if (!$theme->isValid()) {
            return self::$activeThemeCache = null;
        }

        return self::$activeThemeCache = $theme;
    }

    /**
     * setActiveTheme sets the active theme
     *
     * The active theme code is stored in the database and overrides the
     * configuration cms.active_theme config item.
     */
    public static function setActiveTheme(string $code)
    {
        $theme = static::load($code);
        if ($theme->isLocked()) {
            throw new ApplicationException(Lang::get('cms::lang.theme.active.is_locked', ['theme' => $code]));
        }

        $site = App::runningInBackend() ? Site::getEditSite() : Site::getPrimarySite();
        if (!$site) {
            throw new ApplicationException(__("Unable to set active theme. Missing a site definition."));
        }

        Db::table($site->getTable())->where('id', $site->id)->update(['theme' => $code]);
        Config::set('cms.active_theme', $code);

        self::resetCache();

        /**
         * @event cms.theme.setActiveTheme
         * Fires when the active theme has been changed.
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.setActiveTheme', function ($code) {
         *         \Log::info("Theme has been changed to $code");
         *     });
         *
         */
        Event::fire('cms.theme.setActiveTheme', compact('code'));
    }

    /**
     * getEditThemeCode returns the edit theme code
     *
     * There are several ways the edit theme can be set. The code loads
     * the edit theme from the following sources:
     * → CMS Editor edit theme for the currently authenticated back-end user, if any.
     * → cms.edit_theme config item.
     * → CMS Active theme.
     * → cms.theme.getEditTheme event. The theme code returned by the
     * event handler has the highest priority.
     */
    public static function getEditThemeCode(): ?string
    {
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
            return $apiResult;
        }

        $editTheme = self::getEditThemeCodeFromPreference();

        if (!$editTheme) {
            $editTheme = Config::get('cms.edit_theme');
        }

        if (!$editTheme) {
            $editTheme = static::getActiveThemeCode();
        }

        if (!$editTheme) {
            throw new SystemException(Lang::get('cms::lang.theme.edit.not_set'));
        }

        return $editTheme;
    }

    /**
     * getEditThemeCodeFromPreference
     */
    protected static function getEditThemeCodeFromPreference()
    {
        // Check for environment
        if (App::runningInConsole()) {
            return null;
        }

        // Check for auth markers
        if (!BackendAuth::hasSession() && !BackendAuth::hasRemember()) {
            return null;
        }

        if (!App::hasDatabase() || !BackendAuth::getUser()) {
            return null;
        }

        try {
            $prefTheme = Session::remember(Theme::EDIT_KEY, function() {
                return UserPreference::forUser()->get(Theme::EDIT_KEY, '');
            });
        }
        catch (Exception $ex) {
            $prefTheme = null;
        }

        if ($prefTheme && static::exists($prefTheme)) {
            return $prefTheme;
        }

        return null;
    }

    /**
     * getEditTheme returns the edit theme
     */
    public static function getEditTheme(): ?Theme
    {
        if (self::$editThemeCache !== false) {
            return self::$editThemeCache;
        }

        $theme = static::load(static::getEditThemeCode());

        if (!$theme->isValid()) {
            return self::$editThemeCache = null;
        }

        return self::$editThemeCache = $theme;
    }

    /**
     * setEditTheme sets the editing theme
     */
    public static function setEditTheme(string $code)
    {
        UserPreference::forUser()->set(Theme::EDIT_KEY, $code);
        Session::put(Theme::EDIT_KEY, $code);
        Config::set('cms.edit_theme', $code);

        self::resetCache();

        /**
         * @event cms.theme.setEditTheme
         * Fires when the edit theme has been changed.
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.setEditTheme', function ($code) {
         *         \Log::info("Theme has been changed to $code");
         *     });
         *
         */
        Event::fire('cms.theme.setEditTheme', compact('code'));
    }

    /**
     * resetEditTheme
     */
    public static function resetEditTheme()
    {
        UserPreference::forUser()->reset(Theme::EDIT_KEY);
        Session::forget(Theme::EDIT_KEY);

        self::resetCache();
    }

    /**
     * all returns all themes on disk
     */
    public static function all(): array
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
     * allAvailable returns all available themes, those that are not locked
     */
    public static function allAvailable(): array
    {
        $themes = [];

        foreach (self::all() as $theme) {
            if ($theme->isLocked()) {
                continue;
            }
            $themes[] = $theme;
        }

        return $themes;
    }

    /**
     * isLocked returns true if the theme cannot be used
     */
    public function isLocked(): bool
    {
        return File::isFile($this->getPath().'/.themelock');
    }

    /**
     * resetCache resets any memory or cache involved with the active or edit theme
     */
    public static function resetCache()
    {
        self::$activeThemeCache = false;
        self::$editThemeCache = false;
    }

    /**
     * hasCustomData returns true if this theme has form fields that supply customization data
     */
    public function hasCustomData(): bool
    {
        $form = $this->getConfigValue('form', false);

        if (!$form && $this->hasParentTheme()) {
            $form = $this->getParentTheme()->hasCustomData();
        }

        return (bool) $form;
    }

    /**
     * getCustomData returns data specific to this theme
     */
    public function getCustomData(): ThemeData
    {
        return ThemeData::forTheme($this);
    }

    /**
     * removeCustomData removes data specific to this theme
     */
    public function removeCustomData(): bool
    {
        if ($this->hasCustomData()) {
            return $this->getCustomData()->delete();
        }

        return true;
    }

    /**
     * databaseLayerEnabled checks global and local config
     */
    public function databaseLayerEnabled(): bool
    {
        // Globally
        $enableDbLayer = Config::get('cms.database_templates', false);

        // Locally
        if (!$enableDbLayer) {
            $enableDbLayer = $this->getConfigValue('database', false);
        }

        return $enableDbLayer && App::hasDatabase();
    }

    /**
     * hasParentTheme checks if a parent theme is defined
     */
    public function hasParentTheme(): bool
    {
        return (bool) $this->getConfigValue('parent');
    }

    /**
     * getParentTheme returns a parent theme, if enabled
     */
    public function getParentTheme(): ?Theme
    {
        if (!$this->hasParentTheme()) {
            return null;
        }

        return static::load((string) $this->getConfigValue('parent'));
    }

    /**
     * secondLayerEnabled is true if two or more datasources exist
     */
    public function secondLayerEnabled(): bool
    {
        // All changes going to the database
        if ($this->databaseLayerEnabled()) {
            return true;
        }

        // Has an unlocked parent
        if (($parent = $this->getParentTheme()) && !$parent->isLocked()) {
            return true;
        }

        return false;
    }

    /**
     * useParentAsset determines if a parent asset should be used
     */
    public function useParentAsset($relativePath): bool
    {
        return $this->hasParentTheme() && !File::exists($this->getPath().'/'.$relativePath);
    }

    /**
     * registerHalcyonDatasource ensures this theme is registered as a Halcyon datasource
     */
    public function registerHalcyonDatasource()
    {
        $resolver = App::make('halcyon');

        // Already registered
        if ($resolver->hasDatasource($this->dirName)) {
            return;
        }

        $datasources = [];

        // Database layer
        if ($this->databaseLayerEnabled()) {
            $datasources[] = new DbDatasource($this->dirName, 'cms_theme_templates');
        }

        // Current / child theme
        $datasources[] = new FileDatasource($this->getPath(), App::make('files'));

        // Parent theme
        if ($parentTheme = $this->getParentTheme()) {
            $datasources[] = new FileDatasource($parentTheme->getPath(), App::make('files'));
        }

        $resolver->addDatasource($this->dirName, new AutoDatasource($datasources));
    }

    /**
     * getDatasource returns the theme's datasource
     */
    public function getDatasource(): DatasourceInterface
    {
        $resolver = App::make('halcyon');

        return $resolver->datasource($this->getDirName());
    }

    /**
     * getParentOptions returns dropdown options for a parent theme
     */
    public function getParentOptions(): array
    {
        $result = [
            '' => __('-- no parent --'),
        ];

        foreach (static::all() as $theme) {
            if ($theme->getDirName() === $this->getDirName()) {
                continue;
            }

            if ($theme->isLocked()) {
                $label = $theme->getConfigValue('name').' ('.$theme->getDirName().'*)';
            }
            else {
                $label = $theme->getConfigValue('name').' ('.$theme->getDirName().')';
            }

            $result[$theme->getDirName()] = $label;
        }

        return $result;
    }

    /**
     * hasSeedContent returns true if some seed content is available
     */
    public function hasSeedContent()
    {
        return File::exists($this->getPath() . '/seeds');
    }

    /**
     * __get magic
     */
    public function __get($name)
    {
        if ($this->hasCustomData()) {
            return $this->getCustomData()->{$name};
        }

        return null;
    }

    /**
     * __isset magic
     */
    public function __isset($key)
    {
        if ($this->hasCustomData()) {
            $theme = $this->getCustomData();
            return $theme->offsetExists($key);
        }

        return false;
    }

    /**
     * getTwigMethodNames returns a list of method names that can be called from Twig.
     */
    public function getTwigMethodNames(): array
    {
        return [
            'getPath',
            'getDirName',
            'getId',
            'isActiveTheme',
            'getConfig',
            'hasParentTheme',
            'getParentTheme',
            'getFormConfig',
            'getConfigValue',
            'getConfigArray',
            'getPreviewImageUrl',
            'getCustomData',
            'hasCustomData'
        ];
    }
}
