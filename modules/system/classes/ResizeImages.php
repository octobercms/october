<?php namespace System\Classes;

use Url;
use Log;
use App;
use File;
use Route;
use Event;
use Cache;
use Config;
use Resizer;
use Storage;
use Redirect;
use Exception;
use October\Rain\Filesystem\Definitions as FileDefinitions;
use ApplicationException;
use finfo;

/**
 * ResizeImages is used for resizing image files
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ResizeImages
{
    /**
     * @var array availableSources to get image paths
     */
    protected $availableSources = [];

    /**
     * @var string storageFolder is the name of the folder in the resources disk
     */
    protected $storageFolder = 'resize';

    /**
     * @var string storageUrl relative or absolute URL of the Library root folder.
     */
    protected $storageUrl;

    /**
     * __construct this instance
     */
    public function __construct()
    {
        $this->storageUrl = rtrim(Config::get('filesystems.disks.resources.url', '/storage/app/resources'), '/');
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.resizer');
    }

    /**
     * resize generates and returns a thumbnail URL path
     *
     * @param integer $width
     * @param integer $height
     * @param array $options [
     *     'mode' => 'auto',
     *     'offset' => [0, 0],
     *     'quality' => 90,
     *     'sharpen' => 0,
     *     'interlace' => false,
     *     'extension' => 'auto',
     * ]
     * @return string
     */
    public static function resize($image, $width = null, $height = null, $options = [])
    {
        return self::instance()->prepareRequest($image, $width, $height, $options);
    }

    /**
     * prepareRequest checks if an image has been resized before and returns the URL,
     * otherwise the performs the resize by passing to a route that ends up at getContents
     */
    protected function prepareRequest($image, $width = null, $height = null, $options = [])
    {
        $imageItem = (new ResizeImageItem)->fromObject($image);
        $imageItem->toOptions($options);
        $imageItem->toDimensions($width, $height);

        if (!$imageItem->isResizable()) {
            return $imageItem->url;
        }

        // Check is resized
        if ($this->hasFile($imageItem)) {
            return $this->getPublicPath($imageItem);
        }

        // Cache and process
        $cacheKey = $imageItem->getCacheKey();
        $cacheInfo = $this->getCache($cacheKey);

        if (!$cacheInfo) {
            $this->putCache($cacheKey, $imageItem->getCacheInfo());
        }

        // Force immediate processing if requested
        if ($imageItem->options['force'] ?? false) {
            $this->processImage($cacheKey);
            return $this->getPublicPath($imageItem);
        }

        $outputFilename = $imageItem->getCacheVersion();

        return $this->getResizedUrl($outputFilename);
    }

    /**
     * getContents performs the resize and stores in on disk, creating a cache
     */
    public function getContents($cacheKey)
    {
        $cacheInfo = $this->getCache($cacheKey);
        if (!$cacheInfo || !isset($cacheInfo['path'])) {
            throw new ApplicationException(__("The resizer file ':name' is not found.", ['name' => e($cacheKey)]));
        }

        $this->processImage($cacheKey);

        $imageItem = (new ResizeImageItem)->fromCacheInfo($cacheKey, $cacheInfo);

        return Redirect::to($this->getPublicPath($imageItem));
    }

    /**
     * processImage performs the resize and stores it on disk
     */
    protected function processImage($cacheKey): void
    {
        $cacheInfo = $this->getCache($cacheKey);
        if (!$cacheInfo || !isset($cacheInfo['path'])) {
            return;
        }

        $imageItem = (new ResizeImageItem)->fromCacheInfo($cacheKey, $cacheInfo);

        // Set local paths for resizer
        $tempFilename = $imageItem->getPartitionDirectory() . '_' . $imageItem->getFilename();
        $tempTargetPath = $this->getTempPath() . '/' . $tempFilename;
        $tempSourcePath = $this->getTempPath() . '/raw_' . $tempFilename;
        $sourcePath = $this->getSourcePathForResize($cacheInfo['path'], $tempSourcePath);

        // Perform resize
        Resizer::open($sourcePath)
            ->resize($imageItem->width, $imageItem->height, $imageItem->options)
            ->save($tempTargetPath);

        // Save resized file to disk
        $disk = Storage::disk('resources');
        $filePath = $this->getStoragePath($imageItem);
        $success = $disk->putFileAs(
            dirname($filePath),
            $tempTargetPath,
            basename($filePath)
        );

        // Clean up
        File::delete($tempTargetPath);

        if (file_exists($tempSourcePath)) {
            File::delete($tempSourcePath);
        }

        // Eagerly cache remote exists call
        if ($success && !$this->isLocalStorage()) {
            Cache::forever($this->getExistsCacheKey($filePath), true);
        }
    }

    /**
     * getSourcePathForResize creates a temp copy of external files in the local filesystem
     */
    protected function getSourcePathForResize($realSourcePath, $tempSourcePath)
    {
        $isExternal = strpos($realSourcePath, 'http') === 0;
        $sourcePath = $isExternal ? $tempSourcePath : $realSourcePath;

        if ($isExternal) {
            // Validate file extension before fetching
            if (!$this->validateExternalImageUrl($realSourcePath)) {
                Log::warning("Blocked external image with invalid extension: {$realSourcePath}");
            }
            else {
                try {
                    $contents = file_get_contents($realSourcePath);

                    // Validate MIME type of fetched content
                    if ($this->validateImageContents($contents)) {
                        file_put_contents($tempSourcePath, $contents);
                    }
                    else {
                        Log::warning("Blocked external URL with non-image content: {$realSourcePath}");
                    }
                }
                catch (Exception $ex) {
                    Log::warning("Unable to fetch external image {$realSourcePath} [{$ex->getMessage()}]");
                }
            }
        }

        if (!file_exists($sourcePath)) {
            /**
             * @event system.resizer.handleMissingImage
             * Provides an opportunity to configure a custom image when the resizer couldn't find the original file
             *
             * Example usage:
             *
             *     Event::listen('system.resizer.handleMissingImage', function(&$sourcePath) {
             *         $sourcePath = plugins_path('vendor/plugin/assets/broken-image.jpg');
             *     });
             *
             */
            Event::fire('system.resizer.handleMissingImage', [&$sourcePath]);
        }

        return $sourcePath;
    }

    /**
     * validateExternalImageUrl checks if an external URL has a valid image extension
     */
    protected function validateExternalImageUrl(string $url): bool
    {
        $path = parse_url($url, PHP_URL_PATH);
        if (!$path) {
            return false;
        }

        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!$extension) {
            return false;
        }

        $allowedExtensions = FileDefinitions::get('image_extensions');

        return in_array($extension, $allowedExtensions);
    }

    /**
     * validateImageContents checks if the content is actually an image based on MIME type
     */
    protected function validateImageContents(string $contents): bool
    {
        if (empty($contents)) {
            return false;
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($contents);

        return str_starts_with($mimeType, 'image/');
    }

    /**
     * hasFile checks file exists on storage device
     */
    protected function hasFile($imageItem): bool
    {
        $filePath = $this->getStoragePath($imageItem);

        $disk = Storage::disk('resources');
        if ($this->isLocalStorage()) {
            return $disk->exists($filePath);
        }

        // Cache remote storage results for performance increase
        $result = Cache::memo()->remember($this->getExistsCacheKey($filePath), now()->addDays(30), function() use ($disk, $filePath) {
            return $disk->exists($filePath);
        });

        return $result;
    }

    /**
     * getResizedUrl
     */
    protected function getResizedUrl($outputFilename = 'undefined.css')
    {
        $combineAction = \System\Classes\SystemController::class.'@resize';
        $actionExists = Route::getRoutes()->getByAction($combineAction) !== null;

        if ($actionExists) {
            $result = Url::action($combineAction, [$outputFilename], false);
        }
        else {
            $result = '/resize/'.$outputFilename;
        }

        return Url::toRelative($result);
    }

    //
    // Paths
    //

    /**
     * getStoragePath returns a relative storage path for the image
     */
    public function getStoragePath($imageItem)
    {
        return $this->storageFolder . '/' . $imageItem->getFilepath();
    }

    /**
     * getPublicPath returns the public address for the resources path
     */
    public function getPublicPath($imageItem)
    {
        $publicPath = $this->storageUrl . '/resize';

        if ($this->isLocalStorage() && Config::get('system.relative_links') === true) {
            $result = Url::toRelative($publicPath);
        }
        else {
            $result = Url::asset($publicPath);
        }

        return $result . '/' . $imageItem->getFilepath();
    }

    /**
     * getTempPath returns an internal working path
     */
    public function getTempPath()
    {
        $path = temp_path('resize');

        if (!File::isDirectory($path)) {
            File::makeDirectory($path, 0755, true, true);
        }

        return $path;
    }

    /**
     * isLocalStorage returns true if the storage engine is local
     */
    protected function isLocalStorage()
    {
        return Config::get('filesystems.disks.resources.driver') === 'local';
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
        $cacheKey = 'resizer.'.$cacheKey;

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
        $cacheKey = 'resizer.'.$cacheKey;

        if ($cache = Cache::memo()->get($cacheKey)) {
            return @unserialize(@base64_decode($cache));
        }

        return false;
    }

    /**
     * getExistsCacheKey builds a key for caching the exists check
     */
    protected function getExistsCacheKey(string $filePath): string
    {
        return md5(json_encode([
            'type' => 'resizer-file',
            'path' => $filePath
        ]));
    }

    /**
     * resetCache resets the resizer cache
     * @return void
     */
    public static function resetCache()
    {
        if ($cache = Cache::get('resizer.index')) {
            $index = (array) @unserialize(@base64_decode($cache)) ?: [];

            foreach ($index as $cacheKey) {
                Cache::forget($cacheKey);
            }

            Cache::forget('resizer.index');
        }

        // CacheHelper::instance()->clearCombiner();
    }

    /**
     * putCacheIndex adds a cache identifier to the index store used for
     * performing a reset of the cache.
     * @param string $cacheKey Cache identifier
     * @return bool Returns false if identifier is already in store
     */
    protected function putCacheIndex($cacheKey)
    {
        $index = [];

        if ($cache = Cache::memo()->get('resizer.index')) {
            $index = (array) @unserialize(@base64_decode($cache)) ?: [];
        }

        if (in_array($cacheKey, $index)) {
            return false;
        }

        $index[] = $cacheKey;

        Cache::forever('resizer.index', base64_encode(serialize($index)));

        return true;
    }
}
