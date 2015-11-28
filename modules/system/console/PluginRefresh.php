<?php namespace System\Console;

use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class PluginRefresh extends Command
{

    /**
     * The console command name.
     * @var string
     */
    protected $name = 'plugin:refresh';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Removes and re-adds an existing plugin.';

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
        $pluginName = $this->argument('name');
        $pluginName = PluginManager::instance()->normalizeIdentifier($pluginName);
        if (!PluginManager::instance()->exists($pluginName)) {
            throw new \InvalidArgumentException(sprintf('Plugin "%s" not found.', $pluginName));
        }

        $manager = UpdateManager::instance()->resetNotes();

        $manager->rollbackPlugin($pluginName);
        foreach ($manager->getNotes() as $note) {
            $this->output->writeln($note);
        }

        $manager->resetNotes();
        $this->output->writeln('<info>Reinstalling plugin...</info>');
        $manager->updatePlugin($pluginName);

        foreach ($manager->getNotes() as $note) {
            $this->output->writeln($note);
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
