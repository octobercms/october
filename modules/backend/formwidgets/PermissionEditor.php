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
    /**
     * {@inheritDoc}
     */
    public function init()
    {
    }

    /**
     * {@inheritDoc}
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
        $this->vars['permissions'] = BackendAuth::listTabbedPermissions();
        $this->vars['baseFieldName'] = $this->formField->getName();
        $this->vars['permissionsData'] = $this->formField->getValueFromData($this->model);
    }

    /**
     * {@inheritDoc}
     */
    protected function loadAssets()
    {
        $this->addCss('css/permissioneditor.css', 'core');
    }
}
