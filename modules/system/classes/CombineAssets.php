<?php namespace System\Classes;

use App;
use Url;
use File;
use Site;
use Event;
use Cache;
use Route;
use Config;
use Request;
use Response;
use System\Helpers\Cache as CacheHelper;
use ApplicationException;
use DateTime;

/**
 * CombineAssets is used for combining JavaScript and StyleSheet files
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
 * - cms.enable_asset_cache - Cache untouched assets
 * - cms.enable_asset_minify - Compress assets using minification
 * - cms.enable_asset_deep_hashing - Advanced caching of imports
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class CombineAssets
{
    /**
     * @var array jsExtensions is a list of known JavaScript extensions.
     */
    protected static $jsExtensions = ['js'];

    /**
     * @var array cssExtensions is a list of known StyleSheet extensions.
     */
    protected static $cssExtensions = ['css', 'less', 'scss', 'sass'];

    /**
     * @var array aliases for asset file paths.
     */
    protected $aliases = [];

    /**
     * @var array bundles that are compiled to the filesystem.
     */
    protected $bundles = [];

    /**
     * @var string localPath context to find assets.
     */
    protected $localPath;

    /**
     * @var bool useCache to cache untouched files.
     */
    public $useCache = false;

    /**
     * @var bool useMinify compress (minify) asset files.
     */
    public $useMinify = false;

    /**
     * @var bool useDeepHashing when true, cache will be busted when an import is modified.
     * Enabling this feature will make page loading slower.
     */
    public $useDeepHashing = false;

    /**
     * __construct this class
     */
    public function __construct()
    {
        // Default config
        $this->useCache = Config::get('cms.enable_asset_cache', false);
        $this->useMinify = Config::get('cms.enable_asset_minify', false);
        $this->useDeepHashing = Config::get('cms.enable_asset_deep_hashing', null);

        if ($this->useDeepHashing === null) {
            $this->useDeepHashing = Config::get('app.debug', false);
        }

        // jQuery Framework
        $this->registerAlias('jquery', '~/modules/system/assets/js/vendor/jquery.min.js');

        // AJAX Framework
        $this->registerAlias('framework', '~/modules/system/assets/js/framework.min.js');

        // AJAX Framework (Extras)
        $this->registerAlias('framework.extras', '~/modules/system/assets/js/framework-bundle.min.js');
        $this->registerAlias('framework.extras.js', '~/modules/system/assets/js/framework-bundle.min.js');
        $this->registerAlias('framework.extras', '~/modules/system/assets/css/framework-extras.css');
        $this->registerAlias('framework.extras.css', '~/modules/system/assets/css/framework-extras.css');

        // @deprecated from v3
        $this->registerAlias('framework.bundle', '~/modules/system/assets/js/framework-bundle.min.js');
        $this->registerAlias('framework.bundle.js', '~/modules/system/assets/js/framework-bundle.min.js');
        $this->registerAlias('framework.bundle', '~/modules/system/assets/css/framework-extras.css');
        $this->registerAlias('framework.bundle.css', '~/modules/system/assets/css/framework-extras.css');
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.combiner');
    }

    /**
     * registerCallback registers a callback function that defines bundles.
     * The callback function should register bundles by calling the manager's
     * `registerBundle` method. This instance is passed to the callback
     * function as an argument. Usage:
     *
     *     CombineAssets::registerCallback(function ($combiner) {
     *         $combiner->registerBundle('~/modules/backend/assets/less/october.less');
     *     });
     *
     * @deprecated this will be removed in a later version
     * @param callable $callback A callable function.
     */
    public static function registerCallback(callable $callback)
    {
        App::extendInstance('system.combiner', $callback);
    }

    /**
     * getAssetic
     */
    protected function getAssetic()
    {
        return App::make('assetic');
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
     * @param string $pathPrefix Prefix all assets with this path (optional)
     * @return string URL to contents.
     */
    public static function combine($assets = [], $basePath = null)
    {
        return self::instance()->prepareRequest($assets, $basePath);
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
     * @param string $pathPrefix Prefix all assets with this path (optional)
     * @return void
     */
    public function combineToFile($assets, $destination, $basePath = null)
    {
        // Prefix all assets with base path
        if ($basePath) {
            if (substr($basePath, -1) !== '/') {
                $basePath = $basePath.'/';
            }
            $assets = array_map(function ($asset) use ($basePath) {
                if (substr($asset, 0, 1) === '@') {
                    return $asset;
                }
                return $basePath.$asset;
            }, $assets);
        }

        [$assets, $extension] = $this->prepareAssets($assets);

        $rewritePath = File::localToPublic(dirname($destination));

        $combiner = $this->prepareCombiner($assets, $rewritePath, ['useCache' => false]);

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
            throw new ApplicationException(__("The combiner file ':name' is not found.", ['name' => e($cacheKey)]));
        }

        // Ensure defaults
        $cacheInfo += [
            'version' => null,
            'etag' => null,
            'lastMod' => null,
            'files' => null,
            'path' => null,
            'extension' => null,
            'site' => null,
            'theme' => null,
        ];

        $this->setActiveSiteContext($cacheInfo['site'], $cacheInfo['theme']);
        $this->setLocalPath($cacheInfo['path']);

        // Analyze cache information
        $lastModifiedTime = gmdate("D, d M Y H:i:s \G\M\T", $cacheInfo['lastMod']);
        $mimeType = $cacheInfo['extension'] === 'css'
            ? 'text/css'
            : 'application/javascript';

        // Set 304 Not Modified header, if necessary
        $response = Response::make();
        $response->header('Content-Type', $mimeType);
        $response->header('Cache-Control', 'private, max-age=15768000');
        $response->setLastModified(new DateTime($lastModifiedTime));
        $response->setEtag($cacheInfo['etag']);
        $response->setPublic();
        $modified = !$response->isNotModified(App::make('request'));

        // Request says response is cached, no code evaluation needed
        if ($modified) {
            $combiner = $this->prepareCombiner($cacheInfo['files'], null, ['deepHashKey' => $cacheKey]);
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

        // Split assets in to groups.
        $combineJs = [];
        $combineCss = [];

        foreach ($assets as $asset) {
            // Allow aliases to go through without an extension
            if (substr($asset, 0, 1) === '@') {
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

        // Determine which group of assets to combine.
        if (count($combineCss) > count($combineJs)) {
            $extension = 'css';
            $assets = $combineCss;
        }
        else {
            $extension = 'js';
            $assets = $combineJs;
        }

        // Apply registered aliases
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
     * prepareRequest combines asset file references of a single type to produce
     * a URL reference to the combined contents.
     * @param array $assets List of asset files.
     * @param string $basePath
     * @return string
     */
    protected function prepareRequest(array $assets, $basePath = null)
    {
        if ($basePath !== null && substr($basePath, -1) !== '/') {
            $basePath = $basePath.'/';
        }

        $this->setLocalPath($basePath);

        [$assets, $extension] = $this->prepareAssets($assets);

        // Cache and process
        $cacheKey = $this->getCacheKey($assets);
        $cacheInfo = $this->useCache ? $this->getCache($cacheKey) : false;

        if (!$cacheInfo) {
            $combiner = $this->prepareCombiner($assets, null, ['deepHashKey' => $cacheKey]);
            $lastMod = $this->useDeepHashing
                ? $this->getAssetic()->getDeepHashLastModified($combiner)
                : $combiner->getLastModified();

            $cacheInfo = [
                'version' => $cacheKey.'-'.$lastMod,
                'etag' => $cacheKey,
                'lastMod' => $lastMod,
                'files' => $assets,
                'path' => $basePath,
                'extension' => $extension,
                'site' => Site::getSiteIdFromContext(),
                'theme' => Config::get('cms.active_theme'),
            ];

            $this->putCache($cacheKey, $cacheInfo);
        }

        return $this->getCombinedUrl($cacheInfo['version']);
    }

    /**
     * prepareCombiner returns the combined contents from a prepared cache identifier.
     * @param array $assets List of asset files.
     * @param string $rewritePath
     * @return \October\Rain\Assetic\Asset\AssetInterface
     */
    protected function prepareCombiner(array $assets, $rewritePath = null, $options = [])
    {
        /**
         * @event cms.combiner.beforePrepare
         * Provides an opportunity to interact with the asset combiner before assets are combined.
         *
         * Example usage:
         *
         *     Event::listen('cms.combiner.beforePrepare', function ((\System\Classes\CombineAssets) $assetCombiner, (array) $assets) {
         *         $assetCombiner->registerFilter(...)
         *     });
         *
         */
        Event::fire('cms.combiner.beforePrepare', [$this, $assets]);

        return $this->getAssetic()->prepareCombiner($assets, [
            'targetPath' => $this->getTargetPath($rewritePath),
            'production' => $this->useMinify
        ] + $options);
    }

    /**
     * Returns the URL used for accessing the combined files.
     * @param string $outputFilename A custom file name to use.
     * @return string
     */
    protected function getCombinedUrl($outputFilename = 'undefined.css')
    {
        $combineAction = \System\Classes\SystemController::class.'@combine';
        $actionExists = Route::getRoutes()->getByAction($combineAction) !== null;

        if ($actionExists) {
            $result = Url::action($combineAction, [$outputFilename], false);
        }
        else {
            $result = '/combine/'.$outputFilename;
        }

        return Url::toRelative($result);
    }

    /**
     * setActiveSiteContext sets the theme and site, if provided
     */
    protected function setActiveSiteContext($siteId = null, $theme = null)
    {
        if ($siteId && Site::hasFeature('system_asset_combiner')) {
            Site::applyActiveSiteId($siteId);
        }

        if ($theme) {
            Config::set('cms.active_theme', $theme);
        }
    }

    /**
     * setLocalPath
     */
    protected function setLocalPath($path = null)
    {
        $this->localPath = $path;
        $this->getAssetic()->setLocalPath($path);
    }

    /**
     * getTargetPath returns the target path for use with the combiner. The target
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
    // Filters
    //

    /**
     * registerFilter to apply to the combining process.
     * @param string|array $extension Extension name. Eg: css
     * @param object $filter Collection of files to combine.
     * @return self
     */
    public function registerFilter($extension, $filter, $isProduction = false)
    {
        $this->getAssetic()->registerFilter($extension, $filter, $isProduction);
        return $this;
    }

    /**
     * resetFilters clears any registered filters.
     * @param string $extension Extension name. Eg: css
     * @return self
     */
    public function resetFilters($extension = null)
    {
        $this->getAssetic()->resetFilters($extension);
        return $this;
    }

    /**
     * getFilters returns all defined filters for a given extension
     */
    public function getFilters(?string $extension = null, $isProduction = false): array
    {
        return $this->getAssetic()->getFilters($extension, $isProduction);
    }

    //
    // Bundles
    //

    /**
     * registerBundle
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
     * getBundles returns bundles.
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
     * registerAlias to use for a longer file reference.
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
     * resetAliases clears any registered aliases.
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
     * getAliases returns aliases.
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
     * putCache stores information about a asset collection against
     * a cache identifier.
     * @param string $cacheKey Cache identifier.
     * @param array $cacheInfo List of asset files.
     * @return bool Successful
     */
    protected function putCache($cacheKey, array $cacheInfo)
    {
        $cacheKey = 'combiner.'.$cacheKey;

        if (Cache::memo()->has($cacheKey)) {
            return false;
        }

        $this->putCacheIndex($cacheKey);

        Cache::forever($cacheKey, base64_encode(serialize($cacheInfo)));

        return true;
    }

    /**
     * getCache looks up information about a cache identifier.
     * @param string $cacheKey Cache identifier
     * @return array Cache information
     */
    protected function getCache($cacheKey)
    {
        $cacheKey = 'combiner.'.$cacheKey;

        if ($cache = Cache::memo()->get($cacheKey)) {
            return @unserialize(@base64_decode($cache));
        }

        return false;
    }

    /**
     * getCacheKey builds a unique string based on assets
     * @param array $assets Asset files
     * @return string Unique identifier
     */
    protected function getCacheKey(array $assets)
    {
        $cacheKey = $this->localPath . implode('|', $assets);

        // Deep hashing
        if ($this->useDeepHashing) {
            $cacheKey .= $this->getAssetic()->getDeepHashFromAssets($assets);
        }

        if (Site::hasFeature('system_asset_combiner')) {
            $cacheKey .= Site::getSiteIdFromContext();
        }

        /**
         * @event cms.combiner.getCacheKey
         * Provides an opportunity to modify the asset combiner's cache key
         *
         * Example usage:
         *
         *     Event::listen('cms.combiner.getCacheKey', function ((\System\Classes\CombineAssets) $assetCombiner, &$cacheKey) {
         *         $cacheKey = rand();
         *     });
         *
         */
        Event::fire('cms.combiner.getCacheKey', [$this, &$cacheKey]);

        return md5($cacheKey);
    }

    /**
     * resetCache resets the combiner cache
     */
    public static function resetCache()
    {
        if ($cache = Cache::get('combiner.index')) {
            $index = (array) @unserialize(@base64_decode($cache)) ?: [];

            foreach ($index as $cacheKey) {
                Cache::forget($cacheKey);
            }

            Cache::forget('combiner.index');
        }

        CacheHelper::instance()->clearCombiner();
    }

    /**
     * putCacheIndex adds a cache identifier to the index store used for
     * performing a reset of the cache. Returns false if identifier is already in store
     * @param string $cacheKey Cache identifier
     */
    protected function putCacheIndex($cacheKey): bool
    {
        $index = [];

        if ($cache = Cache::memo()->get('combiner.index')) {
            $index = (array) @unserialize(@base64_decode($cache)) ?: [];
        }

        if (in_array($cacheKey, $index)) {
            return false;
        }

        $index[] = $cacheKey;

        Cache::forever('combiner.index', base64_encode(serialize($index)));

        return true;
    }
}
