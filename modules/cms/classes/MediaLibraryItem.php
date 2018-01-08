<?php namespace Cms\Classes;

use System\Classes\MediaLibraryItem as SystemMediaLibraryItem;

/**
 * Represents a file or folder in the Media Library.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 * @deprecated Use System\Classes\MediaLibraryItem. Remove if year >= 2020.
 */
class MediaLibraryItem extends SystemMediaLibraryItem
{
    public function __construct()
    {
        traceLog('Class Cms\Classes\MediaLibraryItem has been deprecated, use ' . SystemMediaLibraryItem::class . ' instead.');
        parent::__construct(...func_get_args());
    }
}
