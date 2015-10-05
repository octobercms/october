<?php namespace Cms\Classes;

/**
 * The CMS layout class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Layout extends CmsCompoundObject
{
    const FALLBACK_FILE_NAME = 'fallback';

    protected function parseSettings()
    {
    }

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'layouts';
    }

    /**
     * Initializes the fallback layout.
     * @param \Cms\ClassesTheme $theme Specifies a theme the file belongs to.
     * @return \Cms\Classes\Layout
     */
    public static function initFallback($theme)
    {
        $obj = new self($theme);
        $obj->markup = '{% page %}';
        $obj->fileName = self::FALLBACK_FILE_NAME;
        return $obj;
    }

    /**
     * Returns true if the layout is a fallback layout
     * @return boolean
     */
    public function isFallBack()
    {
        return $this->fileName == self::FALLBACK_FILE_NAME;
    }

    /**
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return mixed Returns the class name or null.
     */
    public function getCodeClassParent()
    {
        return '\Cms\Classes\LayoutCode';
    }
}
