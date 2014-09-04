<?php namespace Cms\Classes;

/**
 * The CMS content file class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Content extends CmsCompoundObject
{
    protected static $allowedExtensions = ['htm', 'txt', 'md'];

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'content';
    }
}
