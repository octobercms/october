<?php namespace Backend\Classes;

use Str;
use October\Rain\Html\Helper as HtmlHelper;
use October\Rain\Element\Form\FieldsetDefinition;

/**
 * FormTabs is a fieldset definition for backend tabs
 *
 * @method FormTabs section(string $section) section specifies the form section these tabs belong to
 * @method FormTabs lazy(array $lazy) lazy is the names of tabs to lazy load
 * @method FormTabs adaptive(array $adaptive) adaptive is the names of tabs that use the entire screen space
 * @method FormTabs defaultTab(string $defaultTab) defaultTab is default tab label to use when none is specified
 * @method FormTabs activeTab(string $activeTab) activeTab is the selected tab when the form first loads, name or index.
 * @method FormTabs icons(array $icons) icons lists of icons for their corresponding tabs
 * @method FormTabs stretch(bool $stretch) stretch should these tabs stretch to the bottom of the page layout
 * @method FormTabs cssClass(string $cssClass) cssClass specifies a CSS class to attach to the tab container
 * @method FormTabs paneCssClass(array $paneCssClass) paneCssClass specifies a CSS class to an individual tab pane
 * @method FormTabs linkable(bool $linkable) linkable means tab gets url fragment to be linkable
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FormTabs extends FieldsetDefinition
{
    const SECTION_OUTSIDE = 'outside';
    const SECTION_PRIMARY = 'primary';
    const SECTION_SECONDARY = 'secondary';

    /**
     * initDefaultValues for this scope
     */
    protected function initDefaultValues()
    {
        parent::initDefaultValues();

        $this
            ->section(self::SECTION_OUTSIDE)
            ->defaultTab("Misc")
            ->linkable()
            ->icons([])
            ->lazy([])
            ->adaptive([])
        ;
    }

    /**
     * evalConfig
     */
    public function evalConfig(array $config)
    {
        if (isset($config['section']) && $config['section'] === self::SECTION_OUTSIDE) {
            $this->suppressTabs();
        }
    }

    /**
     * isLazy checks if a tab should be lazy loaded
     */
    public function isLazy($tabName): bool
    {
        return in_array($tabName, $this->config['lazy']);
    }

    /**
     * addLazy flags a tab to be lazy loaded
     */
    public function addLazy($tabName)
    {
        $this->config['lazy'] = array_merge((array) $this->config['lazy'], (array) $tabName);
    }

    /**
     * isAdaptive checks if a tab uses adaptive sizing
     */
    public function isAdaptive($tabName): bool
    {
        return in_array($tabName, $this->config['adaptive']);
    }

    /**
     * addAdaptive flags a tab to use adaptive sizing
     */
    public function addAdaptive($tabName)
    {
        $this->config['adaptive'] = array_merge((array) $this->config['adaptive'], (array) $tabName);
    }

    /**
     * getIcon returns an icon for the tab based on the tab's name
     * @param string $name
     * @return string
     */
    public function getIcon($name)
    {
        if (!empty($this->config['icons'][$name])) {
            return $this->config['icons'][$name];
        }
    }

    /**
     * getPaneCssClass returns a tab pane CSS class
     * @param string $index
     * @param string $label
     * @return string
     */
    public function getPaneCssClass($index = null, $label = null)
    {
        if (!isset($this->config['paneCssClass'])) {
            return '';
        }

        if (is_string($this->config['paneCssClass'])) {
            return $this->config['paneCssClass'];
        }

        if ($index !== null && isset($this->config['paneCssClass'][$index])) {
            return $this->config['paneCssClass'][$index];
        }

        if ($label !== null && isset($this->config['paneCssClass'][$label])) {
            return $this->config['paneCssClass'][$label];
        }

        return $this->config['paneCssClass']['*'] ?? '';
    }

    /**
     * setPaneCssClass appends a CSS class to the tab pane
     */
    public function setPaneCssClass($tabNameOrIndex, string $cssClass, bool $overwrite = false)
    {
        if (is_string($this->config['paneCssClass'])) {
            $this->config['paneCssClass'] = ['*' => $this->config['paneCssClass']];
        }

        if ($overwrite) {
            $this->config['paneCssClass'][$tabNameOrIndex] = $cssClass;
        }
        else {
            $currentValue = $this->config['paneCssClass'][$tabNameOrIndex] ?? '';
            $this->config['paneCssClass'][$tabNameOrIndex] = trim($currentValue . ' ' . $cssClass);
        }
    }

    /**
     * isPaneActive returns a tab pane CSS class
     */
    public function isPaneActive($index = null, $label = null): bool
    {
        if ($this->activeTab === null) {
            return $index === 1;
        }

        if ($index !== null && $this->activeTab === $index) {
            return true;
        }

        if ($label !== null && $this->activeTab === $label) {
            return true;
        }

        return false;
    }

    /**
     * getPaneAnchorId returns a value suitable for the pane id property.
     * @return string
     */
    public function getPaneAnchorId($index = null, $label = null)
    {
        $id = $this->section . 'tab';

        if ($this->linkable) {
            $id .= '-' . (Str::slug(__($label)) ?: $index);
        }
        else {
            $id .= '-' . $index;
        }

        return HtmlHelper::nameToId($id);
    }

    /**
     * getPaneId
     */
    public function getPaneId($tabName)
    {
        if ($id = $this->getIdentifier($tabName)) {
            return "pane-{$id}";
        }

        return null;
    }

    /**
     * getTabId
     */
    public function getTabId($tabName)
    {
        if ($id = $this->getIdentifier($tabName)) {
            return "tab-{$id}";
        }

        return null;
    }

    /**
     * getIdentifier returns an API identifier for the specified tab
     */
    public function getIdentifier($tabName): ?string
    {
        return $this->config['identifiers'][$tabName] ?? null;
    }

    /**
     * addIdentifier adds a new API identifier for the specified tab
     */
    public function addIdentifier($tabName, $identifier)
    {
        $this->config['identifiers'][$tabName] = $identifier;
    }
}
