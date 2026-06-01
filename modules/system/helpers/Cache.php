<?php namespace System\Helpers;

use App;
use File;
use Cache as CacheFacade;
use Config;

/**
 * Cache helper
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Cache
{
    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.cacher');
    }

    /**
     * clear from the console command
     */
    public static function clear()
    {
        CacheFacade::flush();
        self::clearInternal();
    }

    /**
     * clearInternal
     */
    public static function clearInternal()
    {
        $instance = self::instance();
        $instance->clearCombiner();
        $instance->clearCache();
        $instance->clearThemeCache();
        $instance->clearBlueprintCache();

        if (Config::get('cms.enable_twig_cache', true)) {
            $instance->clearTwig();
        }

        $instance->clearMeta();
    }

    /**
     * clearCombiner
     */
    public function clearCombiner()
    {
        foreach (File::directories(storage_path().'/cms/combiner') as $directory) {
            File::deleteDirectory($directory);
        }
    }

    /**
     * clearCache
     */
    public function clearCache()
    {
        foreach (File::directories(storage_path().'/cms/cache') as $directory) {
            File::deleteDirectory($directory);
        }
    }

    /**
     * clearTwig
     */
    public function clearTwig()
    {
        foreach (File::directories(storage_path().'/cms/twig') as $directory) {
            File::deleteDirectory($directory);
        }
    }

    /**
     * clearThemeCache
     */
    public function clearThemeCache()
    {
        collect(File::files(cache_path('cms')))
            ->reject(function($file) {
                return !str_starts_with($file->getFilename(), 'theme-');
            })
            ->each(function($file) {
                File::delete(cache_path('cms/'.$file->getFilename()));
            });
    }

    /**
     * clearBlueprintCache
     */
    public function clearBlueprintCache()
    {
        collect(File::files(cache_path('cms')))
            ->reject(function($file) {
                return !str_starts_with($file->getFilename(), 'blueprint-');
            })
            ->each(function($file) {
                File::delete(cache_path('cms/'.$file->getFilename()));
            });
    }

    /**
     * clearMeta
     */
    public function clearMeta()
    {
        File::delete(cache_path('cms/manifest.php'));

        File::delete(App::getCachedClassesPath());

        File::delete(App::getCachedCompilePath());

        File::delete(App::getCachedConfigPath());

        File::delete(App::getCachedServicesPath());

        File::delete(App::getCachedPackagesPath());

        File::delete(App::getCachedRoutesPath());
    }
}
