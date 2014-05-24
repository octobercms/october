<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Rich Editor
 * Renders a rich content editor field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditor extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'richeditor';

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('richeditor');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['stretch'] = $this->formField->stretch;
        $this->vars['size'] = $this->formField->size;
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->model->{$this->columnName};
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('vendor/redactor/redactor.css', 'core');
        $this->addCss('css/richeditor.css', 'core');
        $this->addJs('vendor/redactor/redactor.js', 'core');
        $this->addJs('js/richeditor.js', 'core');
    }

}