<?php namespace Tailor\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * BlueprintEditor Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class BlueprintEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'tailor-editor-component-blueprint-editor';

    /**
     * @var array require
     */
    protected $require = [
        \Backend\VueComponents\MonacoEditor::class
    ];
}
