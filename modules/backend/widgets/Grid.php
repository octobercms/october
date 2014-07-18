<?php namespace Backend\Widgets;

use Backend\Classes\WidgetBase;

/**
 * Grid Widget
 * Renders a search container used for viewing tabular data
 * 
 * Supported options:
 *
 * - allowInsert
 * - autoInsertRows
 * - allowRemove
 * - allowImport
 * - allowExport
 * - exportFileName
 * 
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Grid extends WidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'grid';

    /**
     * @var array Grid columns
     */
    protected $columns = [];

    /**
     * @var boolean Show data table header
     */
    protected $showHeader = true;

    /**
     * @var boolean Insert row button
     */
    protected $allowInsert = true;

    /**
     * @var boolean Delete row button
     */
    protected $allowRemove = true;

    /**
     * @var boolean Disable the toolbar
     */
    protected $disableToolbar = false;

    /**
     * @var mixed Array of data, or callable for data source.
     */
    protected $dataSource;

    /**
     * @var string HTML element that can [re]store the grid data.
     */
    protected $dataLocker;

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->columns = $this->getConfig('columns', []);
        $this->showHeader = $this->getConfig('showHeader', $this->showHeader);
        $this->allowInsert = $this->getConfig('allowInsert', $this->allowInsert);
        $this->allowRemove = $this->getConfig('allowRemove', $this->allowRemove);
        $this->disableToolbar = $this->getConfig('disableToolbar', $this->disableToolbar);
        $this->dataLocker = $this->getConfig('dataLocker', $this->dataLocker);
        $this->dataSource = $this->getConfig('dataSource', $this->dataSource);
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('grid');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->vars['columnHeaders'] = $this->getColumnHeaders();
        $this->vars['columnDefinitions'] = $this->getColumnDefinitions();
        $this->vars['columnWidths'] = $this->getColumnWidths();
        $this->vars['toolbarWidget'] = $this->makeToolbarWidget();

        $this->vars['showHeader'] = $this->showHeader;
        $this->vars['allowInsert'] = $this->allowInsert;
        $this->vars['allowRemove'] = $this->allowRemove;
        $this->vars['disableToolbar'] = $this->disableToolbar;
        $this->vars['dataLocker'] = $this->dataLocker;
    }

    protected function makeToolbarWidget()
    {
        if ($this->disableToolbar)
            return;

        $toolbarConfig = $this->makeConfig([
            'alias'   => $this->alias . 'Toolbar',
            'buttons' => $this->getViewPath('_toolbar.htm'),
        ]);

        $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
        $toolbarWidget->vars['allowInsert'] = $this->allowInsert;
        $toolbarWidget->vars['allowRemove'] = $this->allowRemove;
        return $toolbarWidget;
    }

    //
    // AJAX
    //

    public function onAutocomplete()
    {
        $field = post('autocomplete_field');
        $value = post('autocomplete_value');
        $data = post('autocomplete_data', []);
        $result = $this->fireEvent('grid.autocomplete', [$field, $value, $data], true);
        return ['result' => $result];
    }

    public function onDataSource()
    {
        if ($this->dataLocker)
            return;

        $result = $this->dataSource;
        return ['result' => $result];
    }

    //
    // Getters
    //

    protected function getColumnHeaders()
    {
        if (!$this->showHeader)
            return false;

        $headers = [];
        foreach ($this->columns as $key => $column) {
            $headers[] = isset($column['title']) ? $column['title'] : '???';
        }
        return $headers;
    }

    protected function getColumnWidths()
    {
        $widths = [];
        foreach ($this->columns as $key => $column) {
            $widths[] = isset($column['width']) ? $column['width'] : '0';
        }
        return $widths;
    }

    protected function getColumnDefinitions()
    {
        $definitions = [];
        foreach ($this->columns as $key => $column) {
            $item = [];
            $item['data'] = $key;

            if (isset($column['readOnly']))
                $item['readOnly'] =  $column['readOnly'];

            $item = $this->evalColumnType($column, $item);
            $definitions[] = $item;
        }
        return $definitions;
    }

    protected function evalColumnType($column, $item)
    {
        if (!isset($column['type']))
            return $item;

        switch ($column['type']) {
            case 'number':
                $item['type'] = 'numeric';
                break;

            case 'currency':
                $item['type'] = 'numeric';
                $item['format'] = '$0,0.00';
                break;

            case 'checkbox':
                $item['type'] = 'checkbox';
                break;

            case 'autocomplete':
                $item['type'] = 'autocomplete';
                if (isset($column['options'])) $item['source'] = $column['options'];
                if (isset($column['strict'])) $item['strict'] = $column['strict'];
                break;
        }

        return $item;
    }

    //
    // Internals
    //

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('vendor/handsontable/jquery.handsontable.css', 'core');
        $this->addCss('css/datagrid.css', 'core');
        $this->addJs('vendor/handsontable/jquery.handsontable.js', 'core');
        $this->addJs('js/datagrid.js', 'core');
    }

}