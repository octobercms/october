<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Modal dialog Vue component.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Modal extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-modal';

    /**
     * @var string assetDefaults is the default attributes for assets.
     * @deprecated we don't use bundles anymore (remove this)
     */
    protected $assetDefaults = ['build' => 'global'];

    /**
     * loadAssets adds component specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page. The default component script and CSS
     * file are loaded automatically.
     */
    protected function loadAssets()
    {
        $this->addJs('js/classes/index.js', ['type' => 'module']);
    }

    /**
     * registerSubcomponents
     */
    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('alert');
        $this->registerSubcomponent('confirm');
        $this->registerSubcomponent('basic');
    }
}
