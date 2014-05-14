<?php namespace System\Console;

use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class OctoberDown extends Command
{

    /**
     * The console command name.
     */
    protected $name = 'october:down';

    /**
     * The console command description.
     */
    protected $description = 'Destroys all database tables for October and all plugins.';

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
        if ($this->confirm('Destroy all database tables? [yes|no]')) {

            $manager = UpdateManager::instance()->resetNotes()->uninstall();

            foreach ($manager->getNotes() as $note)
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