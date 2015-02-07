<?php namespace System\Console;

use App;
use Config;
use Illuminate\Cache\Console\ClearCommand;
use Symfony\Component\Console\Output\NullOutput;
use Illuminate\Cache\CacheManager;
use Illuminate\Filesystem\Filesystem;

class CacheClear extends ClearCommand
{
    /**
     * The file system instance.
     *
     * @var \Illuminate\Filesystem\Filesystem
     */
    protected $files;

    /**
     * Create a new cache clear command instance.
     *
     * @param  \Illuminate\Cache\CacheManager  $cache
     * @param  \Illuminate\Filesystem\Filesystem  $files
     * @return void
     */
    public function __construct(CacheManager $cache, Filesystem $files)
    {
        parent::__construct($cache);

        $this->files = $files;
    }

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $storagePath = $this->laravel->storagePath();

        /*
         * Allow this command to be executed internally
         */
        if (!isset($this->output)) {
            $this->output = new NullOutput;
        }

        /*
         * Combiner
         */
        foreach ($this->files->directories($storagePath.'/cms/combiner') as $directory) {
            $this->files->deleteDirectory($directory);
        }
        $this->info('Combiner cache cleared!');

        /*
         * Combiner
         */
        foreach ($this->files->directories($storagePath.'/cms/cache') as $directory) {
            $this->files->deleteDirectory($directory);
        }
        $this->info('CMS cache cleared!');

        /*
         * Twig
         */
        if (!Config::get('cms.twigNoCache')) {
            foreach ($this->files->directories($storagePath.'/cms/twig') as $directory) {
                $this->files->deleteDirectory($directory);
            }
            $this->info('Twig cache cleared!');
        }

        /*
         * Meta
         */
        $this->files->delete($storagePath.'/cms/disabled.json');

        parent::fire();
    }

    /**
     * Clear the cache outside of shell environment
     * @return void
     */
    public static function fireInternal()
    {
        try {
            $command = App::make('System\Console\CacheClear');
            $command->setLaravel(App::make('app'));
            $command->fire();
        }
        catch (\Exception $ex) {
            // Do nothing
        }
    }
}
