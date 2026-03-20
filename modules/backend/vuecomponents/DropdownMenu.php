<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Dropdown menu Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DropdownMenu extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-dropdown-menu';

    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('sheet');
        $this->registerSubcomponent('menuitem');
    }
}
