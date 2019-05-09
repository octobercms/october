<?php namespace October\Test\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use October\Test\Models\Phone;

/**
 * People Back-end Controller
 */
class People extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController',
        'Backend.Behaviors.RelationController',
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';
    public $relationConfig = 'config_relation.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Test', 'test', 'people');
    }

    public function formExtendModel($model)
    {
        /*
         * Init proxy field model if we are creating the model
         * and the context is proxy fields.
         */
        if ($this->formGetContext() === 'proxyfields' && !$model->phone) {
            $model->phone = new Phone;
        }

        return $model;
    }
}