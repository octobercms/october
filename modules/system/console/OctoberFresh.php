<?php namespace System\Console;

use Artisan;
use File;
use Illuminate\Console\Command;
use Illuminate\Console\ConfirmableTrait;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;

class OctoberFresh extends Command
{
    use ConfirmableTrait;

    /**
     * The console command name.
     */
    protected $name = 'october:fresh';

    /**
     * The console command description.
     */
    protected $description = 'Removes the demo included with October.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function fire()
    {
        if (!$this->confirmToProceed('Are you sure?')) {
            return;
        }

        $demoThemePath = themes_path().'/demo';

        if (File::exists($demoThemePath)) {
            Artisan::call('plugin:remove', ['name' => 'October.Demo', '--force' => true]);
            File::deleteDirectory($demoThemePath);

            $this->info('Demo has been removed! Enjoy a fresh start.');
        }
        else {
            $this->error('Demo theme is already removed.');
        }
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [];
    }
}
