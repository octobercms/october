<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Time picker
 * Renders a time picker field.
 *
 * @package october\backend
 * @author webmaxx <http://webmaxx.name>
 */
class TimePicker extends FormWidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'timepicker';

    /**
     * @var bool Autoclose timepicker
     */
    public $autoclose = true;

    /**
     * @var string Text for "Done" button.
     */
    public $donetext = 'Done';

    /**
     * @var string Popover placement: "top", "bottom", "left" or "right".
     */
    public $placement = 'bottom';

    /**
     * @var string Popover arrow align: "left" or "right".
     */
    public $align = 'right';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->autoclose = $this->getConfig('autoclose', $this->autoclose);
        $this->donetext = $this->getConfig('donetext', $this->donetext);
        $this->placement = $this->getConfig('placement', $this->placement);
        $this->align = $this->getConfig('align', $this->align);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('timepicker');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName();

        $value = $this->getLoadData();

        $this->vars['value'] = $value ?: '';
        $this->vars['autoclose'] = $this->autoclose;
        $this->vars['donetext'] = $this->donetext;
        $this->vars['placement'] = $this->placement;
        $this->vars['align'] = $this->align;
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/jquery-clockpicker.min.css', 'core');
        $this->addJs('js/jquery-clockpicker.min.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveData($value)
    {
        return strlen($value) ? $value : null;
    }
}
