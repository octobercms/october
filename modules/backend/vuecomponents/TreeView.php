<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Treeview Vue component.
 *
 * See NodeDefinition for node options.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class TreeView extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-treeview';

    protected $require = [
        \Backend\VueComponents\ScrollablePanel::class,
        \Backend\VueComponents\DropdownMenu::class,
        \Backend\VueComponents\Modal::class
    ];

    /**
     * Adds component specific asset files. Use $this->addJs() and $this->addCss()
     * to register new assets to include on the page.
     * The default component script and CSS file are loaded automatically.
     * @return void
     */
    protected function loadAssets()
    {
        $this->addJs('js/classes/index.js', ['type' => 'module']);
    }

    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('node');
        $this->registerSubcomponent('section');
        $this->registerSubcomponent('quickaccess');
    }
}
