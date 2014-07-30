<?php namespace Backend\FormWidgets;

use Backend\Widgets\Grid;
use Backend\Classes\FormWidgetBase;
use System\Classes\ApplicationException;

/**
 * Grid
 * Renders a grid field.
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
    public function getSaveData($value)
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

    public function getAutocompleteValues($field, $value, $data)
    {
        if (!$this->model->methodExists('getGridAutocompleteValues'))
            throw new ApplicationException('Model :model does not contain a method getGridAutocompleteValues()');

        $result = $this->model->getGridAutocompleteValues($field, $value, $data);
        if (!is_array($result))
            $result = [];

        return $result;
    }


    public function getDataSourceValues()
    {
        if (!$this->model->methodExists('getGridDataSourceValues'))
            throw new ApplicationException('Model :model does not contain a method getGridDataSourceValues()');

        $result = $this->model->getGridDataSourceValues();

        return $result;
    }
}
