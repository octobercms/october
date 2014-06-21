<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;
use System\Classes\ApplicationException;

/**
 * Grid
 * Renders a grid field.
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
class DataGrid extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'datagrid';

    /**
     * @var array Grid columns
     */
    protected $columns = [];

    /**
     * @var string Grid size
     */
    protected $size = 'large';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->columns = $this->getConfig('columns', []);
        $this->size = $this->getConfig('size', $this->size);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('datagrid');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName();
        $this->vars['columnHeaders'] = $this->getColumnHeaders();
        $this->vars['columnDefinitions'] = $this->getColumnDefinitions();
        $this->vars['columnWidths'] = $this->getColumnWidths();
        $this->vars['size'] = $this->size;
        $this->vars['toolbarWidget'] = $this->makeToolbarWidget();
    }

    protected function makeToolbarWidget()
    {
        $toolbarConfig = $this->makeConfig([
            'alias'   => $this->alias . 'Toolbar',
            'buttons' => $this->getViewPath('_toolbar.htm'),
        ]);

        $toolbarWidget = $this->makeWidget('Backend\Widgets\Toolbar', $toolbarConfig);
        return $toolbarWidget;
    }

    //
    // Getters
    //

    protected function getColumnHeaders()
    {
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
    // AJAX
    //

    public function onAutocomplete()
    {
        if (!$this->model->methodExists('getGridAutocompleteValues'))
            throw new ApplicationException('Model :model does not contain a method getGridAutocompleteValues()');

        $field = post('autocomplete_field');
        $value = post('autocomplete_value');
        $data = post('autocomplete_data', []);
        $result = $this->model->getGridAutocompleteValues($field, $value, $data);
        if (!is_array($result))
            $result = [];

        return ['result' => $result];
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

    /**
     * {@inheritDoc}
     */
    public function getSaveData($value)
    {
        return $value;
    }
}