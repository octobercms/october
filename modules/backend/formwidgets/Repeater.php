<?php namespace Backend\FormWidgets;

use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;

/**
 * Repeater Form Widget
 */
class Repeater extends FormWidgetBase
{
    const INDEX_PREFIX = '___index_';

    //
    // Configurable properties
    //

    /**
     * @var array Form field configuration
     */
    public $form;

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'repeater';

    protected $indexCount = 0;

    protected $formWidgets = [];

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([
            'form',
        ]);

        $this->processExistingItems();
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('repeater');
    }

    /**
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        $this->vars['indexName'] = self::INDEX_PREFIX.$this->formField->getName(false).'[]';
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/repeater.css', 'core');
        $this->addJs('js/repeater.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        return array_values($value);
    }

    protected function processExistingItems()
    {
        $itemIndexes = post(self::INDEX_PREFIX.$this->formField->getName(false), $this->getLoadValue());

        if (!is_array($itemIndexes)) return;

        foreach ($itemIndexes as $itemIndex) {
            $this->makeFormWidget($itemIndex);
            $this->indexCount = max((int) $itemIndex, $this->indexCount);
        }
    }

    protected function makeFormWidget($index = 0)
    {
        $config = $this->makeConfig($this->form);
        $config->model = $this->model;
        $config->alias = $this->alias . 'Form'.$index;
        $config->arrayName = $this->formField->getName().'['.$index.']';

        $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        $widget->bindToController();

        return $this->formWidgets[$index] = $widget;
    }

    public function onAddItem()
    {
        $this->indexCount++;

        $this->prepareVars();
        $this->vars['widget'] = $this->makeFormWidget($this->indexCount);
        $this->vars['indexValue'] = $this->indexCount;

        $itemContainer = '@#'.$this->getId('items');
        return [$itemContainer => $this->makePartial('repeater_item')];
    }

    public function onRemoveItem()
    {
        // Useful for deleting relations
    }

}
