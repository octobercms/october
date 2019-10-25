<?php namespace System\Console;

use Illuminate\Console\Command;
use System\Classes\UpdateManager;

/**
 * Console command to migrate the database.
 *
 * This builds up all database tables that are registered for October and all plugins.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberUp extends Command
{
    /**
     * The console command name.
     */
    protected $name = 'october:up';

    /**
     * The console command description.
     */
    protected $description = 'Builds database tables for October and all plugins.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->output->writeln('<info>Migrating application and plugins...</info>');

        UpdateManager::instance()
            ->setNotesOutput($this->output)
            ->update()
        ;
    }
}
