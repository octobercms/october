<?php namespace Backend\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use Backend\Models\EditorSettings as EditorSettingsModel;

/**
 * Editor Settings controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class EditorSettings extends Controller
{

    public $implement = [
        'Backend.Behaviors.FormController',
    ];

    public $formConfig = 'config_form.yaml';

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
    }

    public function index()
    {
        $this->getClassExtension('Backend.Behaviors.FormController')->update();
    }

    public function formFindModelObject()
    {
        return EditorSettingsModel::instance();
    }
}