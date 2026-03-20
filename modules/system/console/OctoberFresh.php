<?php namespace System\Console;

use File;
use Artisan;
use Illuminate\Console\Command;
use System\Classes\PluginManager;

/**
 * OctoberFresh is a console command to remove boilerplate.
 *
 * This removes the demo theme and plugin. A great way to start a fresh project!
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberFresh extends Command
{
    use \Illuminate\Console\ConfirmableTrait;

    /**
     * @var string signature for the console command
     */
    protected $signature = 'october:fresh
        {--f|force : Force the operation to run.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Removes the demo theme and plugin.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        if (!$this->confirmToProceed('Are you sure?')) {
            return;
        }

        $demoThemePath = themes_path().'/demo';

        if (File::exists($demoThemePath)) {
            File::deleteDirectory($demoThemePath);

            $manager = PluginManager::instance();
            $manager->deletePlugin('October.Demo');

            $this->info('Demo has been removed! Enjoy a fresh start.');
        }
        else {
            $this->error('Demo theme is already removed.');
        }
    }
}
