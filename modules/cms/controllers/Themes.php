<?php namespace Cms\Controllers;

use Lang;
use Input;
use Config;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use Cms\Models\ThemeData;
use Cms\Classes\Theme as CmsTheme;
use Exception;

/**
 * Theme selector controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Themes extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController'
    ];

    public $formConfig = 'config_form.yaml';

    public $requiredPermissions = ['cms.manage_themes'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->addCss('/modules/cms/assets/css/october.theme-selector.css', 'core');

        $this->pageTitle = 'cms::lang.theme.settings_menu';
        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Cms', 'theme');
    }

    public function index()
    {
        $this->bodyClass = 'compact-container';
    }

    public function index_onSetActiveTheme()
    {
        CmsTheme::setActiveTheme(Input::get('theme'));

        return [
            '#theme-list' => $this->makePartial('theme_list')
        ];
    }

    //
    // Theme customization
    //

    public function update($dirName)
    {
        try {
            $model = $this->getThemeData($dirName);
            $this->asExtension('FormController')->update($model->id);
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    public function update_onSave($dirName)
    {
        $model = $this->getThemeData($dirName);
        $this->asExtension('FormController')->update_onSave($model->id);
    }

    public function update_onResetDefault($dirName)
    {
        $model = $this->getThemeData($dirName);
        $model->delete();

        return Backend::redirect('cms/themes/update/'.$dirName);
    }

    protected function getThemeData($dirName)
    {
        if (!$theme = CmsTheme::load($dirName))
            throw new Exception(Lang::get('Unable to find theme with name :name', $dirName));

        $model = ThemeData::forTheme($theme);
        return $model;
    }

    /**
     * Add form fields defined in theme.yaml
     */
    protected function formExtendFields($form)
    {
        $model = $form->model;

        if (!$theme = CmsTheme::load($model->theme))
            throw new Exception(Lang::get('Unable to find theme with name :name', $this->theme));

        if ($fields = $theme->getConfigValue('form.fields')) {
            $form->addFields($fields);
        }

        if ($fields = $theme->getConfigValue('form.tabs.fields')) {
            $form->addTabFields($fields);
        }

        if ($fields = $theme->getConfigValue('form.secondaryTabs.fields')) {
            $form->addSecondaryTabFields($fields);
        }
    }

}
