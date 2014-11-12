<?php namespace Backend\Widgets;

use Backend\Classes\WidgetBase;

/**
 * Table Widget.
 *
 * Represents an editable tabular control.
 * 
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Table extends WidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'table';

    /**
     * @var array Table columns
     */
    protected $columns = [];

    /**
     * @var boolean Show data table header
     */
    protected $showHeader = true;

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('table');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {

    }

    //
    // Internals
    //

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/table.css', 'core');
        $this->addJs('js/table.js', 'core');
        $this->addJs('js/table.datasource.base.js', 'core');
        $this->addJs('js/table.datasource.client.js', 'core');
    }
}
