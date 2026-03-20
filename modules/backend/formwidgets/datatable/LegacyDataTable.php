<?php

namespace Backend\FormWidgets\DataTable;

use Lang;
use Backend\Widgets\Table;
use October\Rain\Html\Helper as HtmlHelper;
use ApplicationException;

trait LegacyDataTable
{
    /**
     * @var Backend\Widgets\Table table widget used in legacy mode
     */
    protected $table;

    /**
     * @return Backend\Widgets\Table The table to be displayed.
     */
    public function getTable()
    {
        return $this->table;
    }

    /**
     * prepareLegacyVars prepares view variables for legacy mode
     */
    protected function prepareLegacyVars()
    {
        $this->populateLegacyTableWidget();
        $this->vars['name'] = $this->getFieldName();
        $this->vars['table'] = $this->table;
        $this->vars['size'] = $this->size;
        $this->vars['rowSorting'] = $this->rowSorting;
    }

    /**
     * getLegacyLoadValue returns the load value for legacy mode
     */
    protected function getLegacyLoadValue()
    {
        $value = (array) parent::getLoadValue();

        // Sync the array keys as the ID to make the table widget happy.
        foreach ($value as $key => $_value) {
            $value[$key] = ['id' => $key] + (array) $_value;
        }

        return $value;
    }

    /**
     * getLegacySaveValue returns the save value for legacy mode
     */
    protected function getLegacySaveValue($value)
    {
        $dataSource = $this->table->getDataSource();

        $result = [];
        while ($records = $dataSource->readRecords()) {
            $result = array_merge($result, $records);
        }

        // Strip out the id columns in the final array.
        foreach ($result as $key => $_result) {
            unset($result[$key]['id']);
        }

        return $result;
    }

    /**
     * populateLegacyTableWidget populates the legacy table widget with data
     */
    protected function populateLegacyTableWidget()
    {
        $dataSource = $this->table->getDataSource();

        $records = $this->getLoadValue() ?: [];

        $dataSource->purge();
        $dataSource->initRecords((array) $records);
    }

    /**
     * makeLegacyTableWidget creates a legacy table widget instance
     */
    protected function makeLegacyTableWidget()
    {
        $fieldName = $this->getFieldName();

        $config = $this->makeConfig((array) $this->config);
        $config->postbackHandlerWild = true;
        $config->dataSource = 'client';
        $config->alias = studly_case(HtmlHelper::nameToId($fieldName)) . 'datatable';
        $config->fieldName = $fieldName;

        $table = new Table($this->controller, $config);
        $table->bindEvent('table.getDropdownOptions', [$this, 'getLegacyDataTableOptions']);
        $table->bindEvent('table.getAutocompleteOptions', [$this, 'getLegacyDataTableOptions']);

        return $table;
    }

    /**
     * getLegacyDataTableOptions is the legacy dropdown/autocomplete option callback handler
     */
    public function getLegacyDataTableOptions($columnName, $rowData)
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
        }
        else {
            $result = $this->model->getDataTableOptions($this->fieldName, $columnName, $rowData);
        }

        if (!is_array($result)) {
            $result = [];
        }

        return $result;
    }
}
