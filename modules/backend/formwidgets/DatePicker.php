<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;

/**
 * Date picker
 * Renders a date picker field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DatePicker extends FormWidgetBase
{
    const TIME_PREFIX = '___time_';

    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'datepicker';

    /**
     * @var bool Display mode: datetime, date, time.
     */
    public $mode = 'datetime';

    /**
     * @var string the minimum/earliest date that can be selected.
     */
    public $minDate = '2000-01-01';

    /**
     * @var string the maximum/latest date that can be selected.
     */
    public $maxDate = '2020-12-31';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->mode = strtolower($this->getConfig('mode', $this->mode));
        $this->minDate = $this->getConfig('minDate', $this->minDate);
        $this->maxDate = $this->getConfig('maxDate', $this->maxDate);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('datepicker');
    }

    /**
     * Prepares the list data
     */
    public function prepareVars()
    {
        $this->vars['name'] = $this->formField->getName();

        $this->vars['timeName'] = self::TIME_PREFIX.$this->formField->getName(false);
        $this->vars['timeValue'] = null;

        if ($value = $this->getLoadValue()) {

            /*
             * Date / Time
             */
            if ($this->mode == 'datetime') {
                if (is_object($value)) {
                    $value = $value->toDateTimeString();
                }

                $dateTime = explode(' ', $value);
                $value = $dateTime[0];
                $this->vars['timeValue'] = isset($dateTime[1]) ? substr($dateTime[1], 0, 5) : '';
            }
            /*
             * Date
             */
            elseif ($this->mode == 'date') {
                if (is_string($value)) {
                    $value = substr($value, 0, 10);
                }
                elseif (is_object($value)) {
                    $value = $value->toDateString();
                }
            }
            elseif ($this->mode == 'time') {
                if (is_object($value)) {
                    $value = $value->toTimeString();
                }
            }

        }

        $this->vars['value'] = $value ?: '';
        $this->vars['mode'] = $this->mode;
        $this->vars['minDate'] = $this->minDate;
        $this->vars['maxDate'] = $this->maxDate;
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('vendor/pikaday/css/pikaday.css', 'core');
        $this->addCss('vendor/clockpicker/css/jquery-clockpicker.css', 'core');
        $this->addCss('css/datepicker.css', 'core');
        $this->addJs('vendor/moment/moment.js', 'core');
        $this->addJs('vendor/pikaday/js/pikaday.js', 'core');
        $this->addJs('vendor/pikaday/js/pikaday.jquery.js', 'core');
        $this->addJs('vendor/clockpicker/js/jquery-clockpicker.js', 'core');
        $this->addJs('js/datepicker.js', 'core');
        $this->addJs('js/timepicker.js', 'core');
    }

    /**
     * {@inheritDoc}
     */
    public function getSaveValue($value)
    {
        if (!strlen($value)) {
            return null;
        }

        $timeValue = post(self::TIME_PREFIX . $this->formField->getName(false));
        if ($this->mode == 'datetime' && $timeValue) {
            $value .= ' ' . $timeValue . ':00';
        }
        elseif ($this->mode == 'time') {
            $value .= ':00';
        }

        return $value;
    }
}
