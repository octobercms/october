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
        $this->vars['permissions'] = BackendAuth::listTabbedPermissions();
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
}
