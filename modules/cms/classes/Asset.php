<?php namespace Cms\Classes;

use Config;
use Cms\Classes\Theme;

/**
 * The CMS theme asset file class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Asset extends CmsObject
{
    /**
     * Creates an instance of the object and associates it with a CMS theme.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     */
    public function __construct(Theme $theme)
    {
        parent::__construct($theme);

        self::$allowedExtensions = self::getEditableExtensions();
    }

    /**
     * Sets path for new asset files created from the back-end.
     * @param string $path Specifies the path.
     */
    public function setInitialPath($path)
    {
        $this->fileName = $path;
    }

    /**
     * Returns a list of editable asset extensions.
     * The list can be overridden with the cms.editableAssetTypes configuration option.
     * @return array
     */
    public static function getEditableExtensions()
    {
        $defaultTypes =  ['css','js','less','sass','scss'];

        $configTypes = Config::get('cms.editableAssetTypes');
        if (!$configTypes) {
            return $defaultTypes;
        }

        return $configTypes;
    }

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'assets';
    }

    /**
     * {@inheritDoc}
     */
    protected static function getMaxAllowedPathNesting()
    {
        return null;
    }
}
