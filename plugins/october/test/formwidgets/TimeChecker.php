<?php namespace October\Test\FormWidgets;

use Backend;
use Carbon\Carbon;
use Backend\Classes\FormWidgetBase;
use ApplicationException;
use Exception;

class TimeChecker extends FormWidgetBase
{
    use \Backend\Traits\FormModelWidget;

    /**
     * {@inheritDoc}
     */
    protected $defaultAlias = 'timechecker';

    /**
     * {@inheritDoc}
     */
    public function init()
    {
        $this->fillFromConfig([]);
    }

    /**
     * {@inheritDoc}
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('timechecker');
    }

    protected function prepareVars()
    {
        $randomDate = Carbon::now()->addMinutes(rand(1, 60));

        $this->vars['testImg'] = 'http://placehold.it/'.post('size', '50x50');
        $this->vars['currentTime'] = Backend::dateTime($randomDate);
    }

    /**
     * Test AJAX
     */
    public function onPullImage()
    {
        $this->prepareVars();

        return $this->makePartial('timechecker');
    }

    public function onPushUpdateTime()
    {
        $this->prepareVars();

        return ['#'.$this->getId('container') => $this->makePartial('current_time')];
    }
}
