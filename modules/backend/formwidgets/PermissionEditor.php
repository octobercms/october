<?php namespace Backend\FormWidgets;

use Backend\Classes\RoleManager;
use Backend\Classes\FormWidgetBase;
use BackendAuth;

/**
 * PermissionEditor is used by the system internally on the System / Administrators pages.
 *
 * Available Modes:
 *
 * - radio: Default mode, used by user-level permissions.
 *   Provides three-state control over each available permission. States are
 *      -1: Explicitly deny the permission
 *      0: Inherit the permission's value from a parent source (User inherits from Role)
 *      1: Explicitly grant the permission
 *
 * - checkbox: Used to define permissions for roles. Intended to define a base of what permissions are available
 *   Provides two state control over each available permission. States are
 *      1: Explicitly allow the permission
 *      null: If the checkbox is not ticked, the permission will not be sent to the server and will not be stored.
 *      This is interpreted as the permission not being present and thus not allowed
 *
 * - switch: Used to define overriding permissions in a simpler UX than the radio.
 *   Provides two state control over each available permission. States are
 *      1: Explicitly allow the permission
 *     -1: Explicitly deny the permission
 *
 * Although users are still not allowed to modify permissions that they themselves do not have access to,
 * available permissions can be defined in the form of an array of permission codes to allow:
 *
 *     availablePermissions: ['some.author.permission', 'some.other.permission', 'etc.some.system.permission']
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PermissionEditor extends FormWidgetBase
{
    /**
     * @var \Backend\Models\User user
     */
    protected $user;

    /**
     * @var string Mode to display the permission editor with. Available options: radio, checkbox, switch
     */
    public $mode = 'radio';

    /**
     * @var array Permission codes to allow to be interacted with through this widget
     */
    public $availablePermissions;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode',
            'availablePermissions',
        ]);

        $this->user = BackendAuth::getUser();
    }

    /**
     * @inheritDoc
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('permissioneditor');
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        if ($this->formField->disabled) {
            $this->previewMode = true;
        }

        $permissionsData = $this->formField->getValueFromData($this->model);
        if (!is_array($permissionsData)) {
            $permissionsData = [];
        }

        $this->vars['mode'] = $this->mode;
        $this->vars['permissions'] = $this->getViewPermissions();
        $this->vars['baseFieldName'] = $this->getFieldName();
        $this->vars['permissionsData'] = $permissionsData;
        $this->vars['field'] = $this->formField;
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if ($this->user->isSuperUser()) {
            return is_array($value) ? $value : [];
        }

        return $this->getSaveValueSecure($value);
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/permissioneditor.css');
        $this->addJs('js/permissioneditor.js', ['type' => 'module']);
    }

    /**
     * getSaveValueSecure returns a safely parsed set of permissions, ensuring the user cannot
     * elevate their own permissions or permissions of another user above their own.
     *
     * @param string $value
     * @return array
     */
    protected function getSaveValueSecure($value)
    {
        $newPermissions = is_array($value) ? array_map('intval', $value) : [];

        if (!$newPermissions) {
            return [];
        }

        $existingPermissions = $this->model->permissions ?: [];

        $allowedPermissions = array_map(function ($permissionObject) {
            return $permissionObject->code;
        }, $this->getFilteredPermissions());

        foreach ($newPermissions as $permission => $code) {
            if (in_array($permission, $allowedPermissions)) {
                $existingPermissions[$permission] = $code;
            }
        }

        return $existingPermissions;
    }

    /**
     * getFilteredPermissions returns the available permissions, removing those that
     * the logged-in user does not have access to. In the format of:
     *
     *     ['permission-tab' => $arrayOfAllowedPermissionObjects]
     *
     * @return array
     */
    protected function getFilteredPermissions()
    {
        $permissions = RoleManager::instance()->listPermissionsForUser($this->user);

        if (!is_array($this->availablePermissions)) {
            return $permissions;
        }

        return array_filter($permissions, function ($permission) {
            return $permission->code && in_array($permission->code, $this->availablePermissions);
        });
    }

    /**
     * getViewPermissions
     */
    protected function getViewPermissions()
    {
        $permissions = $this->getFilteredPermissions();
        $permissions = $this->makeTabbedPermissions($permissions);
        $permissions = array_map(function($tabbed) {
            return $this->makeNestedPermissions($tabbed);
        }, $permissions);

        return $permissions;
    }

    /**
     * makeTabbedPermissions
     */
    protected function makeTabbedPermissions($permissions)
    {
        $tabs = [];

        foreach ($permissions as $permission) {
            $tab = $permission->tab ?? 'backend::lang.form.undefined_tab';

            if (!array_key_exists($tab, $tabs)) {
                $tabs[$tab] = [];
            }

            $tabs[$tab][$permission->code] = $permission;
        }

        return $tabs;
    }

    /**
     * makeNestedPermissions
     */
    protected function makeNestedPermissions($permissions)
    {
        $forget = [];

        foreach ($permissions as $permission) {
            $code = $permission->code;
            $parentCode = substr($code, 0, strrpos($code, '.'));

            if (isset($permissions[$parentCode])) {
                $permissions[$parentCode]->addChild($permission);
                $forget[] = $code;
            }
        }

        array_forget($permissions, $forget);

        return $permissions;
    }
}
