<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Tabs Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Tabs extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-tabs';

    protected $require = [
        \Backend\VueComponents\DropdownMenu::class
    ];
}
