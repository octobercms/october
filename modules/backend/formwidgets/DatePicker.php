<?php namespace Backend\FormWidgets;

use Config;
use Carbon\Carbon;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use System\Helpers\DateTime as DateTimeHelper;

/**
 * Date picker
 * Renders a date picker field.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class DatePicker extends FormWidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var bool Display mode: datetime, date, time.
     */
    public $mode = 'datetime';

    /**
     * @var string Provide an explicit date display format.
     */
    public $format;

    /**
     * @var string the minimum/earliest date that can be selected.
     * eg: 2000-01-01
     */
    public $minDate;

    /**
     * @var string the maximum/latest date that can be selected.
     * eg: 2020-12-31
     */
    public $maxDate;

    /**
     * @var string number of years either side or array of upper/lower range
     * eg: 10 or [1900,1999]
     */
    public $yearRange;

    /**
     * @var int first day of the week
     * eg: 0 (Sunday), 1 (Monday), 2 (Tuesday), etc.
     */
    public $firstDay = 0;

    /**
     * @var bool show week numbers at head of row
     */
    public $showWeekNumber = false;

    /**
     * @var bool change datetime exactly as is in database
     */
    public $ignoreTimezone = false;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'datepicker';

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'format',
            'mode',
            'minDate',
            'maxDate',
            'yearRange',
            'firstDay',
            'showWeekNumber',
            'ignoreTimezone',
        ]);

        $this->mode = strtolower($this->mode);

        if ($this->minDate !== null) {
            $this->minDate = is_int($this->minDate)
                ? Carbon::createFromTimestamp($this->minDate)
                : Carbon::parse($this->minDate);
        }

        if ($this->maxDate !== null) {
            $this->maxDate = is_int($this->maxDate)
                ? Carbon::createFromTimestamp($this->maxDate)
                : Carbon::parse($this->maxDate);
        }
    }

    /**
     * @inheritDoc
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
        if ($value = $this->getLoadValue()) {
            $value = DateTimeHelper::makeCarbon($value, false);
            if ($this->mode === 'date' && !$this->ignoreTimezone) {
                $backendTimeZone = \Backend\Models\Preference::get('timezone');
                $value->setTimezone($backendTimeZone);
                $value->setTime(0, 0, 0);
                $value->setTimezone(Config::get('app.timezone'));
            }
            $value = $value->toDateTimeString();
        }

        $this->vars['name'] = $this->getFieldName();
        $this->vars['value'] = $value ?: '';
        $this->vars['field'] = $this->formField;
        $this->vars['mode'] = $this->mode;
        $this->vars['minDate'] = $this->minDate;
        $this->vars['maxDate'] = $this->maxDate;
        $this->vars['yearRange'] = $this->yearRange;
        $this->vars['firstDay'] = $this->firstDay;
        $this->vars['showWeekNumber'] = $this->showWeekNumber;
        $this->vars['ignoreTimezone'] = $this->ignoreTimezone;
        $this->vars['format'] = $this->format;
        $this->vars['formatMoment'] = $this->getDateFormatMoment();
        $this->vars['formatAlias'] = $this->getDateFormatAlias();
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->formField->disabled || $this->formField->hidden) {
            return FormField::NO_SAVE_DATA;
        }

        if (!strlen($value)) {
            return null;
        }

        return $value;
    }

    /**
     * Convert PHP format to JS format
     */
    protected function getDateFormatMoment()
    {
        if ($this->format) {
            return DateTimeHelper::momentFormat($this->format);
        }
    }

    /*
     * Display alias, used by preview mode
     */
    protected function getDateFormatAlias()
    {
        if ($this->format) {
            return null;
        }

        if ($this->mode == 'time') {
            return 'time';
        }
        elseif ($this->mode == 'date') {
            return 'dateLong';
        }
        else {
            return 'dateTimeLong';
        }
    }
}
