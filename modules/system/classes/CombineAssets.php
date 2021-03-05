<?php namespace System\Classes;

use App;
use Url;
use File;
use Lang;
use Event;
use Cache;
use Route;
use Config;
use Request;
use Response;
use October\Rain\Assetic\Asset\FileAsset;
use October\Rain\Assetic\Asset\AssetCache;
use October\Rain\Assetic\Asset\AssetCollection;
use October\Rain\Assetic\Cache\FilesystemCache;
use October\Rain\Assetic\Factory\AssetFactory;
use System\Helpers\Cache as CacheHelper;
use ApplicationException;
use DateTime;

/**
 * Combiner class used for combining JavaScript and StyleSheet files.
 *
 * This works by taking a collection of asset locations, serializing them,
 * then storing them in the session with a unique ID. The ID is then used
 * to generate a URL to the `/combine` route via the system controller.
 *
 * When the combine route is hit, the unique ID is used to serve up the
 * assets -- minified, compiled or both. Special E-Tags are used to prevent
 * compilation and delivery of cached assets that are unchanged.
 *
 * Use the `CombineAssets::combine` method to combine your own assets.
 *
 * The functionality of this class is controlled by these config items:
 *
 * - cms.enableAssetCache - Cache untouched assets
 * - cms.enableAssetMinify - Compress assets using minification
 * - cms.enableAssetDeepHashing - Advanced caching of imports
 *
 * @see System\Classes\SystemController System controller
 * @see https://octobercms.com/docs/services/session Session service
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class CombineAssets
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * @var array A list of known JavaScript extensions.
     */
    protected static $jsExtensions = ['js'];

    /**
     * @var array A list of known StyleSheet extensions.
     */
    protected static $cssExtensions = ['css', 'less', 'scss', 'sass'];

    /**
     * @var array Aliases for asset file paths.
     */
    protected $aliases = [];

    /**
     * @var array Bundles that are compiled to the filesystem.
     */
    protected $bundles = [];

    /**
     * @var array Filters to apply to each file.
     */
    protected $filters = [];

    /**
     * @var string The local path context to find assets.
     */
    protected $localPath;

    /**
     * @var string The output folder for storing combined files.
     */
    protected $storagePath;

    /**
     * @var bool Cache untouched files.
     */
    public $useCache = false;

    /**
     * @var bool Compress (minify) asset files.
     */
    public $useMinify = false;

    /**
     * @var bool When true, cache will be busted when an import is modified.
     * Enabling this feature will make page loading slower.
     */
    public $useDeepHashing = false;

    /**
     * @var array Cache of registration callbacks.
     */
    private static $callbacks = [];

    /**
     * Constructor
     */
    public function init()
    {
        /*
         * Register preferences
         */
        $this->useCache = Config::get('cms.enableAssetCache', false);
        $this->useMinify = Config::get('cms.enableAssetMinify', null);
        $this->useDeepHashing = Config::get('cms.enableAssetDeepHashing', null);

        if ($this->useMinify === null) {
            $this->useMinify = !Config::get('app.debug', false);
        }

        if ($this->useDeepHashing === null) {
            $this->useDeepHashing = Config::get('app.debug', false);
        }

        /*
         * Register JavaScript filters
         */
        $this->registerFilter('js', new \October\Rain\Assetic\Filter\JavascriptImporter);

        /*
         * Register CSS filters
         */
        $this->registerFilter('css', new \October\Rain\Assetic\Filter\CssImportFilter);
        $this->registerFilter(['css', 'less', 'scss'], new \October\Rain\Assetic\Filter\CssRewriteFilter);
        $this->registerFilter('less', new \October\Rain\Assetic\Filter\LessCompiler);
        $this->registerFilter('scss', new \October\Rain\Assetic\Filter\ScssCompiler);

        /*
         * Minification filters
         */
        if ($this->useMinify) {
            $this->registerFilter('js', new \October\Rain\Assetic\Filter\JSMinFilter);
            $this->registerFilter(['css', 'less', 'scss'], new \October\Rain\Assetic\Filter\StylesheetMinify);
        }

        /*
         * Common Aliases
         */
        $this->registerAlias('jquery', '~/modules/backend/assets/js/vendor/jquery-and-migrate.min.js');
        $this->registerAlias('framework', '~/modules/system/assets/js/framework.js');
        $this->registerAlias('framework.extras', '~/modules/system/assets/js/framework.extras.js');
        $this->registerAlias('framework.extras.js', '~/modules/system/assets/js/framework.extras.js');
        $this->registerAlias('framework.extras', '~/modules/system/assets/css/framework.extras.css');
        $this->registerAlias('framework.extras.css', '~/modules/system/assets/css/framework.extras.css');

        /*
         * Deferred registration
         */
        foreach (static::$callbacks as $callback) {
            $callback($this);
        }
    }

    /**
     * Combines JavaScript or StyleSheet file references
     * to produce a page relative URL to the combined contents.
     *
     *     $assets = [
     *         'assets/vendor/mustache/mustache.js',
     *         'assets/js/vendor/jquery.ui.widget.js',
     *         'assets/js/vendor/canvas-to-blob.js',
     *     ];
     *
     *     CombineAssets::combine($assets, base_path('plugins/acme/blog'));
     *
     * @param array $assets Collection of assets
     * @param string $localPath Prefix all assets with this path (optional)
     * @return string URL to contents.
     */
    public static function combine($assets = [], $localPath = null)
    {
        return self::instance()->prepareRequest($assets, $localPath);
    }

    /**
     * Combines a collection of assets files to a destination file
     *
     *     $assets = [
     *         'assets/less/header.less',
     *         'assets/less/footer.less',
     *     ];
     *
     *     CombineAssets::combineToFile(
     *         $assets,
     *         base_path('themes/website/assets/theme.less'),
     *         base_path('themes/website')
     *     );
     *
     * @param array $assets Collection of assets
     * @param string $destination Write the combined file to this location
     * @param string $localPath Prefix all assets with this path (optional)
     * @return void
     */
    public function combineToFile($assets, $destination, $localPath = null)
    {
        // Disable cache always
        $this->storagePath = null;

        // Prefix all assets
        if ($localPath) {
            if (substr($localPath, -1) !== '/') {
                $localPath = $localPath.'/';
            }
            $assets = array_map(function ($asset) use ($localPath) {
                if (substr($asset, 0, 1) === '@') {
                    return $asset;
                }
                return $localPath.$asset;
            }, $assets);
        }

        list($assets, $extension) = $this->prepareAssets($assets);

        $rewritePath = File::localToPublic(dirname($destination));

        $combiner = $this->prepareCombiner($assets, $rewritePath);

        $contents = $combiner->dump();

        File::put($destination, $contents);
    }

    /**
     * Returns the combined contents from a prepared cache identifier.
     * @param string $cacheKey Cache identifier.
     * @return string Combined file contents.
     */
    public function getContents($cacheKey)
    {
        $cacheInfo = $this->getCache($cacheKey);
        if (!$cacheInfo) {
            throw new ApplicationException(Lang::get('system::lang.combiner.not_found', ['name'=>$cacheKey]));
        }

        $this->localPath = $cacheInfo['path'];
        $this->storagePath = storage_path('cms/combiner/assets');

        /*
         * Analyse cache information
         */
        $lastModifiedTime = gmdate("D, d M Y H:i:s \G\M\T", array_get($cacheInfo, 'lastMod'));
        $etag = array_get($cacheInfo, 'etag');
        $mime = (array_get($cacheInfo, 'extension') == 'css')
            ? 'text/css'
            : 'application/javascript';

        /*
         * Set 304 Not Modified header, if necessary
         */
        $response = Response::make();
        $response->header('Content-Type', $mime);
        $response->header('Cache-Control', 'private, max-age=604800');
        $response->setLastModified(new DateTime($lastModifiedTime));
        $response->setEtag($etag);
        $response->setPublic();
        $modified = !$response->isNotModified(App::make('request'));

        /*
         * Request says response is cached, no code evaluation needed
         */
        if ($modified) {
            $this->setHashOnCombinerFilters($cacheKey);
            $combiner = $this->prepareCombiner($cacheInfo['files']);
            $contents = $combiner->dump();
            $response->setContent($contents);
        }

        return $response;
    }

    /**
     * Prepares an array of assets by normalizing the collection
     * and processing aliases.
     * @param array $assets
     * @return array
     */
    protected function prepareAssets(array $assets)
    {
        if (!is_array($assets)) {
            $assets = [$assets];
        }

        /*
         * Split assets in to groups.
         */
        $combineJs = [];
        $combineCss = [];

        foreach ($assets as $asset) {
            /*
             * Allow aliases to go through without an extension
             */
            if (substr($asset, 0, 1) == '@') {
                $combineJs[] = $asset;
                $combineCss[] = $asset;
                continue;
            }

            $extension = File::extension($asset);

            if (in_array($extension, self::$jsExtensions)) {
                $combineJs[] = $asset;
                continue;
            }

            if (in_array($extension, self::$cssExtensions)) {
                $combineCss[] = $asset;
                continue;
            }
        }

        /*
         * Determine which group of assets to combine.
         */
        if (count($combineCss) > count($combineJs)) {
            $extension = 'css';
            $assets = $combineCss;
        }
        else {
            $extension = 'js';
            $assets = $combineJs;
        }

        /*
         * Apply registered aliases
         */
        if ($aliasMap = $this->getAliases($extension)) {
            foreach ($assets as $key => $asset) {
                if (substr($asset, 0, 1) !== '@') {
                    continue;
                }
                $_asset = substr($asset, 1);

                if (isset($aliasMap[$_asset])) {
                    $assets[$key] = $aliasMap[$_asset];
                }
            }
        }

        return [$assets, $extension];
    }

    /**
     * Combines asset file references of a single type to produce
     * a URL reference to the combined contents.
     * @param array $assets List of asset files.
     * @param string $localPath File extension, used for aesthetic purposes only.
     * @return string URL to contents.
     */
    protected function prepareRequest(array $assets, $localPath = null)
    {
        if (substr($localPath, -1) != '/') {
            $localPath = $localPath.'/';
        }

        $this->localPath = $localPath;
        $this->storagePath = storage_path('cms/combiner/assets');

        list($assets, $extension) = $this->prepareAssets($assets);

        /*
         * Cache and process
         */
        $cacheKey = $this->getCacheKey($assets);
        $cacheInfo = $this->useCache ? $this->getCache($cacheKey) : false;

        if (!$cacheInfo) {
            $this->setHashOnCombinerFilters($cacheKey);

            $combiner = $this->prepareCombiner($assets);

            if ($this->useDeepHashing) {
                $factory = new AssetFactory($this->localPath);
                $lastMod = $factory->getLastModified($combiner);
            }
            else {
                $lastMod = $combiner->getLastModified();
            }

            $cacheInfo = [
                'version'   => $cacheKey.'-'.$lastMod,
                'etag'      => $cacheKey,
                'lastMod'   => $lastMod,
                'files'     => $assets,
                'path'      => $this->localPath,
                'extension' => $extension
            ];

            $this->putCache($cacheKey, $cacheInfo);
        }

        return $this->getCombinedUrl($cacheInfo['version']);
    }

    /**
     * Returns the combined contents from a prepared cache identifier.
     * @param array $assets List of asset files.
     * @param string $rewritePath
     * @return string Combined file contents.
     */
    protected function prepareCombiner(array $assets, $rewritePath = null)
    {
        /**
         * @event cms.combiner.beforePrepare
         * Provides an opportunity to interact with the asset combiner before assets are combined.
         * >**NOTE**: Plugin's must be elevated (`$elevated = true` on Plugin.php) to be run on the /combine route and thus listen to this event
         *
         * Example usage:
         *
         *     Event::listen('cms.combiner.beforePrepare', function ((\System\Classes\CombineAssets) $assetCombiner, (array) $assets) {
         *         $assetCombiner->registerFilter(...)
         *     });
         *
         */
        Event::fire('cms.combiner.beforePrepare', [$this, $assets]);

        $files = [];
        $filesSalt = null;
        foreach ($assets as $asset) {
            $filters = $this->getFilters(File::extension($asset)) ?: [];
            $path = file_exists($asset) ? $asset : (File::symbolizePath($asset, null) ?: $this->localPath . $asset);
            $files[] = new FileAsset($path, $filters, public_path());
            $filesSalt .= $this->localPath . $asset;
        }
        $filesSalt = md5($filesSalt);

        $collection = new AssetCollection($files, [], $filesSalt);
        $collection->setTargetPath($this->getTargetPath($rewritePath));

        if ($this->storagePath === null) {
            return $collection;
        }

        if (!File::isDirectory($this->storagePath)) {
            @File::makeDirectory($this->storagePath);
        }

        $cache = new FilesystemCache($this->storagePath);

        $cachedFiles = [];
        foreach ($files as $file) {
            $cachedFiles[] = new AssetCache($file, $cache);
        }

        $cachedCollection = new AssetCollection($cachedFiles, [], $filesSalt);
        $cachedCollection->setTargetPath($this->getTargetPath($rewritePath));
        return $cachedCollection;
    }

    /**
     * Busts the cache based on a different cache key.
     * @return void
     */
    protected function setHashOnCombinerFilters($hash)
    {
        $allFilters = array_merge(...array_values($this->getFilters()));

        foreach ($allFilters as $filter) {
            if (method_exists($filter, 'setHash')) {
                $filter->setHash($hash);
            }
        }
    }

    /**
     * Returns a deep hash on filters that support it.
     * @param array $assets List of asset files.
     * @return void
     */
    protected function getDeepHashFromAssets($assets)
    {
        $key = '';

        $assetFiles = array_map(function ($file) {
            return file_exists($file) ? $file : (File::symbolizePath($file, null) ?: $this->localPath . $file);
        }, $assets);

        foreach ($assetFiles as $file) {
            $filters = $this->getFilters(File::extension($file));

            foreach ($filters as $filter) {
                if (method_exists($filter, 'hashAsset')) {
                    $key .= $filter->hashAsset($file, $this->localPath);
                }
            }
        }

        return $key;
    }

    /**
     * Returns the URL used for accessing the combined files.
     * @param string $outputFilename A custom file name to use.
     * @return string
     */
    protected function getCombinedUrl($outputFilename = 'undefined.css')
    {
        $combineAction = 'System\Classes\Controller@combine';
        $actionExists = Route::getRoutes()->getByAction($combineAction) !== null;

        if ($actionExists) {
            return Url::action($combineAction, [$outputFilename], false);
        }

        return '/combine/'.$outputFilename;
    }

    /**
     * Returns the target path for use with the combiner. The target
     * path helps generate relative links within CSS.
     *
     * /combine              returns combine/
     * /index.php/combine    returns index-php/combine/
     *
     * @param string|null $path
     * @return string The new target path
     */
    protected function getTargetPath($path = null)
    {
        if ($path === null) {
            $baseUri = substr(Request::getBaseUrl(), strlen(Request::getBasePath()));
            $path = $baseUri.'/combine';
        }

        if (strpos($path, '/') === 0) {
            $path = substr($path, 1);
        }

        $path = str_replace('.', '-', $path).'/';
        return $path;
    }

    //
    // Registration
    //

    /**
     * Registers a callback function that defines bundles.
     * The callback function should register bundles by calling the manager's
     * `registerBundle` method. This instance is passed to the callback
     * function as an argument. Usage:
     *
     *     CombineAssets::registerCallback(function ($combiner) {
     *         $combiner->registerBundle('~/modules/backend/assets/less/october.less');
     *     });
     *
     * @param callable $callback A callable function.
     */
    public static function registerCallback(callable $callback)
    {
        self::$callbacks[] = $callback;
    }

    //
    // Filters
    //

    /**
     * Register a filter to apply to the combining process.
     * @param string|array $extension Extension name. Eg: css
     * @param object $filter Collection of files to combine.
     * @return self
     */
    public function registerFilter($extension, $filter)
    {
        if (is_array($extension)) {
            foreach ($extension as $_extension) {
                $this->registerFilter($_extension, $filter);
            }
            return;
        }

        $extension = strtolower($extension);

        if (!isset($this->filters[$extension])) {
            $this->filters[$extension] = [];
        }

        if ($filter !== null) {
            $this->filters[$extension][] = $filter;
        }

        return $this;
    }

    /**
     * Clears any registered filters.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function resetFilters($extension = null)
    {
        if ($extension === null) {
            $this->filters = [];
        }
        else {
            $this->filters[$extension] = [];
        }

        return $this;
    }

    /**
     * Returns filters.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function getFilters($extension = null)
    {
        if ($extension === null) {
            return $this->filters;
        }

        if (isset($this->filters[$extension])) {
            return $this->filters[$extension];
        }

        return null;
    }

    //
    // Bundles
    //

    /**
     * Registers bundle.
     * @param string|array $files Files to be registered to bundle
     * @param string $destination Destination file will be compiled to.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function registerBundle($files, $destination = null, $extension = null)
    {
        if (!is_array($files)) {
            $files = [$files];
        }

        $firstFile = array_values($files)[0];

        if ($extension === null) {
            $extension = File::extension($firstFile);
        }

        $extension = strtolower(trim($extension));

        if ($destination === null) {
            $file = File::name($firstFile);
            $path = dirname($firstFile);
            $preprocessors = array_diff(self::$cssExtensions, ['css']);

            if (in_array($extension, $preprocessors)) {
                $cssPath = $path.'/../css';
                if (
                    in_array(strtolower(basename($path)), $preprocessors) &&
                    File::isDirectory(File::symbolizePath($cssPath))
                ) {
                    $path = $cssPath;
                }
                $destination = $path.'/'.$file.'.css';
            }
            else {
                $destination = $path.'/'.$file.'-min.'.$extension;
            }
        }

        $this->bundles[$extension][$destination] = $files;

        return $this;
    }

    /**
     * Returns bundles.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function getBundles($extension = null)
    {
        if ($extension === null) {
            return $this->bundles;
        }

        if (isset($this->bundles[$extension])) {
            return $this->bundles[$extension];
        }

        return null;
    }

    //
    // Aliases
    //

    /**
     * Register an alias to use for a longer file reference.
     * @param string $alias Alias name. Eg: framework
     * @param string $file Path to file to use for alias
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function registerAlias($alias, $file, $extension = null)
    {
        if ($extension === null) {
            $extension = File::extension($file);
        }

        $extension = strtolower($extension);

        if (!isset($this->aliases[$extension])) {
            $this->aliases[$extension] = [];
        }

        $this->aliases[$extension][$alias] = $file;

        return $this;
    }

    /**
     * Clears any registered aliases.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function resetAliases($extension = null)
    {
        if ($extension === null) {
            $this->aliases = [];
        }
        else {
            $this->aliases[$extension] = [];
        }

        return $this;
    }

    /**
     * Returns aliases.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function getAliases($extension = null)
    {
        if ($extension === null) {
            return $this->aliases;
        }

        if (isset($this->aliases[$extension])) {
            return $this->aliases[$extension];
        }

        return null;
    }

    //
    // Cache
    //

    /**
     * Stores information about a asset collection against
     * a cache identifier.
     * @param string $cacheKey Cache identifier.
     * @param array $cacheInfo List of asset files.
     * @return bool Successful
     */
    protected function putCache($cacheKey, array $cacheInfo)
    {
        $cacheKey = 'combiner.'.$cacheKey;

        if (Cache::has($cacheKey)) {
            return false;
        }

        $this->putCacheIndex($cacheKey);

        Cache::forever($cacheKey, base64_encode(serialize($cacheInfo)));

        return true;
    }

    /**
     * Look up information about a cache identifier.
     * @param string $cacheKey Cache identifier
     * @return array Cache information
     */
    protected function getCache($cacheKey)
    {
        $cacheKey = 'combiner.'.$cacheKey;

        if (!Cache::has($cacheKey)) {
            return false;
        }

        return @unserialize(@base64_decode(Cache::get($cacheKey)));
    }

    /**
     * Builds a unique string based on assets
     * @param array $assets Asset files
     * @return string Unique identifier
     */
    protected function getCacheKey(array $assets)
    {
        $cacheKey = $this->localPath . implode('|', $assets);

        /*
         * Deep hashing
         */
        if ($this->useDeepHashing) {
            $cacheKey .= $this->getDeepHashFromAssets($assets);
        }

        $dataHolder = (object) ['key' => $cacheKey];

        /**
         * @event cms.combiner.getCacheKey
         * Provides an opportunity to modify the asset combiner's cache key
         *
         * Example usage:
         *
         *     Event::listen('cms.combiner.getCacheKey', function ((\System\Classes\CombineAssets) $assetCombiner, (stdClass) $dataHolder) {
         *         $dataHolder->key = rand();
         *     });
         *
         */
        Event::fire('cms.combiner.getCacheKey', [$this, $dataHolder]);
        $cacheKey = $dataHolder->key;

        return md5($cacheKey);
    }

    /**
     * Resets the combiner cache
     * @return void
     */
    public static function resetCache()
    {
        if (Cache::has('combiner.index')) {
            $index = (array) @unserialize(@base64_decode(Cache::get('combiner.index'))) ?: [];

            foreach ($index as $cacheKey) {
                Cache::forget($cacheKey);
            }

            Cache::forget('combiner.index');
        }

        CacheHelper::instance()->clearCombiner();
    }

    /**
     * Adds a cache identifier to the index store used for
     * performing a reset of the cache.
     * @param string $cacheKey Cache identifier
     * @return bool Returns false if identifier is already in store
     */
    protected function putCacheIndex($cacheKey)
    {
        $index = [];

        if (Cache::has('combiner.index')) {
            $index = (array) @unserialize(@base64_decode(Cache::get('combiner.index'))) ?: [];
        }

        if (in_array($cacheKey, $index)) {
            return false;
        }

        $index[] = $cacheKey;

        Cache::forever('combiner.index', base64_encode(serialize($index)));

        return true;
    }
}
