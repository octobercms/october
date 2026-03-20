<?php namespace Cms\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * CMS asset editor Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class AssetEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'cms-editor-component-asset-editor';

    protected $require = [
        \Backend\VueComponents\MonacoEditor::class
    ];
}
