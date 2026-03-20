<?php namespace Media\Classes;

use App;
use Url;
use Str;
use Lang;
use Cache;
use Config;
use Storage;
use October\Rain\Filesystem\Definitions as FileDefinitions;
use ApplicationException;

/**
 * MediaLibrary provides abstraction level for the Media Library operations.
 * Implements the library caching features and security checks.
 *
 * @package october\media
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaLibrary
{
    const SORT_BY_TITLE = 'title';
    const SORT_BY_SIZE = 'size';
    const SORT_BY_MODIFIED = 'modified';
    const SORT_DIRECTION_ASC = 'asc';
    const SORT_DIRECTION_DESC = 'desc';

    /**
     * @var string cacheKey
     */
    protected $cacheKey = 'media-library-contents';

    /**
     * @var string storageUrl relative or absolute URL of the Library root folder.
     */
    protected $storageUrl;

    /**
     * @var mixed storageDisk is a reference to the Media Library disk.
     */
    protected $storageDisk;

    /**
     * @var array ignoreNames contains a list of files and directories to ignore.
     * The list can be customized with media.ignore_files configuration option.
     */
    protected $ignoreNames;

    /**
     * @var array ignorePatterns contains a list of regex patterns to ignore in files and directories.
     * The list can be customized with media.ignore_patterns configuration option.
     */
    protected $ignorePatterns;

    /**
     * __construct this class
     */
    public function __construct()
    {
        $this->storageUrl = rtrim(Config::get('filesystems.disks.media.url', '/storage/app/media'), '/');
        $this->ignoreNames = FileDefinitions::get('ignore_files');
        $this->ignorePatterns = FileDefinitions::get('ignore_patterns');
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('media.library');
    }

    /**
     * setCacheKey as the cache key for this instance
     */
    public function setCacheKey(string $cacheKey)
    {
        $this->cacheKey = $cacheKey;
    }

    /**
     * getCacheKey as the cache key for this instance
     */
    public function getCacheKey(): string
    {
        return $this->cacheKey;
    }

    /**
     * listFolderContents returns a list of folders and files in a Library folder.
     *
     * @param string $folder Specifies the folder path relative the the Library root.
     * @param mixed $sortBy Determines the sorting preference.
     * Supported values are 'title', 'size', 'lastModified' (see SORT_BY_XXX class constants), FALSE (to disable sorting), or an associative array with a 'by' key and a 'direction' key: ['by' => SORT_BY_XXX, 'direction' => SORT_DIRECTION_XXX].
     * @param string $filter Determines the document type filtering preference.
     * Supported values are 'image', 'video', 'audio', 'document' (see FILE_TYPE_XXX constants of MediaLibraryItem class).
     * @param bool $ignoreFolders Determines whether folders should be suppressed in the result list.
     * @return array Returns an array of MediaLibraryItem objects.
     */
    public function listFolderContents($folder = '/', $sortBy = 'title', $filter = null, $ignoreFolders = false)
    {
        $folder = self::validatePath($folder);

        // Try to load the contents from cache
        $cached = Cache::memo()->get($this->cacheKey, false);
        $cached = $cached ? @unserialize(@base64_decode($cached)) : [];

        if (!is_array($cached)) {
            $cached = [];
        }

        if (array_key_exists($folder, $cached)) {
            $folderContents = $cached[$folder];
        }
        else {
            $folderContents = $this->scanFolderContents($folder);

            $cached[$folder] = $folderContents;
            $expiresAt = now()->addMinutes(Config::get('media.item_cache_ttl', 10));
            Cache::put(
                $this->cacheKey,
                base64_encode(serialize($cached)),
                $expiresAt
            );
        }

        // Sort the result and combine the file and folder lists
        if ($sortBy !== false) {
            $this->sortItemList($folderContents['files'], $sortBy);
            $this->sortItemList($folderContents['folders'], $sortBy);
        }

        $this->filterItemList($folderContents['files'], $filter);

        if (!$ignoreFolders) {
            $folderContents = array_merge($folderContents['folders'], $folderContents['files']);
        }
        else {
            $folderContents = $folderContents['files'];
        }

        return $folderContents;
    }

    /**
     * findFiles in the Library.
     *
     * @param string $searchTerm Specifies the search term.
     * @param mixed $sortBy Determines the sorting preference.
     * Supported values are 'title', 'size', 'lastModified' (see SORT_BY_XXX class constants), FALSE (to disable sorting), or an associative array with a 'by' key and a 'direction' key: ['by' => SORT_BY_XXX, 'direction' => SORT_DIRECTION_XXX].
     * @param string $filter Determines the document type filtering preference.
     * Supported values are 'image', 'video', 'audio', 'document' (see FILE_TYPE_XXX constants of MediaLibraryItem class).
     * @return array Returns an array of MediaLibraryItem objects.
     */
    public function findFiles($searchTerm, $sortBy = 'title', $filter = null)
    {
        $words = explode(' ', Str::lower($searchTerm));
        $result = [];

        $findInFolder = function ($folder) use (&$findInFolder, $words, &$result, $sortBy, $filter) {
            $folderContents = $this->listFolderContents($folder, $sortBy, $filter);

            foreach ($folderContents as $item) {
                if ($item->type === MediaLibraryItem::TYPE_FOLDER) {
                    $findInFolder($item->path);
                }
                elseif ($this->pathMatchesSearch($item->path, $words)) {
                    $result[] = $item;
                }
            }
        };

        $findInFolder('/');

        // Sort the result
        if ($sortBy !== false) {
            $this->sortItemList($result, $sortBy);
        }

        return $result;
    }

    /**
     * findFile looks up a file and returns its MediaLibraryItem object
     */
    public function findFile($path): ?MediaLibraryItem
    {
        $path = self::validatePath($path);

        $item = $this->initLibraryItem($path, MediaLibraryItem::TYPE_FILE);

        return $item;
    }

    /**
     * findFolder looks up a folder and returns its MediaLibraryItem object
     */
    public function findFolder($path): ?MediaLibraryItem
    {
        $path = self::validatePath($path);

        $item = $this->initLibraryItem($path, MediaLibraryItem::TYPE_FOLDER);

        return $item;
    }

    /**
     * deleteFiles from the Library.
     * @param array $paths A list of file paths relative to the Library root to delete.
     */
    public function deleteFiles($paths)
    {
        $deletePaths = [];
        foreach ($paths as $path) {
            $deletePaths[] = self::validatePath($path);
        }
        return $this->getStorageDisk()->delete($deletePaths);
    }

    /**
     * deleteFolder from the Library.
     * @param string $path Specifies the folder path relative to the Library root.
     */
    public function deleteFolder($path)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->deleteDirectory($path);
    }

    /**
     * exists determines if a file with the specified path exists in the library.
     * @param string $path Specifies the file path relative the the Library root.
     * @return bool Returns TRUE if the file exists.
     */
    public function exists($path)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->exists($path);
    }

    /**
     * folderExists determines if a folder with the specified path exists in the library.
     * @param string $path Specifies the folder path relative the the Library root.
     * @return bool Returns TRUE if the folder exists.
     */
    public function folderExists($path)
    {
        $folderName = basename($path);
        $folderPath = dirname($path);
        $path = self::validatePath($folderPath);

        $folders = $this->getStorageDisk()->directories($path);
        foreach ($folders as $folder) {
            if (basename($folder) === $folderName) {
                return true;
            }
        }

        return false;
    }

    /**
     * listAllDirectories returns a list of all directories in the Library, optionally
     * excluding some of them.
     * @param array $exclude A list of folders to exclude from the result list.
     * The folder paths should be specified relative to the Library root.
     * @return array
     */
    public function listAllDirectories($exclude = [])
    {
        $folders = $this->getStorageDisk()->allDirectories();

        $folders = array_unique($folders, SORT_LOCALE_STRING);

        $result = [];

        foreach ($folders as $folder) {
            $folder = self::validatePath($folder, true);
            if (!strlen($folder)) {
                $folder = '/';
            }

            if (Str::startsWith($folder, $exclude)) {
                continue;
            }

            if (!$this->isVisible($folder)) {
                $exclude[] = $folder . '/';
                continue;
            }

            $result[] = $folder;
        }

        if (!in_array('/', $result)) {
            array_unshift($result, '/');
        }

        return $result;
    }

    /**
     * has checks for existence.
     * @param string $path
     * @return bool
     */
    public function has($path)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->has($path);
    }

    /**
     * size returns a file size in bytes.
     * @param string $path Specifies the file path relative the the Library root.
     * @return int Returns the file size
     */
    public function size($path)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->size($path);
    }

    /**
     * get returns a file contents.
     * @param string $path Specifies the file path relative the the Library root.
     * @return string Returns the file contents
     */
    public function get($path)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->get($path);
    }

    /**
     * put a file to the library.
     * @param string $path Specifies the file path relative the the Library root.
     * @param string $contents Specifies the file contents.
     * @return bool
     */
    public function put($path, $contents)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->put($path, $contents);
    }

    /**
     * put a file to the library.
     * @param string $path Specifies the file path relative the the Library root.
     * @param string $file Specifies the file path.
     * @return bool
     */
    public function putFile($path, $file)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->putFileAs(dirname($path), $file, basename($path));
    }

    /**
     * moveFile to another location.
     * @param string $oldPath Specifies the original path of the file.
     * @param string $newPath Specifies the new path of the file.
     * @return bool
     */
    public function moveFile($oldPath, $newPath, $isRename = false)
    {
        $oldPath = self::validatePath($oldPath);
        $newPath = self::validatePath($newPath);

        return $this->getStorageDisk()->move($oldPath, $newPath);
    }

    /**
     * copyFolder copies an original path to a newly located path.
     * @param string $originalPath
     * @param string $newPath
     * @return bool
     */
    public function copyFolder($originalPath, $newPath)
    {
        $disk = $this->getStorageDisk();

        $copyDirectory = function ($srcPath, $destPath) use (&$copyDirectory, $disk) {
            $srcPath = self::validatePath($srcPath);
            $destPath = self::validatePath($destPath);
            if (!$disk->makeDirectory($destPath)) {
                return false;
            }

            $folderContents = $this->scanFolderContents($srcPath);
            foreach ($folderContents['folders'] as $dirInfo) {
                if (!$copyDirectory($dirInfo->path, $destPath.'/'.basename($dirInfo->path))) {
                    return false;
                }
            }

            foreach ($folderContents['files'] as $fileInfo) {
                if (!$disk->copy($fileInfo->path, $destPath.'/'.basename($fileInfo->path))) {
                    return false;
                }
            }

            return true;
        };

        return $copyDirectory($originalPath, $newPath);
    }

    /**
     * moveFolder moves an original path to a newly located path.
     * @param string $originalPath
     * @param string $newPath
     * @return bool
     */
    public function moveFolder($originalPath, $newPath)
    {
        if (Str::lower($originalPath) !== Str::lower($newPath)) {
            // If there is no risk that the directory was renamed
            // by just changing the letter case in the name -
            // copy the directory to the destination path and delete
            // the source directory.
            if (!$this->copyFolder($originalPath, $newPath)) {
                return false;
            }

            $this->deleteFolder($originalPath);
        }
        else {
            // If there's a risk that the directory name was updated
            // by changing the letter case - swap source and destination
            // using a temporary directory with random name.
            $tempraryDirPath = $this->generateRandomTmpFolderName(dirname($originalPath));

            if (!$this->copyFolder($originalPath, $tempraryDirPath)) {
                $this->deleteFolder($tempraryDirPath);

                return false;
            }

            $this->deleteFolder($originalPath);

            return $this->moveFolder($tempraryDirPath, $newPath);
        }

        return true;
    }

    /**
     * makeFolder creates a folder.
     * @param string $path Specifies the folder path.
     * @return bool
     */
    public function makeFolder($path)
    {
        $path = self::validatePath($path);
        return $this->getStorageDisk()->makeDirectory($path);
    }

    /**
     * resetCache for the Library cache.
     *
     * The cache stores the library table of contents locally in order to optimize
     * the performance when working with remote storages. The default cache TTL is
     * 10 minutes. The cache is deleted automatically when an item is added, changed
     * or deleted. This method allows to reset the cache forcibly.
     */
    public function resetCache()
    {
        Cache::forget($this->cacheKey);
    }

    /**
     * validatePath checks if file path doesn't contain any substrings that would pose a security
     * threat. Returns a normalized path. Throws an exception if the path is not valid. An option
     * is provided, if only normalization is needed without validation.
     * @param string $path
     * @param bool $normalizeOnly
     * @return string
     */
    public static function validatePath($path, $normalizeOnly = false): string
    {
        $path = str_replace('\\', '/', $path);
        $path = '/'.trim($path, '/');

        if ($normalizeOnly) {
            return $path;
        }

        // Validate folder names
        $regexAllowlist = [
            '\w', // any word character
            preg_quote('@', '/'),
            preg_quote('.', '/'),
            '\s', // whitespace character
            preg_quote('-', '/'),
            preg_quote('_', '/'),
            preg_quote('/', '/'),
            preg_quote('(', '/'),
            preg_quote(')', '/'),
            preg_quote('[', '/'),
            preg_quote(']', '/'),
            preg_quote(',', '/'),
            preg_quote('=', '/'),
            preg_quote("'", '/'),
            preg_quote('&', '/'),
        ];

        if (!preg_match('/^[' . implode('', $regexAllowlist) . ']+$/iu', $path)) {
            throw new ApplicationException(Lang::get('system::lang.media.invalid_path', compact('path')));
        }

        $regexDirectorySeparator = preg_quote('/', '#');
        $regexDot = preg_quote('.', '#');
        $regex = [
            // Beginning of path
            '(^'.$regexDot.'+?'.$regexDirectorySeparator.')',

            // Middle of path
            '('.$regexDirectorySeparator.$regexDot.'+?'.$regexDirectorySeparator.')',

            // End of path
            '('.$regexDirectorySeparator.$regexDot.'+?$)',
        ];

        // Validate invalid paths
        $regex = '#'.implode('|', $regex).'#';
        if (preg_match($regex, $path) !== 0 || strpos($path, '//') !== false) {
            throw new ApplicationException(Lang::get('system::lang.media.invalid_path', compact('path')));
        }

        return $path;
    }

    /**
     * url is a helper that makes a URL for a media file.
     * Ideally the file should be passed as a string but it will try to deal with anything.
     * @param string $file
     * @return string
     */
    public static function url($file)
    {
        if (is_array($file)) {
            $file = array_first($file);
        }

        if ($file instanceof \Illuminate\Support\Collection) {
            $file = $file->first();
        }

        if ($file instanceof \October\Rain\Database\Attach\File) {
            return $file->getPath();
        }

        return static::instance()->getPathUrl($file);
    }

    /**
     * getPathUrl returns a public file URL.
     * @param string $path Specifies the file path relative the the Library root.
     * @return string
     */
    public function getPathUrl($path)
    {
        $path = self::validatePath($path);

        $fullPath = $this->storageUrl . implode('/', array_map('rawurlencode', explode('/', $path)));

        // Relative links
        if ($this->isLocalStorage() && Config::get('system.relative_links') === true) {
            return Url::toRelative($fullPath);
        }

        return Url::asset($fullPath);
    }

    /**
     * isVisible determines if the path should be visible and not ignored.
     * @param string $path
     * @return bool
     */
    protected function isVisible($path): bool
    {
        $baseName = basename($path);

        if (in_array($baseName, $this->ignoreNames)) {
            return false;
        }

        foreach ($this->ignorePatterns as $pattern) {
            if (preg_match('/'.$pattern.'/', $baseName)) {
                return false;
            }
        }

        return true;
    }

    /**
     * initLibraryItem from a path relative to the storage disk root and item type constant.
     * Returns null if the item is not visible.
     * @param string $path
     * @param string $itemType
     * @return mixed
     */
    protected function initLibraryItem($path, $itemType): ?MediaLibraryItem
    {
        $path = self::validatePath($path, true);

        if (!$this->isVisible($path)) {
            return null;
        }

        // S3 doesn't allow getting the last modified timestamp for folders,
        // so this feature is disabled - folders timestamp is always NULL.
        $lastModified = $itemType === MediaLibraryItem::TYPE_FILE
            ? $this->getStorageDisk()->lastModified($path)
            : null;

        // The folder size (number of items) doesn't respect filters. That
        // could be confusing for users, but that's safer than displaying
        // zero items for a folder that contains files not visible with a
        // currently applied filter. -ab
        $size = $itemType === MediaLibraryItem::TYPE_FILE
            ? $this->getStorageDisk()->size($path)
            : $this->getFolderItemCount($path);

        $publicUrl = $this->getPathUrl($path);

        return new MediaLibraryItem($path, $size, $lastModified, $itemType, $publicUrl);
    }

    /**
     * getFolderItemCount returns a number of items on a folder.
     * @param string $path Specifies the folder path relative to the storage disk root.
     * @return integer Returns the number of items in the folder.
     */
    protected function getFolderItemCount($path)
    {
        $folderItems = array_merge(
            $this->getStorageDisk()->files($path),
            $this->getStorageDisk()->directories($path)
        );

        $size = 0;
        foreach ($folderItems as $folderItem) {
            if ($this->isVisible($folderItem)) {
                $size++;
            }
        }

        return $size;
    }

    /**
     * scanFolderContents fetches the contents of a folder from the Library. The full folder
     * path relative the the storage disk root. Returns an array containing two elements
     * - 'files' and 'folders', each is an array of MediaLibraryItem objects.
     * @param string $fullFolderPath
     * @return array
     */
    protected function scanFolderContents(string $fullFolderPath): array
    {
        $result = [
            'files' => [],
            'folders' => []
        ];

        $files = $this->getStorageDisk()->files($fullFolderPath);
        foreach ($files as $file) {
            if ($libraryItem = $this->initLibraryItem($file, MediaLibraryItem::TYPE_FILE)) {
                $result['files'][] = $libraryItem;
            }
        }

        $folders = $this->getStorageDisk()->directories($fullFolderPath);
        foreach ($folders as $folder) {
            if ($libraryItem = $this->initLibraryItem($folder, MediaLibraryItem::TYPE_FOLDER)) {
                $result['folders'][] = $libraryItem;
            }
        }

        return $result;
    }

    /**
     * sortItemList sorts the item list by title, size or last modified date.
     * @param array $itemList Specifies the item list to sort.
     * @param mixed $sortSettings Determines the sorting preference.
     * Supported values are 'title', 'size', 'lastModified' (see SORT_BY_XXX class constants) or an associative array with a 'by' key and a 'direction' key: ['by' => SORT_BY_XXX, 'direction' => SORT_DIRECTION_XXX].
     */
    protected function sortItemList(&$itemList, $sortSettings)
    {
        // Convert string $sortBy to array
        if (is_string($sortSettings)) {
            $sortSettings = [
                'by' => $sortSettings,
                'direction' => self::SORT_DIRECTION_ASC,
            ];
        }

        usort($itemList, function ($a, $b) use ($sortSettings) {
            $result = 0;

            switch ($sortSettings['by']) {
                case self::SORT_BY_TITLE:
                    $result = strcasecmp($a->path, $b->path);
                    break;

                case self::SORT_BY_SIZE:
                    if ($a->size < $b->size) {
                        $result = -1;
                    }
                    else {
                        $result = $a->size > $b->size ? 1 : 0;
                    }
                    break;

                case self::SORT_BY_MODIFIED:
                    if ($a->lastModified < $b->lastModified) {
                        $result = -1;
                    }
                    else {
                        $result = $a->lastModified > $b->lastModified ? 1 : 0;
                    }
                    break;
            }

            // Reverse the polarity of the result to direct sorting in a descending order instead
            if ($sortSettings['direction'] === self::SORT_DIRECTION_DESC) {
                $result = 0 - $result;
            }

            return $result;
        });
    }

    /**
     * filterItemList by file type.
     * @param array $itemList Specifies the item list to sort.
     * @param string $filter Determines the document type filtering preference.
     * Supported values are 'image', 'video', 'audio', 'document' (see FILE_TYPE_XXX constants of MediaLibraryItem class).
     */
    protected function filterItemList(&$itemList, $filter)
    {
        if (!$filter) {
            return;
        }

        $result = [];
        foreach ($itemList as $item) {
            if ($item->getFileType() === $filter) {
                $result[] = $item;
            }
        }

        $itemList = $result;
    }

    /**
     * getStorageDisk initializes and returns the Media Library disk.
     * This method should always be used instead of trying to access the
     * $storageDisk property directly as initializing the disc requires
     * communicating with the remote storage.
     * @return mixed Returns the storage disk object.
     */
    protected function getStorageDisk()
    {
        if ($this->storageDisk) {
            return $this->storageDisk;
        }

        return $this->storageDisk = Storage::disk('media');
    }

    /**
     * pathMatchesSearch determines if file path contains all words form the search term.
     * @param string $path Specifies a path to examine.
     * @param array $words A list of words to check against.
     * @return bool
     */
    protected function pathMatchesSearch($path, $words)
    {
        $path = Str::lower($path);

        foreach ($words as $word) {
            $word = trim($word);
            if (!strlen($word)) {
                continue;
            }

            if (!Str::contains($path, $word)) {
                return false;
            }
        }

        return true;
    }

    /**
     * generateRandomTmpFolderName
     */
    protected function generateRandomTmpFolderName($location)
    {
        $temporaryDirBaseName = time();

        $tmpPath = $location.'/tmp-'.$temporaryDirBaseName;

        while ($this->folderExists($tmpPath)) {
            $temporaryDirBaseName++;
            $tmpPath = $location.'/tmp-'.$temporaryDirBaseName;
        }

        return $tmpPath;
    }

    /**
     * isLocalStorage returns true if the storage engine is local
     */
    protected function isLocalStorage()
    {
        return Config::get('filesystems.disks.media.driver') === 'local';
    }
}
