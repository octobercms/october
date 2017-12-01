<?php namespace System\Helpers;

use App;
use File;
use Cache as CacheFacade;
use Config;

class Cache
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * Execute the console command.
     */
    public static function clear()
    {
        CacheFacade::flush();
        self::clearInternal();
    }

    public static function clearInternal()
    {
        $instance = self::instance();
        $instance->clearCombiner();
        $instance->clearCache();

        if (!Config::get('cms.twigNoCache')) {
            $instance->clearTwig();
        }

        $instance->clearMeta();
    }

    /*
     * Combiner
     */
    public function clearCombiner()
    {
        foreach (File::directories(storage_path().'/cms/combiner') as $directory) {
            File::deleteDirectory($directory);
        }
    }

    /*
     * Cache
     */
    public function clearCache()
    {
        foreach (File::directories(storage_path().'/cms/cache') as $directory) {
            File::deleteDirectory($directory);
        }
    }

    /*
     * Twig
     */
    public function clearTwig()
    {
        foreach (File::directories(storage_path().'/cms/twig') as $directory) {
            File::deleteDirectory($directory);
        }
    }

    /*
     * Meta
     */
    public function clearMeta()
    {
        File::delete(storage_path().'/cms/disabled.json');
        File::delete(App::getCachedCompilePath());
        File::delete(App::getCachedServicesPath());
    }
}
