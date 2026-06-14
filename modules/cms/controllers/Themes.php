<?php namespace Cms\Controllers;

use File;
use Lang;
use Flash;
use System;
use Backend;
use Redirect;
use BackendMenu;
use BackendAuth;
use ValidationException;
use ApplicationException;
use Cms\Models\ThemeSeed;
use Cms\Models\ThemeExport;
use Cms\Models\ThemeImport;
use Cms\Classes\Theme as CmsTheme;
use Cms\Classes\ThemeManager;
use System\Classes\SettingsManager;
use Backend\Classes\Controller;
use ForbiddenException;
use Exception;

/**
 * Themes selector controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Themes extends Controller
{
    /**
     * @var array requiredPermissions to view this page
     */
    public $requiredPermissions = ['cms.themes', 'cms.theme_customize'];

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        $this->addCss('/modules/cms/assets/css/themes.css');

        $this->pageTitle = 'Site Theme';
        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.Cms', 'theme');

        // Enable AJAX for Form widgets
        if (post('mode') === 'import') {
            $this->makeImportFormWidget($this->findThemeObject())->bindToController();
        }
    }

    /**
     * beforeDisplay
     */
    public function beforeDisplay()
    {
        // Custom redirect for unauthorized request
        if (!$this->user->hasAccess('cms.themes')) {
            return Backend::redirect('cms/themeoptions/update');
        }
    }

    /**
     * index
     */
    public function index()
    {
        $this->bodyClass = 'compact-container';

        $this->vars['themes'] = CmsTheme::allAvailable();
    }

    /**
     * index_onSetActiveTheme
     */
    public function index_onSetActiveTheme()
    {
        if (!BackendAuth::userHasAccess('cms.themes.activate')) {
            throw new ForbiddenException;
        }

        $themeCode = post('theme');

        // For the frontend
        CmsTheme::setActiveTheme($themeCode);

        // For the backend
        CmsTheme::setEditTheme($themeCode);

        return [
            '#theme-list' => $this->makePartial('theme_list')
        ];
    }

    /**
     * index_onDelete
     */
    public function index_onDelete()
    {
        if (!BackendAuth::userHasAccess('cms.themes.delete')) {
            throw new ForbiddenException;
        }

        ThemeManager::instance()->deleteTheme(post('theme'));

        Flash::success(__('Theme deleted!'));
        return Redirect::refresh();
    }

    //
    // Theme properties
    //

    /**
     * index_onLoadFieldsForm
     */
    public function index_onLoadFieldsForm()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeFieldsFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_fields_form');
    }

    /**
     * index_onSaveFields
     */
    public function index_onSaveFields()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        $theme = $this->findThemeObject();
        $widget = $this->makeFieldsFormWidget($theme);
        $theme->writeConfig($widget->getSaveData());

        return ['#themeListItem-'.$theme->getId() => $this->makePartial('theme_list_item', ['theme' => $theme])];
    }

    /**
     * makeFieldsFormWidget
     */
    protected function makeFieldsFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/classes/theme/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = $theme;
        $widgetConfig->data = $theme->getConfig();
        $widgetConfig->data['dir_name'] = $theme->getDirName();
        $widgetConfig->arrayName = 'Theme';
        $widgetConfig->context = 'update';

        return $this->makeWidget(\Backend\Widgets\Form::class, $widgetConfig);
    }

    //
    // Create theme
    //

    /**
     * index_onLoadCreateForm
     */
    public function index_onLoadCreateForm()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        $this->vars['widget'] = $this->makeCreateFormWidget();
        return $this->makePartial('theme_create_form');
    }

    /**
     * index_onCreate
     */
    public function index_onCreate()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        $widget = $this->makeCreateFormWidget();
        $data = $widget->getSaveData();
        $newDirName = trim($data['dir_name'] ?? '');
        $destinationPath = themes_path().'/'.$newDirName;

        $data = array_except($data, 'dir_name');

        if (!strlen(trim($data['name'] ?? ''))) {
            throw new ValidationException(['name' => __('Please specify a name for the theme.')]);
        }

        if (!preg_match('/^[a-z0-9\_\-]+$/i', $newDirName)) {
            throw new ValidationException(['dir_name' => __('Name can contain only digits, Latin letters and the following symbols: _-')]);
        }

        if (File::isDirectory($destinationPath)) {
            throw new ValidationException(['dir_name' => __('Desired theme directory already exists.')]);
        }

        File::makeDirectory($destinationPath);
        File::makeDirectory($destinationPath.'/assets');
        File::makeDirectory($destinationPath.'/content');
        File::makeDirectory($destinationPath.'/layouts');
        File::makeDirectory($destinationPath.'/pages');
        File::makeDirectory($destinationPath.'/partials');
        File::put($destinationPath.'/theme.yaml', '');

        $theme = CmsTheme::load($newDirName);
        $theme->writeConfig($data);

        Flash::success(__('Theme Created!'));
        return Redirect::refresh();
    }

    /**
     * makeCreateFormWidget
     */
    protected function makeCreateFormWidget()
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/classes/theme/fields.yaml');
        $widgetConfig->alias = 'formCreateTheme';
        $widgetConfig->model = new CmsTheme;
        $widgetConfig->arrayName = 'Theme';
        $widgetConfig->context = 'create';

        return $this->makeWidget(\Backend\Widgets\Form::class, $widgetConfig);
    }

    //
    // Duplicate
    //

    /**
     * index_onLoadDuplicateForm
     */
    public function index_onLoadDuplicateForm()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        $theme = $this->findThemeObject();
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_duplicate_form');
    }

    /**
     * index_onDuplicateTheme
     */
    public function index_onDuplicateTheme()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        $theme = $this->findThemeObject();
        $newDirName = trim(post('new_dir_name'));

        if (!preg_match('/^[a-z0-9\_\-]+$/i', $newDirName)) {
            throw new ValidationException(['new_dir_name' => __('Name can contain only digits, Latin letters and the following symbols: _-')]);
        }

        if (!ThemeManager::instance()->duplicateTheme($theme->getDirName(), $newDirName)) {
            throw new ValidationException(['new_dir_name' => __('Desired theme directory already exists.')]);
        }

        Flash::success(__('Theme Duplicated!'));

        return Redirect::refresh();
    }

    //
    // Theme export
    //

    /**
     * index_onLoadExportForm
     */
    public function index_onLoadExportForm()
    {
        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeExportFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_export_form');
    }

    /**
     * index_onExport
     */
    public function index_onExport()
    {
        $theme = $this->findThemeObject();
        $widget = $this->makeExportFormWidget($theme);

        $model = new ThemeExport;
        $file = $model->export($theme, $widget->getSaveData());

        return Backend::redirect('cms/themes/download/'.$file.'/'.$theme->getDirName().'.zip');
    }

    /**
     * download
     */
    public function download($name, $outputName = null)
    {
        try {
            $this->pageTitle = 'Download theme export archive';
            return ThemeExport::download($name, $outputName);
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    /**
     * makeExportFormWidget
     */
    protected function makeExportFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/models/themeexport/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = new ThemeExport;
        $widgetConfig->model->theme = $theme;
        $widgetConfig->arrayName = 'ThemeExport';

        return $this->makeWidget(\Backend\Widgets\Form::class, $widgetConfig);
    }

    //
    // Theme import
    //

    /**
     * index_onLoadImportForm
     */
    public function index_onLoadImportForm()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        if (System::checkSafeMode()) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.safe_mode_enabled'));
        }

        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeImportFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_import_form');
    }

    /**
     * index_onImport
     */
    public function index_onImport()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        if (System::checkSafeMode()) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.safe_mode_enabled'));
        }

        $theme = $this->findThemeObject();
        $widget = $this->makeImportFormWidget($theme);

        $model = new ThemeImport;
        $model->import($theme, $widget->getSaveData(), $widget->getSessionKey());

        Flash::success(__('Theme Imported!'));
        return Redirect::refresh();
    }

    /**
     * makeImportFormWidget
     */
    protected function makeImportFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/models/themeimport/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = new ThemeImport;
        $widgetConfig->model->theme = $theme;
        $widgetConfig->arrayName = 'ThemeImport';

        return $this->makeWidget(\Backend\Widgets\Form::class, $widgetConfig);
    }

    //
    // Theme seed
    //

    /**
     * index_onLoadSeedForm
     */
    public function index_onLoadSeedForm()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        if (System::checkSafeMode()) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.safe_mode_enabled'));
        }

        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeSeedFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_seed_form');
    }

    /**
     * index_onSeed
     */
    public function index_onSeed()
    {
        if (!BackendAuth::userHasAccess('cms.themes.create')) {
            throw new ForbiddenException;
        }

        if (System::checkSafeMode()) {
            throw new ApplicationException(Lang::get('cms::lang.cms_object.safe_mode_enabled'));
        }

        $theme = $this->findThemeObject();
        $widget = $this->makeSeedFormWidget($theme);

        $model = new ThemeSeed;
        $model->seed($theme, $widget->getSaveData());

        Flash::success(__('Theme Seeded!'));
        return Redirect::refresh();
    }


    /**
     * makeSeedFormWidget
     */
    protected function makeSeedFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/models/themeseed/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = new ThemeSeed;
        $widgetConfig->model->theme = $theme;
        $widgetConfig->arrayName = 'ThemeSeed';

        return $this->makeWidget(\Backend\Widgets\Form::class, $widgetConfig);
    }

    //
    // Util
    //

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
