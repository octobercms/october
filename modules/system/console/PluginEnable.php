<?php namespace System\Console;

use System\Models\PluginVersion;
use System\Classes\PluginManager;
use Illuminate\Console\Command;

/**
 * PluginDisable enables a plugin in the file system and user preferences
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class PluginEnable extends Command
{
    /**
     * @var string signature for the console command
     */
    protected $signature = 'plugin:enable
        {name : Name of the plugin, eg: Author.Plugin}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Enable an existing plugin.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $manager = PluginManager::instance();
        $name = $manager->normalizeIdentifier($this->argument('name'));

        // Lookup
        if (!$manager->hasPlugin($name)) {
            return $this->output->error("Unable to find plugin '{$name}'");
        }

        // Enable in filesystem
        $manager->enablePlugin($name);

       // Enable user preference
        if ($plugin = PluginVersion::where('code', $name)->first()) {
            $plugin->is_disabled = false;
            $plugin->save();
        }

        $this->output->success("Plugin '{$name}' enabled");
    }
}
