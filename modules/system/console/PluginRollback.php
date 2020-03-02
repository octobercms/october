<?php namespace System\Console;

use Illuminate\Console\Command;
use Lang;
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
            throw new \InvalidArgumentException(sprintf('Plugin "%s" not found.', $pluginName));
        }

        $stopOnVersion = ltrim(($this->argument('version') ?: null), 'v');

        if ($stopOnVersion) {
            if (!VersionManager::instance()->hasDatabaseVersion($pluginName, $stopOnVersion)) {
                throw new \InvalidArgumentException(Lang::get('system::lang.updates.plugin_version_not_found'));
            }
            $confirmQuestion = 'Do you want to continue reverting to version ' . $stopOnVersion . '? This option is nonreversible. [yes|no]';
        } else {
            $confirmQuestion = 'Do you wish to continue reverting all versions? This option is nonreversible. [yes|no]';
        }

        if ($this->option('force') || $this->confirm($confirmQuestion)) {
            $manager = UpdateManager::instance()->setNotesOutput($this->output);
            $stopOnVersion = ltrim(($this->argument('version') ?: null), 'v');

            try {
                $manager->rollbackPlugin($pluginName, $stopOnVersion);
            } catch (\Exception $exception) {
                $lastVersion = VersionManager::instance()->getCurrentVersion($pluginName);
                $this->output->writeln(sprintf("<comment>An exception occurred during the rollback, and the plugin was stopped in version v%s.</comment>", $lastVersion));
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
            ['name', InputArgument::REQUIRED, 'The name of the plugin. Eg: AuthorName.PluginName'],
            ['version', InputArgument::OPTIONAL, 'If this parameter is specified, the process stops after the specified version is rolled back, if not, go back to the first version. Eg: 1.3.9'],
        ];
    }

    protected function getOptions()
    {
        return [
            ['force', 'f', InputOption::VALUE_NONE, 'Force rollback', null],
        ];
    }
}
