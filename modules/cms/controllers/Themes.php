<?php namespace Cms\Controllers;

use Yaml;
use Config;
use Backend;
use Redirect;
use BackendMenu;
use ApplicationException;
use Cms\Models\ThemeData;
use Backend\Classes\Controller;
use Cms\Classes\Theme as CmsTheme;
use System\Classes\SettingsManager;
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
        CmsTheme::setActiveTheme(post('theme'));

        return [
            '#theme-list' => $this->makePartial('theme_list')
        ];
    }

    //
    // Theme properties
    //

    public function index_onLoadThemeFieldsForm()
    {
        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeThemeFieldsFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_fields_form');
    }

    public function index_onSaveThemeFields()
    {
        $theme = $this->findThemeObject();
        $widget = $this->makeThemeFieldsFormWidget($theme);
        $theme->writeConfig($widget->getSaveData());

        return ['#themeListItem-'.$theme->getId() => $this->makePartial('theme_list_item', ['theme' => $theme])];
    }

    protected function makeThemeFieldsFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/classes/theme/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = $theme;
        $widgetConfig->data = $theme->getConfig();
        $widgetConfig->data['directory_name'] = $theme->getDirName();
        $widgetConfig->arrayName = 'Theme';

        $widget = $this->makeWidget('Backend\Widgets\Form', $widgetConfig);
        return $widget;
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
        $theme = $this->findThemeObject($dirName);
        $model = ThemeData::forTheme($theme);
        return $model;
    }

    /**
     * Add form fields defined in theme.yaml
     */
    protected function formExtendFields($form)
    {
        $model = $form->model;
        $theme = $this->findThemeObject($model->theme);

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

    //
    // Helpers
    //

    protected function findThemeObject($name = null)
    {
        if ($name === null) {
            $name = post('theme');
        }

        if (!$name || (!$theme = CmsTheme::load($name))) {
            throw new ApplicationException(trans('cms::lang.theme.not_found_name', ['name' => $name]));
        }

        return $theme;
    }

}
