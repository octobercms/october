<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Document dropdown Vue component
 *
 * @link https://github.com/shentao/vue-multiselect
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Dropdown extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-dropdown';

    protected function loadDependencyAssets()
    {
        $this->addCss('vendor/vue-multiselect/vue-multiselect.min.css');
    }
}
