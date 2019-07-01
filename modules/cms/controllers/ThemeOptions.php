<?php namespace Cms\Controllers;

use Backend;
use BackendMenu;
use ApplicationException;
use Cms\Models\ThemeData;
use Cms\Classes\Theme as CmsTheme;
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
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array Permissions required to view this page.
     */
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
        $dirName = $this->getDirName($dirName);

        try {
            $model = $this->getThemeData($dirName);

            $this->asExtension('FormController')->update($model->id);

            $this->vars['hasCustomData'] = $this->hasThemeData($dirName);
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    public function update_onSave($dirName = null)
    {
        $model = $this->getThemeData($this->getDirName($dirName));
        $result = $this->asExtension('FormController')->update_onSave($model->id);

        // Redirect close requests to the settings index when user doesn't have access
        // to go back to the theme selection page
        if (!$this->user->hasAccess('cms.manage_themes') && input('close')) {
            $result = Backend::redirect('system/settings');
        }

        return $result;
    }

    public function update_onResetDefault($dirName = null)
    {
        $model = $this->getThemeData($this->getDirName($dirName));
        $model->delete();

        return Backend::redirect('cms/themeoptions/update/'.$dirName);
    }

    /**
     * Add form fields defined in theme.yaml
     */
    public function formExtendFields($form)
    {
        $model = $form->model;
        $theme = $this->findThemeObject($model->theme);
        $config = $theme->getFormConfig();

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

    /**
     * Default to the active theme if user doesn't have access to manage all themes
     */
    protected function getDirName($dirName = null)
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

        return $dirName;
    }

    protected function hasThemeData($dirName)
    {
        return $this->findThemeObject($dirName)->hasCustomData();
    }

    protected function getThemeData($dirName)
    {
        $theme = $this->findThemeObject($dirName);
        return ThemeData::forTheme($theme);
    }

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
