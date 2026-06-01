<?php namespace Tailor\Classes\Blueprint;

use System;
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
     * getDefaultActiveTheme returns the active theme as a datasource
     */
    protected static function getDefaultActiveTheme()
    {
        if (self::$resolvedActiveTheme !== null) {
            return self::$resolvedActiveTheme;
        }

        $result = [];

        try {
            if (System::hasModule('Cms')) {
                $activeCode = CmsTheme::getActiveThemeCode();
                if ($activeCode) {
                    $themes = ThemeManager::instance()->getThemePaths();
                    if (isset($themes[$activeCode])) {
                        $path = $themes[$activeCode];
                        if (file_exists($bpPath = $path . '/blueprints')) {
                            $result[$activeCode] = $bpPath;
                        }
                    }
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
            $activeCode = System::hasModule('Cms') ? CmsTheme::getActiveThemeCode() : null;
            $themes = System::hasModule('Cms') ? ThemeManager::instance()->getThemePaths() : [];
            foreach ($themes as $code => $path) {
                if ($code === $activeCode) {
                    continue;
                }
                if (file_exists($bpPath = $path . '/blueprints')) {
                    $result[$code] = $bpPath;
                }
            }
        }
        catch (Exception $ex) {
        }

        return self::$resolvedThemes = $result;
    }
}
