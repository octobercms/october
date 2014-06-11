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

        $this->addCss('/modules/backend/formwidgets/codeeditor/assets/css/codeeditor.css', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/ace/ace.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/codeeditor.js', 'core');
        $this->addJs('/modules/backend/assets/js/editorsettings/editorsettings.js', 'core');

        BackendMenu::setContext('October.System', 'system', 'settings');
    }

    public function index()
    {
        // Load the editor system settings
        $editorSettings = EditorSettingsModel::instance();

        $this->vars['showGutter'] = true;
        $this->vars['theme'] = $editorSettings->theme;
        $this->vars['wrapWords'] = $editorSettings->use_wrap;
        $this->vars['fontSize'] = $editorSettings->font_size;
        $this->vars['tabSize'] = $editorSettings->tab_size;
        $this->vars['useSoftTabs'] = !$editorSettings->use_hard_tabs;
        $this->vars['margin'] = 0;

        $this->getClassExtension('Backend.Behaviors.FormController')->update();
    }

    public function formFindModelObject()
    {
        return EditorSettingsModel::instance();
    }
}