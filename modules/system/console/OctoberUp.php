<?php namespace System\Console;

use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

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
        $manager = UpdateManager::instance()->resetNotes()->update();

        $this->output->writeln('<info>Migrating application and plugins...</info>');

        foreach ($manager->getNotes() as $note) {
            $this->output->writeln($note);
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
