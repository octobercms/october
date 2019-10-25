<?php namespace Backend\Classes;

use File;
use Config;
use October\Rain\Router\Helper as RouterHelper;

/**
 * Skin Base class
 * Used for defining skins.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class Skin
{
    /**
     * Returns information about this skin, including name and description.
     */
    abstract public function skinDetails();

    /**
     * @var string The absolute path to this skin.
     */
    public $skinPath;

    /**
     * @var string The public path to this skin.
     */
    public $publicSkinPath;

    /**
     * @var string The default skin path, usually the root level of modules/backend.
     */
    public $defaultSkinPath;

    /**
     * @var string The default public skin path.
     */
    public $defaultPublicSkinPath;

    /**
     * @var Self Cache of the active skin.
     */
    private static $skinCache;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->defaultSkinPath = base_path() . '/modules/backend';

        /*
         * Guess the skin path
         */
        $class = get_called_class();
        $classFolder = strtolower(class_basename($class));
        $classFile = realpath(dirname(File::fromClass($class)));
        $this->skinPath = $classFile
            ? $classFile . '/' . $classFolder
            : $this->defaultSkinPath;

        $this->publicSkinPath = File::localToPublic($this->skinPath);
        $this->defaultPublicSkinPath = File::localToPublic($this->defaultSkinPath);
    }

    /**
     * Looks up a path to a skin-based file, if it doesn't exist, the default path is used.
     * @param  string  $path
     * @param  boolean $isPublic
     * @return string
     */
    public function getPath($path = null, $isPublic = false)
    {
        $path = RouterHelper::normalizeUrl($path);
        $assetFile = $this->skinPath . $path;

        if (File::isFile($assetFile)) {
            return $isPublic
                ? $this->publicSkinPath . $path
                : $this->skinPath . $path;
        }

        return $isPublic
            ? $this->defaultPublicSkinPath . $path
            : $this->defaultSkinPath . $path;
    }

    /**
     * Returns an array of paths where skin layouts can be found.
     * @return array
     */
    public function getLayoutPaths()
    {
        return [$this->skinPath.'/layouts', $this->defaultSkinPath.'/layouts'];
    }

    /**
     * Returns the active skin.
     */
    public static function getActive()
    {
        if (self::$skinCache !== null) {
            return self::$skinCache;
        }

        $skinClass = Config::get('cms.backendSkin');
        $skinObject = new $skinClass();
        return self::$skinCache = $skinObject;
    }
}
