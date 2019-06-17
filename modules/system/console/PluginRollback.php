<?php namespace System\Console;

use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Symfony\Component\Console\Input\InputArgument;

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

        $manager = UpdateManager::instance()->setNotesOutput($this->output);

        $stopOnVersion = $this->argument('version') ?: null;

        /*
         * Rollback plugin
         */
        $manager->rollbackPlugin($pluginName, $stopOnVersion);

    }

    /**
     * Get the console command arguments.
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['name', InputArgument::REQUIRED, 'The name of the plugin. Eg: AuthorName.PluginName'],
            ['version', InputArgument::OPTIONAL, 'If this parameter is specified, the process stops after the specified version is rolled back, if not, go back to the first version Eg: 1.3.9'],
        ];
    }
}
