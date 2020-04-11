<?php namespace System\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Symfony\Component\Console\Input\InputArgument;
use System\Classes\VersionManager;

/**
 * Console command to rollback a plugin.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginRollback extends Command
{
    /**
     * The console command name.
     * @var string
     */
    protected $name = 'plugin:rollback';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Rollback an existing plugin.';

    /**
     * Execute the console command.
     * @return void
     */
    public function handle()
    {
        /*
         * Lookup plugin
         */
        $pluginName = $this->argument('name');
        $pluginName = PluginManager::instance()->normalizeIdentifier($pluginName);
        if (!PluginManager::instance()->exists($pluginName)) {
            throw new \InvalidArgumentException('Plugin not found');
        }

        $stopOnVersion = ltrim(($this->argument('version') ?: null), 'v');

        if ($stopOnVersion) {
            if (!VersionManager::instance()->hasDatabaseVersion($pluginName, $stopOnVersion)) {
                throw new \InvalidArgumentException('Plugin version not found');
            }
            $confirmQuestion = 'Please confirm that you wish to revert the plugin to version ' . $stopOnVersion . '. This may result in changes to your database and potential data loss.';
        } else {
            $confirmQuestion = 'Please confirm that you wish to completely rollback this plugin. This may result in potential data loss.';
        }

        if ($this->option('force') || $this->confirm($confirmQuestion)) {
            $manager = UpdateManager::instance()->setNotesOutput($this->output);
            $stopOnVersion = ltrim(($this->argument('version') ?: null), 'v');

            try {
                $manager->rollbackPlugin($pluginName, $stopOnVersion);
            } catch (\Exception $exception) {
                $lastVersion = VersionManager::instance()->getCurrentVersion($pluginName);
                $this->output->writeln(sprintf("<comment>An exception occurred during the rollback and the process has been stopped. The plugin was rolled back to version v%s.</comment>", $lastVersion));
                throw $exception;
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
            ['name', InputArgument::REQUIRED, 'The name of the plugin to be rolled back. Eg: AuthorName.PluginName'],
            ['version', InputArgument::OPTIONAL, 'If this parameter is specified, the process will stop on the specified version, if not, it will completely rollback the plugin. Example: 1.3.9'],
        ];
    }

    protected function getOptions()
    {
        return [
            ['force', 'f', InputOption::VALUE_NONE, 'Force rollback', null],
        ];
    }
}
