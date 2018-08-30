<?php namespace System\Console;

use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use Symfony\Component\Console\Input\InputOption;

/**
 * Console command to tear down the database.
 *
 * This destroys all database tables that are registered for October and all plugins.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberDown extends Command
{
    use \Illuminate\Console\ConfirmableTrait;

    /**
     * The console command name.
     */
    protected $name = 'october:down';

    /**
     * The console command description.
     */
    protected $description = 'Destroys all database tables for October and all plugins.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->confirmToProceed('This will DESTROY all database tables.')) {
            return;
        }

        UpdateManager::instance()
            ->setNotesOutput($this->output)
            ->uninstall()
        ;
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

    /**
     * Get the default confirmation callback.
     * @return \Closure
     */
    protected function getDefaultConfirmCallback()
    {
        return function () {
            return true;
        };
    }
}
