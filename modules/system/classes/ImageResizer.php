<?php namespace System\Classes;

use App;
use Url;
use Cache;
use Event;
use Storage;
use SystemException;
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
     *              ['disk' => string, 'path' => string],
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
     * Instantiate a resizer instance from the provided identifier
     *
     * @param string $identifier The 40 character cache identifier for the desired resizer configuration
     * @throws SystemException If the identifier is unable to be loaded
     * @return static
     */
    public static function fromIdentifier(string $identifier)
    {
        // Attempt to retrieve the resizer configuration and remove the data from the cache after retrieval
        $config = Cache::pull(static::CACHE_PREFIX . $identifier, null);

        // Validate that the desired config was able to be loaded
        if (empty($config)) {
            throw new SystemException("Unable to retrieve the configuration for " . e($identifier));
        }

        return new static($config['image'], $config['width'], $config['height'], $config['options']);
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
            'uploads' => [
                'disk' => config('cms.storage.uploads.disk', 'local'),
                'folder' => config('cms.storage.uploads.folder', 'uploads'),
                'path' => config('cms.storage.uploads.path', '/storage/app/uploads'),
                'target' => 'alongside',
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
        if ($this->identifer) {
            return $this->identifier;
        }

        // Prepare the configuration
        $config = [
            'image' => $this->image,
            'width' => $this->width,
            'height' => $this->height,
            'options' => $this->options,
        ];

        // Generate the identifier
        $this->identifier = hash_hmac('sha1', json_encode($config), App::make('encrypter')->getKey());

        // If the image hasn't been resized yet, then store the config data for the resizer to use
        if (!$this->isResized()) {
            Cache::put(static::CACHE_PREFIX . $this->identifier, $config);
        }

        return $this->identifier;
    }

    /**
     * Normalize the provided input into information that the resizer can work with
     *
     * @param mixed $image Supported values below:
     *              ['disk' => string, 'path' => string],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @throws SystemException If the image was unable to be identified
     * @return array Array containing the disk, path, and selected source name ['disk' => string, 'path' => string, 'source' => string]
     */
    public static function normalizeImage($image)
    {
        $disk = null;
        $path = null;
        $selectedSource = null;

        // Process an array
        if (is_array($image) && !empty($image['disk']) && !empty($image['path'])) {
            $disk = $image['disk'];
            $path = $image['path'];

        // Process a FileModel
        } elseif ($image instanceof FileModel) {
            $disk = $image->getDisk();
            $path = $image->getDiskPath();

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
                    if ($disk->exists($path)) {
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
            throw new SystemException("Unable to process the provided image: " . e(var_export($image)));
        }

        return [
            'disk' => $disk,
            'path' => $path,
            'source' => $selectedSource,
        ];
    }


    /**
     * Get the reference to the resized image if the requested resize exists
     *
     * @param string $identifier The Resizer Identifier that references the source image and desired resizing configuration
     * @return bool|string
     */
    public function isResized()
    {
        // @Todo: need to centralize the target disk path / url generation logic
        $targetPath = implode('/', array_slice(str_split($identifier, 10), 0, 4)) . '/' . pathinfo($image['path'], PATHINFO_FILENAME) . "_resized_{$data['width']}_{$data['height']}.{$data['options']['extension']}";

        // @todo: Check if resized path exists on the target disk
    }

    public function resize($image, $width = null, $height = null, $options = [])
    {
        $identifier = static::getIdentifier($image, $width, $height, $options);
    }

    /**
     * Get the filename of the resized image
     */
    public function getResizedName()
    {
        return pathinfo($this->image['path'], PATHINFO_FILENAME) . "_resized.{$this->options['extension']}";
    }

    /**
     * Get the URL to the system resizer route for this instance's configuration
     *
     * @return string $url
     */
    public function getResizerUrl()
    {
        $identifier = $this->getIdentifier();
        $resizedName = $this->getResizedName();
        $source = $this->image['source'];

        return Url::to("/resizer/$identifier/$source/$name");
    }

    /**
     * Get the URL to the resized image
     *
     * @param string $identifier The 40 character unique identifier for the image
     * @param string $source The name of the source the image is being resized from
     * @param string $name The filename of the resized image
     * @return string
     */
    public static function getResizedUrl(string $identifier, string $source, string $name)
    {
        $sources = static::getAvailableSources();

        if (empty($sources[$source])) {
            throw new SystemException("The provided source is invalid: " . e($source));
        } else {
            $sourceConfig = $sources[$source];
        }

        switch ($sourceConfig['target']) {
            case 'alongside':
                break;
            default:
                $path = implode('/', array_slice(str_split($hash, 10), 0, 4)) . '/' . $name;
                $url = Storage::disk(config('cms.resized.disk'))->url($path);
                break;
        }

        return $url;
    }

    public function getUrl()
    {
        if ($this->isResized()) {
            return static::getResizedUrl($this->identifier, $this->image['source'], $this->getResizedName());
        } else {
            return $this->getResizerUrl();
        }
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
    public static function getFilterUrl()
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
                throw new SystemException("Unable to process the provided image: " . e(var_export($image)));
            }
        }

        return $resizer->getUrl();
    }
}
