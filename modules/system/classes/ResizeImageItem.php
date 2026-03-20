<?php namespace System\Classes;

use App;
use Url;
use Str;
use File;
use Event;
use October\Rain\Database\Attach\File as FileModel;
use October\Rain\Element\ElementBase;

/**
 * ResizeImageItem
 *
 * @method ResizeImageItem url(string $url) url is the public location
 * @method ResizeImageItem path(string $path) path is the local location
 * @method ResizeImageItem extension(string $extension) extension for the file
 * @method ResizeImageItem source(string $source) source can be model, local, url
 * @method ResizeImageItem options(array $mode) options
 * @method ResizeImageItem width(int $width) width
 * @method ResizeImageItem height(int $height) height
 * @method ResizeImageItem cacheKey(string $cacheKey) cacheKey
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ResizeImageItem extends ElementBase
{
    /**
     * isResizable checks for SVG image types
     */
    public function isResizable()
    {
        if (strtolower($this->extension) === 'svg') {
            return false;
        }

        return true;
    }

    /**
     * getFilepath
     */
    public function getFilepath(): string
    {
        if ($groupFolder = $this->getGroupFolder()) {
            return $this->getPartitionDirectory() . '/' . $groupFolder . '/' . $this->getFilename();
        }

        return $this->getPartitionDirectory() . '/' . $this->getFilename();
    }

    /**
     * getFilename returns a generated filename for the resized image, adhering
     * to the 255 character limit on file sizes in Linux.
     */
    public function getFilename(): string
    {
        $filename = Str::limit($this->options['filename'], 222, '');
        $extension = $this->options['extension'];

        // Group folder
        if (isset($this->options['group'])) {
            return "{$filename}.{$extension}";
        }

        // Global folder
        $id = $this->getCacheKey();
        return "{$filename}_{$id}.{$extension}";
    }

    /**
     * getGroupFolder
     */
    public function getGroupFolder()
    {
        if ($this->options['group'] ?? null) {
            return Str::slug($this->options['group']);
        }

        return null;
    }

    /**
     * getPartitionDirectory
     */
    public function getPartitionDirectory(): string
    {
        $width = $this->width;
        $height = $this->height;
        $options = $this->options;
        $mode = $options['mode'];

        if (is_array($options['offset'] ?? null)) {
            $offsetX = $options['offset'][0] ?? ($options['offset']['x'] ?? 0);
            $offsetY = $options['offset'][1] ?? ($options['offset']['y'] ?? 0);
            return "{$width}_{$height}_{$offsetX}_{$offsetY}_{$mode}";
        }
        else {
            return "{$width}_{$height}_{$mode}";
        }
    }

    /**
     * getCacheVersion
     */
    public function getCacheVersion(): string
    {
        return $this->getCacheKey() . '-1';
    }

    /**
     * fromCacheInfo
     */
    public function fromCacheInfo($cacheKey, array $cacheInfo)
    {
        $this->cacheKey($cacheKey);
        $this->version($cacheInfo['version'] ?? null);
        $this->source($cacheInfo['source'] ?? null);
        $this->path($cacheInfo['path'] ?? null);
        $this->extension($cacheInfo['extension'] ?? null);
        $this->width($cacheInfo['width'] ?? 0);
        $this->height($cacheInfo['height'] ?? 0);
        $this->options((array) @json_decode(@base64_decode($cacheInfo['options']), true));
        return $this;
    }

    /**
     * getCacheInfo
     */
    public function getCacheInfo(): array
    {
        $cacheInfo = [
            'version' => $this->getCacheVersion(),
            'source' => $this->source,
            'path' => $this->path,
            'extension' => $this->extension,
            'width' => $this->width,
            'height' => $this->height,
            'options' => base64_encode(json_encode($this->options)),
        ];

        return $cacheInfo;
    }

    /**
     * getCacheKey
     */
    public function getCacheKey()
    {
        if ($this->cacheKey !== null) {
            return $this->cacheKey;
        }

        $payload = [
            'url' => $this->url,
            'path' => $this->path,
            'extension' => $this->extension,
            'source' => $this->source,
            'width' => $this->width,
            'height' => $this->height,
            'options' => $this->options
        ];

        $cacheKey = json_encode($payload);

        /**
         * @event cms.resizer.getCacheKey
         * Provides an opportunity to modify the asset resizer's cache key
         *
         * Example usage:
         *
         *     Event::listen('cms.resizer.getCacheKey', function((\System\Classes\ResizeImages) $assetCombiner, (stdClass) $dataHolder) {
         *         $dataHolder->key = rand();
         *     });
         *
         */
        $dataHolder = (object) ['key' => $cacheKey];
        Event::fire('cms.resizer.getCacheKey', [$this, $dataHolder]);
        $cacheKey = $dataHolder->key;

        return $this->cacheKey = md5($cacheKey);
    }

    /**
     * toDimensions
     */
    public function toDimensions($width, $height)
    {
        $this->width((int) $width);
        $this->height((int) $height);
    }

    /**
     * toOptions
     */
    public function toOptions($options)
    {
        $defaultOptions = [
            'mode' => 'auto',
            'offset' => null,
            'quality' => 90,
            'sharpen' => 0,
            'interlace' => false,
            'filename' => 'img',
            'group' => null,
            'extension' => 'auto',
            'force' => false,
        ];

        if (!is_array($options)) {
            $options = ['mode' => $options];
        }

        $options = array_merge($defaultOptions, $options);

        $options['mode'] = strtolower($options['mode']);

        // Use the same extension as source image
        if ($options['extension'] === 'auto') {
            $options['extension'] = $this->extension;
        }

        // Check filename
        if ($options['filename'] === true) {
            $options['filename'] = File::anyname(basename($this->path));
        }

        // Check group name
        if (!$this->validateGroupName($options['group'])) {
            $options['group'] = null;
        }

        return $this->options($options);
    }

    /**
     * fromObject
     */
    public function fromObject($image)
    {
        $result = [
            'url' => null,
            'path' => null,
            'extension' => null,
            'source' => null
        ];

        // File model
        if ($image instanceof FileModel) {
            $disk = $image->getDisk();
            $path = $image->getDiskPath();

            if (File::extension($path) && $disk->exists($path)) {
                $result['url'] = $image->getPath();
                $result['path'] = $image->getLocalPath();
                $result['extension'] = $image->getExtension();
                $result['source'] = 'model';
            }
        }
        elseif (is_string($image)) {
            $path = $this->parseFileName($image);

            // Local path
            if ($path !== null) {
                $url = Url::asset(File::localToPublic($path));
                $result['url'] = $url;
                $result['path'] = $path;
                $result['extension'] = File::extension($path);
                $result['source'] = 'local';
            }
            // URL
            elseif (strpos($image, '://') !== false) {
                $result['url'] = $result['path'] = $image;
                $result['extension'] = explode('?', File::extension($image))[0];
                $result['source'] = 'url';
            }
        }

        return $this->useConfig($result);
    }

    /**
     * parseFileName to get a relative path for the file
     * @return string
     */
    protected function parseFileName($filePath): ?string
    {
        // Local disk path
        if (file_exists($filePath)) {
            return $filePath;
        }

        // Pop off URI from URL
        $path = urldecode(parse_url($filePath, PHP_URL_PATH));

        foreach ($this->getAvailableSources() as $source) {
            if ($source['disk'] !== 'local') {
                continue;
            }

            $rootPath = $source['root'] ?? '';
            $relativeUrl = Url::makeRelative($source['url'] ?? '');

            if (!$rootPath || !$relativeUrl) {
                continue;
            }

            if (strpos($path, $relativeUrl) === false) {
                continue;
            }

            $pathParts = explode($relativeUrl, $path, 2);
            $finalPath = $rootPath . end($pathParts);
            if (file_exists($finalPath)) {
                return $finalPath;
            }
        }

        return null;
    }

    /**
     * getAvailableSources returns available sources
     */
    protected function getAvailableSources(): array
    {
        if ($this->availableSources) {
            return $this->availableSources;
        }

        $config = App::make('config');

        $sources = [
            'media' => [
                'disk' => $config->get('filesystems.disks.media.driver', 'local'),
                'root' => $config->get('filesystems.disks.media.root', storage_path('app/media')),
                'url' => $config->get('filesystems.disks.media.url', '/storage/app/media')
            ],
            'uploads' => [
                'disk' => $config->get('filesystems.disks.uploads.driver', 'local'),
                'root' => $config->get('filesystems.disks.uploads.root', storage_path('app/uploads')),
                'url' => $config->get('filesystems.disks.uploads.url', '/storage/app/uploads')
            ],
            'app' => [
                'disk' => 'local',
                'root' => base_path('app'),
                'url' => '/app'
            ],
            'modules' => [
                'disk' => 'local',
                'root' => base_path('modules'),
                'url' => '/modules'
            ],
            'plugins' => [
                'disk' => 'local',
                'root' => base_path('plugins'),
                'url' => '/plugins'
            ],
            'themes' => [
                'disk' => 'local',
                'root' => base_path('themes'),
                'url' => '/themes'
            ],
        ];

        /**
         * @event system.resizer.getAvailableSources
         * Provides an opportunity to modify the available sources
         *
         * Example usage:
         *
         *     Event::listen('system.resizer.getAvailableSources', function((array) &$sources)) {
         *         $sources['custom'] = [
         *              'disk' => 'custom',
         *              'root' => 'relative/path/on/disk',
         *              'url' => 'publicly/accessible/path',
         *         ];
         *     });
         *
         */
        Event::fire('system.resizer.getAvailableSources', [&$sources]);

        return $this->availableSources = $sources;
    }

    /**
     * validateGroupName ensures the group name is simple ASCII
     */
    protected function validateGroupName($groupName): bool
    {
        if (!is_string($groupName)) {
            return false;
        }

        if (strpos($groupName, '..') !== false) {
            return false;
        }

        if (strpos($groupName, './') !== false || strpos($groupName, '//') !== false) {
            return false;
        }

        if (!preg_match('/^[a-z0-9\_\s\-\.\/]+$/i', $groupName)) {
            return false;
        }

        return true;
    }
}
