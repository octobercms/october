<?php namespace Backend\Controllers;

use Lang;
use Flash;
use Config;
use System;
use Backend;
use Redirect;
use BackendAuth;
use Backend\Models\UserRole;
use Backend\Models\UserGroup;
use Backend\Classes\SettingsController;
use ForbiddenException;

/**
 * Users controller for backend users
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Users extends SettingsController
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = 'config_list.yaml';

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['admins.manage'];

    /**
     * @var string HTML body tag class
     */
    public $bodyClass = 'compact-container';

    /**
     * @var string settingsItemCode determines the settings code
     */
    public $settingsItemCode = 'administrators';

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        if ($this->action == 'myaccount') {
            $this->requiredPermissions = null;
        }
    }

    /**
     * index controller action
     * @return void
     */
    public function index()
    {
        $this->bodyClass = 'slim-container';

        return $this->asExtension('ListController')->index();
    }

    /**
     * formExtendFields adds available permission fields to the User form.
     * Mark default groups as checked for new Users.
     */
    public function formExtendFields($form)
    {
        // Remove permissions on own account
        if ($form->getContext() === 'myaccount') {
            return;
        }

        // Add super user flag
        if ($this->user->isSuperUser()) {
            $form->addField('is_superuser')
                ->context(['create', 'update'])
                ->tab('backend::lang.user.permissions')
                ->label('backend::lang.user.superuser')
                ->comment('backend::lang.user.superuser_comment')
                ->displayAs('switch');
        }

        // Manage other admins
        if ($form->getContext() !== 'create' && !BackendAuth::userHasAccess('admins.manage.other_admins')) {
            $form->removeField('password');
            $form->removeField('password_confirmation');
            $form->getField('email')->disabled();
        }

        // Filter the role options to those below rank
        if (!$this->user->isSuperUser()) {
            $form->getField('role')->options(function() {
                return $this->getRankedRoleOptions();
            });
        }

        // Mark default groups
        if (!$form->model->exists) {
            $defaultGroupIds = UserGroup::where('is_new_user_default', true)->pluck('id')->all();

            if ($groupField = $form->getField('groups')) {
                $groupField->value($defaultGroupIds);
            }
        }
    }

    /**
     * listExtendQuery extends the list query to hide superusers if the current user is not a superuser themselves
     */
    public function listExtendQuery($query)
    {
        $this->applyRankPermissionsToQuery($query);
    }

    /**
     * listFilterExtendScopes prevents non-superusers from even seeing the is_superuser filter
     */
    public function listFilterExtendScopes($filterWidget)
    {
        if (!$this->user->isSuperUser()) {
            $filterWidget->removeScope('is_superuser');
        }
    }

    /**
     * listInjectRowClass strikes out deleted records
     */
    public function listInjectRowClass($record, $definition = null)
    {
        if ($record->trashed()) {
            return 'strike';
        }
    }

    /**
     * formExtendModel
     */
    public function formExtendModel($model)
    {
        if (!$this->user->isSuperUser()) {
            $model->addValidationRule('role', 'required');
        }
    }

    /**
     * formExtendQuery extends the form query to prevent non-superusers from accessing superusers at all
     */
    public function formExtendQuery($query)
    {
        $this->applyRankPermissionsToQuery($query);

        // Ensure soft-deleted records can still be managed
        $query->withTrashed();
    }

    /**
     * formBeforeSave
     */
    public function formBeforeSave($model)
    {
        // Prevent outranked roles from being selected
        if (
            !$this->user->isSuperUser() &&
            ($role = UserRole::find(post('User[role]'))) &&
            ($this->allowPeerManagement()
                ? $role->sort_order < $this->user->role->sort_order
                : $role->sort_order <= $this->user->role->sort_order)
        ) {
            throw new ForbiddenException;
        }
    }

    /**
     * formBeforeCreate
     */
    public function formBeforeCreate($model)
    {
        // In production, we assume the user creating the new user is not the
        // new user so password must always be reset for security reasons
        if (!System::checkDebugMode()) {
            $model->is_password_expired = true;
        }
    }

    /**
     * getRoleOptions returns available role options
     */
    protected function getRankedRoleOptions()
    {
        $user = BackendAuth::getUser();
        if (!$user || !$user->role || !$user->role->sort_order) {
            return [];
        }

        $roles = UserRole::where(
            'sort_order',
            $this->allowPeerManagement() ? '>=' : '>',
            $user->role->sort_order
        )->get();

        $result = [];
        foreach ($roles as $role) {
            $result[$role->id] = [$role->name, $role->description];
        }

        return $result;
    }

    /**
     * applyRankPermissionsToQuery
     */
    protected function applyRankPermissionsToQuery($query)
    {
        // Super users have no restrictions
        if ($this->user->isSuperUser()) {
            return;
        }

        // Hide super users
        $query->where('is_superuser', false);

        // Hide users above rank, not including self
        $query->where(function($q) {
            $q->where('id', $this->user->id);

            if ($this->user->role && $this->user->role->sort_order) {
                $q->orWhereHas('role', function($q) {
                    $q->where(
                        'sort_order',
                        $this->allowPeerManagement() ? '>=' : '>',
                        $this->user->role->sort_order
                    );
                });
            }
        });
    }

    /**
     * update controller
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
     * update_onRestore handles restoring users
     */
    public function update_onRestore($recordId)
    {
        $this->formFindModelObject($recordId)->restore();

        Flash::success(Lang::get('backend::lang.form.restore_success', ['name' => Lang::get('backend::lang.user.name')]));

        return Redirect::refresh();
    }

    /**
     * myaccount controller
     */
    public function myaccount()
    {
        // SettingsManager::setContext('October.Backend', 'myaccount');

        $this->pageTitle = "My Account";

        return $this->update($this->user->id, 'myaccount');
    }

    /**
     * myaccount_onSave proxies the update onSave event
     */
    public function myaccount_onSave()
    {
        $result = $this->asExtension('FormController')->update_onSave($this->user->id, 'myaccount');

        // If the password or login name has been updated, reauthenticate the user
        $loginChanged = $this->user->login != post('User[login]');
        $passwordChanged = strlen(post('User[password]'));

        if ($loginChanged || $passwordChanged) {
            // Determine remember policy
            $remember = Config::get('backend.force_remember');
            if ($remember === null) {
                $remember = BackendAuth::hasRemember();
            }

            BackendAuth::login($this->user->reload(), (bool) $remember);
        }

        return $result;
    }

    /**
     * allowPeerManagement returns true if users can manage other peers
     */
    protected function allowPeerManagement(): bool
    {
        return Config::get('backend.user_peer_management', false);
    }
}
