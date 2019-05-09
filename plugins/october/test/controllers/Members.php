<?php namespace October\Test\Controllers;

use BackendMenu;
use Backend\Classes\Controller;

/**
 * Members Back-end Controller
 */
class Members extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
    ];

    public $formConfig = 'config_form.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Test', 'test', 'trees');
    }
}