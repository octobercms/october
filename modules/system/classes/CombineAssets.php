<?php namespace System\Classes;

use App;
use URL;
use File;
use Lang;
use Cache;
use Route;
use Config;
use Request;
use Response;
use Assetic\Asset\AssetCollection;
use Assetic\Asset\FileAsset;
use Assetic\Asset\GlobAsset;
use Assetic\Asset\AssetCache;
use Assetic\Cache\FilesystemCache;
use ApplicationException;
use DateTime;

/**
 * Class used for combining JavaScript and StyleSheet
 * files.
 *
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

        if ($this->useMinify === null) {
            $this->useMinify = !Config::get('app.debug', false);
        }

        /*
         * Register JavaScript filters
         */
        $this->registerFilter('js', new \October\Rain\Support\Filters\JavascriptImporter);

        /*
         * Register CSS filters
         */
        $this->registerFilter('css', new \Assetic\Filter\CssImportFilter);
        $this->registerFilter(['css', 'less'], new \Assetic\Filter\CssRewriteFilter);
        $this->registerFilter('less', new \October\Rain\Support\Filters\LessCompiler);

        /*
         * Minification filters
         */
        if ($this->useMinify) {
            $this->registerFilter('js', new \Assetic\Filter\JSMinFilter);
            $this->registerFilter(['css', 'less'], new \October\Rain\Support\Filters\StylesheetMinify);
        }

        /*
         * Common Aliases
         */
        $this->registerAlias('jquery', '~/modules/backend/assets/js/vendor/jquery.min.js');
        $this->registerAlias('framework', '~/modules/system/assets/js/framework.js');
        $this->registerAlias('framework.extras', '~/modules/system/assets/js/framework.extras.js');
        $this->registerAlias('framework.extras', '~/modules/system/assets/css/framework.extras.css');

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
     * @return string URL to contents.
     */
    public static function combine($assets = [], $localPath = null)
    {
        return self::instance()->prepareRequest($assets, $localPath);
    }

    /**
     * Combines a collection of assets files to a destination file
     * @param array $assets
     * @param string $destination
     * @return void
     */
    public function combineToFile($assets = [], $destination)
    {
        // Disable cache always
        $this->storagePath = null;

        list($assets, $extension) = $this->prepareAssets($assets);

        $rewritePath = File::localToPublic(dirname($destination));
        $combiner = $this->prepareCombiner($assets, $rewritePath);

        $contents = $combiner->dump();
        File::put($destination, $contents);
    }

    /**
     * Returns the combined contents from a prepared cache identifier.
     * @return string Combined file contents.
     */
    public function getContents($cacheId)
    {
        $cacheInfo = $this->getCache($cacheId);
        if (!$cacheInfo) {
            throw new ApplicationException(Lang::get('cms::lang.combiner.not_found', ['name'=>$cacheId]));
        }

        $this->localPath = $cacheInfo['path'];
        $this->storagePath = storage_path().'/cms/combiner/assets';

        $combiner = $this->prepareCombiner($cacheInfo['files']);
        $contents = $combiner->dump();
        $mime = ($cacheInfo['extension'] == 'css') ? 'text/css' : 'text/javascript';

        header_remove();
        $response = Response::make($contents);
        $response->header('Content-Type', $mime);

        /*
         * Set 304 Not Modified header, if necessary
         */
        $lastModifiedTime = gmdate("D, d M Y H:i:s \G\M\T", array_get($cacheInfo, 'lastMod'));
        $response->setLastModified(new DateTime($lastModifiedTime));
        $response->setEtag(array_get($cacheInfo, 'etag'));
        $response->isNotModified(App::make('request'));

        return $response;
    }

    /**
     * Prepares an array of assets by normalizing the collection
     * and processing aliases.
     * @param $assets array
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
     * @var array List of asset files.
     * @var string File extension, used for aesthetic purposes only.
     * @return string URL to contents.
     */
    protected function prepareRequest(array $assets, $localPath = null)
    {
        if (substr($localPath, -1) != '/') {
            $localPath = $localPath.'/';
        }

        $this->localPath = $localPath;
        $this->storagePath = storage_path().'/cms/combiner/assets';

        list($assets, $extension) = $this->prepareAssets($assets);

        /*
         * Cache and process
         */
        $cacheId = $this->makeCacheId($assets);
        $cacheInfo = $this->useCache ? $this->getCache($cacheId) : false;

        if (!$cacheInfo) {
            $combiner = $this->prepareCombiner($assets);
            $lastMod = $combiner->getLastModified();

            $cacheInfo = [
                'version'   => $cacheId.'-'.$lastMod,
                'etag'      => $cacheId,
                'lastMod'   => $lastMod,
                'files'     => $assets,
                'path'      => $this->localPath,
                'extension' => $extension
            ];

            $this->putCache($cacheId, $cacheInfo);
        }

        return $this->getCombinedUrl($cacheInfo['version']);
    }

    /**
     * Returns the combined contents from a prepared cache identifier.
     * @return string Combined file contents.
     */
    protected function prepareCombiner(array $assets, $rewritePath = null)
    {
        $files = [];
        $filesSalt = null;
        foreach ($assets as $asset) {
            $filters = $this->getFilters(File::extension($asset)) ?: [];
            $path = File::symbolizePath($asset, null) ?: $this->localPath . $asset;
            $files[] = new FileAsset($path, $filters, public_path());
            $filesSalt .= $this->localPath . $asset;
        }
        $filesSalt = md5($filesSalt);

        $collection = new AssetCollection($files, [], $filesSalt);
        $collection->setTargetPath($this->getTargetPath($rewritePath));

        if ($this->storagePath === null) {
            return $collection;
        }

        $cache = new FilesystemCache($this->storagePath);
        $cachedCollection = new AssetCache($collection, $cache);
        return $cachedCollection;
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
            return URL::action($combineAction, [$outputFilename], false);
        }
        else {
            return '/combine/'.$outputFilename;
        }
    }

    /**
     * Returns the target path for use with the combiner. The target
     * path helps generate relative links within CSS.
     *
     * /combine              returns combine/
     * /index.php/combine    returns index-php/combine/
     *
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
     * registerBundle() function. Thi instance is passed to the
     * callback function as an argument. Usage:
     * <pre>
     *   CombineAssets::registerCallback(function($combiner){
     *       $combiner->registerBundle('~/modules/backend/assets/less/october.less');
     *   });
     * </pre>
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
     * @return Self
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
     * @return Self
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
     * @return Self
     */
    public function getFilters($extension = null)
    {
        if ($extension === null) {
            return $this->filters;
        }
        elseif (isset($this->filters[$extension])) {
            return $this->filters[$extension];
        }
        else {
            return null;
        }
    }

    //
    // Bundles
    //

    /**
     * Registers an alias to use for a longer file reference.
     * @param string $alias Alias name. Eg: framework
     * @param object $filter Collection of files to combine
     * @param string $extension Extension name. Eg: css
     * @return Self
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

            if ($extension == 'less') {
                $cssPath = $path.'/../css';
                if (
                    strtolower(basename($path)) == 'less' &&
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
     * @return Self
     */
    public function getBundles($extension = null)
    {
        if ($extension === null) {
            return $this->bundles;
        }
        elseif (isset($this->bundles[$extension])) {
            return $this->bundles[$extension];
        }
        else {
            return null;
        }
    }

    //
    // Aliases
    //

    /**
     * Register an alias to use for a longer file reference.
     * @param string $alias Alias name. Eg: framework
     * @param string $file Path to file to use for alias
     * @param string $extension Extension name. Eg: css
     * @return Self
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
     * @return Self
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
     * @return Self
     */
    public function getAliases($extension = null)
    {
        if ($extension === null) {
            return $this->aliases;
        }
        elseif (isset($this->aliases[$extension])) {
            return $this->aliases[$extension];
        }
        else {
            return null;
        }
    }

    //
    // Cache
    //

    /**
     * Stores information about a asset collection against
     * a cache identifier.
     * @var string Cache identifier.
     * @var array List of asset files.
     * @return bool Successful
     */
    protected function putCache($cacheId, array $cacheInfo)
    {
        $cacheId = 'combiner.'.$cacheId;

        if (Cache::has($cacheId)) {
            return false;
        }

        $this->putCacheIndex($cacheId);
        Cache::forever($cacheId, serialize($cacheInfo));
        return true;
    }

    /**
     * Look up information about a cache identifier.
     * @var string Cache identifier
     * @return array Cache information
     */
    protected function getCache($cacheId)
    {
        $cacheId = 'combiner.'.$cacheId;

        if (!Cache::has($cacheId)) {
            return false;
        }

        return unserialize(Cache::get($cacheId));
    }

    /**
     * Builds a unique string based on assets
     * @var array Asset files
     * @return string Unique identifier
     */
    protected function makeCacheId(array $assets)
    {
        return md5($this->localPath . implode('|', $assets));
    }

    /**
     * Resets the combiner cache
     * @return void
     */
    public static function resetCache()
    {
        if (!Cache::has('combiner.index')) {
            return;
        }

        $index = unserialize(Cache::get('combiner.index'));
        foreach ($index as $cacheId) {
            Cache::forget($cacheId);
        }

        Cache::forget('combiner.index');
    }

    /**
     * Adds a cache identifier to the index store used for
     * performing a reset of the cache.
     * @var string Cache identifier
     * @return bool Returns false if identifier is already in store
     */
    protected function putCacheIndex($cacheId)
    {
        $index = [];
        
        if (Cache::has('combiner.index')) {
            $index = unserialize(Cache::get('combiner.index'));
        }

        if (in_array($cacheId, $index)) {
            return false;
        }

        $index[] = $cacheId;

        Cache::forever('combiner.index', serialize($index));
        return true;
    }
}
