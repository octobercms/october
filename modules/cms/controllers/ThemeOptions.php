<?php namespace Cms\Controllers;

use File;
use Yaml;
use View;
use Flash;
use Config;
use Backend;
use Redirect;
use Response;
use BackendMenu;
use ValidationException;
use ApplicationException;
use Cms\Models\ThemeData;
use Cms\Models\ThemeExport;
use Cms\Models\ThemeImport;
use Cms\Classes\Theme as CmsTheme;
use Cms\Classes\ThemeManager;
use System\Classes\SettingsManager;
use Backend\Classes\Controller;
use Exception;

/**
 * Theme customization controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class ThemeOptions extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController'
    ];

    public $formConfig = 'config_form.yaml';

    public $requiredPermissions = ['cms.manage_themes', 'cms.manage_theme_options'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->pageTitle = 'cms::lang.theme.settings_menu';

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Cms', 'theme');
    }

    public function update($dirName = null)
    {
        /*
         * Only the active theme can be managed without this permission
         */
        if ($dirName && !$this->user->hasAccess('cms.manage_themes')) {
            $dirName = null;
        }

        if ($dirName === null) {
            $dirName = CmsTheme::getActiveThemeCode();
        }

        try {
            $model = $this->getThemeData($dirName);

            $this->asExtension('FormController')->update($model->id);

            $this->vars['hasCustomData'] = $this->hasThemeData($dirName);
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

        return Backend::redirect('cms/themeoptions/update/'.$dirName);
    }

    protected function hasThemeData($dirName)
    {
        return $this->findThemeObject($dirName)->hasCustomData();
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
    public function formExtendFields($form)
    {
        $model = $form->model;
        $theme = $this->findThemeObject($model->theme);
        $config = $theme->getConfigArray('form');

        if ($fields = array_get($config, 'fields')) {
            $form->addFields($fields);
        }

        if ($fields = array_get($config, 'tabs.fields')) {
            $form->addTabFields($fields);
        }

        if ($fields = array_get($config, 'secondaryTabs.fields')) {
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
