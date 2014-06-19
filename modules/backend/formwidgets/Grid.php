<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Grid
 * Renders a grid field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Grid extends FormWidgetBase
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
     * {@inheritDoc}
     */
    public function init()
    {
        $this->columns = $this->getConfig('columns');
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('grid');
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
    }

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
            $item['readOnly'] = isset($column['readOnly']) && $column['readOnly'];
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
        }

        return $item;
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('vendor/handsontable/jquery.handsontable.full.css', 'core');
        $this->addCss('css/grid.css', 'core');
        $this->addJs('vendor/handsontable/jquery.handsontable.full.js', 'core');
        $this->addJs('js/grid.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveData($value)
    {
        return $value;
    }
}