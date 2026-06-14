<?php namespace System\Classes;

use Db;
use App;
use Date;
use File;
use Yaml;
use Exception;
use Illuminate\Database\QueryException;

/**
 * VersionManager manages the versions and database updates for plugins
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class VersionManager
{
    use \System\Traits\NoteMaker;

    /**
     * Value when no updates are found.
     */
    const NO_VERSION_VALUE = 0;

    /**
     * Morph types for history table.
     */
    const HISTORY_TYPE_COMMENT = 'comment';
    const HISTORY_TYPE_SCRIPT = 'script';

    /**
     * @var array fileVersions cache of plugin versions as files.
     */
    protected $fileVersions;

    /**
     * @var array databaseVersions cache of database versions
     */
    protected $databaseVersions;

    /**
     * @var array databaseHistory cache of database history
     */
    protected $databaseHistory;

    /**
     * @var \System\Classes\PluginManager
     */
    protected $pluginManager;

    /**
     * __construct this class
     */
    public function __construct()
    {
        $this->pluginManager = PluginManager::instance();
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.versions');
    }

    /**
     * updatePlugin updates a single plugin by its code or object with it's latest changes
     * If the $toVersion parameter is specified, the process stops after
     * the specified version is applied.
     */
    public function updatePlugin($plugin, $toVersion = null)
    {
        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        if (!$this->hasVersionFile($code)) {
            return false;
        }

        $currentVersion = $this->getLatestFileVersion($code);
        $databaseVersion = $this->getDatabaseVersion($code);

        // No updates needed
        if ((string) $currentVersion === (string) $databaseVersion) {
            return false;
        }

        $newUpdates = $this->getNewFileVersions($code, $databaseVersion);
        $pendingCount = count($newUpdates);
        $dbIsAhead = (string) $databaseVersion !== (string) self::NO_VERSION_VALUE
            && version_compare((string) $databaseVersion, (string) $currentVersion, '>');

        if ($dbIsAhead) {
            $this->note(sprintf(
                '<info>%s</info> <fg=yellow>db ahead of files: v%s > v%s</> <fg=gray>(nothing to migrate)</>',
                $code,
                $databaseVersion,
                $currentVersion
            ));

            return false;
        }

        if ($pendingCount === 0) {
            return false;
        }

        $fromLabel = ((string) $databaseVersion === (string) self::NO_VERSION_VALUE)
            ? 'not installed'
            : 'v' . $databaseVersion;

        $this->note(sprintf(
            '<info>%s</info> <comment>%s -> v%s</comment> <fg=gray>(%d pending %s)</>',
            $code,
            $fromLabel,
            $currentVersion,
            $pendingCount,
            $pendingCount === 1 ? 'migration' : 'migrations'
        ));

        foreach ($newUpdates as $version => $details) {
            $this->applyPluginUpdate($code, $version, $details);

            if ($toVersion === $version) {
                return true;
            }
        }

        return true;
    }

    /**
     * listNewVersions returns a list of unapplied plugin versions
     */
    public function listNewVersions($plugin)
    {
        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        if (!$this->hasVersionFile($code)) {
            return [];
        }

        $databaseVersion = $this->getDatabaseVersion($code);

        return $this->getNewFileVersions($code, $databaseVersion);
    }

    /**
     * hasVersion will return true if a plugin has been registered at a supplied version
     */
    public function hasVersion($plugin, string $version): bool
    {
        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        foreach ($this->getDatabaseHistory($code) as $history) {
            if ($history->version === $version) {
                return true;
            }
        }

        return false;
    }

    /**
     * getLatestVersion returns the latest version for a plugin
     * @param string $plugin
     */
    public function getLatestVersion($pluginCode)
    {
        $pluginCode = $this->pluginManager->normalizeIdentifier($pluginCode);

        return $this->getLatestFileVersion($pluginCode);
    }

    /**
     * applyPluginUpdate applies a single version update to a plugin.
     */
    protected function applyPluginUpdate($code, $version, $details)
    {
        $version = $this->normalizeVersion($version);

        [$comments, $scripts] = $this->extractScriptsAndComments($details);

        // Apply scripts, if any
        foreach ($scripts as $script) {
            if ($this->hasDatabaseHistory($code, $version, $script)) {
                continue;
            }

            $this->applyDatabaseScript($code, $version, $script);
        }

        // Register the comment and update the version
        if (!$this->hasDatabaseHistory($code, $version)) {
            foreach ($comments as $comment) {
                $this->applyDatabaseComment($code, $version, $comment);

                $this->note(sprintf('- <info>v%s</info> %s', $version, $comment));
            }
        }

        $this->setDatabaseVersion($code, $version);
    }

    /**
     * removePlugin removes and packs down a plugin from the system. Files are left intact
     * If the $toVersion parameter is specified, the process stops after the specified
     * version is rolled back.
     */
    public function removePlugin($plugin, $toVersion = null): bool
    {
        // @todo this API is used as part of the builder plugin and could be replaced
        // with the removePluginToVersion method in a later deprecation review along
        // with creating a updatePluginToVersion API method -sg
        if ($toVersion) {
            return $this->removePluginToVersion($plugin, $toVersion, true);
        }

        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        if (!$this->hasVersionFile($code)) {
            return false;
        }

        $pluginHistory = $this->getDatabaseHistory($code);
        $pluginHistory = array_reverse($pluginHistory);

        foreach ($pluginHistory as $history) {
            if ($history->type === self::HISTORY_TYPE_COMMENT) {
                $this->removeDatabaseComment($code, $history->version);
            }
            elseif ($history->type === self::HISTORY_TYPE_SCRIPT) {
                $this->removeDatabaseScript($code, $history->version, $history->detail);
            }
        }

        $this->setDatabaseVersion($code);

        $this->resetCacheForCode($code);

        return true;
    }

    /**
     * removePluginToVersion will remove the plugin version up to a specified one,
     * you may also specify to include that version itself as part of the rollback.
     */
    public function removePluginToVersion($plugin, string $toVersion, bool $includeVersion = false): bool
    {
        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        if (!$this->hasVersionFile($code)) {
            return false;
        }

        $pluginHistory = $this->getDatabaseHistory($code);
        $pluginHistory = array_reverse($pluginHistory);

        $stopOnNextVersion = false;
        $latestVersion = null;

        foreach ($pluginHistory as $history) {
            // Stop if the $toVersion filter is met and we don't want to include
            // that version itself in the rollback.
            if (!$includeVersion && $history->version === $toVersion) {
                $latestVersion = $history->version;
                break;
            }

            // Stop if the $toVersion value was found and this is a new version.
            // The history could contain multiple items for a single version
            // (comments and scripts).
            if ($stopOnNextVersion && $history->version !== $toVersion) {
                $latestVersion = $history->version;
                break;
            }

            if ($history->type === self::HISTORY_TYPE_COMMENT) {
                $this->removeDatabaseComment($code, $history->version);
            }
            elseif ($history->type === self::HISTORY_TYPE_SCRIPT) {
                $this->removeDatabaseScript($code, $history->version, $history->detail);
            }

            if ($toVersion === $history->version) {
                $stopOnNextVersion = true;
            }
        }

        $this->setDatabaseVersion($code, $latestVersion);

        $this->resetCacheForCode($code);

        return true;
    }

    /**
     * resetCacheForCode will reset the cache for a specified plugin code
     */
    protected function resetCacheForCode(string $code): void
    {
        if (isset($this->fileVersions[$code])) {
            unset($this->fileVersions[$code]);
        }
        if (isset($this->databaseVersions[$code])) {
            unset($this->databaseVersions[$code]);
        }
        if (isset($this->databaseHistory[$code])) {
            unset($this->databaseHistory[$code]);
        }
    }

    /**
     * purgePlugin deletes all records from the version and history tables for a plugin
     * @param  string $pluginCode Plugin code
     * @return void
     */
    public function purgePlugin($pluginCode)
    {
        $versions = Db::table('system_plugin_versions')->where('code', $pluginCode);
        if ($countVersions = $versions->count()) {
            $versions->delete();
        }

        $history = Db::table('system_plugin_history')->where('code', $pluginCode);
        if ($countHistory = $history->count()) {
            $history->delete();
        }

        return ($countHistory + $countVersions) > 0;
    }

    //
    // File representation
    //

    /**
     * getLatestFileVersion returns the latest version of a plugin from its version file
     */
    protected function getLatestFileVersion($code)
    {
        $versionInfo = $this->getFileVersions($code);
        if (!$versionInfo) {
            return self::NO_VERSION_VALUE;
        }

        return trim(key(array_slice($versionInfo, -1, 1)));
    }

    /**
     * getNewFileVersions returns any new versions from a supplied version, ie. unapplied versions
     */
    protected function getNewFileVersions($code, $version = null)
    {
        if ($version === null) {
            $version = self::NO_VERSION_VALUE;
        }

        $versions = $this->getFileVersions($code);

        // Quick check
        $position = array_search($version, array_keys($versions));

        // Version compare check
        if ($position === false) {
            foreach (array_keys($versions) as $index => $fileVersion) {
                if (version_compare((string) $version, (string) $fileVersion) !== -1) {
                    $position = $index;
                }
            }
        }

        if ($position === false) {
            $position = -1;
        }

        return array_slice($versions, ++$position);
    }

    /**
     * getFileVersions returns all versions of a plugin from its version file
     */
    protected function getFileVersions($code)
    {
        if ($this->fileVersions !== null && array_key_exists($code, $this->fileVersions)) {
            return $this->fileVersions[$code];
        }

        // Attempt to parse version information
        $versionInfo = [];

        if ($this->hasVersionFile($code)) {
            $versionInfo = Yaml::parseFile($this->getVersionFile($code));
        }

        if (!is_array($versionInfo)) {
            $versionInfo = [];
        }

        // Sort result
        uksort($versionInfo, function ($a, $b) {
            return version_compare((string) $a, (string) $b);
        });

        // Normalize result
        $result = [];

        foreach ($versionInfo as $version => $info) {
            $result[$this->normalizeVersion($version)] = $info;
        }

        return $this->fileVersions[$code] = $result;
    }

    /**
     * getVersionFile returns the absolute path to a version file for a plugin, the string
     * is empty if no file is found or resolved
     */
    protected function getVersionFile($code): string
    {
        $pluginPath = $this->pluginManager->getPluginPath($code);
        if (!$pluginPath) {
            return '';
        }

        return $pluginPath . '/updates/version.yaml';
    }

    /**
     * hasVersionFile checks if a plugin has a version file
     */
    protected function hasVersionFile($code): bool
    {
        if ($versionFile = $this->getVersionFile($code)) {
            return File::isFile($versionFile);
        }

        return false;
    }

    //
    // Database representation
    //

    /**
     * getDatabaseVersion returns the latest version of a plugin from the database
     */
    protected function getDatabaseVersion($code)
    {
        if ($this->databaseVersions === null) {
            $this->databaseVersions = Db::table('system_plugin_versions')->pluck('version', 'code')->all();
        }

        if (!isset($this->databaseVersions[$code])) {
            $this->databaseVersions[$code] = Db::table('system_plugin_versions')
                ->where('code', $code)
                ->value('version')
            ;
        }

        return $this->databaseVersions[$code] ?? self::NO_VERSION_VALUE;
    }

    /**
     * setDatabaseVersion updates a plugin version in the database, if the version
     * is not specified then the version is reset to empty.
     */
    protected function setDatabaseVersion($code, $version = null)
    {
        $currentVersion = $this->getDatabaseVersion($code);

        if ($version && !$currentVersion) {
            Db::table('system_plugin_versions')->insert([
                'code' => $code,
                'version' => $version,
                'created_at' => Date::now()
            ]);
        }
        elseif ($version && $currentVersion) {
            Db::table('system_plugin_versions')->where('code', $code)->update([
                'version' => $version,
                'created_at' => Date::now()
            ]);
        }
        elseif ($currentVersion) {
            Db::table('system_plugin_versions')->where('code', $code)->delete();
        }

        $this->databaseVersions[$code] = $version;
    }

    /**
     * applyDatabaseComment registers a database update comment in the history table
     */
    protected function applyDatabaseComment($code, $version, $comment)
    {
        Db::table('system_plugin_history')->insert([
            'code' => $code,
            'type' => self::HISTORY_TYPE_COMMENT,
            'version' => $version,
            'detail' => $comment,
            'created_at' => Date::now()
        ]);
    }

    /**
     * removeDatabaseComment removes a database update comment in the history table
     */
    protected function removeDatabaseComment($code, $version)
    {
        Db::table('system_plugin_history')
            ->where('code', $code)
            ->where('type', self::HISTORY_TYPE_COMMENT)
            ->where('version', $version)
            ->delete();
    }

    /**
     * applyDatabaseScript registers a database update script in the history table
     */
    protected function applyDatabaseScript($code, $version, $script)
    {
        // Execute the database PHP script
        $updateFile = $this->pluginManager->getPluginPath($code) . '/updates/' . $script;

        if (!File::isFile($updateFile)) {
            $this->note('- <error>v' . $version . ':  Migration file "' . $script . '" not found</error>');
            return;
        }

        try {
            $this->getUpdater()->setUp($updateFile);

            Db::table('system_plugin_history')->insert([
                'code' => $code,
                'type' => self::HISTORY_TYPE_SCRIPT,
                'version' => $version,
                'detail' => $script,
                'created_at' => Date::now()
            ]);
        }
        catch (Exception $ex) {
            $this->note('- <error>v' . $version . ':  Migration "' . $script . '" failed</error>');
            $this->noteScriptException($ex, $updateFile);
            throw $ex;
        }
    }

    /**
     * noteScriptException prints detailed context for a migration failure:
     * exception class + message, SQL + bindings for QueryException, and
     * the migration file path.
     */
    protected function noteScriptException(Exception $ex, string $updateFile): void
    {
        $this->note('  <fg=red>' . class_basename($ex) . ':</> ' . $ex->getMessage());

        if ($ex instanceof QueryException) {
            $sql = $ex->getSql();
            if ($sql !== '') {
                $this->note('  <fg=gray>SQL:</> ' . $sql);
            }

            $bindings = $ex->getBindings();
            if (!empty($bindings)) {
                $rendered = array_map(static function ($binding) {
                    if (is_string($binding)) {
                        return "'" . $binding . "'";
                    }
                    if (is_bool($binding)) {
                        return $binding ? 'true' : 'false';
                    }
                    if ($binding === null) {
                        return 'null';
                    }
                    if ($binding instanceof \DateTimeInterface) {
                        return "'" . $binding->format('Y-m-d H:i:s') . "'";
                    }
                    if (is_scalar($binding)) {
                        return (string) $binding;
                    }
                    return json_encode($binding);
                }, $bindings);

                $this->note('  <fg=gray>bindings:</> [' . implode(', ', $rendered) . ']');
            }
        }

        $relative = str_replace(base_path() . DIRECTORY_SEPARATOR, '', $updateFile);
        $this->note('  <fg=gray>file:</> ' . str_replace('\\', '/', $relative));
    }

    /**
     * removeDatabaseScript removes a database update script in the history table
     */
    protected function removeDatabaseScript($code, $version, $script)
    {
        // Execute the database PHP script
        $updateFile = $this->pluginManager->getPluginPath($code) . '/updates/' . $script;

        $this->getUpdater()->packDown($updateFile);

        Db::table('system_plugin_history')
            ->where('code', $code)
            ->where('type', self::HISTORY_TYPE_SCRIPT)
            ->where('version', $version)
            ->where('detail', $script)
            ->delete()
        ;
    }

    /**
     * getDatabaseHistory returns all the update history for a plugin
     */
    protected function getDatabaseHistory($code)
    {
        if ($this->databaseHistory !== null && array_key_exists($code, $this->databaseHistory)) {
            return $this->databaseHistory[$code];
        }

        $historyInfo = Db::table('system_plugin_history')
            ->where('code', $code)
            ->orderBy('id')
            ->get()
            ->all()
        ;

        return $this->databaseHistory[$code] = $historyInfo;
    }

    /**
     * hasDatabaseHistory checks if a plugin has an applied update version
     */
    protected function hasDatabaseHistory($code, $version, $script = null)
    {
        $historyInfo = $this->getDatabaseHistory($code);
        if (!$historyInfo) {
            return false;
        }

        foreach ($historyInfo as $history) {
            if ((string) $history->version !== (string) $version) {
                continue;
            }

            if ($history->type === self::HISTORY_TYPE_COMMENT && !$script) {
                return true;
            }

            if ($history->type === self::HISTORY_TYPE_SCRIPT && $history->detail === $script) {
                return true;
            }
        }

        return false;
    }

    /**
     * normalizeVersion checks some versions start with v and others not
     */
    protected function normalizeVersion($version): string
    {
        return rtrim(ltrim((string) $version, 'v'), '.');
    }

    /**
     * extractScriptsAndComments extracts script and comments from version details
     * @return array
     */
    protected function extractScriptsAndComments($details)
    {
        if (is_array($details)) {
            $fileNamePattern = "/^[a-z0-9\_\-\.\/\\\]+\.php$/i";

            $comments = array_values(array_filter($details, function ($detail) use ($fileNamePattern) {
                return !preg_match($fileNamePattern, $detail);
            }));

            $scripts = array_values(array_filter($details, function ($detail) use ($fileNamePattern) {
                return preg_match($fileNamePattern, $detail);
            }));
        }
        else {
            $comments = (array) $details;
            $scripts = [];
        }

        return [$comments, $scripts];
    }

    /**
     * getUpdater returns the updater service
     * @return \October\Rain\Database\Updater
     */
    protected function getUpdater()
    {
        return App::make('db.updater');
    }
}
