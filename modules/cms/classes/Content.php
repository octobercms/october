<?php namespace Cms\Classes;

use File;
use Markdown;

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
     * @var string Contains the parsed markup.
     */
    public $parsedMarkup = null;

    /**
     * Returns the directory name corresponding to the object type.
     * For pages the directory name is "pages", for layouts - "layouts", etc.
     * @return string
     */
    public static function getObjectTypeDirName()
    {
        return 'content';
    }

    /**
     * Loads the object from a file.
     * @param \Cms\Classes\Theme $theme Specifies the theme the object belongs to.
     * @param string $fileName Specifies the file name, with the extension.
     * The file name can contain only alphanumeric symbols, dashes and dots.
     * @return boolean Returns true if the object was successfully loaded. Otherwise returns false.
     */
    public static function load($theme, $fileName)
    {
        if ($obj = parent::load($theme, $fileName)) {
            $obj->parsedMarkup = $obj->parseMarkup();
        }

        return $obj;
    }

    /**
     * Initializes the object properties from the cached data.
     * @param array $cached The cached data array.
     */
    protected function initFromCache($cached)
    {
        parent::initFromCache($cached);

        $this->parsedMarkup = array_key_exists('parsed-markup', $cached)
            ? $cached['parsed-markup']
            : $this->parseMarkup($this->markup);
    }

    /**
     * Initializes a cache item.
     * @param array &$item The cached item array.
     */
    protected function initCacheItem(&$item)
    {
        parent::initCacheItem($item);
        $item['parsed-markup'] = $this->parsedMarkup;
    }

    protected function parseMarkup()
    {
        $result = $this->markup;

        if (strtolower(File::extension($this->fileName)) == 'md') {
            $result = Markdown::parse($this->markup);
        }

        return $result;
    }
}
