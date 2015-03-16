<?php namespace Cms\Classes;

use ApplicationException;
use SystemException;
use Config;
use Storage;
use Cache;

/**
 * Provides abstraction level for the Media Library operations.
 * Implements the library caching features and security checks.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaLibrary
{
    use \October\Rain\Support\Traits\Singleton;

    const CACHE_KEY = 'cms-media-library-contents';
    const SORT_BY_TITLE = 'title';
    const SORT_BY_SIZE = 'size';
    const SORT_BY_MODIFIED = 'modified';

    /**
     * @var string Relative or absolute URL of the Library root folder.
     */
    protected $storagePath;

    /**
     * @var string The root Library folder path.
     */
    protected $storageFolder;

    /**
     * @var mixed A reference to the Media Library disk.
     */
    protected $storageDisk;

    /**
     * @var array Contains a default list of files and directories to ignore.
     * The list can be customized with cms.storage.media.ignore configuration option.
     */
    protected $defaultIgnoreNames = ['.svn', '.git', '.DS_Store'];

    /**
     * @var array Contains a list of files and directories to ignore.
     * The list can be customized with cms.storage.media.ignore configuration option.
     */
    protected $ignoreNames;

    protected $storageFolderNameLength;

    /**
     * Initialize this singleton.
     */
    protected function init()
    {
        $this->storagePath = rtrim(Config::get('cms.storage.media.path', '/storage/app/media'), '/');
        $this->storageFolder = self::validatePath(
            Config::get('cms.storage.media.folder', 'media'), true);
        $this->ignoreNames = Config::get('cms.storage.media.ignore', $this->defaultIgnoreNames);

        $this->storageFolderNameLength = strlen($this->storageFolder);
    }

    /**
     * Returns a list of folders and files in a Library folder.
     * @param string $folder Specifies the folder path relative the the Library root.
     * @param string $sortBy Determines the sorting preference. 
     * Supported values are 'title', 'size', 'lastModified' (see SORT_BY_XXX class constants).
     */
    public function listFolderContents($folder = '/', $sortBy = 'title')
    {
        $folder = self::validatePath($folder);
        $fullFolderPath = $this->getMediaPath($folder);

        /*
         * Try to load the contents from cache
         */

        $cached = Cache::get('cms-media-library-contents', false);
        $cached = $cached ? @unserialize($cached) : [];

        if (!is_array($cached))
            $cached = [];

        if (array_key_exists($fullFolderPath, $cached))
            $folderContents = $cached[$fullFolderPath];
        else {
            $folderContents = $this->scanFolderContents($fullFolderPath);

            $cached[$fullFolderPath] = $folderContents;
            Cache::put(self::CACHE_KEY, serialize($cached), Config::get('cms.storage.media.ttl', 10));
        }

        /*
         * Sort the result and combine the file and folder lists
         */

        $this->sortItemList($folderContents['files'], $sortBy);
        $this->sortItemList($folderContents['folders'], $sortBy);

        $folderContents = array_merge($folderContents['folders'], $folderContents['files']);

        return $folderContents;
    }

    /**
     * Determines if a file with the specified path exists in the library.
     * @param string $path Specifies the file path relative the the Library root.
     * @return boolean Returns TRUE if the file exists.
     */
    public function exists($path)
    {
        $path = self::validatePath($path);
        $fullPath = $this->getMediaPath($path);

        return $this->getStorageDisk()->exists($fullPath);
    }

    /**
     * Returns a file contents.
     * @param string $path Specifies the file path relative the the Library root.
     * @return string Returns the file contents
     */
    public function get($path)
    {
        $path = self::validatePath($path);
        $fullPath = $this->getMediaPath($path);
        return $this->getStorageDisk()->get($fullPath);
    }

    /**
     * Puts a file to the library.
     * @param string $path Specifies the file path relative the the Library root.
     * @param string $contents Specifies the file contents.
     * @return boolean
     */
    public function put($path, $contents)
    {
        $path = self::validatePath($path);
        $fullPath = $this->getMediaPath($path);
        return $this->getStorageDisk()->put($fullPath, $contents);
    }

    /**
     * Resets the Library cache.
     *
     * The cache stores the library table of contents locally in order to optimize
     * the performance when working with remote storages. The default cache TTL is
     * 10 minutes. The cache is deleted automatically when an item is added, changed
     * or deleted. This method allows to reset the cache forcibly.
     */
    public function resetCache()
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Checks if file path doesn't contain any substrings that would pose a security threat.
     * Throws an exception if the path is not valid.
     * @param string $path Specifies the path.
     * @param boolean $normalizeOnly Specifies if only the normalization, without validation should be performed.
     * @return string Returns a normalized path.
     */
    public static function validatePath($path, $normalizeOnly = false)
    {
        $path = str_replace('\\', '/', $path);
        $path = '/'.trim($path, '/');

        if ($normalizeOnly)
            return $path;

        if (strpos($path, '..') !== false)
            throw new ApplicationException(Lang::get('cms::lang.media.invalid_path', ['path'=>$path]));

        if (strpos($path, './') !== false || strpos($path, '//') !== false)
            throw new ApplicationException(Lang::get('cms::lang.media.invalid_path', ['path'=>$path]));

        return $path;
    }

    /**
     * Returns a file or folder path with the prefixed storage folder.
     * @param string $path Specifies a path to process.
     * @return string Returns a processed string.
     */
    protected function getMediaPath($path)
    {
        return $this->storageFolder.$path;
    }

    /**
     * Returns path relative to the Library root folder.
     * @param string $path Specifies a path relative to the Library disk root.
     * @return string Returns the updated path.
     */
    protected function getMediaRelativePath($path)
    {
        $path = self::validatePath($path, true);

        if (substr($path, 0, $this->storageFolderNameLength) == $this->storageFolder)
            return substr($path, $this->storageFolderNameLength);

        throw new SystemException(sprintf('Cannot convert Media Library path "%s" to a path relative to the Library root.', $path));
    }

    /**
     * Determines if the path should be visible (not ignored).
     * @param string $path Specifies a path to check.
     * return boolean Returns TRUE if the path is visible.
     */
    protected function isVisible($path)
    {
        return !in_array(basename($path), $this->ignoreNames);
    }

    /**
     * Initializes a library item from a path and item type.
     * @param string $path Specifies the item path relative to the storage disk root.
     * @param string $type Specifies the item type.
     * @return mixed Returns the MediaLibraryItem object or NULL if the item is not visible.
     */
    protected function initLibraryItem($path, $itemType)
    {
        $relativePath = $this->getMediaRelativePath($path);

        if (!$this->isVisible($relativePath))
            return;

        /*
         * S3 doesn't allow getting the last modified timestamp for folders,
         * so this feature is disabled - folders timestamp is always NULL.
         */
        $lastModified = $itemType == MediaLibraryItem::TYPE_FILE ? 
            $this->getStorageDisk()->lastModified($path) : null;

        $size = $itemType == MediaLibraryItem::TYPE_FILE ? 
            $this->getStorageDisk()->size($path) : $this->getFolderItemCount($path);

        $publicUrl = $this->storagePath.$relativePath;
        return new MediaLibraryItem($relativePath, $size, $lastModified, $itemType, $publicUrl);
    }

    /**
     * Returns a number of items on a folder.
     * @param string $path Specifies the folder path relative to the storage disk root.
     * @return integer Returns the number of items in the folder.
     */
    protected function getFolderItemCount($path)
    {
        $folderItems = array_merge(
            $this->getStorageDisk()->files($path),
            $this->getStorageDisk()->directories($path));

        $size = 0;
        foreach ($folderItems as $folderItem) {
            if ($this->isVisible($folderItem))
                $size++;
        }

        return $size;
    }

    /**
     * Fetches the contents of a folder from the Library.
     * @param string $fullFolderPath Specifies the folder path relative the the storage disk root.
     * @return array Returns an array containing two elements - 'files' and 'folders', each is an array of MediaLibraryItem objects.
     */
    protected function scanFolderContents($fullFolderPath)
    {
        $result = [
            'files' => [],
            'folders' => []
        ];

        $files = $this->getStorageDisk()->files($fullFolderPath);
        foreach ($files as $file) {
            if ($libraryItem = $this->initLibraryItem($file, MediaLibraryItem::TYPE_FILE))
                $result['files'][] = $libraryItem;
        }

        $folders = $this->getStorageDisk()->directories($fullFolderPath);
        foreach ($folders as $folder) {
            if ($libraryItem = $this->initLibraryItem($folder, MediaLibraryItem::TYPE_FOLDER))
                $result['folders'][] = $libraryItem;
        }

        return $result;
    }

    /**
     * Sorts the item list by title, size or last modified date.
     * @param array $itemList Specifies the item list to sort.
     * @param string $sortBy Determines the sorting preference. 
     * Supported values are 'title', 'size', 'lastModified' (see SORT_BY_XXX class constants).
     */
    protected function sortItemList(&$itemList, $sortBy)
    {
        $files = [];
        $folders = [];

        usort($itemList, function($a, $b) use ($sortBy) {
            switch ($sortBy) {
                case self::SORT_BY_TITLE : return strcmp($a->path, $b->path);
                case self::SORT_BY_SIZE : 
                    if ($a->size > $b->size)
                        return 1;

                    return $a->size < $b->size ? -1 : 0;
                break;
                case self::SORT_BY_MODIFIED :
                    if ($a->lastModified > $b->lastModified)
                        return 1;

                    return $a->lastModified < $b->lastModified ? -1 : 0;
                break;
            }
        });
    }

    /**
     * Initializes and returns the Media Library disk.
     * This method should always be used instead of trying to access the 
     * $storageDisk property directly as initializing the disc requires
     * communicating with the remote storage.
     * @return mixed Returns the storage disk object.
     */
    protected function getStorageDisk()
    {
        if ($this->storageDisk)
            return $this->storageDisk;

        return $this->storageDisk = Storage::disk(
            Config::get('cms.storage.media.disk', 'local'));
    }
}