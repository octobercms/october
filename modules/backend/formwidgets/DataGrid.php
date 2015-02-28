<?php namespace Backend\FormWidgets;

use Backend\Widgets\Grid;
use Backend\Classes\FormWidgetBase;
use ApplicationException;

/**
 * Grid
 * Renders a grid field.
 *
 * !!!
 * !!! WARNING: This class and widget is scheduled for destruction.
 * !!! Please use DataTable form widget instead
 * !!!
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DataGrid extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'datagrid';

    /**
     * @var string Grid size
     */
    protected $size = 'large';

    /**
     * @var Backend\Widgets\Grid Grid widget
     */
    protected $grid;

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->size = $this->getConfig('size', $this->size);
        $this->grid = $this->makeGridWidget();
        $this->grid->bindToController();
    }

    /**
     * @return Backend\Widgets\Grid   The grid to be displayed.
     */
    public function getGrid()
    {
        return $this->grid;
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
        $this->vars['grid'] = $this->grid;
        $this->vars['name'] = $this->formField->getName();
        $this->vars['size'] = $this->size;
        $this->vars['value'] = json_encode($this->formField->value);
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        return json_decode($value);
    }

    protected function makeGridWidget()
    {
        $config = $this->makeConfig((array) $this->config);
        $config->dataLocker = '#'.$this->getId('dataLocker');

        $grid = new Grid($this->controller, $config);
        $grid->alias = $this->alias . 'Grid';
        $grid->bindEvent('grid.autocomplete', [$this, 'getAutocompleteValues']);
        $grid->bindEvent('grid.dataSource', [$this, 'getDataSourceValues']);

        return $grid;
    }

    /**
     * Looks at the model for getXXXAutocompleteValues or getGridAutocompleteValues methods
     * to obtain values for autocomplete field types.
     * @param  string $field Grid field name
     * @param  string $value Current value
     * @param  string $data  Data for the entire grid
     * @return array
     */
    public function getAutocompleteValues($field, $value, $data)
    {
        $methodName = 'get'.studly_case($this->fieldName).'AutocompleteValues';

        if (!$this->model->methodExists($methodName) && !$this->model->methodExists('getGridAutocompleteValues')) {
            throw new ApplicationException('Model :model does not contain a method getGridAutocompleteValues()');
        }

        if ($this->model->methodExists($methodName)) {
            $result = $this->model->$methodName($field, $value, $data);
        }
        else {
            $result = $this->model->getGridAutocompleteValues($this->fieldName, $field, $value, $data);
        }

        if (!is_array($result)) {
            $result = [];
        }

        return $result;
    }

    /**
     * Looks at the model for getXXXDataSourceValues or getGridDataSourceValues methods
     * to obtain the starting values for the grid.
     * @return array
     */
    public function getDataSourceValues()
    {
        $methodName = 'get'.studly_case($this->fieldName).'DataSourceValues';

        if (!$this->model->methodExists($methodName) && !$this->model->methodExists('getGridDataSourceValues')) {
            throw new ApplicationException('Model :model does not contain a method getGridDataSourceValues()');
        }

        if ($this->model->methodExists($methodName)) {
            $result = $this->model->$methodName();
        }
        else {
            $result = $this->model->getGridDataSourceValues($this->fieldName);
        }

        if (!is_array($result)) {
            $result = [];
        }

        return $result;
    }
}
