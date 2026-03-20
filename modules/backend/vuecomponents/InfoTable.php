<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * InfoTable is a read-only information table Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class InfoTable extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-info-table';

    /**
     * registerSubcomponents
     */
    protected function registerSubcomponents()
    {
        $this->registerSubcomponent('item');
    }
}
