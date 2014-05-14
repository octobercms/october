<?php namespace System\Console;

use Str;
use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class OctoberUpdate extends Command
{

    /**
     * The console command name.
     */
    protected $name = 'october:update';

    /**
     * The console command description.
     */
    protected $description = 'Updates October CMS and all plugins, database and files.';

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
        $this->output->writeln('<info>Updating October...</info>');
        $manager = UpdateManager::instance()->resetNotes();

        $updateList = $manager->requestUpdateList();
        $updates = (int)array_get($updateList, 'update', 0);

        if ($updates == 0) {
            $this->output->writeln('<info>No new updates found</info>');
            return;
        }
        else
            $this->output->writeln(sprintf('<info>Found %s new %s!</info>', $updates, Str::plural('update', $updates)));

        $coreHash = array_get($updateList, 'core.hash');
        $coreBuild = array_get($updateList, 'core.build');

        $this->output->writeln('<info>Downloading application files</info>');
        $manager->downloadCore($coreHash);

        $plugins = array_get($updateList, 'plugins');
        foreach ($plugins as $code => $plugin) {
            $pluginName = array_get($plugin, 'name');
            $pluginHash = array_get($plugin, 'hash');

            $this->output->writeln(sprintf('<info>Downloading plugin: %s</info>', $pluginName));
            $manager->downloadPlugin($code, $pluginHash);
        }

        $this->output->writeln('<info>Unpacking application files</info>');
        $manager->extractCore($coreHash, $coreBuild);

        foreach ($plugins as $code => $plugin) {
            $pluginName = array_get($plugin, 'name');
            $pluginHash = array_get($plugin, 'hash');

            $this->output->writeln(sprintf('<info>Unpacking plugin: %s</info>', $pluginName));
            $manager->extractPlugin($code, $pluginHash);
        }

        /*
         * Run migrations
         */
        $this->call('october:up');
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