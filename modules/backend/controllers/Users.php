<?php namespace Backend\Controllers;

use Backend;
use Redirect;
use BackendMenu;
use BackendAuth;
use Backend\Models\UserGroup;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;

/**
 * Backend user controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Users extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $formConfig = 'config_form.yaml';
    public $listConfig = 'config_list.yaml';

    public $requiredPermissions = ['backend.manage_users'];

    public $bodyClass = 'compact-container';

    public function __construct()
    {
        parent::__construct();

        if ($this->action == 'myaccount') {
            $this->requiredPermissions = null;
        }

        BackendMenu::setContext('October.System', 'system', 'users');
        SettingsManager::setContext('October.System', 'administrators');
    }

    /**
     * Update controller
     */
    public function update($recordId, $context = null)
    {
        // Users cannot edit themselves, only use My Settings
        if ($context != 'myaccount' && $recordId == $this->user->id) {
            return Backend::redirect('backend/users/myaccount');
        }

        return $this->asExtension('FormController')->update($recordId, $context);
    }

    /**
     * My Settings controller
     */
    public function myaccount()
    {
        SettingsManager::setContext('October.Backend', 'myaccount');

        $this->pageTitle = 'backend::lang.myaccount.menu_label';
        return $this->update($this->user->id, 'myaccount');
    }

    /**
     * Proxy update onSave event
     */
    public function myaccount_onSave()
    {
        $result = $this->asExtension('FormController')->update_onSave($this->user->id, 'myaccount');

        /*
         * If the password or login name has been updated, reauthenticate the user
         */
        $loginChanged = $this->user->login != post('User[login]');
        $passwordChanged = strlen(post('User[password]'));
        if ($loginChanged || $passwordChanged) {
            BackendAuth::login($this->user->reload(), true);
        }

        return $result;
    }

    /**
     * Add available permission fields to the User form.
     * Mark default groups as checked for new Users.
     */
    protected function formExtendFields($form)
    {
        if ($form->getContext() == 'myaccount') {
            return;
        }

        $permissionFields = [];
        foreach (BackendAuth::listPermissions() as $permission) {

            $fieldName = 'permissions['.$permission->code.']';
            $fieldConfig = [
                'label' => $permission->label,
                'comment' => $permission->comment,
                'type' => 'balloon-selector',
                'options' => [
                    1 => 'backend::lang.user.allow',
                    0 => 'backend::lang.user.inherit',
                    -1 => 'backend::lang.user.deny',
                ],
                'attributes' => [
                    'data-trigger-action' => 'disable',
                    'data-trigger' => "input[name='User[permissions][superuser]']",
                    'data-trigger-condition' => 'checked',
                ],
                'span' => 'auto',
            ];

            if (isset($permission->tab)) {
                $fieldConfig['tab'] = $permission->tab;
            }

            $permissionFields[$fieldName] = $fieldConfig;
        }

        $form->addTabFields($permissionFields);

        /*
         * Mark default groups
         */
        if (!$form->model->exists) {
            $defaultGroupIds = UserGroup::where('is_new_user_default', true)->lists('id');

            $groupField = $form->getField('groups');
            $groupField->value = $defaultGroupIds;
        }
    }
}
