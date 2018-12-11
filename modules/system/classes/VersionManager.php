<?php namespace System\Classes;

use File;
use Yaml;
use Db;
use Carbon\Carbon;
use October\Rain\Database\Updater;

/**
 * Version manager
 *
 * Manages the versions and database updates for plugins.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class VersionManager
{
    use \October\Rain\Support\Traits\Singleton;

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
     * The notes for the current operation.
     * @var array
     */
    protected $notes = [];

    /**
     * @var \Illuminate\Console\OutputStyle
     */
    protected $notesOutput;

    /**
     * Cache of plugin versions as files.
     */
    protected $fileVersions;

    /**
     * Cache of database versions
     */
    protected $databaseVersions;

    /**
     * Cache of database history
     */
    protected $databaseHistory;

    /**
     * @var October\Rain\Database\Updater
     */
    protected $updater;

    /**
     * @var System\Classes\PluginManager
     */
    protected $pluginManager;

    protected function init()
    {
        $this->updater = new Updater;
        $this->pluginManager = PluginManager::instance();
    }

    /**
     * Updates a single plugin by its code or object with it's latest changes.
     * If the $stopOnVersion parameter is specified, the process stops after
     * the specified version is applied.
     */
    public function updatePlugin($plugin, $stopOnVersion = null)
    {
        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        if (!$this->hasVersionFile($code)) {
            return false;
        }

        $currentVersion = $this->getLatestFileVersion($code);
        $databaseVersion = $this->getDatabaseVersion($code);

        // No updates needed
        if ($currentVersion == $databaseVersion) {
            $this->note('- <info>Nothing to update.</info>');
            return;
        }

        $newUpdates = $this->getNewFileVersions($code, $databaseVersion);
        foreach ($newUpdates as $version => $details) {
            $this->applyPluginUpdate($code, $version, $details);

            if ($stopOnVersion === $version) {
                return true;
            }
        }

        return true;
    }

    /**
     * Returns a list of unapplied plugin versions.
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
     * Applies a single version update to a plugin.
     */
    protected function applyPluginUpdate($code, $version, $details)
    {
        if (is_array($details)) {
            $comment = array_shift($details);
            $scripts = $details;
        }
        else {
            $comment = $details;
            $scripts = [];
        }

        /*
         * Apply scripts, if any
         */
        foreach ($scripts as $script) {
            if ($this->hasDatabaseHistory($code, $version, $script)) {
                continue;
            }

            $this->applyDatabaseScript($code, $version, $script);
        }

        /*
         * Register the comment and update the version
         */
        if (!$this->hasDatabaseHistory($code, $version)) {
            $this->applyDatabaseComment($code, $version, $comment);
        }

        $this->setDatabaseVersion($code, $version);

        $this->note(sprintf('- <info>v%s: </info> %s', $version, $comment));
    }

    /**
     * Removes and packs down a plugin from the system. Files are left intact.
     * If the $stopOnVersion parameter is specified, the process stops after
     * the specified version is rolled back.
     */
    public function removePlugin($plugin, $stopOnVersion = null)
    {
        $code = is_string($plugin) ? $plugin : $this->pluginManager->getIdentifier($plugin);

        if (!$this->hasVersionFile($code)) {
            return false;
        }

        $pluginHistory = $this->getDatabaseHistory($code);
        $pluginHistory = array_reverse($pluginHistory);

        $stopOnNextVersion = false;
        $newPluginVersion = null;

        foreach ($pluginHistory as $history) {
            if ($stopOnNextVersion && $history->version !== $stopOnVersion) {
                // Stop if the $stopOnVersion value was found and
                // this is a new version. The history could contain
                // multiple items for a single version (comments and scripts).
                $newPluginVersion = $history->version;
                break;
            }

            if ($history->type == self::HISTORY_TYPE_COMMENT) {
                $this->removeDatabaseComment($code, $history->version);
            }
            elseif ($history->type == self::HISTORY_TYPE_SCRIPT) {
                $this->removeDatabaseScript($code, $history->version, $history->detail);
            }

            if ($stopOnVersion === $history->version) {
                $stopOnNextVersion = true;
            }
        }

        $this->setDatabaseVersion($code, $newPluginVersion);

        if (isset($this->fileVersions[$code])) {
            unset($this->fileVersions[$code]);
        }
        if (isset($this->databaseVersions[$code])) {
            unset($this->databaseVersions[$code]);
        }
        if (isset($this->databaseHistory[$code])) {
            unset($this->databaseHistory[$code]);
        }
        return true;
    }

    /**
     * Deletes all records from the version and history tables for a plugin.
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
     * Returns the latest version of a plugin from its version file.
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
     * Returns any new versions from a supplied version, ie. unapplied versions.
     */
    protected function getNewFileVersions($code, $version = null)
    {
        if ($version === null) {
            $version = self::NO_VERSION_VALUE;
        }

        $versions = $this->getFileVersions($code);
        $position = array_search($version, array_keys($versions));
        return array_slice($versions, ++$position);
    }

    /**
     * Returns all versions of a plugin from its version file.
     */
    protected function getFileVersions($code)
    {
        if ($this->fileVersions !== null && array_key_exists($code, $this->fileVersions)) {
            return $this->fileVersions[$code];
        }

        $versionFile = $this->getVersionFile($code);
        $versionInfo = Yaml::parseFile($versionFile);

        if (!is_array($versionInfo)) {
            $versionInfo = [];
        }

        if ($versionInfo) {
            uksort($versionInfo, function ($a, $b) {
                return version_compare($a, $b);
            });
        }

        return $this->fileVersions[$code] = $versionInfo;
    }

    /**
     * Returns the absolute path to a version file for a plugin.
     */
    protected function getVersionFile($code)
    {
        $versionFile = $this->pluginManager->getPluginPath($code) . '/updates/version.yaml';
        return $versionFile;
    }

    /**
     * Checks if a plugin has a version file.
     */
    protected function hasVersionFile($code)
    {
        $versionFile = $this->getVersionFile($code);
        return File::isFile($versionFile);
    }

    //
    // Database representation
    //

    /**
     * Returns the latest version of a plugin from the database.
     */
    protected function getDatabaseVersion($code)
    {
        if ($this->databaseVersions === null) {
            $this->databaseVersions = Db::table('system_plugin_versions')->lists('version', 'code');
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
     * Updates a plugin version in the database.
     */
    protected function setDatabaseVersion($code, $version = null)
    {
        $currentVersion = $this->getDatabaseVersion($code);

        if ($version && !$currentVersion) {
            Db::table('system_plugin_versions')->insert([
                'code' => $code,
                'version' => $version,
                'created_at' => new Carbon
            ]);
        }
        elseif ($version && $currentVersion) {
            Db::table('system_plugin_versions')->where('code', $code)->update([
                'version' => $version,
                'created_at' => new Carbon
            ]);
        }
        elseif ($currentVersion) {
            Db::table('system_plugin_versions')->where('code', $code)->delete();
        }

        $this->databaseVersions[$code] = $version;
    }

    /**
     * Registers a database update comment in the history table.
     */
    protected function applyDatabaseComment($code, $version, $comment)
    {
        Db::table('system_plugin_history')->insert([
            'code' => $code,
            'type' => self::HISTORY_TYPE_COMMENT,
            'version' => $version,
            'detail' => $comment,
            'created_at' => new Carbon
        ]);
    }

    /**
     * Removes a database update comment in the history table.
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
     * Registers a database update script in the history table.
     */
    protected function applyDatabaseScript($code, $version, $script)
    {
        /*
         * Execute the database PHP script
         */
        $updateFile = $this->pluginManager->getPluginPath($code) . '/updates/' . $script;

        if (!File::isFile($updateFile)) {
            $this->note('- <error>v' . $version . ':  Migration file "' . $script . '" not found</error>');
        }

        $this->updater->setUp($updateFile);

        Db::table('system_plugin_history')->insert([
            'code' => $code,
            'type' => self::HISTORY_TYPE_SCRIPT,
            'version' => $version,
            'detail' => $script,
            'created_at' => new Carbon
        ]);
    }

    /**
     * Removes a database update script in the history table.
     */
    protected function removeDatabaseScript($code, $version, $script)
    {
        /*
         * Execute the database PHP script
         */
        $updateFile = $this->pluginManager->getPluginPath($code) . '/updates/' . $script;
        $this->updater->packDown($updateFile);

        Db::table('system_plugin_history')
            ->where('code', $code)
            ->where('type', self::HISTORY_TYPE_SCRIPT)
            ->where('version', $version)
            ->where('detail', $script)
            ->delete();
    }

    /**
     * Returns all the update history for a plugin.
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
            ->all();

        return $this->databaseHistory[$code] = $historyInfo;
    }

    /**
     * Checks if a plugin has an applied update version.
     */
    protected function hasDatabaseHistory($code, $version, $script = null)
    {
        $historyInfo = $this->getDatabaseHistory($code);
        if (!$historyInfo) {
            return false;
        }

        foreach ($historyInfo as $history) {
            if ($history->version != $version) {
                continue;
            }

            if ($history->type == self::HISTORY_TYPE_COMMENT && !$script) {
                return true;
            }

            if ($history->type == self::HISTORY_TYPE_SCRIPT && $history->detail == $script) {
                return true;
            }
        }

        return false;
    }

    //
    // Notes
    //

    /**
     * Raise a note event for the migrator.
     * @param  string  $message
     * @return void
     */
    protected function note($message)
    {
        if ($this->notesOutput !== null) {
            $this->notesOutput->writeln($message);
        }
        else {
            $this->notes[] = $message;
        }

        return $this;
    }

    /**
     * Get the notes for the last operation.
     * @return array
     */
    public function getNotes()
    {
        return $this->notes;
    }

    /**
     * Resets the notes store.
     * @return self
     */
    public function resetNotes()
    {
        $this->notesOutput = null;

        $this->notes = [];

        return $this;
    }

    /**
     * Sets an output stream for writing notes.
     * @param  Illuminate\Console\Command $output
     * @return self
     */
    public function setNotesOutput($output)
    {
        $this->notesOutput = $output;

        return $this;
    }
}
