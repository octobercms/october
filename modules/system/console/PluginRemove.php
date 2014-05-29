<?php namespace System\Console;

use File;
use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class PluginRemove extends Command
{

    /**
     * The console command name.
     * @var string
     */
    protected $name = 'plugin:remove';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Removes an existing plugin.';

    /**
     * Create a new command instance.
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     * @return void
     */
    public function fire()
    {
        if ($this->confirm('Are you sure you want to uninstall this plugin? [yes|no]')) {
            $pluginName = $this->argument('name');
            $pluginName = PluginManager::instance()->normalizeIdentifier($pluginName);

            /*
             * Rollback plugin
             */
            $manager = UpdateManager::instance()->resetNotes();
            $manager->rollbackPlugin($pluginName);

            foreach ($manager->getNotes() as $note)
                $this->output->writeln($note);

            /*
             * Delete from file system
             */
            if ($pluginPath = PluginManager::instance()->getPluginPath($pluginName)) {
                File::deleteDirectory($pluginPath);
                $this->output->writeln(sprintf('<info>Deleted: %s</info>', $pluginName));
            }
        }
    }

    /**
     * Get the console command arguments.
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['name', InputArgument::REQUIRED, 'The name of the plugin. Eg: AuthorName.PluginName'],
        ];
    }

    /**
     * Get the console command options.
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }

}