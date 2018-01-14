<?php namespace Cms\Classes;

/**
 * The CMS layout class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Layout extends CmsCompoundObject
{
    /**
     * Fallback layout name.
     */
    const FALLBACK_FILE_NAME = 'fallback';

    /**
     * @var string The container name associated with the model, eg: pages.
     */
    protected $dirName = 'layouts';

    protected function parseSettings()
    {
    }

    /**
     * Initializes the fallback layout.
     * @param \Cms\Classes\Theme $theme Specifies a theme the file belongs to.
     * @return \Cms\Classes\Layout
     */
    public static function initFallback($theme)
    {
        $obj = self::inTheme($theme);
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
        return $this->fileName === self::FALLBACK_FILE_NAME;
    }

    /**
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return mixed Returns the class name or null.
     */
    public function getCodeClassParent()
    {
        return LayoutCode::class;
    }
}
