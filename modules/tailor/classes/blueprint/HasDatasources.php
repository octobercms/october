<?php namespace Tailor\Classes\Blueprint;

use System;
use Cms\Models\SourceFile;
use Cms\Classes\Theme as CmsTheme;
use Cms\Classes\ThemeManager;
use System\Classes\PluginManager;
use Exception;

/**
 * HasDatasources
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasDatasources
{
    /**
     * @var string datasource is the data source for the model, a directory path.
     */
    protected $datasource;

    /**
     * @var string datasourceTheme is the theme directory name, used to filter blueprints.
     */
    protected $datasourceTheme;

    /**
     * @var array|null resolvedPlugins
     */
    protected static $resolvedPlugins = null;

    /**
     * @var array|null resolvedActiveTheme
     */
    protected static $resolvedActiveTheme = null;

    /**
     * @var array|null resolvedThemes
     */
    protected static $resolvedThemes = null;

    /**
     * inDatasource prepares the datasource for the model.
     */
    public static function inDatasource($path, $theme = null)
    {
        $obj = new static;

        $obj->datasource = $path;

        if ($theme) {
            $obj->datasourceTheme = $theme;
        }

        return $obj;
    }

    /**
     * getDatasourceTheme
     */
    public function getDatasourceTheme()
    {
        return $this->datasourceTheme;
    }

    /**
     * getDefaultPlugins
     */
    protected static function getDefaultPlugins()
    {
        if (self::$resolvedPlugins !== null) {
            return self::$resolvedPlugins;
        }

        $result = [];

        try {
            $plugins = PluginManager::instance()->getPluginPaths();
            foreach ($plugins as $code => $path) {
                if (file_exists($bpPath = $path . '/blueprints')) {
                    $result[$code] = $bpPath;
                }
            }
        }
        catch (Exception $ex) {
        }

        return self::$resolvedPlugins = $result;
    }

    /**
     * getDefaultActiveTheme returns the active theme and its parent as datasources,
     * where the child theme takes priority over the parent.
     */
    protected static function getDefaultActiveTheme()
    {
        if (self::$resolvedActiveTheme !== null) {
            return self::$resolvedActiveTheme;
        }

        $result = [];

        try {
            $themes = System::hasModule('Cms') ? ThemeManager::instance()->getThemePaths() : [];
            foreach (self::getActiveThemeCodes() as $code) {
                if (!isset($themes[$code])) {
                    continue;
                }
                $bpPath = $themes[$code] . '/blueprints';
                if (file_exists($bpPath) || static::themeHasDbBlueprints($code)) {
                    $result[$code] = $bpPath;
                }
            }
        }
        catch (Exception $ex) {
        }

        return self::$resolvedActiveTheme = $result;
    }

    /**
     * getDefaultThemes returns all non-active themes as datasources
     */
    protected static function getDefaultThemes()
    {
        if (self::$resolvedThemes !== null) {
            return self::$resolvedThemes;
        }

        $result = [];

        try {
            $activeCodes = self::getActiveThemeCodes();
            $themes = System::hasModule('Cms') ? ThemeManager::instance()->getThemePaths() : [];
            foreach ($themes as $code => $path) {
                if (in_array($code, $activeCodes)) {
                    continue;
                }
                $bpPath = $path . '/blueprints';
                if (file_exists($bpPath) || static::themeHasDbBlueprints($code)) {
                    $result[$code] = $bpPath;
                }
            }
        }
        catch (Exception $ex) {
        }

        return self::$resolvedThemes = $result;
    }

    /**
     * getActiveThemeCodes returns the active theme code with its parent theme code, if any
     */
    protected static function getActiveThemeCodes(): array
    {
        $result = [];

        if (!System::hasModule('Cms')) {
            return $result;
        }

        $theme = CmsTheme::getActiveTheme();
        if (!$theme) {
            return $result;
        }

        $result[] = $theme->getDirName();

        if ($parentTheme = $theme->getParentTheme()) {
            $result[] = $parentTheme->getDirName();
        }

        return $result;
    }

    /**
     * themeHasDbBlueprints returns true when the theme has its database layer
     * enabled and active SourceFile rows exist for its blueprint source.
     */
    protected static function themeHasDbBlueprints(string $themeCode): bool
    {
        try {
            $theme = CmsTheme::load($themeCode);
            if (!$theme || !$theme->databaseLayerEnabled()) {
                return false;
            }

            return SourceFile::query()->bySource('theme.'.$themeCode.'.blueprint')->exists();
        }
        catch (Exception $ex) {
            return false;
        }
    }

    /**
     * resetDatasourceCache clears the memoized datasource discovery results,
     * forcing the next listInProject call to resolve plugins and themes again.
     */
    public static function resetDatasourceCache(): void
    {
        self::$resolvedPlugins = null;
        self::$resolvedActiveTheme = null;
        self::$resolvedThemes = null;
    }
}
