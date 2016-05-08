<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Tag List Form Widget
 */
class TagList extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var string Tag separator: space, comma.
     */
    public $separator = 'space';

    /**
     * @var bool Allows custom tags to be entered manually by the user.
     */
    public $useCustom = true;

    //
    // Object properties
    //

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'taglist';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([
            'separator',
            'useCustom',
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('taglist');
    }

    /**
     * Prepares the form widget view data
     */
    public function prepareVars()
    {
        $this->vars['customSeparators'] = $this->getCustomSeparators();
        $this->vars['field'] = $this->formField;
        $this->vars['name'] = $this->formField->getName();
        $this->vars['value'] = $this->getLoadValue();
        $this->vars['model'] = $this->model;
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        return $value;
    }

    /**
     * Returns character(s) to use for separating keywords.
     * @return mixed
     */
    protected function getCustomSeparators()
    {
        if (!$this->useCustom) {
            return false;
        }

        $separators = [];

        $separators[] = $this->separator == 'comma' ? ',' : ' ';

        return implode('|', $separators);
    }

}
