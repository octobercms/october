<?php namespace Cms\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * CMS partial editor Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PartialEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'cms-editor-component-partial-editor';

    protected $require = [
        \Backend\VueComponents\MonacoEditor::class,
        \Cms\VueComponents\CmsObjectComponentList::class
    ];
}
