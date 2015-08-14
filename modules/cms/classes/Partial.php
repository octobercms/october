<?php namespace Cms\Classes;

/**
 * The CMS partial class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Partial extends CmsCompoundObject
{
    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'partials';
    }

    /**
     * Returns name of a PHP class to us a parent for the PHP class created for the object's PHP section.
     * @return mixed Returns the class name or null.
     */
    public function getCodeClassParent()
    {
        return '\Cms\Classes\PartialCode';
    }
}
