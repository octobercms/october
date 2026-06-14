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
 * ThemeOptions customization controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class ThemeOptions extends Controller
{
    /**
     * @var array implement extensions for this controller
     */
    public $implement = [
        \Backend\Behaviors\FormController::class
    ];

    /**
     * @var array formConfig `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array requiredPermissions to view this page
     */
    public $requiredPermissions = ['cms.theme_customize'];

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        $this->pageTitle = 'Site Theme';

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Cms', 'theme');
    }

    /**
     * formCreateModelObject
     */
    public function formCreateModelObject()
    {
        return ThemeData::createThemeDataModel();
    }

    /**
     * update
     */
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

    /**
     * update_onSave
     */
    public function update_onSave($dirName = null)
    {
        $model = $this->getThemeData($this->getDirName($dirName));
        $result = $this->asExtension('FormController')->update_onSave($model->id);

        // Redirect close requests to the settings index when user doesn't have access
        // to go back to the theme selection page
        if (!$this->user->hasAccess('cms.themes') && input('close')) {
            $result = Backend::redirect('system/settings');
        }

        return $result;
    }

    /**
     * update_onResetDefault
     */
    public function update_onResetDefault($dirName = null)
    {
        $model = $this->getThemeData($this->getDirName($dirName));
        $model->delete();

        return Backend::redirect('cms/themeoptions/update/'.$dirName);
    }

    /**
     * formExtendFieldsBefore will add form fields defined in theme.yaml
     */
    public function formExtendFieldsBefore($form)
    {
        $model = $form->model;
        $theme = $this->findThemeObject($model->theme);
        $form->config = $this->mergeConfig($form->config, $theme->getFormConfig());
        $form->init();
    }

    //
    // Helpers
    //

    /**
     * getDirName defaults to the active theme if user doesn't have access to manage all themes
     */
    protected function getDirName($dirName = null)
    {
        // Only the active theme can be managed without this permission
        if ($dirName && !$this->user->hasAccess('cms.themes')) {
            $dirName = null;
        }

        if ($dirName === null) {
            $dirName = CmsTheme::getActiveThemeCode();
        }

        return $dirName;
    }

    /**
     * hasThemeData
     */
    protected function hasThemeData($dirName)
    {
        return $this->findThemeObject($dirName)->hasCustomData();
    }

    /**
     * getThemeData
     */
    protected function getThemeData($dirName)
    {
        $theme = $this->findThemeObject($dirName);

        return ThemeData::forTheme($theme);
    }

    /**
     * findThemeObject
     */
    protected function findThemeObject($name = null)
    {
        if ($name === null) {
            $name = post('theme');
        }

        $theme = $name ? CmsTheme::load($name) : null;

        if (!$theme || !$theme->isValid()) {
            throw new ApplicationException(__("The theme ':name' is not found.", ['name' => $name]));
        }

        return $theme;
    }
}
