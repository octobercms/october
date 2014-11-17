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
        $this->columns = $this->getConfig('columns', []);
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
        $this->vars['columns'] = $this->prepareColumnsArray();
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
        $this->addJs('js/table.processor.base.js', 'core');
        $this->addJs('js/table.processor.string.js', 'core');
    }

    /**
     * Converts the columns associative array to a regular array.
     * Working with regular arrays is much faster in JavaScript.
     * References: 
     * - http://www.smashingmagazine.com/2012/11/05/writing-fast-memory-efficient-javascript/
     * - http://jsperf.com/performance-of-array-vs-object/3
     */
    protected function prepareColumnsArray()
    {
        $result = [];

        foreach ($this->columns as $key=>$data) {
            $data['key'] = $key;
            $result[] = $data;
        }

        return $result;
    }
}
