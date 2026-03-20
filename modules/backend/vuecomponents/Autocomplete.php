<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Autocomplete Vue component
 *
 * @link https://github.com/trevoreyre/autocomplete
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Autocomplete extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-autocomplete';

    /**
     * loadDependencyAssets
     */
    protected function loadDependencyAssets()
    {
        $this->addCss('vendor/vue-autocomplete/vue-autocomplete.min.css');
    }
}
