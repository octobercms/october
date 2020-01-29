<?php namespace October\Core\Tests\Concerns;

use System\Classes\UpdateManager;
use System\Classes\PluginManager;

trait TestsPlugins
{
    /**
     * @var array Cache for storing which plugins have been loaded
     * and refreshed.
     */
    protected $pluginTestCaseLoadedPlugins = [];

    public function resetManagers(): void
    {
        PluginManager::forgetInstance();
        UpdateManager::forgetInstance();
    }

    /**
     * Detects the current plugin based on the namespace, when running tests within a plugin.
     *
     * @return void
     */
    public function detectPlugin(): void
    {
        $this->pluginTestCaseLoadedPlugins = [];
        $pluginCode = $this->guessPluginCodeFromTest();

        if ($pluginCode !== false) {
            $this->runPluginRefreshCommand($pluginCode, false);
        }
    }

    /**
     * Locates the plugin code based on the test file location.
     *
     * @return string|bool
     */
    protected function guessPluginCodeFromTest()
    {
        $reflect = new \ReflectionClass($this);
        $path = $reflect->getFilename();
        $basePath = $this->app->pluginsPath();

        $result = false;

        if (strpos($path, $basePath) === 0) {
            $result = ltrim(str_replace('\\', '/', substr($path, strlen($basePath))), '/');
            $result = implode('.', array_slice(explode('/', $result), 0, 2));
        }

        return $result;
    }

    /**
     * Runs a refresh command on a plugin.
     *
     * Since the test environment has loaded all the test plugins
     * natively, this method will ensure the desired plugin is
     * loaded in the system before proceeding to migrate it.
     *
     * @return void
     */
    protected function runPluginRefreshCommand($code, $throwException = true): void
    {
        if (!preg_match('/^[\w+]*\.[\w+]*$/', $code)) {
            if (!$throwException) {
                return;
            }
            throw new \Exception(sprintf('Invalid plugin code: "%s"', $code));
        }

        $manager = PluginManager::instance();
        $plugin = $manager->findByIdentifier($code);

        // First time seeing this plugin, load it up
        if (!$plugin) {
            $namespace = '\\'.str_replace('.', '\\', strtolower($code));
            $path = array_get($manager->getPluginNamespaces(), $namespace);

            if (!$path) {
                if (!$throwException) {
                    return;
                }
                throw new \Exception(sprintf('Unable to find plugin with code: "%s"', $code));
            }

            $plugin = $manager->loadPlugin($namespace, $path);
        }

        // Spin over dependencies and refresh them too
        $this->pluginTestCaseLoadedPlugins[$code] = $plugin;

        if (!empty($plugin->require)) {
            foreach ((array) $plugin->require as $dependency) {
                if (isset($this->pluginTestCaseLoadedPlugins[$dependency])) {
                    continue;
                }

                $this->runPluginRefreshCommand($dependency);
            }
        }

        // Execute the command
        \Artisan::call('plugin:refresh', ['name' => $code]);
    }
}
