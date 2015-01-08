<?php namespace Backend\Controllers;

use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use Backend\Models\EditorPreferences as EditorPreferencesModel;

/**
 * Editor Settings controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class EditorPreferences extends Controller
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
        $this->addJs('/modules/backend/assets/js/editorpreferences/editorpreferences.js', 'core');

        BackendMenu::setContext('October.System', 'system', 'mysettings');
        SettingsManager::setContext('October.Backend', 'editor');
    }

    public function index()
    {
        // Load the editor system settings
        $editorSettings = EditorPreferencesModel::instance();

        $this->vars['fontSize'] = $editorSettings->font_size;
        $this->vars['wordWrap'] = $editorSettings->word_wrap;
        $this->vars['codeFolding'] = $editorSettings->code_folding;
        $this->vars['tabSize'] = $editorSettings->tab_size;
        $this->vars['theme'] = $editorSettings->theme;
        $this->vars['showInvisibles'] = $editorSettings->show_invisibles;
        $this->vars['highlightActiveLine'] = $this->highlight_active_line;
        $this->vars['useSoftTabs'] = !$editorSettings->use_hard_tabs;
        $this->vars['showGutter'] = true;
        $this->vars['language'] = 'css';
        $this->vars['margin'] = 0;

        $this->asExtension('FormController')->update();
        $this->pageTitle = 'backend::lang.editor.menu_label';
    }

    public function index_onSave()
    {
        return $this->asExtension('FormController')->update_onSave();
    }

    public function formFindModelObject()
    {
        return EditorPreferencesModel::instance();
    }
}
