<?php namespace Cms\Classes;

use Site;
use File;
use Markdown;
use Cms\Classes\PageManager;

/**
 * Content file class.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Content extends CmsCompoundObject
{
    /**
     * @var string dirName associated with the model, eg: pages.
     */
    protected $dirName = 'content';

    /**
     * @var array allowedExtensions
     */
    protected $allowedExtensions = ['htm', 'html', 'txt', 'md'];

    /**
     * @var array purgeable attribute names which are not considered "settings".
     */
    protected $purgeable = ['parsedMarkup'];

    /**
     * @var string|null parsedMarkupCache holds the markup with links resolved for this request.
     */
    protected $parsedMarkupCache = null;

    /**
     * findLocalized returns a content file from a locale subdirectory, falling back
     * to the base file when no translation exists.
     * @param \Cms\Classes\Theme $theme
     * @param string $fileName
     * @param string|null $locale
     * @return static|null
     */
    public static function findLocalized($theme, $fileName, $locale = null)
    {
        $locale = $locale ?: Site::getActiveSite()?->hard_locale;

        foreach ($locale ? Site::getLocaleKeyChain($locale) : [] as $localeKey) {
            if ($content = static::loadCached($theme, $localeKey.'/'.$fileName)) {
                return $content;
            }
        }

        return static::loadCached($theme, $fileName);
    }

    /**
     * initCacheItem initializes the object properties from the cached data. The extra
     * data set here becomes available as attributes set on the model after fetch.
     * @param array $item
     */
    public static function initCacheItem(&$item)
    {
        $item['parsedMarkup'] = (new static($item))->parseMarkup();
    }

    /**
     * getParsedMarkupAttribute returns the parsed markup with page links resolved.
     * @return string
     */
    public function getParsedMarkupAttribute()
    {
        if ($this->parsedMarkupCache !== null) {
            return $this->parsedMarkupCache;
        }

        $result = $this->attributes['parsedMarkup'] ?? $this->parseMarkup();

        // Links resolve per request since their URLs depend on the active site and locale
        if ($this->isMarkupProcessable()) {
            $result = PageManager::processLinks($result);
        }

        return $this->parsedMarkupCache = $result;
    }

    /**
     * parseMarkup converts the file type to HTML, the result is safe to cache since
     * it does not depend on the request.
     * @return string
     */
    public function parseMarkup()
    {
        $extension = strtolower(File::extension($this->fileName));
        $result = $this->markup;

        if ($extension === 'md') {
            $result = Markdown::parse((string) $result);
        }
        elseif ($extension === 'txt') {
            $result = htmlspecialchars($result);
        }

        return $result;
    }

    /**
     * isMarkupProcessable returns true when the content type supports link
     * and snippet processing.
     */
    public function isMarkupProcessable(): bool
    {
        return in_array(
            strtolower(File::extension($this->fileName)),
            ['htm', 'html', 'md']
        );
    }
}
