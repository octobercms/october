<?php namespace System\Classes;

use App;
use Url;
use Crypt;
use Cache;
use Event;
use Config;
use Storage;
use SystemException;
use System\Models\File as SystemFileModel;
use October\Rain\Database\Attach\File as FileModel;

/**
 * $width = numeric, 'auto' | false | null
 * $height = numeric, 'auto' | false | null
 * $options = null | array [
 *      'mode' => [
 *          'auto',         // automatically choose between portrait and landscape based on the image's orientation
 *          'exact',        // resize to the exact dimensions given, without preserving aspect ratio
 *          'portrait',     // resize to the given height and adapt the width to preserve aspect ratio
 *          'landscape',    // resize to the given width and adapt the height to preserve aspect ratio
 *          'crop',         // crop to the given dimensions after fitting as much of the image as possible inside those
 *          'fit',          // fit the image inside the given maximal dimensions, keeping the aspect ratio
 *      ],
 *      'quality'   => numeric, 1 - 100
 *      'interlace' => boolean (default false),
 *      'extension' => ['auto', 'png', 'gif', 'jpg', 'jpeg', 'webp', 'bmp', 'ico'],
 *      'offset'    => [x, y] Offset to crop the image from
 *      'sharpen'   => numeric, 1 - 100
 *
 *      // Options that could be processed by an addon
 *
 *      'blur'      => numeric, 1 - 100
 *      'brightness'=> numeric, -100 - 100
 *      'contrast'  => numeric, -100 - 100
 *      'pixelate'  => numeric, 1 - 5000
 *      'greyscale' => boolean
 *      'invert'    => boolean
 *      'opacity'   => numeric, 0 - 100
 *      'rotate'    => numeric, 1 - 360
 *      'flip'      => [h, v]
 *      'background' | 'fill' => string, hex value
 *      'colourize' => string, RGB value
 * ]
 *
 * Event::fire('system.resizer.afterResize')
 * Event::fire('system.resizer.beforeResize')
 * Event::fire('system.resizer.processResize')
 * Event::fire('system.resizer.getAvailableSources', [&$sourcesArray])
 *
 *
 */

/**
 * DRAFT RESIZER DESIGN
 * This is a rough draft, very WIP, of what the Image resizer UX / API will look like in October.
 *
 * Notes:
 * - Clearing the application cache should not invalidate any existing resized images
 * - Invalid images should not result in a valid "image not found" image existing, it should result in a 404 or more specific error
 * - Provide a new backend list column type "thumb" that will pass it through the resizer
 *
 * Configurations to support
 *
 * - Developer can provide a image (in a wide range of various formats so long as the application actually has access to the provided image
 * and can understand how to access it) to the `| resize(width, height, options)` Twig filter. That filter will output either a link to the
 * final generated image as requested or a link to the resizer route that will actually handle resizing the image.
 * - User should be able to extend the image resizing to provide pre or post processing of the images before / after being resized
 * also to include the ability to swap out the image resizer itself. The core workflow logic should remain the same though.
 *      Examples:
 *      - Post processing of resized images with TinyPNG to optimize filesize further
 *      - Replacement processing of resizing with Intervention Image (using GD or ImageMagick)
 */

/**
 * Image Resizing class used for resizing any image resources accessible
 * to the application.
 *
 * This works by accepting a variety of image sources and normalizing the
 * pipeline for storing the desired resizing configuration and then
 * deferring the actual resizing of the images until requested by the browser.
 *
 * When the resizer route is hit, the configuration is retrieved from the cache
 * and used to generate the desired image and then redirect to the generated images
 * static path to minimize the load on the server. Future loads of the image are
 * automatically pointed to the static URL of the resized image without even hitting
 * the resizer route.
 *
 * The functionality of this class is controlled by these config items:
 *
 * - cms.resized.disk -
 * - cms.resized.folder -
 * - cms.resized.path -
 *
 * @see System\Classes\SystemController System controller
 * @package october\system
 * @author Luke Towers
 */
class ImageResizer
{
    /**
     * @var string The cache key prefix for resizer configs
     */
    public const CACHE_PREFIX = 'system.resizer.';

    /**
     * @var string Unique identifier for the current configuration
     */
    protected $identifier = null;

    /**
     * @var array Image source data ['disk' => string, 'path' => string, 'source' => string]
     */
    protected $image = [];

    /**
     * @var FileModel The instance of the FileModel for the source image
     */
    protected $fileModel = null;

    /**
     * @var integer Desired width
     */
    protected $width = null;

    /**
     * @var integer Desired height
     */
    protected $height = null;

    /**
     * @var array Image resizing configuration data
     */
    protected $options = [];

    /**
     * Prepare the resizer instance
     *
     * @param mixed $image Supported values below:
     *              ['disk' => Illuminate\Filesystem\FilesystemAdapter, 'path' => string],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @param integer|bool|null $width Desired width of the resized image
     * @param integer|bool|null $height Desired height of the resized image
     * @param array|null $options Array of options to pass to the resizer
     */
    public function __construct($image, $width = null, $height = null, $options = [])
    {
        $this->image = static::normalizeImage($image);
        $this->width = is_numeric($width) ? (int) $width : null;
        $this->height = is_numeric($height) ? (int) $height : null;
        $this->options = array_merge($this->getDefaultOptions(), $options);
    }

    /**
     * Get the default options for the resizer
     *
     * @return array
     */
    public function getDefaultOptions()
    {
        // Default options for the built in resizing processor
        $defaultOptions = [
            'mode'      => 'auto',
            'offset'    => [0, 0],
            'sharpen'   => 0,
            'interlace' => false,
            'quality'   => 90,
            'extension' => pathinfo($this->image['path'], PATHINFO_EXTENSION),
        ];

        /**
         * @event system.resizer.getDefaultOptions
         * Provides an opportunity to modify the default options used when generating image resize requests
         *
         * Example usage:
         *
         *     Event::listen('system.resizer.getDefaultOptions', function ((array) &$defaultOptions)) {
         *         $defaultOptions['background'] = '#f2f2f2';
         *     });
         *
         */
        Event::fire('system.resizer.getDefaultOptions', [&$defaultOptions]);

        return $defaultOptions;
    }

    /**
     * Get the available sources for processing image resize requests from
     *
     * @return array
     */
    public static function getAvailableSources()
    {
        $sources = [
            'themes' => [
                'disk' => 'system',
                'folder' => config('cms.themesPathLocal', base_path('themes')),
                'path' => config('cms.themesPath', '/themes'),
            ],
            'plugins' => [
                'disk' => 'system',
                'folder' => config('cms.pluginsPathLocal', base_path('plugins')),
                'path' => config('cms.pluginsPath', '/plugins'),
            ],
            'media' => [
                'disk' => config('cms.storage.media.disk', 'local'),
                'folder' => config('cms.storage.media.folder', 'media'),
                'path' => config('cms.storage.media.path', '/storage/app/media'),
            ],
            'modules' => [
                'disk' => 'system',
                'folder' => base_path('modules'),
                'path' => '/modules',
            ],
            'filemodel' => [
                'disk' => config('cms.storage.uploads.disk', 'local'),
                'folder' => config('cms.storage.uploads.folder', 'uploads'),
                'path' => config('cms.storage.uploads.path', '/storage/app/uploads'),
            ],
        ];

        /**
         * @event system.resizer.getAvailableSources
         * Provides an opportunity to modify the sources available for processing resize requests from
         *
         * Example usage:
         *
         *     Event::listen('system.resizer.getAvailableSources', function ((array) &$sources)) {
         *         $sources['custom'] = [
         *              'disk' => 'custom',
         *              'folder' => 'relative/path/on/disk',
         *              'path' => 'publicly/accessible/path',
         *         ];
         *     });
         *
         */
        Event::fire('system.resizer.getAvailableSources', [&$sources]);

        return $sources;
    }

    /**
     * Get the current config
     *
     * @return array
     */
    public function getConfig()
    {
        $config = [
            'image' => [
                'disk' => $this->image['disk'],
                'path' => $this->image['path'],
                'source' => $this->image['source'],
            ],
            'width' => $this->width,
            'height' => $this->height,
            'options' => $this->options,
        ];

        if (!empty($this->image['fileModel']) && $this->image['fileModel'] instanceof FileModel) {
            $config['image']['fileModel'] = [
                'class' => get_class($this->image['fileModel']),
                'key' => $this->image['fileModel']->getKey(),
            ];
        }

        return $config;
    }

    /**
     * Process the resize request
     */
    public function resize()
    {
        if ($this->isResized()) {
            return;
        }
    }

    /**
     * Gets the current fileModel associated with the source image if one exists
     *
     * @return FileModel|null
     */
    public function getFileModel()
    {
        if ($this->fileModel) {
            return $this->fileModel;
        }

        if ($this->image['source'] === 'filemodel') {
            if ($this->image['fileModel'] instanceof FileModel) {
                $this->fileModel = $this->image['fileModel'];
            } else {
                $this->fileModel = $this->image['fileModel']['class']::findOrFail($this->image['fileModel']['key']);
            }
        }

        return $this->fileModel;
    }

    /**
     * Get the reference to the resized image if the requested resize exists
     *
     * @param string $identifier The Resizer Identifier that references the source image and desired resizing configuration
     * @return bool|string
     */
    public function isResized()
    {
        if ($this->image['source'] === 'fileupload') {
            $model = $this->getFileModel();
            $thumbFile = $model->getThumbFilename($this->width, $this->height, $this->options);
            $disk = $model->getDisk();
            $path = $model->getDiskPath($thumbFile);
        } else {
            $disk = Storage::disk(Config::get('cms.resized.disk', 'local'));
            $path = $this->getPathToResizedImage();
        }

        // Return true if the path is a file and it exists on the target disk
        return !empty(pathinfo($path, PATHINFO_EXTENSION)) && $disk->exists($path);
    }

    /**
     * Get the path of the resized image
     */
    public function getPathToResizedImage()
    {
        // Generate the unique file identifier for the resized image
        $fileIdentifier = hash_hmac('sha1', serialize($this->getConfig()), Crypt::getKey());

        // Generate the filename for the resized image
        $name = pathinfo($this->image['path'], PATHINFO_FILENAME) . "_resized_$fileIdentifier.{$this->options['extension']}";

        // Generate the path to the containing folder for the resized image
        $folder = implode('/', array_slice(str_split(str_limit($fileIdentifier, 9), 3), 0, 3));

        // Generate and return the full path
        return Config::get('cms.resized.folder', 'resized') . '/' . $folder . '/' . $name;
    }

    /**
     * Gets the current useful URL to the resized image
     * (resizer if not resized, resized image directly if resized)
     *
     * @return string
     */
    public function getUrl()
    {
        if ($this->isResized()) {
            return $this->getResizedUrl();
        } else {
            return $this->getResizerUrl();
        }
    }

    /**
     * Get the URL to the system resizer route for this instance's configuration
     *
     * @return string $url
     */
    public function getResizerUrl()
    {
        // Slashes in URL params have to be double encoded to survive Laravel's router
        // @see https://github.com/octobercms/october/issues/3592#issuecomment-671017380
        $resizedUrl = urlencode(urlencode($this->getResizedUrl()));
        $identifier = $this->getIdentifier();

        return Url::to("/resizer/$identifier/$resizedUrl");
    }

    /**
     * Get the URL to the resized image
     *
     * @return string
     */
    public function getResizedUrl()
    {
        $url = '';

        if ($this->image['source'] === 'filemodel') {
            $model = $this->getFileModel();
            $thumbFile = $model->getThumbFilename($this->width, $this->height, $this->options);
            $url = $model->getPath($thumbFile);
        } else {
            $resizedDisk = Storage::disk(Config::get('cms.resized.disk', 'local'));
            $url = $resizedDisk->url($this->getPathToResizedImage());
        }

        return $url;
    }

    /**
     * Normalize the provided input into information that the resizer can work with
     *
     * @param mixed $image Supported values below:
     *              ['disk' => Illuminate\Filesystem\FilesystemAdapter, 'path' => string, 'source' => string],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @throws SystemException If the image was unable to be identified
     * @return array Array containing the disk, path, and extension ['disk' => Illuminate\Filesystem\FilesystemAdapter, 'path' => string, 'source' => string, 'fileModel' => FileModel|void]
     */
    public static function normalizeImage($image)
    {
        $disk = null;
        $path = null;
        $selectedSource = null;
        $fileModel = null;

        // Process an array
        if (is_array($image) && !empty($image['disk']) && !empty($image['path']) && !empty($image['source'])) {
            $disk = $image['disk'];
            $path = $image['path'];
            $selectedSource = $image['source'];

            // Verify that the source file exists
            if (empty(pathinfo($path, PATHINFO_EXTENSION)) || !$disk->exists($path)) {
                $disk = null;
                $path = null;
                $selectedSource = null;
            }

            if (!empty($image['fileModel'])) {
                $fileModel = $image['fileModel'];
            }

        // Process a FileModel
        } elseif ($image instanceof FileModel) {
            $disk = $image->getDisk();
            $path = $image->getDiskPath();
            $selectedSource = 'filemodel';
            $fileModel = $image;

            // Verify that the source file exists
            if (empty(pathinfo($path, PATHINFO_EXTENSION)) || !$disk->exists($path)) {
                $disk = null;
                $path = null;
                $selectedSource = null;
                $fileModel = null;
            }

        // Process a string
        } elseif (is_string($image)) {
            // Parse the provided image path into a filesystem ready relative path
            $relativePath = urldecode(parse_url($image, PHP_URL_PATH));

            // Loop through the sources available to the application to pull from
            // to identify the source most likely to be holding the image
            $resizeSources = static::getAvailableSources();
            foreach ($resizeSources as $source => $details) {
                // Normalize the source path
                $sourcePath = urldecode(parse_url($details['path'], PHP_URL_PATH));

                // Identify if the current source is a match
                if (starts_with($relativePath, $sourcePath)) {
                    // Attempt to handle FileModel URLs passed as strings
                    if ($source === 'filemodel') {
                        $diskName = pathinfo($relativePath, PATHINFO_BASENAME);
                        $model = SystemFileModel::where('disk_name', $diskName)->first();
                        if ($model && $image = static::normalizeImage($model)) {
                            $disk = $image['disk'];
                            $path = $image['path'];
                            $selectedSource = $image['source'];
                            $fileModel = $image['fileModel'];
                            break;
                        }
                    }

                    // Generate a path relative to the selected disk
                    $path = $details['folder'] . '/' . str_after($relativePath, $sourcePath . '/');

                    // Handle disks of type "system" (the local file system the application is running on)
                    if ($details['disk'] === 'system') {
                        Config::set('filesystems.disks.system', [
                            'driver' => 'local',
                            'root' => base_path(),
                        ]);
                        // Regenerate the path relative to the newly defined "system" disk
                        $path = str_after($path, base_path() . '/');
                    }

                    $disk = Storage::disk($details['disk']);

                    // Verify that the file exists before exiting the identification process
                    if (!empty(pathinfo($path, PATHINFO_EXTENSION)) && $disk->exists($path)) {
                        $selectedSource = $source;
                        break;
                    } else {
                        $disk = null;
                        $path = null;
                        continue;
                    }
                }
            }
        }

        if (!$disk || !$path || !$selectedSource) {
            if (is_object($image)) {
                $image = get_class($image);
            }
            throw new SystemException("Unable to process the provided image: " . e(var_export($image, true)));
        }

        $data = [
            'disk' => $disk,
            'path' => $path,
            'source' => $selectedSource,
        ];

        if ($fileModel) {
            $data['fileModel'] = $fileModel;
        }

        return $data;
    }

    /**
     * Check if the provided identifier looks like a valid identifier
     *
     * @param string $id
     * @return bool
     */
    public static function isValidIdentifier($id)
    {
        return is_string($id) && ctype_alnum($id) && strlen($id) === 40;
    }

    /**
     * Gets the identifier for provided resizing configuration
     * This method validates, authorizes, and prepares the resizing request for execution by the resizer
     * Invalid images (inaccessible, private, incompatible formats, etc) should be denied here, and only
     * after successfull validation should the requested configuration be stored along with a signed hash
     * of the the options
     *
     * @return string 40 character string used as a unique reference to the provided configuration
     */
    public function getIdentifier()
    {
        if ($this->identifier) {
            return $this->identifier;
        }

        // Generate the identifier
        $this->identifier = hash_hmac('sha1', $this->getResizedUrl(), Crypt::getKey());

        // If the image hasn't been resized yet, then store the config data for the resizer to use
        if (!$this->isResized()) {
            // @TODO: remove the cache timeout when testing in Laravel 6, L5.5 didn't support rememberForever in put
            Cache::put(static::CACHE_PREFIX . $this->identifier, $this->getConfig(), now()->addMinutes(10));
        }

        return $this->identifier;
    }

    /**
     * Instantiate a resizer instance from the provided identifier
     *
     * @param string $identifier The 40 character cache identifier for the desired resizer configuration
     * @throws SystemException If the identifier is unable to be loaded
     * @return static
     */
    public static function fromIdentifier(string $identifier)
    {
        // Attempt to retrieve the resizer configuration and remove the data from the cache after retrieval
        $config = Cache::get(static::CACHE_PREFIX . $identifier, null); // @TODO: replace with pull()

        dd($config);

        // Validate that the desired config was able to be loaded
        if (empty($config)) {
            throw new SystemException("Unable to retrieve the configuration for " . e($identifier));
        }

        return new static($config['image'], $config['width'], $config['height'], $config['options']);
    }

    /**
     * Check the provided encoded URL to verify its signature and return the decoded URL
     *
     * @param string $identifier
     * @param string $encodedUrl
     * @return string|null Returns null if the provided value was invalid
     */
    public static function getValidResizedUrl($identifier, $encodedUrl)
    {
        // Slashes in URL params have to be double encoded to survive Laravel's router
        // @see https://github.com/octobercms/october/issues/3592#issuecomment-671017380
        $decodedUrl = urldecode(urldecode($encodedUrl));
        $url = null;

        // The identifier should be the signed version of the decoded URL
        if (static::isValidIdentifier($identifier) && $identifier === hash_hmac('sha1', $decodedUrl, Crypt::getKey())) {
            $url = $decodedUrl;
        }

        return $url;
    }

    /**
     * Converts supplied input into a URL that will return the desired resized image
     *
     * @param mixed $image Supported values below:
     *              ['disk' => string, 'path' => string],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @param integer|bool|null $width Desired width of the resized image
     * @param integer|bool|null $height Desired height of the resized image
     * @param array|null $options Array of options to pass to the resizer
     * @throws SystemException If the provided input was unable to be processed
     * @return string
     */
    public static function getFilterUrl($image, $width = null, $height = null, $options = [])
    {
        // Attempt to process the provided image
        try {
            $resizer = new ImageResizer($image, $width, $height, $options);
        } catch (SystemException $ex) {
            // Ignore processing this URL if the resizer is unable to identify it
            if (is_string($image)) {
                return $image;
            } elseif ($image instanceof FileModel) {
                return $image->getPath();
            } else {
                throw $ex;
            }
        }

        return $resizer->getUrl();
    }
}
