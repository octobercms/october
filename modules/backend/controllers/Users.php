<?php namespace Backend\Controllers;

use Backend;
use Redirect;
use BackendMenu;
use BackendAuth;
use Backend\Classes\Controller;

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

        BackendMenu::setContext('October.System', 'system', 'users');
    }

    /**
     * Update controller
     */
    public function update($recordId, $context = null)
    {
        // Users cannot edit themselves, only use My Settings
        if ($context != 'mysettings' && $recordId == $this->user->id)
            return Redirect::to(Backend::url('backend/users/mysettings'));

        return $this->getClassExtension('Backend.Behaviors.FormController')->update($recordId, $context);
    }

    /**
     * My Settings controller
     */
    public function mysettings()
    {
        $this->pageTitle = 'My Settings';
        return $this->update($this->user->id, 'mysettings');
    }

    /**
     * Proxy update onSave event
     */
    public function mysettings_onSave()
    {
        $result = $this->getClassExtension('Backend.Behaviors.FormController')->update_onSave($this->user->id);

        /*
         * If the password or login name has been updated, reauthenticate the user
         */
        $loginChanged = $this->user->login != post('User[login]');
        $passwordChanged = strlen(post('User[password]'));
        if ($loginChanged || $passwordChanged)
            BackendAuth::login($this->user->reload(), true);

        return $result;
    }

    /**
     * Add available permission fields to the User form.
     */
    protected function formExtendFields($host)
    {
        if ($host->getContext() == 'mysettings')
            return;

        $permissionFields = [];
        foreach (BackendAuth::listPermissions() as $permission) {

            $fieldName = 'permissions['.$permission->code.']';
            $fieldConfig = [
                'label' => $permission->label,
                'comment' => $permission->comment,
                'type' => 'balloon-selector',
                'options' => [
                    1 => 'Allow',
                    0 => 'Inherit',
                    -1 => 'Deny',
                ],
                'attributes' => [
                    'data-trigger' => "input[name='User[permissions][superuser]']",
                    'data-trigger-type' => 'disable',
                    'data-trigger-condition' => 'checked',
                ],
                'span' => 'auto',
            ];

            if (isset($permission->tab))
                $fieldConfig['tab'] = $permission->tab;

            $permissionFields[$fieldName] = $fieldConfig;
        }

        $host->addTabFields($permissionFields);
    }
}