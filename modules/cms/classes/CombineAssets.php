<?php namespace Cms\Classes;

use URL;
use File;
use Lang;
use Cache;
use Config;
use Response;
use Assetic\Asset\AssetCollection;
use Assetic\Asset\FileAsset;
use Assetic\Asset\GlobAsset;
use Assetic\Asset\AssetCache;
use Assetic\Cache\FilesystemCache;

/**
 * Class used for combining JavaScript and StyleSheet 
 * files.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class CombineAssets
{
    /**
     * @var Self Instance for multi cycle execution.
     */
    private static $instance;

    /**
     * @var array A list of known JavaScript extensions.
     */
    protected static $jsExtensions = ['js'];
    
    /**
     * @var array A list of known StyleSheet extensions.
     */
    protected static $cssExtensions = ['css', 'less', 'scss', 'sass'];

    /**
     * @var array Filters to apply to each file.
     */
    protected $filters = [];

    /**
     * @var string The directory path context to find assets.
     */
    protected $path;

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
     * Constructor
     */
    public function __construct()
    {
        /*
         * Register cache preference.
         */
        $this->useCache = Config::get('cms.enableAssetCache', false);
        $this->useMinify = Config::get('cms.enableAssetMinify', false);

        /*
         * Register basic JavaScript filters.
         */
        $this->registerFilter('js', new \October\Rain\Support\Filters\JavascriptImporter);

        /*
         * Register basic CSS filters.
         */
        $this->registerFilter('css', new \Assetic\Filter\CssImportFilter);
        $this->registerFilter('css', new \Assetic\Filter\CssRewriteFilter);

        /*
         * Special filters
         */
        $this->registerFilter('less', new \Assetic\Filter\LessphpFilter);

        /*
         * Minification filters
         */
        if ($this->useMinify) {
            $this->registerFilter('js', new \Assetic\Filter\JSMinFilter);
            $this->registerFilter('css', new \October\Rain\Support\Filters\StylesheetMinify);
        }
    }

    /**
     * Combines JavaScript or StyleSheet file references
     * to produce a page relative URL to the combined contents.
     * @return string URL to contents.
     */
    public static function combine($assets = [], $path = null)
    {
        if (static::$instance === null)
            static::$instance = new self();

        return static::$instance->prepareRequest($assets, $path);
    }

    /**
     * Combines asset file references of a single type to produce 
     * a URL reference to the combined contents.
     * @var array List of asset files.
     * @var string File extension, used for aesthetic purposes only.
     * @return string URL to contents.
     */
    protected function prepareRequest(array $assets, $path = null)
    {
        if (substr($path, -1) != '/')
            $path = $path.'/';

        $this->path = public_path().$path;
        $this->storagePath = storage_path().'/combiner/cms';

        if (!is_array($assets))
            $assets = [$assets];

        /*
         * Split assets in to groups.
         */
        $combineJs = [];
        $combineCss = [];

        foreach ($assets as $asset) {
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
        if (count($combineJs) > count($combineCss)) {
            $extension = 'js';
            $assets = $combineJs;
        }
        else {
            $extension = 'css';
            $assets = $combineCss;
        }

        /*
         * Cache and process
         */
        $cacheId = $this->makeCacheId($assets);
        $cacheInfo = $this->useCache ? $this->getCache($cacheId) : false;

        if (!$cacheInfo) {
            $combiner = $this->prepareCombiner($assets);
            $version = $combiner->getLastModified();

            $cacheInfo = [
                'output'    => $cacheId.'-'.$version,
                'version'   => $version,
                'files'     => $assets,
                'path'      => $this->path,
                'extension' => $extension
            ];

            $this->putCache($cacheId, $cacheInfo);
        }

        return $this->getCombinedUrl($cacheInfo['output']);
    }

    /**
     * Returns the URL used for accessing the combined files.
     * @param string $outputFilename A custom file name to use.
     * @return string
     */
    protected function getCombinedUrl($outputFilename = 'undefined.css')
    {
        return URL::action('Cms\Classes\Controller@combine', [$outputFilename], false);
    }

    /**
     * Returns the combined contents from a prepared cache identifier.
     * @return string Combined file contents.
     */
    public function getContents($cacheId)
    {
        $cacheInfo = $this->getCache($cacheId);
        if (!$cacheInfo)
            throw new CmsException(Lang::get('cms::lang.combiner.not_found', ['name'=>$cacheId]));

        $this->path = $cacheInfo['path'];
        $this->storagePath = storage_path().'/combiner/cms';

        $combiner = $this->prepareCombiner($cacheInfo['files']);
        $contents = $combiner->dump();
        $mime = ($cacheInfo['extension'] == 'css') ? 'text/css' : 'text/javascript';

        header_remove();
        $response = Response::make($contents);
        $response->header('Content-Type', $mime);
        $response->header('Cache-Control', 'max-age=31536000, public');
        $response->header('Expires', gmdate('D, d M Y H:i:s \G\M\T', time() + 2678400));

        return $response;
    }

    /**
     * Returns the combined contents from a prepared cache identifier.
     * @return string Combined file contents.
     */
    protected function prepareCombiner(array $assets)
    {
        $files = [];
        $filesSalt = null;
        foreach ($assets as $asset) {
            $filters = $this->getFilters(File::extension($asset));
            $files[] = new FileAsset($this->path . $asset, $filters, public_path());
            $filesSalt .= $this->path . $asset;
        }
        $filesSalt = md5($filesSalt);

        $cache = new FilesystemCache($this->storagePath);
        $collection = new AssetCollection($files, [], $filesSalt);
        $collection->setTargetPath('combine/');

        // @todo - Remove, this cache step is too hardcore.
        // if (!$this->useCache)
        //     return $collection;

        $cachedCollection = new AssetCache($collection, $cache);
        return $cachedCollection;
    }

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

        if (Cache::has($cacheId))
            return false;

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

        if (!Cache::has($cacheId))
            return false;

        return unserialize(Cache::get($cacheId));
    }

    /**
     * Builds a unique string based on assets
     * @var array Asset files
     * @return string Unique identifier
     */
    protected function makeCacheId(array $assets)
    {
        return md5($this->path . implode('|', $assets));
    }

    /**
     * Resets the combiner cache
     * @return void
     */
    public static function resetCache()
    {
        if (!Cache::has('combiner.index'))
            return;

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
        
        if (Cache::has('combiner.index'))
            $index = unserialize(Cache::get('combiner.index'));

        if (in_array($cacheId, $index))
            return false;

        $index[] = $cacheId;

        Cache::forever('combiner.index', serialize($index));
        return true;
    }

    /**
     * Register a filter to apply to the combining process.
     *
     * @param object $filter Collection of files to combine
     * @return Self
     */
    public function registerFilter($extension, $filter)
    {
        $extension = strtolower($extension);
        
        if (!isset($this->filters[$extension]))
            $this->filters[$extension] = [];

        if ($filter !== null)
            $this->filters[$extension][] = $filter;

        return $this;
    }

    /**
     * Clears any registered filters.
     * @return Self
     */
    public function resetFilters($extension = null)
    {
        if ($extension === null)
            $this->filters = [];
        else
            $this->filters[$extension] = [];

        return $this;
    }

    /**
     * Returns filters.
     * @return Self
     */
    public function getFilters($extension = null)
    {
        if ($extension === null)
            return $this->filters;
        elseif (isset($this->filters[$extension]))
            return $this->filters[$extension];
        else
            return null;
    }

}