<?php namespace Backend\Widgets;

use Backend\Classes\WidgetBase;

/**
 * Grid Widget
 * Renders a search container used for viewing tabular data
 * 
 * !!!
 * !!! WARNING: This class and widget is scheduled for destruction.
 * !!! Please use Table widget instead
 * !!!
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
    protected $defaultAlias = 'grid';

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
     * @var array Provided data set, cannot use with dataLocker or useDataSource.
     */
    protected $data;

    /**
     * @var string HTML element that can [re]store the grid data, cannot use with data or useDataSource.
     */
    protected $dataLocker;

    /**
     * @var boolean Get data from AJAX callback (onDataSource), cannot use with data or dataLocker.
     */
    protected $useDataSource = false;

    /**
     * @var boolean Sends an AJAX callback (onDataChanged) any time a field is changed.
     */
    protected $monitorChanges = true;

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
        $this->data = $this->getConfig('data', $this->data);
        $this->dataLocker = $this->getConfig('dataLocker', $this->dataLocker);
        $this->useDataSource = $this->getConfig('useDataSource', $this->useDataSource);
        $this->monitorChanges = $this->getConfig('monitorChanges', $this->monitorChanges);
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
        $this->vars['toolbarWidget'] = $this->makeToolbarWidget();
        $this->vars['columnHeaders'] = $this->getColumnHeaders();
        $this->vars['columnDefinitions'] = $this->getColumnDefinitions();
        $this->vars['columnWidths'] = $this->getColumnWidths();

        $this->vars['showHeader'] = $this->showHeader;
        $this->vars['allowInsert'] = $this->allowInsert;
        $this->vars['allowRemove'] = $this->allowRemove;
        $this->vars['disableToolbar'] = $this->disableToolbar;
        $this->vars['data'] = $this->data;
        $this->vars['dataLocker'] = $this->dataLocker;
        $this->vars['useDataSource'] = $this->useDataSource;
        $this->vars['monitorChanges'] = $this->monitorChanges;
    }

    protected function makeToolbarWidget()
    {
        if ($this->disableToolbar) {
            return;
        }

        $defaultConfig = [
            'buttons' => $this->getViewPath('_toolbar.htm'),
        ];
        $toolbarConfig = $this->makeConfig($this->getConfig('toolbar', $defaultConfig));
        $toolbarConfig->alias = $this->alias . 'Toolbar';

        $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
        $toolbarWidget->vars['gridWidget'] = $this;
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

    public function onDataChanged()
    {
        if (!$this->monitorChanges) {
            return;
        }

        /*
         * Changes array, each array item will contain:
         * ['rowData' => [...], 'keyName' => 'changedColumn', 'oldValue' => 'was', 'newValue' => 'is']
         */
        $changes = post('grid_changes');

        /*
         * Action will be either:
         * "remove", "alter", "empty", "edit", "populateFromArray", "autofill", "paste"
         */
        $action = post('grid_action');

        $this->fireEvent('grid.dataChanged', [$action, $changes]);
    }

    public function onDataSource()
    {
        if (!$this->useDataSource) {
            return;
        }

        $result = [];

        if ($_result = $this->fireEvent('grid.dataSource', [], true)) {
            $result = $_result;
        }

        if (!is_array($result)) {
            $result = [];
        }

        return ['result' => $result];
    }

    //
    // Getters
    //

    protected function getColumnHeaders()
    {
        if (!$this->showHeader) {
            return false;
        }

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

            if (isset($column['readOnly'])) {
                $item['readOnly'] =  $column['readOnly'];
            }

            $item = $this->evalColumnType($column, $item);
            $definitions[] = $item;
        }
        return $definitions;
    }

    protected function evalColumnType($column, $item)
    {
        if (!isset($column['type'])) {
            return $item;
        }

        switch ($column['type']) {
            case 'number':
                $item['type'] = 'numeric';
                break;

            case 'currency':
                $item['type'] = 'numeric';
                $item['format'] = isset($column['format']) ? $column['format'] : '$0,0.00';
                break;

            case 'checkbox':
                $item['type'] = 'checkbox';
                break;

            case 'autocomplete':
                $item['type'] = 'autocomplete';
                if (isset($column['options'])) {
                    $item['source'] = $column['options'];
                }
                if (isset($column['strict'])) {
                    $item['strict'] = $column['strict'];
                }
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
