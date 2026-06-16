<?php namespace Backend\VueComponents;

use Backend\Classes\VueComponentBase;

/**
 * Spreadsheet is a Handsontable-based Vue component for key-value editing
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Spreadsheet extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'backend-spreadsheet';
}
