<?php namespace Cms\Controllers;

use Url;
use Lang;
use Flash;
use Config;
use Request;
use Exception;
use BackendMenu;
use Cms\Widgets\AssetList;
use Cms\Widgets\TemplateList;
use Cms\Widgets\ComponentList;
use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Router;
use Cms\Classes\Layout;
use Cms\Classes\Partial;
use Cms\Classes\Content;
use Cms\Classes\CmsCompoundObject;
use Cms\Classes\ComponentManager;
use Cms\Classes\ComponentPartial;
use Backend\Classes\Controller;
use System\Helpers\DateTime;
use October\Rain\Router\Router as RainRouter;
use ApplicationException;
use Cms\Classes\Asset;

/**
 * CMS index
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Index extends Controller
{
    use \Backend\Traits\InspectableContainer;

    /**
     * @var Cms\Classes\Theme
     */
    protected $theme;

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = [
        'cms.manage_content',
        'cms.manage_assets',
        'cms.manage_pages',
        'cms.manage_layouts',
        'cms.manage_partials'
    ];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.Cms', 'cms', true);

        try {
            if (!($theme = Theme::getEditTheme())) {
                throw new ApplicationException(Lang::get('cms::lang.theme.edit.not_found'));
            }

            $this->theme = $theme;

            new TemplateList($this, 'pageList', function () use ($theme) {
                return Page::listInTheme($theme, true);
            });

            new TemplateList($this, 'partialList', function () use ($theme) {
                return Partial::listInTheme($theme, true);
            });

            new TemplateList($this, 'layoutList', function () use ($theme) {
                return Layout::listInTheme($theme, true);
            });

            new TemplateList($this, 'contentList', function () use ($theme) {
                return Content::listInTheme($theme, true);
            });

            new ComponentList($this, 'componentList');

            new AssetList($this, 'assetList');
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    //
    // Pages
    //

    /**
     * Index page action
     * @return void
     */
    public function index()
    {
        $this->addJs('/modules/cms/assets/js/october.cmspage.js', 'core');
        $this->addJs('/modules/cms/assets/js/october.dragcomponents.js', 'core');
        $this->addJs('/modules/cms/assets/js/october.tokenexpander.js', 'core');
        $this->addCss('/modules/cms/assets/css/october.components.css', 'core');

        // Preload the code editor class as it could be needed
        // before it loads dynamically.
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/build-min.js', 'core');

        $this->bodyClass = 'compact-container';
        $this->pageTitle = 'cms::lang.cms.menu_label';
        $this->pageTitleTemplate = '%s '.trans($this->pageTitle);

        if (Request::ajax() && Request::input('formWidgetAlias')) {
            $this->bindFormWidgetToController();
        }
    }

    /**
     * Opens an existing template from the index page
     * @return array
     */
    public function index_onOpenTemplate()
    {
        $this->validateRequestTheme();

        $type = Request::input('type');
        $template = $this->loadTemplate($type, Request::input('path'));
        $widget = $this->makeTemplateFormWidget($type, $template);

        $this->vars['templatePath'] = Request::input('path');
        $this->vars['lastModified'] = DateTime::makeCarbon($template->mtime);

        if ($type === 'page') {
            $router = new RainRouter;
            $this->vars['pageUrl'] = $router->urlFromPattern($template->url);
        }

        return [
            'tabTitle' => $this->getTabTitle($type, $template),
            'tab'      => $this->makePartial('form_page', [
                'form'          => $widget,
                'templateType'  => $type,
                'templateTheme' => $this->theme->getDirName(),
                'templateMtime' => $template->mtime
            ])
        ];
    }

    /**
     * Saves the template currently open
     * @return array
     */
    public function onSave()
    {
        $this->validateRequestTheme();
        $type = Request::input('templateType');
        $templatePath = trim(Request::input('templatePath'));
        $template = $templatePath ? $this->loadTemplate($type, $templatePath) : $this->createTemplate($type);
        $formWidget = $this->makeTemplateFormWidget($type, $template);

        $saveData = $formWidget->getSaveData();
        $postData = post();
        $templateData = [];

        $settings = array_get($saveData, 'settings', []) + Request::input('settings', []);
        $settings = $this->upgradeSettings($settings);

        if ($settings) {
            $templateData['settings'] = $settings;
        }

        $fields = ['markup', 'code', 'fileName', 'content'];

        foreach ($fields as $field) {
            if (array_key_exists($field, $saveData)) {
                $templateData[$field] = $saveData[$field];
            }
            elseif (array_key_exists($field, $postData)) {
                $templateData[$field] = $postData[$field];
            }
        }

        if (!empty($templateData['markup']) && Config::get('cms.convertLineEndings', false) === true) {
            $templateData['markup'] = $this->convertLineEndings($templateData['markup']);
        }

        if (!empty($templateData['code']) && Config::get('cms.convertLineEndings', false) === true) {
            $templateData['code'] = $this->convertLineEndings($templateData['code']);
        }

        if (
            !Request::input('templateForceSave') && $template->mtime
            && Request::input('templateMtime') != $template->mtime
        ) {
            throw new ApplicationException('mtime-mismatch');
        }

        $template->attributes = [];
        $template->fill($templateData);
        $template->save();

        /**
         * @event cms.template.save
         * Fires after a CMS template (page|partial|layout|content|asset) has been saved.
         *
         * Example usage:
         *
         *     Event::listen('cms.template.save', function ((\Cms\Controllers\Index) $controller, (mixed) $templateObject, (string) $type) {
         *         \Log::info("A $type has been saved");
         *     });
         *
         * Or
         *
         *     $CmsIndexController->bindEvent('template.save', function ((mixed) $templateObject, (string) $type) {
         *         \Log::info("A $type has been saved");
         *     });
         *
         */
        $this->fireSystemEvent('cms.template.save', [$template, $type]);

        Flash::success(Lang::get('cms::lang.template.saved'));

        $result = [
            'templatePath'  => $template->fileName,
            'templateMtime' => $template->mtime,
            'tabTitle'      => $this->getTabTitle($type, $template)
        ];

        if ($type === 'page') {
            $result['pageUrl'] = Url::to($template->url);
            $router = new Router($this->theme);
            $router->clearCache();
            CmsCompoundObject::clearCache($this->theme);
        }

        return $result;
    }

    /**
     * Displays a form that suggests the template has been edited elsewhere
     * @return string
     */
    public function onOpenConcurrencyResolveForm()
    {
        return $this->makePartial('concurrency_resolve_form');
    }

    /**
     * Create a new template
     * @return array
     */
    public function onCreateTemplate()
    {
        $type = Request::input('type');
        $template = $this->createTemplate($type);

        if ($type === 'asset') {
            $template->fileName = $this->widget->assetList->getCurrentRelativePath();
        }

        $widget = $this->makeTemplateFormWidget($type, $template);

        $this->vars['templatePath'] = '';

        return [
            'tabTitle' => $this->getTabTitle($type, $template),
            'tab'      => $this->makePartial('form_page', [
                'form'          => $widget,
                'templateType'  => $type,
                'templateTheme' => $this->theme->getDirName(),
                'templateMtime' => null
            ])
        ];
    }

    /**
     * Deletes multiple templates at the same time
     * @return array
     */
    public function onDeleteTemplates()
    {
        $this->validateRequestTheme();

        $type = Request::input('type');
        $templates = Request::input('template');
        $error = null;
        $deleted = [];

        try {
            foreach ($templates as $path => $selected) {
                if ($selected) {
                    $this->loadTemplate($type, $path)->delete();
                    $deleted[] = $path;
                }
            }
        }
        catch (Exception $ex) {
            $error = $ex->getMessage();
        }

        /**
         * @event cms.template.delete
         * Fires after a CMS template (page|partial|layout|content|asset) has been deleted.
         *
         * Example usage:
         *
         *     Event::listen('cms.template.delete', function ((\Cms\Controllers\Index) $controller, (string) $type) {
         *         \Log::info("A $type has been deleted");
         *     });
         *
         * Or
         *
         *     $CmsIndexController->bindEvent('template.delete', function ((string) $type) {
         *         \Log::info("A $type has been deleted");
         *     });
         *
         */
        $this->fireSystemEvent('cms.template.delete', [$type]);

        return [
            'deleted' => $deleted,
            'error'   => $error,
            'theme'   => Request::input('theme')
        ];
    }

    /**
     * Deletes a template
     * @return void
     */
    public function onDelete()
    {
        $this->validateRequestTheme();

        $type = Request::input('templateType');

        $this->loadTemplate($type, trim(Request::input('templatePath')))->delete();

        /*
         * Extensibility - documented above
         */
        $this->fireSystemEvent('cms.template.delete', [$type]);
    }

    /**
     * Returns list of available templates
     * @return array
     */
    public function onGetTemplateList()
    {
        $this->validateRequestTheme();

        $page = Page::inTheme($this->theme);
        return [
            'layouts' => $page->getLayoutOptions()
        ];
    }

    /**
     * Remembers an open or closed state for a supplied token, for example, component folders.
     * @return array
     */
    public function onExpandMarkupToken()
    {
        if (!$alias = post('tokenName')) {
            throw new ApplicationException(trans('cms::lang.component.no_records'));
        }

        // Can only expand components at this stage
        if ((!$type = post('tokenType')) && $type !== 'component') {
            return;
        }

        if (!($names = (array) post('component_names')) || !($aliases = (array) post('component_aliases'))) {
            throw new ApplicationException(trans('cms::lang.component.not_found', ['name' => $alias]));
        }

        if (($index = array_get(array_flip($aliases), $alias, false)) === false) {
            throw new ApplicationException(trans('cms::lang.component.not_found', ['name' => $alias]));
        }

        if (!$componentName = array_get($names, $index)) {
            throw new ApplicationException(trans('cms::lang.component.not_found', ['name' => $alias]));
        }

        $manager = ComponentManager::instance();
        $componentObj = $manager->makeComponent($componentName);
        $partial = ComponentPartial::load($componentObj, 'default');
        $content = $partial->getContent();
        $content = str_replace('__SELF__', $alias, $content);

        return $content;
    }

    //
    // Methods for the internal use
    //

    /**
     * Validate that the current request is within the active theme
     * @return void
     */
    protected function validateRequestTheme()
    {
        if ($this->theme->getDirName() != Request::input('theme')) {
            throw new ApplicationException(trans('cms::lang.theme.edit.not_match'));
        }
    }

    /**
     * Reolves a template type to its class name
     * @param string $type
     * @return string
     */
    protected function resolveTypeClassName($type)
    {
        $types = [
            'page'    => Page::class,
            'partial' => Partial::class,
            'layout'  => Layout::class,
            'content' => Content::class,
            'asset'   => Asset::class
        ];

        if (!array_key_exists($type, $types)) {
            throw new ApplicationException(trans('cms::lang.template.invalid_type'));
        }

        return $types[$type];
    }

    /**
     * Returns an existing template of a given type
     * @param string $type
     * @param string $path
     * @return mixed
     */
    protected function loadTemplate($type, $path)
    {
        $class = $this->resolveTypeClassName($type);

        if (!($template = call_user_func([$class, 'load'], $this->theme, $path))) {
            throw new ApplicationException(trans('cms::lang.template.not_found'));
        }

        /**
         * @event cms.template.processSettingsAfterLoad
         * Fires immediately after a CMS template (page|partial|layout|content|asset) has been loaded and provides an opportunity to interact with it.
         *
         * Example usage:
         *
         *     Event::listen('cms.template.processSettingsAfterLoad', function ((\Cms\Controllers\Index) $controller, (mixed) $templateObject) {
         *         // Make some modifications to the $template object
         *     });
         *
         * Or
         *
         *     $CmsIndexController->bindEvent('template.processSettingsAfterLoad', function ((mixed) $templateObject) {
         *         // Make some modifications to the $template object
         *     });
         *
         */
        $this->fireSystemEvent('cms.template.processSettingsAfterLoad', [$template]);

        return $template;
    }

    /**
     * Creates a new template of a given type
     * @param string $type
     * @return mixed
     */
    protected function createTemplate($type)
    {
        $class = $this->resolveTypeClassName($type);

        if (!($template = $class::inTheme($this->theme))) {
            throw new ApplicationException(trans('cms::lang.template.not_found'));
        }

        return $template;
    }

    /**
     * Returns the text for a template tab
     * @param string $type
     * @param string $template
     * @return string
     */
    protected function getTabTitle($type, $template)
    {
        if ($type === 'page') {
            $result = $template->title ?: $template->getFileName();
            if (!$result) {
                $result = trans('cms::lang.page.new');
            }

            return $result;
        }

        if ($type === 'partial' || $type === 'layout' || $type === 'content' || $type === 'asset') {
            $result = in_array($type, ['asset', 'content']) ? $template->getFileName() : $template->getBaseFileName();
            if (!$result) {
                $result = trans('cms::lang.'.$type.'.new');
            }

            return $result;
        }

        return $template->getFileName();
    }

    /**
     * Returns a form widget for a specified template type.
     * @param string $type
     * @param string $template
     * @param string $alias
     * @return Backend\Widgets\Form
     */
    protected function makeTemplateFormWidget($type, $template, $alias = null)
    {
        $formConfigs = [
            'page'    => '~/modules/cms/classes/page/fields.yaml',
            'partial' => '~/modules/cms/classes/partial/fields.yaml',
            'layout'  => '~/modules/cms/classes/layout/fields.yaml',
            'content' => '~/modules/cms/classes/content/fields.yaml',
            'asset'   => '~/modules/cms/classes/asset/fields.yaml'
        ];

        if (!array_key_exists($type, $formConfigs)) {
            throw new ApplicationException(trans('cms::lang.template.not_found'));
        }

        $widgetConfig = $this->makeConfig($formConfigs[$type]);
        $widgetConfig->model = $template;
        $widgetConfig->alias = $alias ?: 'form'.studly_case($type).md5($template->getFileName()).uniqid();

        return $this->makeWidget('Backend\Widgets\Form', $widgetConfig);
    }

    /**
     * Processes the component settings so they are ready to be saved
     * @param array $settings
     * @return array
     */
    protected function upgradeSettings($settings)
    {
        /*
         * Handle component usage
         */
        $componentProperties = post('component_properties');
        $componentNames = post('component_names');
        $componentAliases = post('component_aliases');

        if ($componentProperties !== null) {
            if ($componentNames === null || $componentAliases === null) {
                throw new ApplicationException(trans('cms::lang.component.invalid_request'));
            }

            $count = count($componentProperties);
            if (count($componentNames) != $count || count($componentAliases) != $count) {
                throw new ApplicationException(trans('cms::lang.component.invalid_request'));
            }

            for ($index = 0; $index < $count; $index++) {
                $componentName = $componentNames[$index];
                $componentAlias = $componentAliases[$index];

                $section = $componentName;
                if ($componentAlias != $componentName) {
                    $section .= ' '.$componentAlias;
                }

                $properties = json_decode($componentProperties[$index], true);
                unset($properties['oc.alias'], $properties['inspectorProperty'], $properties['inspectorClassName']);
                $settings[$section] = $properties;
            }
        }

        /*
         * Handle view bag
         */
        $viewBag = post('viewBag');
        if ($viewBag !== null) {
            $settings['viewBag'] = $viewBag;
        }

        /**
         * @event cms.template.processSettingsBeforeSave
         * Fires before a CMS template (page|partial|layout|content|asset) is saved and provides an opportunity to interact with the settings data. `$dataHolder` = {settings: array()}
         *
         * Example usage:
         *
         *     Event::listen('cms.template.processSettingsBeforeSave', function ((\Cms\Controllers\Index) $controller, (object) $dataHolder) {
         *         // Make some modifications to the $dataHolder object
         *     });
         *
         * Or
         *
         *     $CmsIndexController->bindEvent('template.processSettingsBeforeSave', function ((object) $dataHolder) {
         *         // Make some modifications to the $dataHolder object
         *     });
         *
         */
        $dataHolder = (object) ['settings' => $settings];
        $this->fireSystemEvent('cms.template.processSettingsBeforeSave', [$dataHolder]);

        return $dataHolder->settings;
    }

    /**
     * Binds the active form widget to the controller
     * @return void
     */
    protected function bindFormWidgetToController()
    {
        $alias = Request::input('formWidgetAlias');
        $type = Request::input('templateType');
        $object = $this->loadTemplate($type, Request::input('templatePath'));
        $widget = $this->makeTemplateFormWidget($type, $object, $alias);

        $widget->bindToController();
    }

    /**
     * Replaces Windows style (/r/n) line endings with unix style (/n)
     * line endings.
     * @param string $markup The markup to convert to unix style endings
     * @return string
     */
    protected function convertLineEndings($markup)
    {
        $markup = str_replace(["\r\n", "\r"], "\n", $markup);

        return $markup;
    }
}
