<?php namespace Backend\Classes;

use Config;

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

    public $skinPath;

    private static $skinCache;

    /**
     * Constructor.
     */
    public function __construct()
    {
        $this->skinPath = str_replace('\\', '/', get_called_class());
    }

    /**
     * Returns the active skin.
     */
    public static function getActive()
    {
        if (self::$skinCache !== null)
            return self::$skinCache;

        $skinClass = Config::get('cms.backendSkin');
        $skinObject = new $skinClass();
        return self::$skinCache = $skinObject;
    }
}