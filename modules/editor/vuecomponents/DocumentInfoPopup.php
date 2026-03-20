<?php namespace Editor\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Editor document information popup component
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DocumentInfoPopup extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'editor-document-info-popup';

    protected $require = [
        \Backend\VueComponents\InfoTable::class,
        \Backend\VueComponents\Modal::class
    ];
}
