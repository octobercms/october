<?php namespace Cms\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * CMS content block editor Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ContentEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'cms-editor-component-content-editor';

    protected $require = [
        \Backend\VueComponents\MonacoEditor::class,
        \Cms\VueComponents\CmsObjectComponentList::class,
        \Backend\VueComponents\RichEditorDocumentConnector::class,
        \Backend\VueComponents\DocumentMarkdownEditor::class
    ];
}
