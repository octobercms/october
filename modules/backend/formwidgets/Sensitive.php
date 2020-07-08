<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Sensitive widget.
 *
 * Renders a password field that can be optionally made visible
 *
 * @package october\backend
 */
class Sensitive extends FormWidgetBase
{
    /**
     * @var bool If true, the sensitive field cannot be edited, but can be toggled.
     */
    public $readOnly = false;

    /**
     * @var bool If true, the sensitive field is disabled.
     */
    public $disabled = false;

    /**
     * @var bool If true, a button will be available to copy the value.
     */
    public $allowCopy = false;

    /**
     * @var string The string that will be used as a placeholder for an unrevealed sensitive value.
     */
    public $hiddenPlaceholder = '__hidden__';

    /**
     * @var bool If true, the sensitive input will be hidden if the user changes to another tab in their browser.
     */
    public $hideOnTabChange = true;

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
            'allowCopy',
            'hiddenPlaceholder',
            'hideOnTabChange',
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
     * Prepares the view data for the widget partial.
     */
    public function prepareVars()
    {
        $this->vars['readOnly'] = $this->readOnly;
        $this->vars['disabled'] = $this->disabled;
        $this->vars['hasValue'] = !empty($this->getLoadValue());
        $this->vars['allowCopy'] = $this->allowCopy;
        $this->vars['hiddenPlaceholder'] = $this->hiddenPlaceholder;
        $this->vars['hideOnTabChange'] = $this->hideOnTabChange;
    }

    /**
     * Reveals the value of a hidden, unmodified sensitive field.
     *
     * @return array
     */
    public function onShowValue()
    {
        return [
            'value' => $this->getLoadValue()
        ];
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($value === $this->hiddenPlaceholder) {
            $value = $this->getLoadValue();
        }

        return $value;
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/sensitive.css', 'core');
        $this->addJs('js/sensitive.js', 'core');
    }
}
