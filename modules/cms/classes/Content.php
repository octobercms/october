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
    /**
     * @var string The container name associated with the model, eg: pages.
     */
    protected $dirName = 'content';

    /**
     * @var array Allowable file extensions.
     */
    protected $allowedExtensions = ['htm', 'txt', 'md'];

    /**
     * @var string Contains the parsed markup.
     */
    public $parsedMarkup = null;

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
        $extension = strtolower(File::extension($this->fileName));

        switch ($extension) {
            case 'txt':
                $result = htmlspecialchars($this->markup);
                break;
            case 'md':
                $result = Markdown::parse($this->markup);
                break;
            default:
                $result = $this->markup;
        }

        return $result;
    }
}
