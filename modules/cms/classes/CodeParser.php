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
     * @var Cms\Classes\CmsCompoundObject A reference to the CMS object being parsed.
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
        $this->filePath = $object->getFullPath();
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
         * Try to load the parsed data from the file cache
         */
        $path = $this->getFilePath();
        $result = [
            'filePath' => $path,
            'offset' => 0
        ];

        if (File::isFile($path)) {
            $cachedInfo = $this->getCachedFileInfo();
            if ($cachedInfo !== null && $cachedInfo['mtime'] == $this->object->mtime) {
                $result['className'] = $cachedInfo['className'];
                $result['source'] = 'cache';

                return self::$cache[$this->filePath] = $result;
            }
        }

        /*
         * If the file was not found, or the cache is stale, prepare the new file and cache information about it
         */
        $uniqueName = uniqid().'_'.abs(crc32(md5(mt_rand())));
        $className = 'Cms'.$uniqueName.'Class';

        $body = $this->object->code;
        $body = preg_replace('/^\s*function/m', 'public function', $body);

        $codeNamespaces = [];
        $pattern = '/(use\s+[a-z0-9_\\\\]+;\n?)/mi';
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

        $dir = dirname($path);
        if (!File::isDirectory($dir) && !@File::makeDirectory($dir, 0777, true)) {
            throw new SystemException(Lang::get('system::lang.directory.create_fail', ['name'=>$dir]));
        }

        if (!@File::put($path, $fileContents)) {
            throw new SystemException(Lang::get('system::lang.file.create_fail', ['name'=>$dir]));
        }

        $cached = $this->getCachedInfo();
        if (!$cached) {
            $cached = [];
        }

        $result['className'] = $className;
        $result['source'] = 'parser';

        $cacheItem = $result;
        $cacheItem['mtime'] = $this->object->mtime;
        $cached[$this->filePath] = $cacheItem;

        Cache::put($this->dataCacheKey, serialize($cached), 1440);

        return self::$cache[$this->filePath] = $result;
    }

    /**
     * Runs the object's PHP file and returns the corresponding object.
     * @param Cms\Classes\Page $page Specifies the CMS page.
     * @param Cms\Classes\Layout $layout Specifies the CMS layout.
     * @param Cms\Classes\Controller $controller Specifies the CMS controller.
     * @return mixed
     */
    public function source($page, $layout, $controller)
    {
        $data = $this->parse();
        $className = $data['className'];

        if (!class_exists($className)) {
            require_once $data['filePath'];
        }

        if (!class_exists($className) && ($data = $this->handleCorruptCache())) {
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
    protected function handleCorruptCache()
    {
        $path = $this->getFilePath();
        if (File::isFile($path)) {
            File::delete($path);
        }

        unset(self::$cache[$this->filePath]);

        return $this->parse();
    }

    /**
     * Evaluates PHP content in order to detect syntax errors.
     * The method handles PHP errors and throws exceptions.
     */
    protected function validate($php)
    {
        eval('?>'.$php);
    }

    /**
     * Returns path to the cached parsed file
     * @return string
     */
    protected function getFilePath()
    {
        $hash = abs(crc32($this->filePath));
        $result = storage_path().'/cms/cache/';
        $result .= substr($hash, 0, 2).'/';
        $result .= substr($hash, 2, 2).'/';
        $result .= basename($this->filePath).'.php';

        return $result;
    }

    /**
     * Returns information about all cached files.
     * @return mixed Returns an array representing the cached data or NULL.
     */
    protected function getCachedInfo()
    {
        $cached = Cache::get($this->dataCacheKey, false);
        if ($cached !== false && ($cached = @unserialize($cached)) !== false) {
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
}
