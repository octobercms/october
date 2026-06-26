<?php namespace System\Helpers;

use App;
use File;
use Config;
use Schema;
use Manifest;

/**
 * System Helper
 *
 * @package october\system
 * @see \System\Facades\System
 * @author Alexey Bobkov, Samuel Georges
 */
class System
{
    /**
     * @var string MANIFEST_MODULES for manifest storage
     */
    const MANIFEST_MODULES = 'modules.all';

    /**
     * @var string MANIFEST_DB_CHECK for manifest storage
     */
    const MANIFEST_DB_CHECK = 'database.check';

    /**
     * @var bool hasDatabaseCache helps multiple calls to hasDatabase()
     */
    protected $hasDatabaseCache = null;

    /**
     * listModulesCache helps multiple calls to listModules()
     */
    protected $listModulesCache = null;

    /**
     * listModules returns a list of module names that are enabled
     */
    public function listModules(): array
    {
        if ($this->listModulesCache !== null) {
            return $this->listModulesCache;
        }

        // Check manifest
        if (Manifest::has(self::MANIFEST_MODULES)) {
            return (array) Manifest::get(self::MANIFEST_MODULES);
        }

        $loadModules = Config::get('system.load_modules');

        // Lazy
        if (!$loadModules) {
            $foundModules = [];
            foreach (File::directories(base_path('modules')) as $dir) {
                $foundModules[] = ucfirst(basename($dir));
            }

            $result = $foundModules;
        }
        // Eager
        elseif (is_array($loadModules)) {
            $result = $loadModules;
        }
        else {
            $result = array_map('trim', explode(',', (string) $loadModules));
        }

        // System comes first
        if ($systemKey = array_search('System', $result)) {
            unset($result[$systemKey]);
            array_unshift($result, 'System');
        }

        // Store result
        Manifest::put(self::MANIFEST_MODULES, $result);

        return $this->listModulesCache = $result;
    }

    /**
     * hasModule checks for a module inside the system
     */
    public function hasModule($name): bool
    {
        return in_array($name, $this->listModules()) &&
            class_exists('\\' . $name . '\ServiceProvider');
    }

    /**
     * hasDatabase checks if a database connection can be made
     * and the migrations table exists
     */
    public function hasDatabase(): bool
    {
        if ($this->hasDatabaseCache !== null) {
            return $this->hasDatabaseCache;
        }

        if (Manifest::get(self::MANIFEST_DB_CHECK) === true) {
            return $this->hasDatabaseCache = true;
        }

        $loadedValue = App::hasDatabase() &&
            Schema::hasTable(Config::get('database.migrations.table', 'migrations'));

        Manifest::put(self::MANIFEST_DB_CHECK, (bool) $loadedValue);

        return $this->hasDatabaseCache = $loadedValue;
    }

    /**
     * checkProjectValid
     */
    public function checkProjectValid($flag = 2): bool
    {
        return (\System\Models\Parameter::getProjectStatusFlag() & $flag) === $flag;
    }

    /**
     * checkDebugMode returns true if debug mode is on
     */
    public function checkDebugMode(): bool
    {
        return Config::get('app.debug', false);
    }

    /**
     * checkSafeMode will return true if cms.safe_mode config is enabled
     */
    public function checkSafeMode(): bool
    {
        return (bool) Config::get('cms.safe_mode', false);
    }

    /**
     * checkBaseDir returns true if a file path is inside the base directory
     */
    public function checkBaseDir($filePath): bool
    {
        $restrictBaseDir = Config::get('system.restrict_base_dir', true);

        if ($restrictBaseDir && !File::isLocalPath($filePath)) {
            return false;
        }

        if (!$restrictBaseDir && realpath($filePath) === false) {
            return false;
        }

        return true;
    }

    /**
     * composerToOctoberCode converts a composer code to an October CMS code
     * rainlab/mailchimp-plugin-9999999-dev -> rainlab.mailchimp
     */
    public function composerToOctoberCode(string $name): string
    {
        // Remove suffix
        $name = explode('-plugin', $name, -1)[0] ?? $name;
        $name = explode('-theme', $name, -1)[0] ?? $name;

        $parts = explode('/', $name, 2);

        // Remove prefix
        $vendor = $parts[0];
        $package = $parts[1] ?? '';
        $package = ltrim($package, 'oc-');

        return rtrim($vendor.'.'.$package, '.');
    }

    /**
     * octoberToComposerCode converts an October CMS code to a composer code
     * RainLab.Mailchimp -> rainlab/mailchimp-plugin
     */
    public function octoberToComposerCode(string $name, string $type, bool $prefix = false): string
    {
        // Add suffix
        $code = str_replace('.', '/', strtolower($name)) . '-' . $type;

        $parts = explode('/', $code, 2);

        // Add prefix
        if (!$prefix || count($parts) !== 2) {
            return $code;
        }

        return $parts[0] . '/' . 'oc-' . $parts[1];
    }
}
