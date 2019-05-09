<?php namespace October\Test\Controllers;

use BackendMenu;
use Backend\Classes\Controller;

/**
 * Trees Back-end Controller
 */
class Trees extends Controller
{
    public $implement = [
        'Backend.Behaviors.ListController'
    ];

    public $listConfig = [
        'members' => 'config_members_list.yaml',
        'categories' => 'config_categories_list.yaml',
        'channels' => 'config_channels_list.yaml'
    ];

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Test', 'test', 'trees');
    }
}