<?php namespace Cms\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * CMS language file editor Vue component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class LangEditor extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'cms-editor-component-lang-editor';

    protected $require = [
        \Backend\VueComponents\Spreadsheet::class
    ];
}
