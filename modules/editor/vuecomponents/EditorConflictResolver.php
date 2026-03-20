<?php namespace Editor\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Resolves concurrency conflicts for Editor documents
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class EditorConflictResolver extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'editor-component-editorconflictresolver';

    protected $require = [
        \Backend\VueComponents\Modal::class
    ];
}
