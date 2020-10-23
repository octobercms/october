<?php namespace Cms\Controllers;

use File;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use ValidationException;
use ApplicationException;
use Cms\Models\ThemeExport;
use Cms\Models\ThemeImport;
use Cms\Classes\Theme as CmsTheme;
use Cms\Classes\ThemeManager;
use System\Classes\SettingsManager;
use Backend\Classes\Controller;
use Exception;
use Backend\Widgets\Form;

/**
 * Theme selector controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Themes extends Controller
{
    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = [
        'cms.manage_themes',
        'cms.manage_theme_options',
    ];

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

        /*
         * Custom redirect for unauthorized request
         */
        $this->bindEvent('page.beforeDisplay', function () {
            if (!$this->user->hasAccess('cms.manage_themes')) {
                return Backend::redirect('cms/themeoptions/update');
            }
        });

        /*
         * Enable AJAX for Form widgets
         */
        if (post('mode') === 'import') {
            $this->makeImportFormWidget($this->findThemeObject())->bindToController();
        }
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

    public function index_onDelete()
    {
        ThemeManager::instance()->deleteTheme(post('theme'));

        Flash::success(trans('cms::lang.theme.delete_theme_success'));
        return Redirect::refresh();
    }

    //
    // Theme properties
    //

    public function index_onLoadFieldsForm()
    {
        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeFieldsFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_fields_form');
    }

    public function index_onSaveFields()
    {
        $theme = $this->findThemeObject();
        $widget = $this->makeFieldsFormWidget($theme);
        $theme->writeConfig($widget->getSaveData());

        return ['#themeListItem-'.$theme->getId() => $this->makePartial('theme_list_item', ['theme' => $theme])];
    }

    protected function makeFieldsFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/classes/theme/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = $theme;
        $widgetConfig->data = $theme->getConfig();
        $widgetConfig->data['dir_name'] = $theme->getDirName();
        $widgetConfig->arrayName = 'Theme';
        $widgetConfig->context = 'update';

        return $this->makeWidget(Form::class, $widgetConfig);
    }

    //
    // Create theme
    //

    public function index_onLoadCreateForm()
    {
        $this->vars['widget'] = $this->makeCreateFormWidget();
        return $this->makePartial('theme_create_form');
    }

    public function index_onCreate()
    {
        $widget = $this->makeCreateFormWidget();
        $data = $widget->getSaveData();
        $newDirName = trim(array_get($data, 'dir_name'));
        $destinationPath = themes_path().'/'.$newDirName;

        $data = array_except($data, 'dir_name');

        if (!strlen(trim(array_get($data, 'name')))) {
            throw new ValidationException(['name' => trans('cms::lang.theme.create_theme_required_name')]);
        }

        if (!preg_match('/^[a-z0-9\_\-]+$/i', $newDirName)) {
            throw new ValidationException(['dir_name' => trans('cms::lang.theme.dir_name_invalid')]);
        }

        if (File::isDirectory($destinationPath)) {
            throw new ValidationException(['dir_name' => trans('cms::lang.theme.dir_name_taken')]);
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

        Flash::success(trans('cms::lang.theme.create_theme_success'));
        return Redirect::refresh();
    }

    protected function makeCreateFormWidget()
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/classes/theme/fields.yaml');
        $widgetConfig->alias = 'formCreateTheme';
        $widgetConfig->model = new CmsTheme;
        $widgetConfig->arrayName = 'Theme';
        $widgetConfig->context = 'create';

        return $this->makeWidget('Backend\Widgets\Form', $widgetConfig);
    }

    //
    // Duplicate
    //

    public function index_onLoadDuplicateForm()
    {
        $theme = $this->findThemeObject();
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_duplicate_form');
    }

    public function index_onDuplicateTheme()
    {
        $theme = $this->findThemeObject();
        $newDirName = trim(post('new_dir_name'));
        $sourcePath = $theme->getPath();
        $destinationPath = themes_path().'/'.$newDirName;

        if (!preg_match('/^[a-z0-9\_\-]+$/i', $newDirName)) {
            throw new ValidationException(['new_dir_name' => trans('cms::lang.theme.dir_name_invalid')]);
        }

        if (File::isDirectory($destinationPath)) {
            throw new ValidationException(['new_dir_name' => trans('cms::lang.theme.dir_name_taken')]);
        }

        File::copyDirectory($sourcePath, $destinationPath);
        $newTheme = CmsTheme::load($newDirName);
        $newName = $newTheme->getConfigValue('name') . ' - Copy';
        $newTheme->writeConfig(['name' => $newName]);

        Flash::success(trans('cms::lang.theme.duplicate_theme_success'));
        return Redirect::refresh();
    }

    //
    // Theme export
    //

    public function index_onLoadExportForm()
    {
        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeExportFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_export_form');
    }

    public function index_onExport()
    {
        $theme = $this->findThemeObject();
        $widget = $this->makeExportFormWidget($theme);

        $model = new ThemeExport;
        $file = $model->export($theme, $widget->getSaveData());

        return Backend::redirect('cms/themes/download/'.$file.'/'.$theme->getDirName().'.zip');
    }

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

    protected function makeExportFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/models/themeexport/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = new ThemeExport;
        $widgetConfig->model->theme = $theme;
        $widgetConfig->arrayName = 'ThemeExport';

        return $this->makeWidget('Backend\Widgets\Form', $widgetConfig);
    }

    //
    // Theme import
    //

    public function index_onLoadImportForm()
    {
        $theme = $this->findThemeObject();
        $this->vars['widget'] = $this->makeImportFormWidget($theme);
        $this->vars['themeDir'] = $theme->getDirName();

        return $this->makePartial('theme_import_form');
    }

    public function index_onImport()
    {
        $theme = $this->findThemeObject();
        $widget = $this->makeImportFormWidget($theme);

        $model = new ThemeImport;
        $model->import($theme, $widget->getSaveData(), $widget->getSessionKey());

        Flash::success(trans('cms::lang.theme.import_theme_success'));
        return Redirect::refresh();
    }

    protected function makeImportFormWidget($theme)
    {
        $widgetConfig = $this->makeConfig('~/modules/cms/models/themeimport/fields.yaml');
        $widgetConfig->alias = 'form'.studly_case($theme->getDirName());
        $widgetConfig->model = new ThemeImport;
        $widgetConfig->model->theme = $theme;
        $widgetConfig->arrayName = 'ThemeImport';

        return $this->makeWidget('Backend\Widgets\Form', $widgetConfig);
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
