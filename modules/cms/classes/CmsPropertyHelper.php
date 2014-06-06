<?php namespace Cms\Classes;

/**
 *
 * DEPRECATED WARNING: This class is deprecated and should be deleted
 * if the current year is equal to or greater than 2015.
 * 
 * @todo Delete this file if year >= 2015.
 *
 */

use Flash;
use Cms\Classes\Page;
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
        Flash::warning("CmsPropertyHelper::listPages() is deprecated, use Page::sortBy('baseFileName')->lists('baseFileName', 'baseFileName') instead.");
        return Page::sortBy('baseFileName')->lists('baseFileName', 'baseFileName');
    }
}