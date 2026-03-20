<?php namespace Cms\Models;

use App;
use Url;
use Event;
use Model;
use Request;
use October\Contracts\Element\FormElement;
use Cms\Classes\Theme;

/**
 * PageLookupItem used by the pagefinder form widget
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class PageLookupItem extends Model
{
    /**
     * @var bool singleMode only allows items to be selected that resolve to a single URL.
     */
    public $singleMode = false;

    /**
     * @var bool allowCustomUrl controls whether the free-form URL option appears.
     */
    public $allowCustomUrl = true;

    /**
     * @var array|null allowedTypes restricts the type dropdown to these types only.
     */
    public $allowedTypes = null;

    /**
     * @var array|null excludedTypes removes these types from the dropdown.
     */
    public $excludedTypes = null;

    /**
     * @var bool nesting determines if auto-generated menu items could have subitems.
     */
    public $nesting = false;

    /**
     * @var array|bool sites includes a lookup for other sites.
     */
    public $sites = false;

    /**
     * @var array pageTypeInfoCache
     */
    protected static $pageTypeInfoCache = [];

    /**
     * SCHEMA_METADATA_KEYS are attribute keys used internally by the schema
     * and should not be treated as URL parameters.
     */
    const SCHEMA_METADATA_KEYS = ['type', 'reference', 'url', 'cms_page', 'title', 'search'];

    /**
     * defineFormFields
     */
    public function defineFormFields(FormElement $host)
    {
        $host->addFormField('search')->displayAs('partial')->path('field_page_search');
        $host->addFormField('type', 'Type')->displayAs('dropdown')->span('row')->spanClass('col-4');
        $host->addFormField('url', 'URL')->dependsOn('type')->span('row')->spanClass('col-8');
        $host->addFormField('reference', 'Reference')->displayAs('dropdown')->dependsOn('type')->span('row')->spanClass('col-8');
        $host->addFormField('cms_page', 'CMS Page')->displayAs('dropdown')->dependsOn('type');
    }

    /**
     * filterFields used by the form controller
     */
    public function filterFields($fields)
    {
        if ($this->type === 'url') {
            $fields->reference->hidden();
            $fields->cms_page->hidden();
        }
        elseif ($this->type === 'cms-page') {
            $fields->url->hidden();
            $fields->cms_page->hidden();
        }
        else {
            $fields->url->hidden();
        }

        if (!$this->typeInfoHasCmsPages()) {
            $fields->cms_page->hidden();
        }

        if (!$this->typeInfoHasAttribute('references')) {
            $fields->reference->disabled();
        }
    }

    /**
     * typeInfoHasAttribute
     */
    protected function typeInfoHasAttribute($attribute): bool
    {
        return array_key_exists($attribute, $this->getTypeInfo((string) $this->type));
    }

    /**
     * typeInfoHasCmsPages checks if type info has non-empty cmsPages
     */
    protected function typeInfoHasCmsPages(): bool
    {
        return !empty($this->getTypeInfo((string) $this->type)['cmsPages']);
    }

    /**
     * getCmsPageAttribute allows access to cms_page and cmsPage
     */
    public function getCmsPageAttribute()
    {
        return $this->attributes['cms_page'] ?? null;
    }

    /**
     * getTypeOptions
     */
    public function getTypeOptions()
    {
        $result = [
            'url' => 'URL',
        ];

        /**
         * @event cms.pageLookup.listTypes
         * Lists available types for locating CMS pages.
         *
         * Example usage:
         *
         *     Event::listen('cms.pageLookup.listTypes', function() {
         *         return [
         *             'blog-post' => 'Blog Post',
         *             'blog-category' => 'Blog Category',
         *             'blog-posts' => ['label' => 'All Blog Posts', 'nesting' => true],
         *         ];
         *     });
         *
         */
        $apiResult = Event::fire('cms.pageLookup.listTypes');

        if (is_array($apiResult)) {
            foreach ($apiResult as $typeList) {
                if (!is_array($typeList)) {
                    continue;
                }

                foreach ($typeList as $typeCode => $typeName) {
                    $isNested = false;

                    if (is_array($typeName)) {
                        // Named-key format: ['label' => '...', 'nesting' => true]
                        if (isset($typeName['label'])) {
                            $isNested = $typeName['nesting'] ?? false;
                            $typeName = $typeName['label'];
                        }
                        // Legacy format: ['Label', true]
                        elseif (
                            count($typeName) > 1 &&
                            is_bool($typeName[array_key_last($typeName)])
                        ) {
                            $isNested = array_pop($typeName);
                            $typeName = array_shift($typeName);
                        }
                    }

                    if (!$typeName) {
                        continue;
                    }

                    if ($this->singleMode && $isNested) {
                        continue;
                    }

                    $result[$typeCode] = $typeName;
                }
            }
        }

        // Filter out types that require CMS pages but have none available
        foreach ($result as $typeCode => $typeName) {
            if ($typeCode === 'url') {
                continue;
            }

            $typeInfo = $this->getTypeInfo($typeCode);
            if (array_key_exists('cmsPages', $typeInfo) && empty($typeInfo['cmsPages'])) {
                unset($result[$typeCode]);
            }
        }

        // Remove URL type if custom URLs are disabled
        if (!$this->allowCustomUrl) {
            unset($result['url']);
        }

        // Apply type whitelist
        if ($this->allowedTypes !== null) {
            $result = array_intersect_key($result, array_flip($this->allowedTypes));
        }

        // Apply type blacklist
        if ($this->excludedTypes !== null) {
            $result = array_diff_key($result, array_flip($this->excludedTypes));
        }

        return $result;
    }

    /**
     * getTypeLabel
     */
    public function getTypeLabel()
    {
        return $this->getTypeOptions()[$this->type] ?? '';
    }

    /**
     * getReferenceOptions
     */
    public function getReferenceOptions()
    {
        return $this->buildReferenceOptions(
            $this->getTypeInfo((string) $this->type)['references'] ?? []
        );
    }

    /**
     * getReferenceLabel
     */
    public function getReferenceLabel()
    {
        $label = $this->getReferenceOptions()[$this->reference] ?? '';
        $label = str_replace('&nbsp;', '', $label);
        return $label;
    }

    /**
     * getCmsPageOptions
     */
    public function getCmsPageOptions()
    {
        return $this->getTypeInfo((string) $this->type)['cmsPages'] ?? [];
    }

    /**
     * buildReferenceOptions handles reference options where outcome can be a single
     * dimension array or an array with [title, items]
     */
    protected function buildReferenceOptions($references)
    {
        if (count($references) === count($references, COUNT_RECURSIVE)) {
            return $references;
        }

        $indent = '&nbsp;&nbsp;&nbsp;';
        $options = [];

        $iterator = function($items, $depth = 0) use (&$iterator, &$options, $indent) {
            foreach ($items as $code => $itemData) {
                if (is_array($itemData)) {
                    $options[$code] = str_repeat($indent, $depth) . ($itemData['title'] ?? '');
                    if (!empty($itemData['items'])) {
                        $iterator($itemData['items'], $depth + 1);
                    }
                }
                elseif (is_string($itemData)) {
                    $options[$code] = str_repeat($indent, $depth) . $itemData;
                }
            }

            return $options;
        };

        return $iterator($references);
    }

    /**
     * getTypeInfo
     */
    public function getTypeInfo(string $type): array
    {
        if (!$type) {
            return [];
        }

        if (array_key_exists($type, static::$pageTypeInfoCache)) {
            return static::$pageTypeInfoCache[$type];
        }

        if ($type === 'url') {
            $result = [];
        }
        else {
            $result = $this->getTypeInfoFromEvent($type);
        }

        return static::$pageTypeInfoCache[$type] = $result;
    }

    /**
     * getTypeInfoFromEvent
     */
    protected function getTypeInfoFromEvent(string $type): array
    {
        $result = [];
        $apiResult = Event::fire('cms.pageLookup.getTypeInfo', [$type]);

        if (!is_array($apiResult)) {
            return $result;
        }

        foreach ($apiResult as $typeInfo) {
            if (!is_array($typeInfo)) {
                continue;
            }

            foreach ($typeInfo as $name => $value) {
                // Convert Page object to key value pair
                if ($name === 'cmsPages') {
                    $cmsPages = [];

                    foreach ($value as $page) {
                        $baseName = $page->getBaseFileName();
                        $pos = strrpos($baseName, '/');

                        $dir = $pos !== false ? substr($baseName, 0, $pos).' / ' : null;
                        $cmsPages[$baseName] = strlen($page->title)
                            ? $dir . $page->title
                            : $baseName;
                    }

                    $value = $cmsPages;
                }

                $result[$name] = $value;
            }
        }

        return $result;
    }

    /**
     * resolveItem resolves the page link by firing the cms.pageLookup.resolveItem
     * event. Listeners should return null if they do not handle the given type.
     *
     * Expected return array keys:
     * - url (string) - the resolved URL
     * - isActive (bool) - whether the item matches the current page
     * - title (string) - display title override
     * - mtime (mixed) - last modification time
     * - code (string) - page code identifier
     * - viewBag (array) - view bag data
     * - sites (array) - multi-site URL alternatives
     * - items (array) - child items for nested types
     *
     * Additional keys are stored as item attributes.
     */
    public function resolveItem()
    {
        if ($this->type === 'url') {
            return $this;
        }

        $currentUrl = mb_strtolower(Url::to(Request::path()));
        $defaultTheme = App::runningInBackend()
            ? Theme::getEditTheme()
            : Theme::getActiveTheme();

        $apiResult = Event::fire('cms.pageLookup.resolveItem', [
            $this->type,
            $this,
            $currentUrl,
            $defaultTheme
        ]);

        if (!is_array($apiResult)) {
            return $this;
        }

        foreach ($apiResult as $itemInfo) {
            if (!is_array($itemInfo)) {
                continue;
            }

            $this->title = $itemInfo['title'] ?? $this->title;
            $this->url = $itemInfo['url'] ?? $this->url;
            $this->isActive = $itemInfo['isActive'] ?? false;
            $this->viewBag = $itemInfo['viewBag'] ?? [];
            $this->code = $itemInfo['code'] ?? null;
            $this->mtime = $itemInfo['mtime'] ?? null;
            $this->sites = $itemInfo['sites'] ?? null;

            if (isset($itemInfo['items']) && is_array($itemInfo['items'])) {
                $this->items = $this->buildChildItems($itemInfo['items']);
            }

            // Merge only extra keys (not handled above) into attributes
            $knownKeys = ['title', 'url', 'isActive', 'viewBag', 'code', 'mtime', 'sites', 'items'];
            $this->attributes = array_merge(
                $this->attributes,
                array_diff_key($itemInfo, array_flip($knownKeys))
            );
        }

        return $this;
    }

    /**
     * buildChildItems
     */
    protected function buildChildItems($items)
    {
        $result = [];

        foreach ($items as $item) {
            $reference = new static;
            $reference->type = $item['type'] ?? null;
            $reference->title = $item['title'] ?? '-- no title --';
            $reference->url = $item['url'] ?? '#';
            $reference->isActive = $item['isActive'] ?? false;
            $reference->viewBag = $item['viewBag'] ?? [];
            $reference->code = $item['code'] ?? null;
            $reference->mtime = $item['mtime'] ?? null;
            $reference->sites = $item['sites'] ?? null;

            if (isset($item['items'])) {
                $reference->items = $this->buildChildItems($item['items']);
            }

            $result[] = $reference;
        }

        return $result;
    }

    /**
     * getPreviewUrl returns a URL suitable for display in the backend.
     * Shows stored param values where available, :paramName placeholders otherwise.
     */
    public function getPreviewUrl(): string
    {
        if ($this->type === 'url') {
            return $this->url ?? '';
        }

        $pageCode = $this->cmsPage ?: ($this->type === 'cms-page' ? $this->reference : null);
        if (!$pageCode) {
            return '';
        }

        $theme = App::runningInBackend()
            ? Theme::getEditTheme()
            : Theme::getActiveTheme();

        $page = \Cms\Classes\Page::loadCached($theme, $pageCode);
        if (!$page || !$page->url) {
            return '';
        }

        $segments = \October\Rain\Router\Helper::segmentizeUrl($page->url);
        $params = $this->getSchemaParams();

        $result = [];
        foreach ($segments as $segment) {
            if (strpos($segment, ':') !== 0) {
                $result[] = $segment;
                continue;
            }

            $paramName = \October\Rain\Router\Helper::getParameterName($segment);

            if (isset($params[$paramName]) && strlen($params[$paramName])) {
                $result[] = $params[$paramName];
            }
            else {
                $result[] = ':' . $paramName;
            }
        }

        return '/' . implode('/', $result);
    }

    /**
     * getSchemaParams returns the URL params stored in the october:// schema,
     * filtering out known metadata keys.
     */
    public function getSchemaParams(): array
    {
        return static::extractUrlParams($this->attributes);
    }

    /**
     * extractUrlParams returns URL-relevant parameters from an attributes
     * array, filtering out known schema metadata keys.
     */
    public static function extractUrlParams(array $attributes): array
    {
        $params = [];
        foreach ($attributes as $key => $value) {
            if (!in_array($key, static::SCHEMA_METADATA_KEYS) && is_scalar($value)) {
                $params[$key] = $value;
            }
        }
        return $params;
    }

    /**
     * resolveFromSchema
     */
    public static function resolveFromSchema(string $address, array $options = []): ?PageLookupItem
    {
        $item = static::fromSchema($address);
        if (!$item) {
            return null;
        }

        $item->nesting = (bool) array_get($options, 'nesting', false);
        $item->sites = (bool) array_get($options, 'sites', false);

        // Merge runtime params into attributes
        if ($runtimeParams = array_get($options, 'params', [])) {
            $item->attributes = array_merge($item->attributes, $runtimeParams);
        }

        $item->resolveItem();

        // Append fragment to resolved URL
        if ($item->fragment && $item->url) {
            $item->url .= '#' . $item->fragment;
        }

        return $item;
    }

    /**
     * fromSchema
     */
    public static function fromSchema(string $address): ?PageLookupItem
    {
        $decoded = self::decodeSchema($address);
        if (!$decoded) {
            return null;
        }

        $item = new static;
        $item->type = $decoded['type'];

        if ($item->type === 'url') {
            $item->url = $decoded['url'] ?? '';
        }
        else {
            $item->reference = $decoded['reference'];
            $item->fragment = $decoded['fragment'] ?? null;
            $item->attributes = array_merge($decoded['params'], $item->attributes);
        }

        return $item;
    }

    /**
     * decodeSchema will decode an October CMS protocol, e.g.
     * `october://cms-page/about/home/index?target=_blank`
     */
    public static function decodeSchema(string $address): array
    {
        $parts = parse_url($address);
        $schema = $parts['scheme'] ?? null;
        $target = $parts['host'] ?? null;
        $type = $parts['user'] ?? '';
        parse_str($parts['query'] ?? '', $params);

        if ($schema === 'october' && $target === 'link') {
            return [
                'type' => $type,
                'reference' => ltrim($parts['path'] ?? '', '/'),
                'params' => $params,
                'fragment' => $parts['fragment'] ?? null,
            ];
        }

        if (self::isValidUrl($address)) {
            return [
                'type' => 'url',
                'url' => $address,
            ];
        }

        return [];
    }

    /**
     * isValidUrl determines if the given path is a valid URL, similar to Laravel's
     * except it accepts relative paths. Eg: /contact
     * @param  string  $path
     * @return bool
     */
    public static function isValidUrl($path)
    {
        if (!preg_match('~^(#|/|https?://|(mailto|tel|sms):)~', $path)) {
            return filter_var($path, FILTER_VALIDATE_URL) !== false;
        }

        return true;
    }

    /**
     * encodeSchema will encode a link using the `october://` October CMS protocol schema, e.g.
     *
     *     PageLookupItem::encodeSchema('cms-page', 'about/home/index', ['target' => '_blank']);
     */
    public static function encodeSchema(string $type, string $reference = '', array $params = []): string
    {
        if ($type === 'url') {
            return $params['url'] ?? '';
        }

        $query = is_array($params) && $params ? '?' . http_build_query($params) : '';

        return "october://{$type}@link/{$reference}{$query}";
    }
}
