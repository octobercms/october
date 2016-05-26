<?php namespace Backend\Controllers;

use Lang;
use Flash;
use Backend;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use Backend\Models\Preference as PreferenceModel;

/**
 * Editor Settings controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Preferences extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
    ];

    public $formConfig = 'config_form.yaml';

    public $requiredPermissions = ['backend.manage_preferences'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->addCss('/modules/backend/formwidgets/codeeditor/assets/css/codeeditor.css', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js', 'core');
        $this->addJs('/modules/backend/assets/js/preferences/preferences.js', 'core');

        BackendMenu::setContext('October.System', 'system', 'mysettings');
        SettingsManager::setContext('October.Backend', 'preferences');
    }

    public function index()
    {
        $this->pageTitle = 'backend::lang.backend_preferences.menu_label';
        $this->asExtension('FormController')->update();
    }

    /**
     * Remove the code editor tab if there is no permission.
     */
    public function formExtendFields($form)
    {
        if (!$this->user->hasAccess('backend.manage_editor')) {
            $form->removeTab('backend::lang.backend_preferences.code_editor');
        }
    }

    public function index_onSave()
    {
        return $this->asExtension('FormController')->update_onSave();
    }

    public function index_onResetDefault()
    {
        $model = $this->formFindModelObject();
        $model->resetDefault();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Backend::redirect('backend/preferences');
    }

    public function formFindModelObject()
    {
        return PreferenceModel::instance();
    }
}
