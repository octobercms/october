<?php namespace Backend\FormWidgets;

use Backend\Classes\FormWidgetBase;
use BackendAuth;

/**
 * User/group permission editor
 * This widget is used by the system internally on the System / Administrators pages.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PermissionEditor extends FormWidgetBase
{
    public $mode;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'mode'
        ]);
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
     * Prepares the list data
     */
    public function prepareVars()
    {
        $permissionsData = $this->formField->getValueFromData($this->model);
        if (!is_array($permissionsData)) {
            $permissionsData = [];
        }

        $this->vars['checkboxMode'] = $this->getControlMode() === 'checkbox';
        $this->vars['permissions'] = $this->getFilteredPermissions();
        $this->vars['baseFieldName'] = $this->getFieldName();
        $this->vars['permissionsData'] = $permissionsData;
        $this->vars['field'] = $this->formField;
    }

    /**
     * @inheritDoc
     */
    public function getSaveValue($value)
    {
        if (is_array($value)) {
            return $value;
        }

        return [];
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/permissioneditor.css', 'core');
        $this->addJs('js/permissioneditor.js', 'core');
    }

    protected function getControlMode()
    {
        return strlen($this->mode) ? $this->mode : 'radio';
    }

    /**
     * Returns the available permissions; removing those that the logged-in user does not have access to
     *
     * @return array The permissions that the logged-in user does have access to
     */
    protected function getFilteredPermissions()
    {
        $permissions = BackendAuth::listTabbedPermissions();
        $user = BackendAuth::getUser();
        foreach ($permissions as $tab => $permissionsArray) {
            foreach ($permissionsArray as $index => $permission) {
                if (!$user->hasAccess($permission->code)) {
                    unset($permissionsArray[$index]);
                }
            }

            if (empty($permissionsArray)) {
                unset($permissions[$tab]);
            } else {
                $permissions[$tab] = $permissionsArray;
            }
        }

        return $permissions;
    }
}
