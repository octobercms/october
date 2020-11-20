<?php namespace System\Twig;

use Url;
use System\Classes\ImageResizer;
use System\Classes\MediaLibrary;
use System\Classes\MarkupManager;
use Twig\TwigFilter as TwigSimpleFilter;
use Twig\Extension\AbstractExtension as TwigExtension;

/**
 * The System Twig extension class implements common Twig functions and filters.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Extension extends TwigExtension
{
    /**
     * @var \System\Classes\MarkupManager A reference to the markup manager instance.
     */
    protected $markupManager;

    /**
     * Creates the extension instance.
     */
    public function __construct()
    {
        $this->markupManager = MarkupManager::instance();
    }

    /**
     * Returns a list of functions to add to the existing list.
     *
     * @return array An array of functions
     */
    public function getFunctions()
    {
        $functions = [];

        /*
         * Include extensions provided by plugins
         */
        $functions = $this->markupManager->makeTwigFunctions($functions);

        return $functions;
    }

    /**
     * Returns a list of filters this extensions provides.
     *
     * @return array An array of filters
     */
    public function getFilters()
    {
        $filters = [
            new TwigSimpleFilter('app', [$this, 'appFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('media', [$this, 'mediaFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('resize', [$this, 'resizeFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('imageWidth', [$this, 'imageWidthFilter'], ['is_safe' => ['html']]),
            new TwigSimpleFilter('imageHeight', [$this, 'imageHeightFilter'], ['is_safe' => ['html']]),
        ];

        /*
         * Include extensions provided by plugins
         */
        $filters = $this->markupManager->makeTwigFilters($filters);

        return $filters;
    }

    /**
     * Returns a list of token parsers this extensions provides.
     *
     * @return array An array of token parsers
     */
    public function getTokenParsers()
    {
        $parsers = [];

        /*
         * Include extensions provided by plugins
         */
        $parsers = $this->markupManager->makeTwigTokenParsers($parsers);

        return $parsers;
    }

    /**
     * Converts supplied URL to one relative to the website root.
     * @param mixed $url Specifies the application-relative URL
     * @return string
     */
    public function appFilter($url)
    {
        return Url::to($url);
    }

    /**
     * Converts supplied file to a URL relative to the media library.
     * @param string $file Specifies the media-relative file
     * @return string
     */
    public function mediaFilter($file)
    {
        return MediaLibrary::url($file);
    }

    /**
     * Converts supplied input into a URL that will return the desired resized image
     *
     * @param mixed $image Supported values below:
     *              ['disk' => Illuminate\Filesystem\FilesystemAdapter, 'path' => string, 'source' => string, 'fileModel' => FileModel|void],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @param integer|bool|null $width Desired width of the resized image
     * @param integer|bool|null $height Desired height of the resized image
     * @param array|null $options Array of options to pass to the resizer
     * @throws Exception If the provided image was unable to be processed
     * @return string
     */
    public function resizeFilter($image, $width = null, $height = null, $options = [])
    {
        return ImageResizer::filterGetUrl($image, $width, $height, $options);
    }

    /**
     * Gets the width in pixels of the provided image source
     *
     * @param mixed $image Supported values below:
     *              ['disk' => Illuminate\Filesystem\FilesystemAdapter, 'path' => string, 'source' => string, 'fileModel' => FileModel|void],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @return int
     */
    public function imageWidthFilter($image)
    {
        return @ImageResizer::filterGetDimensions($image)['width'];
    }

    /**
     * Gets the height in pixels of the provided image source
     *
     * @param mixed $image Supported values below:
     *              ['disk' => Illuminate\Filesystem\FilesystemAdapter, 'path' => string, 'source' => string, 'fileModel' => FileModel|void],
     *              instance of October\Rain\Database\Attach\File,
     *              string containing URL or path accessible to the application's filesystem manager
     * @return int
     */
    public function imageHeightFilter($image)
    {
        return @ImageResizer::filterGetDimensions($image)['height'];
    }
}
