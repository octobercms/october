<?php namespace System\Classes;

use App;
use Date;
use File;
use Event;
use Schema;
use Config;
use System as SystemHelper;
use Cms\Classes\ThemeManager;
use System\Models\Parameter;
use System\Models\PluginVersion;
use Exception;

/**
 * UpdateManager handles the CMS install and update process.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class UpdateManager
{
    use \System\Traits\NoteMaker;
    use \System\Classes\UpdateManager\ManagesApp;
    use \System\Classes\UpdateManager\ManagesModules;
    use \System\Classes\UpdateManager\ManagesPlugins;
    use \System\Classes\UpdateManager\ManagesThemes;
    use \System\Classes\UpdateManager\ManagesProject;
    use \System\Classes\UpdateManager\HasGatewayAccess;

    /**
     * @var string baseDirectory for application.
     */
    protected $baseDirectory;

    /**
     * @var string tempDirectory for working.
     */
    protected $tempDirectory;

    /**
     * @var PluginManager pluginManager
     */
    protected $pluginManager;

    /**
     * @var ThemeManager themeManager
     */
    protected $themeManager;

    /**
     * @var VersionManager versionManager
     */
    protected $versionManager;

    /**
     * @var int migrateCount number of migrations that occurred.
     */
    protected $migrateCount = 0;

    /**
     * __construct this class
     */
    public function __construct()
    {
        $this->pluginManager = PluginManager::instance();
        $this->themeManager = SystemHelper::hasModule('Cms') ? ThemeManager::instance() : null;
        $this->versionManager = VersionManager::instance();
        $this->tempDirectory = temp_path();
        $this->baseDirectory = base_path();

        // Ensure temp directory exists
        if (!File::isDirectory($this->tempDirectory)) {
            File::makeDirectory($this->tempDirectory, 0755, true);
        }
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.updater');
    }

    /**
     * update creates the migration table and updates.
     */
    public function update()
    {
        $this->migrateCount = 0;

        $firstUp = !Schema::hasTable($this->getMigrationTableName());
        if ($firstUp) {
            $this->getRepository()->createRepository();
            $this->note('Migration table created');
        }

        // Update modules
        $this->migrateModules();

        // Update plugins
        $this->migratePlugins();

        // Update app
        $this->migrateApp();

        // Reset update count
        Parameter::set('system::update.count', 0);

        // Nothing updated
        if ($this->migrateCount === 0) {
            $this->note('<info>Nothing to migrate.</info>');
        }

        /**
         * @event system.updater.migrate
         * Provides an opportunity to add migration logic to updater
         *
         * Example usage:
         *
         *     Event::listen('system.updater.migrate', function ((\System\Classes\UpdateManager) $updateManager) {
         *         $updateManager->note('Done');
         *     });
         *
         */
        Event::fire('system.updater.migrate', [$this]);

        // Seeds only run once
        if (!$firstUp) {
            return;
        }

        // Seed modules
        $this->seedModules();

        // Seed app
        $this->seedApp();
    }

    /**
     * check for new updates and returns the amount of unapplied updates
     */
    public function check(bool $force = false): int
    {
        $versions = $this->checkVersions($force);

        return (int) array_get($versions, 'count', 0);
    }

    /**
     * checkVersions checks for available versions
     */
    public function checkVersions(bool $force = false): array
    {
        // No key is set, return a skeleton schema
        if (!Parameter::get('system::project.key')) {
            return [
                'count' => 0,
                'core' => null,
                'plugins' => []
            ];
        }

        // Retry period not passed, skipping.
        if (
            !$force &&
            ($retryTimestamp = Parameter::get('system::update.retry')) &&
            Date::createFromTimeStamp($retryTimestamp)->isFuture()
        ) {
            return (array) Parameter::get('system::update.versions');
        }

        // Ask again
        try {
            $result = $this->requestUpdateList();
            $versions['count'] = array_get($result, 'update', 0);
            $versions['core'] = array_get($result, 'core.version', null);
            $versions['plugins'] = [];
            foreach (array_get($result, 'plugins') as $code => $plugin) {
                $versions['plugins'][$code] = array_get($plugin, 'version');
            }
        }
        catch (Exception $ex) {
            $versions = [
                'count' => 0,
                'core' => null,
                'plugins' => []
            ];
        }

        // Remember update count, set retry date
        Parameter::set('system::update.versions', $versions);
        Parameter::set('system::update.retry', Date::now()->addHours(24)->timestamp);

        return $versions;
    }

    /**
     * requestUpdateList used for checking for new updates.
     * @param  boolean $force Request application and plugins hash list regardless of version.
     * @return array
     */
    public function requestUpdateList()
    {
        $installed = PluginVersion::all();
        $versions = $installed->pluck('version', 'code')->all();
        $names = $installed->pluck('name', 'code')->all();
        $icons = $installed->pluck('icon', 'code')->all();
        $build = Parameter::get('system::core.build');
        $themes = [];

        if ($this->themeManager) {
            $themes = array_keys($this->themeManager->getInstalled());
        }

        $params = [
            'plugins' => base64_encode(json_encode($versions)),
            'themes' => base64_encode(json_encode($themes)),
            'version' => SystemHelper::VERSION,
            'build' => $build
        ];

        $result = [];
        $serverData = $this->requestServerData('project/check', $params);
        $updateCount = (int) array_get($serverData, 'update', 0);
        $canUpdate = (bool) array_get($serverData, 'is_active', false);

        // Inject known core build
        if ($core = array_get($serverData, 'core')) {
            $core['old_build'] = $this->getCurrentVersion();
            $result['core'] = $core;
        }

        // Inject the application's known plugin name and version
        $plugins = [];
        foreach (array_get($serverData, 'plugins', []) as $code => $info) {
            $info['name'] = $names[$code] ?? $code;
            $info['old_version'] = $versions[$code] ?? false;
            $info['icon'] = $icons[$code] ?? false;
            $plugins[$code] = $info;
            $updateCount++;
        }
        $result['plugins'] = $plugins;

        // Recalculate the update counter
        $result['canUpdate'] = $canUpdate !== true;
        $result['hasUpdates'] = $updateCount > 0;
        $result['update'] = $updateCount;
        Parameter::set('system::update.count', $updateCount);
        Parameter::set('system::project.is_active', $canUpdate);

        return $result;
    }

    /**
     * getComposerUrl returns the endpoint for composer
     */
    public function getComposerUrl(bool $withProtocol = true): string
    {
        $gateway = (string) Config::get('system.composer_gateway', 'gateway.octobercms.com');

        return $withProtocol ? 'https://'.$gateway : $gateway;
    }

    /**
     * uninstall rolls back all modules and plugins.
     */
    public function uninstall()
    {
        // Rollback app
        $this->getMigrator()->reset([app_path('database/migrations')]);

        // Rollback plugins
        $plugins = array_reverse($this->pluginManager->getPlugins());
        foreach ($plugins as $name => $plugin) {
            $this->rollbackPlugin($name);
        }

        // Register module migration files
        $paths = [];

        foreach (SystemHelper::listModules() as $module) {
            $paths[] = base_path('modules/'.strtolower($module).'/database/migrations');
        }

        // Rollback modules
        $this->getMigrator()->reset($paths);

        Schema::dropIfExists($this->getMigrationTableName());
    }

    /**
     * getMigrationTableName returns the migration table name
     */
    public function getMigrationTableName(): string
    {
        return Config::get('database.migrations.table', 'migrations');
    }

    /**
     * getComposerVersionConstraint
     */
    protected function getComposerVersionConstraint($versionStr)
    {
        return $versionStr ? '^'.$versionStr : '*';
    }

    /**
     * getMigrator returns the migrator service
     * @return \Illuminate\Database\Migrations\Migrator
     */
    protected function getMigrator()
    {
        $migrator = App::make('migrator');

        if (isset($this->notesOutput)) {
            $migrator->setOutput($this->notesOutput);
        }

        return $migrator;
    }

    /**
     * getRepository returns the migrator repository
     * @return \Illuminate\Database\Migrations\DatabaseMigrationRepository
     */
    protected function getRepository()
    {
        return App::make('migration.repository');
    }

    /**
     * getFilePath calculates a file path for a file code
     * @param string $fileCode
     * @return string
     */
    protected function getFilePath($fileCode)
    {
        return temp_path(md5($fileCode) . '.arc');
    }
}
