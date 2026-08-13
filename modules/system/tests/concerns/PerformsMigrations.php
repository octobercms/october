<?php namespace October\Tests\Concerns;

use Db;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Tailor\Classes\BlueprintIndexer;

trait PerformsMigrations
{
    /**
     * @var array pluginTestCaseMigratedPlugins is a cache for storing
     * which plugins have been migrated.
     */
    protected $pluginTestCaseMigratedPlugins = [];

    /**
     * @var array pluginTestCaseDatabasePdos are migrated database connections by key.
     */
    protected static $pluginTestCaseDatabasePdos = [];

    /**
     * @var bool pluginTestCaseDatabaseReused is true when a database migrated by
     * an earlier test has been attached.
     */
    protected $pluginTestCaseDatabaseReused = false;

    /**
     * beginTestDatabase attaches the database migrated earlier in this process,
     * keeping an in-memory database alive across application rebuilds
     */
    protected function beginTestDatabase()
    {
        $pdo = static::$pluginTestCaseDatabasePdos[$this->getTestDatabaseKey()] ?? null;
        if ($pdo === null) {
            return;
        }

        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        Db::connection()->setPdo($pdo);

        $this->pluginTestCaseDatabaseReused = true;
    }

    /**
     * beginTestTransaction isolates database changes made by the test inside a transaction
     */
    protected function beginTestTransaction()
    {
        static::$pluginTestCaseDatabasePdos[$this->getTestDatabaseKey()] ??= Db::connection()->getPdo();

        Db::beginTransaction();
    }

    /**
     * rollbackTestTransaction discards database changes made by the test
     */
    protected function rollbackTestTransaction()
    {
        while (Db::transactionLevel() > 0) {
            Db::rollBack();
        }
    }

    /**
     * getTestDatabaseKey returns the cache key for the migrated database
     */
    protected function getTestDatabaseKey(): string
    {
        return $this->guessPluginCodeFromTest() ?: $this->isAppCodeFromTest() ?: 'default';
    }

    /**
     * migrateDatabase
     */
    protected function migrateDatabase()
    {
        // Migrate everything
        UpdateManager::instance()->update();
    }

    /**
     * migrateTailor
     */
    protected function migrateTailor()
    {
        // Migrate tailor
        BlueprintIndexer::instance()->migrate();
    }

    /**
     * migrateApp
     */
    protected function migrateApp()
    {
        $manager = UpdateManager::instance();

        // Rollback app, unless reusing an already migrated database
        if (!$this->pluginTestCaseDatabaseReused) {
            $manager->rollbackApp();
        }

        $manager->migrateApp();
    }

    /**
     * migrateModules
     */
    protected function migrateModules()
    {
        // Unregister all the plugins so only the modules migrate
        PluginManager::instance()->unloadPlugins();

        // Migrate modules
        UpdateManager::instance()->update();

        // Re-register all plugins
        PluginManager::instance()->loadPlugins();
    }

    /**
     * migrateCurrentPlugin
     */
    protected function migrateCurrentPlugin()
    {
        // Detect plugin from test and autoload it
        $pluginCode = $this->guessPluginCodeFromTest();
        if ($pluginCode !== false) {
            $this->migratePluginInternal($pluginCode, false);
        }

        // Current plugin is the app
        if ($this->isAppCodeFromTest()) {
            $this->migrateApp();
        }
    }

    /**
     * migratePlugin
     */
    protected function migratePlugin($code)
    {
        $this->migratePluginInternal($code);
    }

    /**
     * migratePlugin since the test environment has loaded all the test plugins
     * natively, this method will ensure the desired plugin is loaded in the system before
     * proceeding to migrate it.
     * @return void
     */
    protected function migratePluginInternal($code, $throwException = true)
    {
        // Ensure plugin is registered
        $plugin = $this->loadPluginInternal($code, $throwException);

        // Spin over dependencies and refresh them too
        $this->pluginTestCaseMigratedPlugins[$code] = $plugin;

        if (!empty($plugin->require)) {
            foreach ((array) $plugin->require as $dependency) {
                if (isset($this->pluginTestCaseMigratedPlugins[$dependency])) {
                    continue;
                }

                $this->migratePlugin($dependency);
            }
        }

        $manager = UpdateManager::instance();

        // Rollback plugin, unless reusing an already migrated database
        if (!$this->pluginTestCaseDatabaseReused) {
            $manager->rollbackPlugin($code);
        }

        // Migrate plugin
        $manager->migratePlugin($code);
    }

    /**
     * runPluginRefreshCommand
     * @deprecated use migratePlugin()
     */
    protected function runPluginRefreshCommand($code, $throwException = true)
    {
        $this->migratePlugin($code, $throwException);
    }

    /**
     * runOctoberMigrateCommand
     * @deprecated use migrateDatabase()
     */
    protected function runOctoberMigrateCommand()
    {
        $this->migrateDatabase();
    }
}
