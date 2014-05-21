<?php namespace System\Console;

use App;
use Config;
use Illuminate\Cache\Console\ClearCommand;
use Symfony\Component\Console\Output\NullOutput;

class CacheClear extends ClearCommand
{
    /**
     * Execute the console command.
     */
    public function fire()
    {
        /*
         * Allow this command to be executed internally
         */
        if (!isset($this->output)) {
            $this->output = new NullOutput;
        }

        /*
         * Combiner
         */
        foreach ($this->files->directories(storage_path().'/combiner') as $directory) {
            $this->files->deleteDirectory($directory);
        }
        $this->info('Combiner cache cleared!');

        /*
         * Twig
         */
        if (!Config::get('cms.twigNoCache')) {
            foreach ($this->files->directories(storage_path().'/twig') as $directory) {
                $this->files->deleteDirectory($directory);
            }
            $this->info('Twig cache cleared!');
        }

        /*
         * Meta
         */
        $this->files->delete($this->laravel['config']['app.manifest'].'/disabled.json');

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
            $command->fire();
        }
        catch (\Exception $ex) {}
    }

}