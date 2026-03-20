<?php namespace Tailor\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * PublishingControls for Tailor entry as a Vue component.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PublishingControls extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'tailor-component-publishingcontrols';

    /**
     * @var array require
     */
    protected $require = [
        \Backend\VueComponents\Popover::class
    ];
}
