<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Document UI entity Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Document extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-document';

    protected $require = [
        \Backend\VueComponents\DropdownMenu::class,
        \Backend\VueComponents\LoadingIndicator::class
    ];

    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('toolbar');
        $this->registerSubcomponent('toolbar-button');
        $this->registerSubcomponent('header');
    }
}
