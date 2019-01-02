<?php namespace System\Console;

use File;
use Illuminate\Console\Command;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

/**
 * Console command to remove a plugin.
 *
 * This completely deletes an existing plugin, including database tables, files
 * and directories.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginRemove extends Command
{

    use \Illuminate\Console\ConfirmableTrait;

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
     * Execute the console command.
     * @return void
     */
    public function handle()
    {
        $pluginManager = PluginManager::instance();
        $pluginName = $this->argument('name');
        $pluginName = $pluginManager->normalizeIdentifier($pluginName);

        if (!$pluginManager->hasPlugin($pluginName)) {
            return $this->error(sprintf('Unable to find a registered plugin called "%s"', $pluginName));
        }

        if (!$this->confirmToProceed(sprintf('This will DELETE plugin "%s" from the filesystem and database.', $pluginName))) {
            return;
        }

        /*
         * Rollback plugin
         */
        $manager = UpdateManager::instance()->setNotesOutput($this->output);
        $manager->rollbackPlugin($pluginName);

        /*
         * Delete from file system
         */
        if ($pluginPath = $pluginManager->getPluginPath($pluginName)) {
            File::deleteDirectory($pluginPath);
            $this->output->writeln(sprintf('<info>Deleted: %s</info>', $pluginName));
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
