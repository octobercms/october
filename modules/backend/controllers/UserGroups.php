<?php namespace Backend\Controllers;

use BackendMenu;
use BackendAuth;
use Backend\Classes\Controller;

/**
 * Backend user groups controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class UserGroups extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public $requiredPermissions = ['backend.manage_users'];

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'users');
    }

    /**
     * Add available permission fields to the Group form.
     */
    protected function formExtendFields($host)
    {
        $permissionFields = [];
        foreach (BackendAuth::listPermissions() as $permission) {

            $fieldName = 'permissions['.$permission->code.']';
            $fieldConfig = [
                'label' => $permission->label,
                'comment' => $permission->comment,
                'type' => 'checkbox',
            ];

            if (isset($permission->tab)) {
                $fieldConfig['tab'] = $permission->tab;
            }

            $permissionFields[$fieldName] = $fieldConfig;
        }

        $host->addTabFields($permissionFields);
    }
}
