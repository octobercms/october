<?php namespace Cms\Classes;

use File;
use Lang;
use Cache;
use Config;
use SystemException;

/**
 * Parses the PHP code section of CMS objects.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CodeParser
{
    /**
     * @var \Cms\Classes\CmsCompoundObject A reference to the CMS object being parsed.
     */
    protected $object;

    /**
     * @var string Contains a path to the CMS object's file being parsed.
     */
    protected $filePath;

    /**
     * @var mixed The internal cache, keeps parsed object information during a request.
     */
    static protected $cache = [];

    /**
     * @var string Key for the parsed PHP file information cache.
     */
    protected $dataCacheKey = 'cms-php-file-data';

    /**
     * Creates the class instance
     * @param \Cms\Classes\CmsCompoundObject A reference to a CMS object to parse.
     */
    public function __construct(CmsCompoundObject $object)
    {
        $this->object = $object;
        $this->filePath = $object->getFilePath();
    }

    /**
     * Parses the CMS object's PHP code section and returns an array with the following keys:
     * - className
     * - filePath (path to the parsed PHP file)
     * - offset (PHP section offset in the template file)
     * - source ('parser', 'request-cache', or 'cache')
     * @return array
     */
    public function parse()
    {
        /*
         * If the object has already been parsed in this request return the cached data.
         */
        if (array_key_exists($this->filePath, self::$cache)) {
            self::$cache[$this->filePath]['source'] = 'request-cache';
            return self::$cache[$this->filePath];
        }

        /*
         * Try to load the parsed data from the cache
         */
        $path = $this->getCacheFilePath();

        $result = [
            'filePath' => $path,
            'className' => null,
            'source' => null,
            'offset' => 0
        ];

        /*
         * There are two types of possible caching scenarios, either stored
         * in the cache itself, or stored as a cache file. In both cases,
         * make sure the cache is not stale and use it.
         */
        if (is_file($path)) {
            $cachedInfo = $this->getCachedFileInfo();
            $hasCache = $cachedInfo !== null;

            /*
             * Valid cache, return result
             */
            if ($hasCache && $cachedInfo['mtime'] == $this->object->mtime) {
                $result['className'] = $cachedInfo['className'];
                $result['source'] = 'cache';

                return self::$cache[$this->filePath] = $result;
            }

            /*
             * Cache expired, cache file not stale, refresh cache and return result
             */
            if (!$hasCache && filemtime($path) >= $this->object->mtime) {
                $className = $this->extractClassFromFile($path);
                if ($className) {
                    $result['className'] = $className;
                    $result['source'] = 'file-cache';

                    $this->storeCachedInfo($result);
                    return $result;
                }
            }
        }

        $result['className'] = $this->rebuild($path);
        $result['source'] = 'parser';

        $this->storeCachedInfo($result);
        return $result;
    }

   /**
    * Rebuilds the current file cache.
    * @param string The path in which the cached file should be stored
    */
    protected function rebuild($path)
    {
        $uniqueName = str_replace('.', '', uniqid('', true)).'_'.abs(crc32(mt_rand()));
        $className = 'Cms'.$uniqueName.'Class';

        $body = $this->object->code;
        $body = preg_replace('/^\s*function/m', 'public function', $body);

        $codeNamespaces = [];
        $pattern = '/(use\s+[a-z0-9_\\\\]+(\s+as\s+[a-z0-9_]+)?;\n?)/mi';
        preg_match_all($pattern, $body, $namespaces);
        $body = preg_replace($pattern, '', $body);

        $parentClass = $this->object->getCodeClassParent();
        if ($parentClass !== null) {
            $parentClass = ' extends '.$parentClass;
        }

        $fileContents = '<?php '.PHP_EOL;

        foreach ($namespaces[0] as $namespace) {
            $fileContents .= $namespace;
        }

        $fileContents .= 'class '.$className.$parentClass.PHP_EOL;
        $fileContents .= '{'.PHP_EOL;
        $fileContents .= $body.PHP_EOL;
        $fileContents .= '}'.PHP_EOL;

        $this->validate($fileContents);

        $this->makeDirectorySafe(dirname($path));

        $this->writeContentSafe($path, $fileContents);

        return $className;
    }

    /**
     * Runs the object's PHP file and returns the corresponding object.
     * @param \Cms\Classes\Page $page Specifies the CMS page.
     * @param \Cms\Classes\Layout $layout Specifies the CMS layout.
     * @param \Cms\Classes\Controller $controller Specifies the CMS controller.
     * @return mixed
     */
    public function source($page, $layout, $controller)
    {
        $data = $this->parse();
        $className = $data['className'];

        if (!class_exists($className)) {
            require_once $data['filePath'];
        }

        if (!class_exists($className) && ($data = $this->handleCorruptCache($data))) {
            $className = $data['className'];
        }

        return new $className($page, $layout, $controller);
    }

    /**
     * In some rare cases the cache file will not contain the class
     * name we expect. When this happens, destroy the corrupt file,
     * flush the request cache, and repeat the cycle.
     * @return void
     */
    protected function handleCorruptCache($data)
    {
        $path = array_get($data, 'filePath', $this->getCacheFilePath());

        if (is_file($path)) {
            if ($className = $this->extractClassFromFile($path)) {
                $data['className'] = $className;
                return $data;
            }

            @unlink($path);
        }

        unset(self::$cache[$this->filePath]);

        return $this->parse();
    }

    //
    // Cache
    //

    /**
     * Stores result data inside cache.
     * @param array $result
     * @return void
     */
    protected function storeCachedInfo($result)
    {
        $cacheItem = $result;
        $cacheItem['mtime'] = $this->object->mtime;

        $cached = $this->getCachedInfo() ?: [];
        $cached[$this->filePath] = $cacheItem;

        Cache::put($this->dataCacheKey, base64_encode(serialize($cached)), 1440);

        self::$cache[$this->filePath] = $result;
    }

    /**
     * Returns path to the cached parsed file
     * @return string
     */
    protected function getCacheFilePath()
    {
        $hash = abs(crc32($this->filePath));
        $result = storage_path().'/cms/cache/';
        $result .= substr($hash, 0, 2).'/';
        $result .= substr($hash, 2, 2).'/';
        $result .= basename($this->filePath);
        $result .= '.php';

        return $result;
    }

    /**
     * Returns information about all cached files.
     * @return mixed Returns an array representing the cached data or NULL.
     */
    protected function getCachedInfo()
    {
        $cached = Cache::get($this->dataCacheKey, false);

        if (
            $cached !== false &&
            ($cached = @unserialize(@base64_decode($cached))) !== false
        ) {
            return $cached;
        }

        return null;
    }

    /**
     * Returns information about a cached file
     * @return integer
     */
    protected function getCachedFileInfo()
    {
        $cached = $this->getCachedInfo();

        if ($cached !== null) {
            if (array_key_exists($this->filePath, $cached)) {
                return $cached[$this->filePath];
            }
        }

        return null;
    }

    //
    // Helpers
    //

    /**
     * Evaluates PHP content in order to detect syntax errors.
     * The method handles PHP errors and throws exceptions.
     */
    protected function validate($php)
    {
        eval('?>'.$php);
    }

    /**
     * Extracts the class name from a cache file
     * @return string
     */
    protected function extractClassFromFile($path)
    {
        $fileContent = file_get_contents($path);
        $matches = [];
        $pattern = '/Cms\S+_\S+Class/';
        preg_match($pattern, $fileContent, $matches);

        if (!empty($matches[0])) {
            return $matches[0];
        }

        return null;
    }

    /**
     * Writes content with concurrency support and cache busting
     * This work is based on the Twig_Cache_Filesystem class
     */
    protected function writeContentSafe($path, $content)
    {
        $count = 0;
        $tmpFile = tempnam(dirname($path), basename($path));

        if (@file_put_contents($tmpFile, $content) === false) {
            throw new SystemException(Lang::get('system::lang.file.create_fail', ['name'=>$tmpFile]));
        }

        while (!@rename($tmpFile, $path)) {
            usleep(rand(50000, 200000));

            if ($count++ > 10) {
                throw new SystemException(Lang::get('system::lang.file.create_fail', ['name'=>$path]));
            }
        }

        File::chmod($path);

        /*
         * Compile cached file into bytecode cache
         */
        if (function_exists('opcache_invalidate')) {
            opcache_invalidate($path, true);
        }
        elseif (function_exists('apc_compile_file')) {
            apc_compile_file($path);
        }
    }

    /**
     * Make directory with concurrency support
     */
    protected function makeDirectorySafe($dir)
    {
        $count = 0;

        if (is_dir($dir)) {
            if (!is_writable($dir)) {
                throw new SystemException(Lang::get('system::lang.directory.create_fail', ['name'=>$dir]));
            }

            return;
        }

        while (!is_dir($dir) && !@mkdir($dir, 0777, true)) {
            usleep(rand(50000, 200000));

            if ($count++ > 10) {
                throw new SystemException(Lang::get('system::lang.directory.create_fail', ['name'=>$dir]));
            }
        }

        File::chmodRecursive($dir);
    }
}
