<?php namespace Backend\FormWidgets;

use Lang;
use ApplicationException;
use Backend\Classes\FormWidgetBase;

/**
 * Sensitive - renders a password field with "eye" icon to show it
 */
class Sensitive extends FormWidgetBase
{
    /**
     * @var bool If true, the color picker is set to read-only mode
     */
    public $readOnly = false;

    /**
     * @var bool If true, the color picker is set to disabled mode
     */
    public $disabled = false;

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'sensitive';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'readOnly',
            'disabled',
        ]);

        if ($this->formField->disabled || $this->formField->readOnly) {
            $this->previewMode = true;
        }
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('sensitive');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['readOnly'] = $this->readOnly;
        $this->vars['disabled'] = $this->disabled;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addJs('js/sensitive.js', 'core');
    }
}
