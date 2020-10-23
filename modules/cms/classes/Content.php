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
     * @var array List of attribute names which are not considered "settings".
     */
    protected $purgeable = ['parsedMarkup'];

    /**
     * Initializes the object properties from the cached data. The extra data
     * set here becomes available as attributes set on the model after fetch.
     * @param array $item The cached data array.
     */
    public static function initCacheItem(&$item)
    {
        $item['parsedMarkup'] = (new static($item))->parseMarkup();
    }

    /**
     * Returns a default value for parsedMarkup attribute.
     * @return string
     */
    public function getParsedMarkupAttribute()
    {
        if (array_key_exists('parsedMarkup', $this->attributes)) {
            return $this->attributes['parsedMarkup'];
        }

        return $this->attributes['parsedMarkup'] = $this->parseMarkup();
    }

    /**
     * Parses the content markup according to the file type.
     * @return string
     */
    public function parseMarkup()
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
