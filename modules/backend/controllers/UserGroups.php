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
    public function formExtendFields($form)
    {
        /*
         * Add permissions tab
         */
        $form->addTabFields($this->generatePermissionFields());
    }

    /**
     * Generates an array of form fields to assign permissions provided
     * by the system.
     * @return array
     */
    protected function generatePermissionFields()
    {
        $permissionFields = [];

        foreach (BackendAuth::listTabbedPermissions() as $tab => $permissions) {

            $fieldName = 'permissions_'.snake_case($tab).'_section';
            $fieldConfig = [
                'label' => $tab,
                'type' => 'section',
                'tab' => 'backend::lang.user.permissions',
                'containerAttributes' => ['data-field-collapsible' => 1]
            ];

            $permissionFields[$fieldName] = $fieldConfig;

            foreach ($permissions as $permission) {
                $fieldName = 'permissions['.$permission->code.']';
                $fieldConfig = [
                    'label' => $permission->label,
                    'comment' => $permission->comment,
                    'type' => 'checkbox',
                    'span' => 'auto',
                    'tab' => 'backend::lang.user.permissions'
                ];

                $permissionFields[$fieldName] = $fieldConfig;
            }
        }

        return $permissionFields;
    }
}
