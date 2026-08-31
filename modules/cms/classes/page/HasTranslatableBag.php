<?php namespace Cms\Classes\Page;

use Site;
use Cms\Components\TranslatableBag;

/**
 * HasTranslatableBag resolves translated template properties from the translatable component
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasTranslatableBag
{
    /**
     * @var mixed translatableBagCache store for the getTranslatableBag method.
     */
    protected $translatableBagCache = false;

    /**
     * getTranslatableBag returns the configured translatable component.
     * @return \Cms\Components\TranslatableBag
     */
    public function getTranslatableBag()
    {
        if ($this->translatableBagCache !== false) {
            return $this->translatableBagCache;
        }

        $componentName = 'translatable';

        if (!isset($this->settings['components'][$componentName])) {
            $bag = new TranslatableBag(null, []);
            $bag->name = $componentName;

            return $this->translatableBagCache = $bag;
        }

        return $this->translatableBagCache = $this->getComponent($componentName);
    }

    /**
     * getTranslatableUrl returns the translated URL pattern for a site, if available.
     * @param \System\Models\SiteDefinition|null $site
     * @return string|null
     */
    public function getTranslatableUrl($site = null)
    {
        if (!$this->isTranslatableEnabled()) {
            return null;
        }

        $site = $site ?: Site::getActiveSite();
        if (!$site) {
            return null;
        }

        $url = $this->getTranslatableBag()->siteProperty('url', $site);
        if ($url === null || $url === '') {
            $url = array_get($this->viewBag, 'localeUrl.'.$site->hard_locale);
        }

        return $url !== null && $url !== '' ? $url : null;
    }

    /**
     * getTranslatableValue returns a translated property value for a site, if available.
     * The name avoids the get*Attribute convention since translatable is a real attribute.
     * @param string $name
     * @param \System\Models\SiteDefinition|null $site
     * @return string|null
     */
    public function getTranslatableValue($name, $site = null)
    {
        if (!$this->isTranslatableEnabled()) {
            return null;
        }

        $site = $site ?: Site::getActiveSite();
        if (!$site) {
            return null;
        }

        $value = $this->getTranslatableBag()->siteProperty($name, $site);
        if ($value === null || $value === '') {
            $value = array_get($this->viewBag, 'locale'.ucfirst($name).'.'.$site->hard_locale);
        }

        return $value !== null && $value !== '' ? $value : null;
    }

    /**
     * applyTranslatableContext overrides page attributes with translated values for a site.
     * @param \System\Models\SiteDefinition|null $site
     * @return void
     */
    public function applyTranslatableContext($site = null)
    {
        if (!$this->isTranslatableEnabled()) {
            return;
        }

        $site = $site ?: Site::getActiveSite();
        if (!$site) {
            return;
        }

        $values = $this->getTranslatableBag()->siteProperties($site);

        // Structural keys and template sections are never translatable overrides
        unset(
            $values['url'],
            $values['locale'],
            $values['code'],
            $values['markup'],
            $values['settings'],
            $values['components']
        );

        // Legacy viewBag values act as a fallback for known properties
        foreach (['title', 'description', 'meta_title', 'meta_description'] as $name) {
            if (isset($values[$name])) {
                continue;
            }

            $fallback = array_get($this->viewBag, 'locale'.ucfirst($name).'.'.$site->hard_locale);
            if ($fallback !== null && $fallback !== '') {
                $values[$name] = $fallback;
            }
        }

        foreach ($values as $name => $value) {
            // Magic assignment keeps the settings copy in sync with the attribute
            $this->{$name} = $value;
        }
    }

    /**
     * isTranslatableEnabled checks the multisite page translation feature is active.
     */
    protected function isTranslatableEnabled(): bool
    {
        return true;
    }
}
