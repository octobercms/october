<?php namespace Backend\FormWidgets;

use Lang;
use Backend\Widgets\Table;
use Backend\Classes\FormWidgetBase;
use System\Classes\ApplicationException;

/**
 * Data Table
 * Renders a table field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DataTable extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'datatable';

    /**
     * @var string Table size
     */
    protected $size = 'large';

    /**
     * @var Backend\Widgets\Table Table widget
     */
    protected $table;

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->size = $this->getConfig('size', $this->size);
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
     * {@inheritDoc}
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
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        $dataSource = $this->table->getDataSource();

        $result = [];
        while ($records = $dataSource->readRecords()) {
            $result += $records;
        }

        return $result;
    }

    /*
     * Populate data
     */
    protected function populateTableWidget()
    {
        $dataSource = $this->table->getDataSource();
        $records = $this->getLoadValue() ?: [];
        $dataSource->initRecords((array) $records);
    }

    protected function makeTableWidget()
    {
        $config = $this->makeConfig((array) $this->config);
        $config->dataSource = 'client';
        $config->alias = $this->alias . 'Table';

        $table = new Table($this->controller, $config);

        $table->bindEvent('table.getDropdownOptions', [$this, 'getDataTableOptions']);

        return $table;
    }

    /**
     * Looks at the model for getXXXDataTableOptions or getDataTableOptions methods
     * to obtain values for autocomplete field types.
     * @param  string $field Table field name
     * @param  string $data  Data for the entire table
     * @return array
     */
    public function getDataTableOptions($field, $data)
    {
        $methodName = 'get'.studly_case($this->fieldName).'DataTableOptions';

        if (!$this->model->methodExists($methodName) && !$this->model->methodExists('getDataTableOptions')) {
            throw new ApplicationException(Lang::get('backend::lang.model.missing_method', ['class' => get_class($this->model), 'method' => 'getDataTableOptions']));
        }

        if ($this->model->methodExists($methodName)) {
            $result = $this->model->$methodName($field, $data);
        }
        else {
            $result = $this->model->getDataTableOptions($this->fieldName, $field, $data);
        }

        if (!is_array($result)) {
            $result = [];
        }

        return $result;
    }

}
