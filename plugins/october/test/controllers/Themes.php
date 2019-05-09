<?php namespace October\Test\Controllers;

use BackendMenu;
use Backend\Classes\Controller;

/**
 * Themes Back-end Controller
 */
class Themes extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Test', 'test', 'reviews');
    }
}
