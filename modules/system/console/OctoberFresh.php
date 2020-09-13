<?php namespace System\Console;

use File;
use Artisan;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

/**
 * Console command to remove boilerplate.
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
     * The console command name.
     */
    protected $name = 'october:fresh';

    /**
     * The console command description.
     */
    protected $description = 'Removes the demo theme and plugin.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->confirmToProceed('Are you sure?')) {
            return;
        }

        $demoThemePath = themes_path().'/demo';
        if (File::exists($demoThemePath)) {
            File::deleteDirectory($demoThemePath);

            $this->info('Demo theme has been removed! Enjoy a fresh start.');
        }
        else {
            $this->error('Demo theme is already removed.');
        }

        $demoPluginPath = plugins_path().'/october/demo';
        if (File::exists($demoPluginPath)) {
            Artisan::call('plugin:remove', ['name' => 'October.Demo', '--force' => true]);

            $this->info('Demo plugin has been removed! Enjoy a fresh start.');
        }
        else {
            $this->error('Demo plugin is already removed.');
        }
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run.'],
        ];
    }
}
