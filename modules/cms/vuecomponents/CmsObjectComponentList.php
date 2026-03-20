<?php namespace Cms\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * CmsObjectComponentList is a Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsObjectComponentList extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'cms-component-cmsobjectcomponentlist';

    /**
     * registerSubcomponents
     */
    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('component');
    }
}
