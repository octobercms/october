<?php namespace Backend\FormWidgets;

use Lang;
use Backend\Widgets\Table;
use Backend\Classes\FormWidgetBase;
use October\Rain\Html\Helper as HtmlHelper;
use ApplicationException;

/**
 * Data Table
 * Renders a table field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DataTable extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var string Table size
     */
    public $size = 'large';

    /**
     * @var bool Allow rows to be sorted
     * @todo Not implemented...
     */
    public $rowSorting = false;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'datatable';

    /**
     * @var Backend\Widgets\Table Table widget
     */
    protected $table;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'size',
            'rowSorting',
        ]);

        $this->table = $this->makeTableWidget();
        $this->table->bindToController();
    }

    /**
     * @return Backend\Widgets\Table   The table to be displayed.
     */
    public function getTable()
    {
        return $this->table;
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('datatable');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->populateTableWidget();
        $this->vars['table'] = $this->table;
        $this->vars['size'] = $this->size;
        $this->vars['rowSorting'] = $this->rowSorting;
    }

    /**
     * @inheritDoc
     */
    public function getLoadValue()
    {
        $value = (array) parent::getLoadValue();

        // Sync the array keys as the ID to make the
        // table widget happy!
        foreach ($value as $key => $_value) {
            $value[$key] = ['id' => $key] + (array) $_value;
        }

        return $value;
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        // TODO: provide a streaming implementation of saving
        // data to the model. The current implementation returns
        // all records at once. -ab

        $dataSource = $this->table->getDataSource();

        $result = [];
        while ($records = $dataSource->readRecords()) {
            $result = array_merge($result, $records);
        }

        // We should be dealing with a simple array, so
        // strip out the id columns in the final array.
        foreach ($result as $key => $_result) {
            unset($result[$key]['id']);
        }

        return $result;
    }

    /*
     * Populate data
     */
    protected function populateTableWidget()
    {
        $dataSource = $this->table->getDataSource();

        // TODO: provide a streaming implementation of loading
        // data from the model. The current implementation loads
        // all records at once. -ab

        $records = $this->getLoadValue() ?: [];

        $dataSource->purge();
        $dataSource->initRecords((array) $records);
    }

    protected function makeTableWidget()
    {
        $config = $this->makeConfig((array) $this->config);

        $config->dataSource = 'client';
        if (isset($this->getParentForm()->arrayName)) {
            $config->alias = studly_case(HtmlHelper::nameToId($this->getParentForm()->arrayName . '[' . $this->fieldName . ']')) . 'datatable';
            $config->fieldName = $this->getParentForm()->arrayName . '[' . $this->fieldName . ']';
        } else {
            $config->alias = studly_case(HtmlHelper::nameToId($this->fieldName)) . 'datatable';
            $config->fieldName = $this->fieldName;
        }

        $table = new Table($this->controller, $config);

        $table->bindEvent('table.getDropdownOptions', [$this, 'getDataTableOptions']);

        return $table;
    }

    /**
     * Dropdown/autocomplete option callback handler
     *
     * Looks at the model for getXXXDataTableOptions or getDataTableOptions methods
     * to obtain values for autocomplete and dropdown column types.
     *
     * @param string $columnName The name of the column to pass through to the callback.
     * @param array $rowData The data provided for the current row in the datatable.
     * @return array The options to make available to the dropdown or autocomplete, in format ["value" => "label"]
     */
    public function getDataTableOptions($columnName, $rowData)
    {
        $methodName = 'get' . studly_case($this->fieldName) . 'DataTableOptions';

        if (!$this->model->methodExists($methodName) && !$this->model->methodExists('getDataTableOptions')) {
            throw new ApplicationException(
                Lang::get(
                    'backend::lang.model.missing_method',
                    [
                        'class' => get_class($this->model),
                        'method' => 'getDataTableOptions'
                    ]
                )
            );
        }

        if ($this->model->methodExists($methodName)) {
            $result = $this->model->$methodName($columnName, $rowData);
        } else {
            $result = $this->model->getDataTableOptions($this->fieldName, $columnName, $rowData);
        }

        if (!is_array($result)) {
            $result = [];
        }

        return $result;
    }
}
