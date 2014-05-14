<?php namespace Cms\Classes;

use Cms\Classes\Page;
use Cms\Classes\Theme;
use System\Classes\ApplicationException;

/**
 * This class provides helper methods for inspectable properties.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsPropertyHelper
{
    /**
     * Returns a list of CMS pages as array of page file paths and titles.
     * @return array
     */
    public static function listPages()
    {
        if (!($theme = Theme::getEditTheme()))
            throw new ApplicationException(Lang::get('cms::lang.theme.edit.not_found'));

        $pages = Page::listInTheme($theme, true);

        $result = [];
        foreach ($pages as $page) {
            $fileName = $page->getBaseFileName();
            $result[$fileName] = $fileName;
        }

        ksort($result);

        return $result;
    }
}