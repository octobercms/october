<?php namespace Cms\Classes;

use File;
use Lang;
use Cache;
use Config;
use Validator;
use Cms\Helpers\File as FileHelper;
use ApplicationException;
use ValidationException;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use ArrayAccess;
use Exception;

/**
 * This is a base class for all CMS objects - content files, pages, partials and layouts.
 * The class implements basic operations with file-based templates.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsObject implements ArrayAccess
{
    /**
     * @var string Specifies the file name corresponding the CMS object.
     */
    protected $fileName;

    /**
     * @var string Specifies the file name, the CMS object was loaded from.
     */
    protected $originalFileName = null;

    /**
     * @var string The entire file content.
     */
    protected $content;

    /**
     * @var \Cms\Classes\Theme A reference to the CMS theme containing the object.
     */
    protected $theme;

    /**
     * @var boolean Indicated whether the object was loaded from the cache.
     */
    protected $loadedFromCache = false;

    protected static $fillable = [
        'content',
        'fileName'
    ];

    protected static $allowedExtensions = ['htm'];

    protected static $defaultExtension = 'htm';

    /**
     * @var integer The template file modification time.
     */
    public $mtime;

    /**
     * Creates an instance of the object and associates it with a CMS theme.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * If the theme is specified as NULL, then a query can be performed on the object directly.
     */
    public function __construct(Theme $theme = null)
    {
        $this->theme = $theme;
    }

    /**
     * Loads the object from a cache.
     * This method is used by the CMS in the runtime. If the cache is not found, it is created.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * @return mixed Returns a CMS object instance or null if the object wasn't found.
     */
    public static function loadCached($theme, $fileName)
    {
        if (!FileHelper::validatePath($fileName, static::getMaxAllowedPathNesting())) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.invalid_file', ['name'=>$fileName]));
        }

        if (!strlen(File::extension($fileName))) {
            $fileName .= '.'.static::$defaultExtension;
        }

        $filePath = static::getFilePath($theme, $fileName);
        if (array_key_exists($filePath, ObjectMemoryCache::$cache)) {
            return ObjectMemoryCache::$cache[$filePath];
        }

        $key = self::getObjectTypeDirName().crc32($filePath);

        clearstatcache($filePath);
        $cached = Cache::get($key, false);
        if ($cached !== false && ($cached = @unserialize($cached)) !== false) {
            if ($cached['mtime'] != @File::lastModified($filePath)) {
                $cached = false;
            }
        }

        if ($cached && !File::isFile($filePath)) {
            $cached = false;
        }

        if ($cached !== false) {
            /*
             * The cached item exists and successfully unserialized. 
             * Initialize the object from the cached data.
             */
            $obj = new static($theme);
            $obj->content = $cached['content'];
            $obj->fileName = $fileName;
            $obj->mtime = File::lastModified($filePath);
            $obj->loadedFromCache = true;
            $obj->initFromCache($cached);

            return ObjectMemoryCache::$cache[$filePath] = $obj;
        }

        /*
         * The cached item doesn't exists.
         * Load the object from the file and create the cache.
         */
        if (($obj = static::load($theme, $fileName)) === null) {
            /*
             * If the object cannot be loaded from the disk, delete the cache item.
             */
            Cache::forget($key);
            return null;
        }

        $cached = [
            'mtime'   => @File::lastModified($filePath),
            'content' => $obj->content
        ];

        $obj->loadedFromCache = false;
        $obj->initCacheItem($cached);
        Cache::put($key, serialize($cached), Config::get('cms.parsedPageCacheTTL', 1440));

        return ObjectMemoryCache::$cache[$filePath] = $obj;
    }

    /**
     * Loads the object from a file.
     * This method is used in the CMS back-end. It doesn't use any caching.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * The file name can contain only alphanumeric symbols, dashes and dots.
     * @return mixed Returns a CMS object instance or null if the object wasn't found.
     */
    public static function load($theme, $fileName)
    {
        if (!FileHelper::validatePath($fileName, static::getMaxAllowedPathNesting())) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.invalid_file', ['name'=>$fileName]));
        }

        if (!strlen(File::extension($fileName))) {
            $fileName .= '.'.static::$defaultExtension;
        }

        $fullPath = static::getFilePath($theme, $fileName);

        if (!File::isFile($fullPath)) {
            return null;
        }

        if (($content = @File::get($fullPath)) === false) {
            return null;
        }

        $obj = new static($theme);
        $obj->fileName = $fileName;
        $obj->originalFileName = $fileName;
        $obj->mtime = File::lastModified($fullPath);
        $obj->content = $content;
        return $obj;
    }

    /**
     * Returns the maximum allowed path nesting level. 
     * The default value is 2, meaning that files
     * can only exist in the root directory, or in a subdirectory.
     * @return mixed Returns the maximum nesting level or null if any level is allowed.
     */
    protected static function getMaxAllowedPathNesting()
    {
        return 2;
    }

    /**
     * Returns the file content.
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Returns the file name.
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Returns the file name without the extension.
     * @return string
     */
    public function getBaseFileName()
    {
        $pos = strrpos($this->fileName, '.');
        if ($pos === false) {
            return $this->fileName;
        }

        return substr($this->fileName, 0, $pos);
    }

    /**
     * Helper for {{ page.id }} or {{ layout.id }} twig vars
     * Returns a unique string for this object.
     * @return string
     */
    public function getId()
    {
        return str_replace('/', '-', $this->getBaseFileName());
    }

    /**
     * Sets the object file name.
     * @param string $fileName Specifies the file name.
     * @return \Cms\Classes\CmsObject Returns the object instance.
     */
    public function setFileName($fileName)
    {
        $fileName = trim($fileName);

        if (!strlen($fileName)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.file_name_required', [
                    'allowed' => implode(', ', static::$allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validateExtension($fileName, static::$allowedExtensions)) {
            throw new ValidationException(['fileName' =>
                Lang::get('cms::lang.cms_object.invalid_file_extension', [
                    'allowed' => implode(', ', static::$allowedExtensions),
                    'invalid' => pathinfo($fileName, PATHINFO_EXTENSION)
                ])
            ]);
        }

        if (!FileHelper::validatePath($fileName, static::getMaxAllowedPathNesting())) {
            throw new ValidationException([
               'fileName' => Lang::get('cms::lang.cms_object.invalid_file', ['name'=>$fileName])
            ]);
        }

        if (!strlen(File::extension($fileName))) {
            $fileName .= '.htm';
        }

        $this->fileName = $fileName;
        return $this;
    }

    /**
     * Returns the full path to the template file corresponding to this object.
     * @return string
     */
    public function getFullPath()
    {
        return static::getFilePath($this->theme, $this->fileName);
    }

    /**
     * Returns true if the object was loaded from the cache.
     * This method is used by the CMS internally.
     * @return boolean
     */
    public function isLoadedFromCache()
    {
        return $this->loadedFromCache;
    }

    /**
     * Returns the Twig content string.
     */
    public function getTwigContent()
    {
        return $this->content;
    }

    /**
     * Sets the object attributes.
     * @param array $attributes A list of attributes to set.
     */
    public function fill(array $attributes)
    {
        foreach ($attributes as $key => $value) {
            if (!in_array($key, static::$fillable)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.invalid_property',
                    ['name' => $key]
                ));
            }

            $methodName = 'set'.ucfirst($key);
            if (method_exists($this, $methodName)) {
                $this->$methodName($value);
            }
            else {
                $this->$key = $value;
            }
        }
    }

    /**
     * Saves the object to the disk.
     */
    public function save()
    {
        $fullPath = static::getFilePath($this->theme, $this->fileName);

        if (File::isFile($fullPath) && $this->originalFileName !== $this->fileName) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.file_already_exists',
                ['name'=>$this->fileName]
            ));
        }

        $dirPath = rtrim(static::getFilePath($this->theme, ''), '/');
        if (!file_exists($dirPath) || !is_dir($dirPath)) {
            if (!File::makeDirectory($dirPath, 0777, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        if (($pos = strpos($this->fileName, '/')) !== false) {
            $dirPath = static::getFilePath($this->theme, dirname($this->fileName));

            if (!is_dir($dirPath) && !File::makeDirectory($dirPath, 0777, true, true)) {
                throw new ApplicationException(Lang::get(
                    'cms::lang.cms_object.error_creating_directory',
                    ['name'=>$dirPath]
                ));
            }
        }

        $newFullPath = $fullPath;
        if (@File::put($fullPath, $this->content) === false) {
            throw new ApplicationException(Lang::get(
                'cms::lang.cms_object.error_saving',
                ['name'=>$this->fileName]
            ));
        }

        if (strlen($this->originalFileName) && $this->originalFileName !== $this->fileName) {
            $fullPath = static::getFilePath($this->theme, $this->originalFileName);

            if (File::isFile($fullPath)) {
                @unlink($fullPath);
            }
        }

        clearstatcache();

        $this->mtime = @File::lastModified($newFullPath);
        $this->originalFileName = $this->fileName;
    }

    /**
     * Deletes the object from the disk.
     */
    public function delete()
    {
        $fullPath = static::getFilePath($this->theme, $this->fileName);
        if (File::isFile($fullPath) && !is_dir($fullPath) && !@unlink($fullPath)) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.error_deleting', ['name'=>$this->fileName]));
        }
    }

    /**
     * Clears the internal request-level object cache.
     */
    public static function clearInternalCache()
    {
        ObjectMemoryCache::$cache = [];
    }

    /**
     * Returns the list of objects in the specified theme.
     * This method is used internally by the system.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @param boolean $skipCache Indicates if objects should be reloaded from the disk bypassing the cache.
     * @return array Returns an array of CMS objects.
     */
    public static function listInTheme($theme, $skipCache = false)
    {
        if (!$theme) {
            throw new ApplicationException(Lang::get('cms::lang.theme.active.not_set'));
        }

        $dirPath = $theme->getPath().'/'.static::getObjectTypeDirName();
        $result = [];

        if (!File::isDirectory($dirPath)) {
            return $result;
        }

        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dirPath));
        $it->setMaxDepth(1); // Support only a single level of subdirectories
        $it->rewind();

        while ($it->valid()) {
            if ($it->isFile() && in_array($it->getExtension(), static::$allowedExtensions)) {
                $filePath = $it->getBasename();
                if ($it->getDepth() > 0) {
                    $filePath = basename($it->getPath()).'/'.$filePath;
                }

                $page = $skipCache ? static::load($theme, $filePath) : static::loadCached($theme, $filePath);
                $result[] = $page;
            }

            $it->next();
        }

        return $result;
    }
    
    /**
     * Returns the absolute file path.
     * @param \Cms\Classes\Theme $theme Specifies a theme the file belongs to.
     * @param string$fileName Specifies the file name to return the path to.
     * @return string
     */
    protected static function getFilePath($theme, $fileName)
    {
        return $theme->getPath().'/'.static::getObjectTypeDirName().'/'.$fileName;
    }

    /**
     * Implements the getter functionality.
     * @param  string  $name
     * @return void
     */
    public function __get($name)
    {
        $methodName = 'get'.ucfirst($name);
        if (method_exists($this, $methodName)) {
            return $this->$methodName();
        }

        return null;
    }

    /**
     * Determine if an attribute exists on the object.
     * @param  string  $key
     * @return void
     */
    public function __isset($key)
    {
        $methodName = 'get'.ucfirst($key);
        if (method_exists($this, $methodName)) {
            return true;
        }

        return false;
    }

    /**
     * Determine if the given attribute exists.
     * @param  mixed  $offset
     * @return bool
     */
    public function offsetExists($offset)
    {
        return isset($this->$offset);
    }

    /**
     * Get the value for a given offset.
     * @param  mixed  $offset
     * @return mixed
     */
    public function offsetGet($offset)
    {
        return $this->$offset;
    }

    /**
     * Set the value for a given offset.
     * @param  mixed  $offset
     * @param  mixed  $value
     * @return void
     */
    public function offsetSet($offset, $value)
    {
        $this->$offset = $value;
    }

    /**
     * Unset the value for a given offset.
     * @param  mixed  $offset
     * @return void
     */
    public function offsetUnset($offset)
    {
        unset($this->$offset);
    }

    //
    // Queries
    //

    /**
     * Get a new query builder for the object
     * @return CmsObjectQuery
     */
    public function newQuery()
    {
        $query = new CmsObjectQuery($this, $this->theme);
        return $query;
    }

    /**
     * Handle dynamic method calls into the method.
     * @param  string  $method
     * @param  array   $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        // If this object is populated with a theme, then a query
        // cannot be performed on it to reduce overhead on populated objects.
        if (!$this->theme) {
            $query = $this->newQuery();
            return call_user_func_array(array($query, $method), $parameters);
        }

        $className = get_class($this);
        throw new \BadMethodCallException("Call to undefined method {$className}::{$method}()");
    }

    /**
     * Handle dynamic static method calls into the method.
     * @param  string  $method
     * @param  array   $parameters
     * @return mixed
     */
    public static function __callStatic($method, $parameters)
    {
        $instance = new static;
        return call_user_func_array([$instance, $method], $parameters);
    }

    //
    // Overrides
    //

    /**
     * Initializes the object properties from the cached data.
     * @param array $cached The cached data array.
     */
    protected function initFromCache($cached)
    {
    }

    /**
     * Initializes a cache item.
     * @param array &$item The cached item array.
     */
    protected function initCacheItem(&$item)
    {
    }

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
    }
}
