<?php namespace Cms\Components;

use Site;
use Cms\Classes\ComponentModuleBase;

/**
 * TranslatableBag stores translated template properties for each site, including the URL.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class TranslatableBag extends ComponentModuleBase
{
    /**
     * @var string LOCALES_PROPERTY is the property containing the translated values.
     */
    const LOCALES_PROPERTY = 'locales';

    /**
     * componentDetails
     * @return array
     */
    public function componentDetails()
    {
        return [
            'name' => 'Translatable',
            'description' => 'Translates template properties for each site, including the URL.',
            'icon' => 'icon-globe'
        ];
    }

    /**
     * defineProperties uses an object list keyed by locale.
     * @return array
     */
    public function defineProperties()
    {
        $result = [
            self::LOCALES_PROPERTY => [
                'title' => 'Locales',
                'description' => 'Translated properties for each locale.',
                'type' => 'objectList',
                'titleProperty' => 'locale',
                'keyProperty' => 'locale',
                'showExternalParam' => false,
                'itemProperties' => [
                    [
                        'property' => 'locale',
                        'title' => 'Locale',
                        'description' => $this->makeLocaleDescription(),
                        'type' => 'string'
                    ],
                    [
                        'property' => 'url',
                        'title' => "cms::lang.editor.url",
                        'placeholder' => "/",
                        'type' => 'string'
                    ],
                    [
                        'property' => 'title',
                        'title' => "cms::lang.editor.title",
                        'placeholder' => "cms::lang.editor.new_title",
                        'type' => 'string'
                    ],
                    [
                        'property' => 'description',
                        'title' => "cms::lang.editor.description",
                        'type' => 'text'
                    ],
                    [
                        'property' => 'meta_title',
                        'title' => "cms::lang.editor.meta_title",
                        'type' => 'string'
                    ],
                    [
                        'property' => 'meta_description',
                        'title' => "cms::lang.editor.meta_description",
                        'type' => 'text'
                    ]
                ]
            ]
        ];

        // Include manually added properties so they survive an editor save
        foreach ($this->listCurrentPropertyNames() as $name) {
            if (!isset($result[$name])) {
                $result[$name] = [
                    'title' => $name,
                    'type' => 'string',
                    'showExternalParam' => false
                ];
            }
        }

        return $result;
    }

    /**
     * validateProperties
     * @param array $properties
     * @return array
     */
    public function validateProperties(array $properties)
    {
        return $properties;
    }

    /**
     * property accepts bracket syntax (locales[fr][url]) in addition to dot syntax (locales.fr.url).
     * @param string $name
     * @param mixed $default
     * @return mixed
     */
    public function property($name, $default = null)
    {
        return array_get($this->properties, $this->normalizePropertyName($name), $default);
    }

    /**
     * siteProperty returns a translated property value for a site, matched by locale with language fallback.
     * @param string $name
     * @param \System\Models\SiteDefinition|null $site
     * @param mixed $default
     * @return mixed
     */
    public function siteProperty($name, $site = null, $default = null)
    {
        $site = $site ?: Site::getActiveSite();
        if (!$site) {
            return $default;
        }

        foreach ($this->makeSiteKeyChain($site) as $key) {
            $value = $this->property(self::LOCALES_PROPERTY."[{$key}][{$name}]");
            if ($value !== null && $value !== '') {
                return $value;
            }
        }

        return $default;
    }

    /**
     * siteProperties returns all translated property values for a site as a single array.
     * @param \System\Models\SiteDefinition|null $site
     * @return array
     */
    public function siteProperties($site = null)
    {
        $site = $site ?: Site::getActiveSite();
        if (!$site) {
            return [];
        }

        $result = [];

        foreach (array_reverse($this->makeSiteKeyChain($site)) as $key) {
            $values = $this->property(self::LOCALES_PROPERTY."[{$key}]");
            if (is_array($values)) {
                $result = array_merge($result, array_filter($values, function ($value) {
                    return $value !== null && $value !== '';
                }));
            }
        }

        return $result;
    }

    /**
     * makeLocaleDescription lists the available site locales as a hint.
     * @return string
     */
    protected function makeLocaleDescription()
    {
        $description = 'The locale these properties apply to.';

        if (Site::hasMultiSite()) {
            $locales = [];
            foreach (Site::listEnabled() as $site) {
                $locales[] = $site->hard_locale;
            }
            $description .= ' Available: '.implode(', ', array_unique(array_filter($locales)));
        }

        return $description;
    }

    /**
     * makeSiteKeyChain returns the locale lookup keys for a site in priority order.
     * @param \System\Models\SiteDefinition $site
     * @return array
     */
    protected function makeSiteKeyChain($site)
    {
        return Site::getLocaleKeyChain($site->hard_locale);
    }

    /**
     * listCurrentPropertyNames returns the current property names in bracket syntax.
     * @return array
     */
    protected function listCurrentPropertyNames()
    {
        $result = [];

        foreach ($this->properties as $name => $value) {
            if ($name === self::LOCALES_PROPERTY) {
                continue;
            }

            if (is_array($value)) {
                foreach ($value as $key => $innerValue) {
                    $result[] = "{$name}[{$key}]";
                }
            }
            else {
                $result[] = $name;
            }
        }

        return $result;
    }

    /**
     * normalizePropertyName converts bracket syntax to a dot path.
     * @param string $name
     * @return string
     */
    protected function normalizePropertyName($name)
    {
        return str_replace(['[', ']'], ['.', ''], $name);
    }
}
