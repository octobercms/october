<?php namespace Cms\Classes;

/**
 * Represents a file or folder in the Media Library.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaLibraryItem
{
    const TYPE_FILE = 'file';

    const TYPE_FOLDER = 'folder';

    /**
     * @var string Specifies the item path relative to the Library root.
     */
    public $path; 

    /**
     * @var integer Specifies the item size.
     * For files the item size is measured in bytes. For folders it
     * contains the number of files in the folder.
     */
    public $size;

    /**
     * @var integer Contains the last modification time (Unix timestamp).
     */
    public $lastModified;

    /**
     * @var string Specifies the item type.
     */
    public $type;

    public function __construct($path, $size, $lastModified, $type)
    {
        $this->path = $path;
        $this->size = $size;
        $this->lastModified = $lastModified;
        $this->type = $type;
    }

    public function isFile()
    {
        return $this->type == self::TYPE_FILE;
    }
}