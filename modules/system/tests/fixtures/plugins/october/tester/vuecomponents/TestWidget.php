<?php namespace October\Tester\VueComponents;

use System\Classes\VueComponentBase;

class TestWidget extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'october-tester-testwidget';

    /**
     * @var array require lists dependent Vue component classes.
     */
    protected $require = [
        \October\Tester\VueComponents\TestButton::class
    ];
}
