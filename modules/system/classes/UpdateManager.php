<?php namespace System\Classes;

use Db;
use App;
use Url;
use File;
use Lang;
use Http;
use Cache;
use Schema;
use Config;
use ApplicationException;
use Cms\Classes\ThemeManager;
use System\Models\Parameter;
use System\Models\PluginVersion;
use System\Helpers\Cache as CacheHelper;
use October\Rain\Filesystem\Zip;
use Carbon\Carbon;
use Exception;

/**
 * Update manager
 *
 * Handles the CMS install and update process.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class UpdateManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * @var array The notes for the current operation.
     */
    protected $notes = [];

    /**
     * @var \Illuminate\Console\OutputStyle
     */
    protected $notesOutput;

    /**
     * @var string Application base path.
     */
    protected $baseDirectory;

    /**
     * @var string A temporary working directory.
     */
    protected $tempDirectory;

    /**
     * @var System\Classes\PluginManager
     */
    protected $pluginManager;

    /**
     * @var Cms\Classes\ThemeManager
     */
    protected $themeManager;

    /**
     * @var System\Classes\VersionManager
     */
    protected $versionManager;

    /**
     * @var string Secure API Key
     */
    protected $key;

    /**
     * @var string Secure API Secret
     */
    protected $secret;

    /**
     * @var boolean If set to true, core updates will not be downloaded or extracted.
     */
    protected $disableCoreUpdates = false;

    /**
     * @var array Cache of gateway products
     */
    protected $productCache;

    /**
     * @var Illuminate\Database\Migrations\Migrator
     */
    protected $migrator;

    /**
     * @var Illuminate\Database\Migrations\DatabaseMigrationRepository
     */
    protected $repository;

    /**
     * Initialize this singleton.
     */
    protected function init()
    {
        $this->pluginManager = PluginManager::instance();
        $this->themeManager = class_exists(ThemeManager::class) ? ThemeManager::instance() : null;
        $this->versionManager = VersionManager::instance();
        $this->tempDirectory = temp_path();
        $this->baseDirectory = base_path();
        $this->disableCoreUpdates = Config::get('cms.disableCoreUpdates', false);
        $this->bindContainerObjects();

        /*
         * Ensure temp directory exists
         */
        if (!File::isDirectory($this->tempDirectory)) {
            File::makeDirectory($this->tempDirectory, 0777, true);
        }
    }

    /**
     * These objects are "soft singletons" and may be lost when
     * the IoC container reboots. This provides a way to rebuild
     * for the purposes of unit testing.
     */
    public function bindContainerObjects()
    {
        $this->migrator = App::make('migrator');
        $this->repository = App::make('migration.repository');
    }

    /**
     * Creates the migration table and updates
     * @return self
     */
    public function update()
    {
        $firstUp = !Schema::hasTable($this->getMigrationTableName());
        if ($firstUp) {
            $this->repository->createRepository();
            $this->note('Migration table created');
        }

        /*
         * Update modules
         */
        $modules = Config::get('cms.loadModules', []);
        foreach ($modules as $module) {
            $this->migrateModule($module);
        }

        /*
         * Update plugins
         */
        $plugins = $this->pluginManager->sortByDependencies();
        foreach ($plugins as $plugin) {
            $this->updatePlugin($plugin);
        }

        Parameter::set('system::update.count', 0);
        CacheHelper::clear();

        /*
         * Seed modules
         */
        if ($firstUp) {
            $modules = Config::get('cms.loadModules', []);
            foreach ($modules as $module) {
                $this->seedModule($module);
            }
        }

        return $this;
    }

    /**
     * Checks for new updates and returns the amount of unapplied updates.
     * Only requests from the server at a set interval (retry timer).
     * @param  boolean $force Ignore the retry timer.
     * @return int            Number of unapplied updates.
     */
    public function check($force = false)
    {
        /*
         * Already know about updates, never retry.
         */
        $oldCount = Parameter::get('system::update.count');
        if ($oldCount > 0) {
            return $oldCount;
        }

        /*
         * Retry period not passed, skipping.
         */
        if (!$force && ($retryTimestamp = Parameter::get('system::update.retry'))) {
            if (Carbon::createFromTimeStamp($retryTimestamp)->isFuture()) {
                return $oldCount;
            }
        }

        try {
            $result = $this->requestUpdateList();
            $newCount = array_get($result, 'update', 0);
        }
        catch (Exception $ex) {
            $newCount = 0;
        }

        /*
         * Remember update count, set retry date
         */
        Parameter::set('system::update.count', $newCount);
        Parameter::set('system::update.retry', Carbon::now()->addHours(24)->timestamp);

        return $newCount;
    }

    /**
     * Requests an update list used for checking for new updates.
     * @param  boolean $force Request application and plugins hash list regardless of version.
     * @return array
     */
    public function requestUpdateList($force = false)
    {
        $installed = PluginVersion::all();
        $versions = $installed->lists('version', 'code');
        $names = $installed->lists('name', 'code');
        $icons = $installed->lists('icon', 'code');
        $frozen = $installed->lists('is_frozen', 'code');
        $updatable = $installed->lists('is_updatable', 'code');
        $build = Parameter::get('system::core.build');

        $params = [
            'core' => $this->getHash(),
            'plugins' => serialize($versions),
            'build' => $build,
            'force' => $force
        ];

        $result = $this->requestServerData('core/update', $params);
        $updateCount = (int) array_get($result, 'update', 0);

        /*
         * Inject known core build
         */
        if ($core = array_get($result, 'core')) {
            $core['old_build'] = Parameter::get('system::core.build');
            $result['core'] = $core;
        }

        /*
         * Inject the application's known plugin name and version
         */
        $plugins = [];
        foreach (array_get($result, 'plugins', []) as $code => $info) {
            $info['name'] = isset($names[$code]) ? $names[$code] : $code;
            $info['old_version'] = isset($versions[$code]) ? $versions[$code] : false;
            $info['icon'] = isset($icons[$code]) ? $icons[$code] : false;

            /*
             * If a plugin has updates frozen, or cannot be updated,
             * do not add to the list and discount an update unit.
             */
            if (
                (isset($frozen[$code]) && $frozen[$code]) ||
                (isset($updatable[$code]) && !$updatable[$code])
            ) {
                $updateCount = max(0, --$updateCount);
            }
            else {
                $plugins[$code] = $info;
            }
        }
        $result['plugins'] = $plugins;

        /*
         * Strip out themes that have been installed before
         */
        if ($this->themeManager) {
            $themes = [];
            foreach (array_get($result, 'themes', []) as $code => $info) {
                if (!$this->themeManager->isInstalled($code)) {
                    $themes[$code] = $info;
                }
            }
            $result['themes'] = $themes;
        }

        /*
         * If there is a core update and core updates are disabled,
         * remove the entry and discount an update unit.
         */
        if (array_get($result, 'core') && $this->disableCoreUpdates) {
            $updateCount = max(0, --$updateCount);
            unset($result['core']);
        }

        /*
         * Recalculate the update counter
         */
        $updateCount += count($themes);
        $result['hasUpdates'] = $updateCount > 0;
        $result['update'] = $updateCount;
        Parameter::set('system::update.count', $updateCount);

        return $result;
    }

    /**
     * Requests details about a project based on its identifier.
     * @param  string $projectId
     * @return array
     */
    public function requestProjectDetails($projectId)
    {
        return $this->requestServerData('project/detail', ['id' => $projectId]);
    }

    /**
     * Roll back all modules and plugins.
     * @return self
     */
    public function uninstall()
    {
        /*
         * Rollback plugins
         */
        $plugins = $this->pluginManager->getPlugins();
        foreach ($plugins as $name => $plugin) {
            $this->rollbackPlugin($name);
        }

        /*
         * Register module migration files
         */
        $paths = [];
        $modules = Config::get('cms.loadModules', []);

        foreach ($modules as $module) {
            $paths[] = $path = base_path() . '/modules/'.strtolower($module).'/database/migrations';
        }

        /*
         * Rollback modules
         */
        while (true) {
            $rolledBack = $this->migrator->rollback($paths, ['pretend' => false]);

            foreach ($this->migrator->getNotes() as $note) {
                $this->note($note);
            }

            if (count($rolledBack) == 0) {
                break;
            }
        }

        Schema::dropIfExists($this->getMigrationTableName());

        return $this;
    }

    /**
     * Asks the gateway for the lastest build number and stores it.
     * @return void
     */
    public function setBuildNumberManually()
    {
        $postData = [];

        if (Config::get('cms.edgeUpdates', false)) {
            $postData['edge'] = 1;
        }

        $result = $this->requestServerData('ping', $postData);

        $build = (int) array_get($result, 'pong', 420);

        $this->setBuild($build);

        return $build;
    }

    //
    // Modules
    //

    /**
     * Returns the currently installed system hash.
     * @return string
     */
    public function getHash()
    {
        return Parameter::get('system::core.hash', md5('NULL'));
    }

    /**
     * Run migrations on a single module
     * @param string $module Module name
     * @return self
     */
    public function migrateModule($module)
    {
        $this->migrator->run(base_path() . '/modules/'.strtolower($module).'/database/migrations');

        $this->note($module);

        foreach ($this->migrator->getNotes() as $note) {
            $this->note(' - '.$note);
        }

        return $this;
    }

    /**
     * Run seeds on a module
     * @param string $module Module name
     * @return self
     */
    public function seedModule($module)
    {
        $className = '\\'.$module.'\Database\Seeds\DatabaseSeeder';
        if (!class_exists($className)) {
            return;
        }

        $seeder = App::make($className);
        $seeder->run();

        $this->note(sprintf('<info>Seeded %s</info> ', $module));
        return $this;
    }

    /**
     * Downloads the core from the update server.
     * @param string $hash Expected file hash.
     * @return void
     */
    public function downloadCore($hash)
    {
        $this->requestServerFile('core/get', 'core', $hash, ['type' => 'update']);
    }

    /**
     * Extracts the core after it has been downloaded.
     * @return void
     */
    public function extractCore()
    {
        $filePath = $this->getFilePath('core');

        if (!Zip::extract($filePath, $this->baseDirectory)) {
            throw new ApplicationException(Lang::get('system::lang.zip.extract_failed', ['file' => $filePath]));
        }

        @unlink($filePath);
    }

    /**
     * Sets the build number and hash
     * @param string $hash
     * @param string $build
     * @return void
     */
    public function setBuild($build, $hash = null)
    {
        $params = [
            'system::core.build' => $build
        ];

        if ($hash) {
            $params['system::core.hash'] = $hash;
        }

        Parameter::set($params);
    }

    //
    // Plugins
    //

    /**
     * Looks up a plugin from the update server.
     * @param string $name Plugin name.
     * @return array Details about the plugin.
     */
    public function requestPluginDetails($name)
    {
        return $this->requestServerData('plugin/detail', ['name' => $name]);
    }

    /**
     * Looks up content for a plugin from the update server.
     * @param string $name Plugin name.
     * @return array Content for the plugin.
     */
    public function requestPluginContent($name)
    {
        return $this->requestServerData('plugin/content', ['name' => $name]);
    }

    /**
     * Runs update on a single plugin
     * @param string $name Plugin name.
     * @return self
     */
    public function updatePlugin($name)
    {
        /*
         * Update the plugin database and version
         */
        if (!($plugin = $this->pluginManager->findByIdentifier($name))) {
            $this->note('<error>Unable to find:</error> ' . $name);
            return;
        }

        $this->note($name);

        $this->versionManager->resetNotes()->setNotesOutput($this->notesOutput);

        if ($this->versionManager->updatePlugin($plugin) !== false) {

            foreach ($this->versionManager->getNotes() as $note) {
                $this->note($note);
            }
        }

        return $this;
    }

    /**
     * Removes an existing plugin
     * @param string $name Plugin name.
     * @return self
     */
    public function rollbackPlugin($name)
    {
        /*
         * Remove the plugin database and version
         */
        if (!($plugin = $this->pluginManager->findByIdentifier($name))) {
            if ($this->versionManager->purgePlugin($name)) {
                $this->note('<info>Purged from database:</info> ' . $name);
                return $this;
            }
        }

        if ($this->versionManager->removePlugin($plugin)) {
            $this->note('<info>Rolled back:</info> ' . $name);
            return $this;
        }

        $this->note('<error>Unable to find:</error> ' . $name);

        return $this;
    }

    /**
     * Downloads a plugin from the update server.
     * @param string $name Plugin name.
     * @param string $hash Expected file hash.
     * @return self
     */
    public function downloadPlugin($name, $hash)
    {
        $fileCode = $name . $hash;
        $this->requestServerFile('plugin/get', $fileCode, $hash, ['name' => $name]);
    }

    /**
     * Extracts a plugin after it has been downloaded.
     */
    public function extractPlugin($name, $hash)
    {
        $fileCode = $name . $hash;
        $filePath = $this->getFilePath($fileCode);

        if (!Zip::extract($filePath, $this->baseDirectory . '/plugins/')) {
            throw new ApplicationException(Lang::get('system::lang.zip.extract_failed', ['file' => $filePath]));
        }

        @unlink($filePath);
    }

    //
    // Themes
    //

    /**
     * Looks up a theme from the update server.
     * @param string $name Theme name.
     * @return array Details about the theme.
     */
    public function requestThemeDetails($name)
    {
        return $this->requestServerData('theme/detail', ['name' => $name]);
    }

    /**
     * Downloads a theme from the update server.
     * @param string $name Theme name.
     * @param string $hash Expected file hash.
     * @return self
     */
    public function downloadTheme($name, $hash)
    {
        $fileCode = $name . $hash;

        $this->requestServerFile('theme/get', $fileCode, $hash, ['name' => $name]);
    }

    /**
     * Extracts a theme after it has been downloaded.
     */
    public function extractTheme($name, $hash)
    {
        $fileCode = $name . $hash;
        $filePath = $this->getFilePath($fileCode);

        if (!Zip::extract($filePath, $this->baseDirectory . '/themes/')) {
            throw new ApplicationException(Lang::get('system::lang.zip.extract_failed', ['file' => $filePath]));
        }

        if ($this->themeManager) {
            $this->themeManager->setInstalled($name);
        }

        @unlink($filePath);
    }

    //
    // Products
    //

    public function requestProductDetails($codes, $type = null)
    {
        if ($type != 'plugin' && $type != 'theme') {
            $type = 'plugin';
        }

        $codes = (array) $codes;
        $this->loadProductDetailCache();

        /*
         * New products requested
         */
        $newCodes = array_diff($codes, array_keys($this->productCache[$type]));
        if (count($newCodes)) {
            $dataCodes = [];
            $data = $this->requestServerData($type.'/details', ['names' => $newCodes]);
            foreach ($data as $product) {
                $code = array_get($product, 'code', -1);
                $this->cacheProductDetail($type, $code, $product);
                $dataCodes[] = $code;
            }

            /*
             * Cache unknown products
             */
            $unknownCodes = array_diff($newCodes, $dataCodes);
            foreach ($unknownCodes as $code) {
                $this->cacheProductDetail($type, $code, -1);
            }

            $this->saveProductDetailCache();
        }

        /*
         * Build details from cache
         */
        $result = [];
        $requestedDetails = array_intersect_key($this->productCache[$type], array_flip($codes));

        foreach ($requestedDetails as $detail) {
            if ($detail === -1) continue;
            $result[] = $detail;
        }

        return $result;
    }

    /**
     * Returns popular themes found on the marketplace.
     */
    public function requestPopularProducts($type = null)
    {
        if ($type != 'plugin' && $type != 'theme') {
            $type = 'plugin';
        }

        $cacheKey = 'system-updates-popular-'.$type;

        if (Cache::has($cacheKey)) {
            return @unserialize(@base64_decode(Cache::get($cacheKey))) ?: [];
        }

        $data = $this->requestServerData($type.'/popular');
        Cache::put($cacheKey, base64_encode(serialize($data)), 60);

        foreach ($data as $product) {
            $code = array_get($product, 'code', -1);
            $this->cacheProductDetail($type, $code, $product);
        }

        $this->saveProductDetailCache();

        return $data;
    }

    protected function loadProductDetailCache()
    {
        $defaultCache = ['theme' => [], 'plugin' => []];
        $cacheKey = 'system-updates-product-details';

        if (Cache::has($cacheKey)) {
            $this->productCache = @unserialize(@base64_decode(Cache::get($cacheKey))) ?: $defaultCache;
        }
        else {
            $this->productCache = $defaultCache;
        }
    }

    protected function saveProductDetailCache()
    {
        if ($this->productCache === null) {
            $this->loadProductDetailCache();
        }

        $cacheKey = 'system-updates-product-details';
        $expiresAt = Carbon::now()->addDays(2);
        Cache::put($cacheKey, base64_encode(serialize($this->productCache)), $expiresAt);
    }

    protected function cacheProductDetail($type, $code, $data)
    {
        if ($this->productCache === null) {
            $this->loadProductDetailCache();
        }

        $this->productCache[$type][$code] = $data;
    }

    //
    // Notes
    //

    /**
     * Raise a note event for the migrator.
     * @param  string  $message
     * @return self
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

    //
    // Gateway access
    //

    /**
     * Contacts the update server for a response.
     * @param  string $uri      Gateway API URI
     * @param  array  $postData Extra post data
     * @return array
     */
    public function requestServerData($uri, $postData = [])
    {
        $result = Http::post($this->createServerUrl($uri), function ($http) use ($postData) {
            $this->applyHttpAttributes($http, $postData);
        });

        if ($result->code == 404) {
            throw new ApplicationException(Lang::get('system::lang.server.response_not_found'));
        }

        if ($result->code != 200) {
            throw new ApplicationException(
                strlen($result->body)
                ? $result->body
                : Lang::get('system::lang.server.response_empty')
            );
        }

        $resultData = false;

        try {
            $resultData = @json_decode($result->body, true);
        }
        catch (Exception $ex) {
            throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
        }

        if ($resultData === false || (is_string($resultData) && !strlen($resultData))) {
            throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
        }

        return $resultData;
    }

    /**
     * Downloads a file from the update server.
     * @param  string $uri          Gateway API URI
     * @param  string $fileCode     A unique code for saving the file.
     * @param  string $expectedHash The expected file hash of the file.
     * @param  array  $postData     Extra post data
     * @return void
     */
    public function requestServerFile($uri, $fileCode, $expectedHash, $postData = [])
    {
        $filePath = $this->getFilePath($fileCode);

        $result = Http::post($this->createServerUrl($uri), function ($http) use ($postData, $filePath) {
            $this->applyHttpAttributes($http, $postData);
            $http->toFile($filePath);
        });

        if ($result->code != 200) {
            throw new ApplicationException(File::get($filePath));
        }

        if (md5_file($filePath) != $expectedHash) {
            @unlink($filePath);
            throw new ApplicationException(Lang::get('system::lang.server.file_corrupt'));
        }
    }

    /**
     * Calculates a file path for a file code
     * @param  string $fileCode A unique file code
     * @return string           Full path on the disk
     */
    protected function getFilePath($fileCode)
    {
        $name = md5($fileCode) . '.arc';
        return $this->tempDirectory . '/' . $name;
    }

    /**
     * Set the API security for all transmissions.
     * @param string $key    API Key
     * @param string $secret API Secret
     */
    public function setSecurity($key, $secret)
    {
        $this->key = $key;
        $this->secret = $secret;
    }

    /**
     * Create a complete gateway server URL from supplied URI
     * @param  string $uri URI
     * @return string      URL
     */
    protected function createServerUrl($uri)
    {
        $gateway = Config::get('cms.updateServer', 'http://gateway.octobercms.com/api');
        if (substr($gateway, -1) != '/') {
            $gateway .= '/';
        }

        return $gateway . $uri;
    }

    /**
     * Modifies the Network HTTP object with common attributes.
     * @param  Http $http      Network object
     * @param  array $postData Post data
     * @return void
     */
    protected function applyHttpAttributes($http, $postData)
    {
        $postData['server'] = base64_encode(serialize(['php' => PHP_VERSION, 'url' => Url::to('/')]));

        if ($projectId = Parameter::get('system::project.id')) {
            $postData['project'] = $projectId;
        }

        if (Config::get('cms.edgeUpdates', false)) {
            $postData['edge'] = 1;
        }

        if ($this->key && $this->secret) {
            $postData['nonce'] = $this->createNonce();
            $http->header('Rest-Key', $this->key);
            $http->header('Rest-Sign', $this->createSignature($postData, $this->secret));
        }

        if ($credentials = Config::get('cms.updateAuth')) {
            $http->auth($credentials);
        }

        $http->noRedirect();
        $http->data($postData);
    }

    /**
     * Create a nonce based on millisecond time
     * @return int
     */
    protected function createNonce()
    {
        $mt = explode(' ', microtime());
        return $mt[1] . substr($mt[0], 2, 6);
    }

    /**
     * Create a unique signature for transmission.
     * @return string
     */
    protected function createSignature($data, $secret)
    {
        return base64_encode(hash_hmac('sha512', http_build_query($data, '', '&'), base64_decode($secret), true));
    }

    //
    // Internals
    //

    protected function getMigrationTableName()
    {
        return Config::get('database.migrations', 'migrations');
    }
}
