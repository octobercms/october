<?php namespace Cms\Controllers;

use URL;
use Lang;
use Flash;
use Event;
use Config;
use Request;
use Response;
use Exception;
use BackendMenu;
use Backend\Classes\Controller;
use Backend\Classes\WidgetManager;
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
use ApplicationException;
use Backend\Traits\InspectableContainer;
use October\Rain\Router\Router as RainRouter;

/**
 * CMS index
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Index extends Controller
{
    use InspectableContainer;

    protected $theme;

    public $requiredPermissions = ['cms.*'];

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

    public function index()
    {
        $this->addJs('/modules/cms/assets/js/october.cmspage.js', 'core');
        $this->addJs('/modules/cms/assets/js/october.dragcomponents.js', 'core');
        $this->addJs('/modules/cms/assets/js/october.tokenexpander.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/js/codeeditor.js', 'core');

        $this->addCss('/modules/cms/assets/css/october.components.css', 'core');

        // Preload Ace editor modes explicitly, because they could be changed dynamically
        // depending on a content block type
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/emmet/emmet.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/ace/ace.js', 'core');
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/ace/ext-emmet.js', 'core');

        $aceModes = ['markdown', 'plain_text', 'html', 'less', 'css', 'scss', 'sass', 'javascript'];
        foreach ($aceModes as $mode) {
            $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/ace/mode-'.$mode.'.js', 'core');
        }

        $this->bodyClass = 'compact-container side-panel-not-fixed';
        $this->pageTitle = 'cms::lang.cms.menu_label';
        $this->pageTitleTemplate = '%s CMS';
    }

    public function index_onOpenTemplate()
    {
        $this->validateRequestTheme();

        $type = Request::input('type');
        $template = $this->loadTemplate($type, Request::input('path'));
        $widget = $this->makeTemplateFormWidget($type, $template);

        $this->vars['templatePath'] = Request::input('path');

        if ($type == 'page') {
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

    public function onSave()
    {
        $this->validateRequestTheme();
        $type = Request::input('templateType');
        $templatePath = trim(Request::input('templatePath'));
        $template = $templatePath ? $this->loadTemplate($type, $templatePath) : $this->createTemplate($type);

        $settings = Request::input('settings') ?: [];
        $settings = $this->upgradeSettings($settings);

        $templateData = [];
        if ($settings) {
            $templateData['settings'] = $settings;
        }

        $fields = ['markup', 'code', 'fileName', 'content'];
        foreach ($fields as $field) {
            if (array_key_exists($field, $_POST)) {
                $templateData[$field] = Request::input($field);
            }
        }

        if (!empty($templateData['markup']) && Config::get('cms.convertLineEndings', false) === true) {
            $templateData['markup'] = $this->convertLineEndings($templateData['markup']);
        }

        if (!Request::input('templateForceSave') && $template->mtime) {
            if (Request::input('templateMtime') != $template->mtime) {
                throw new ApplicationException('mtime-mismatch');
            }
        }

        $template->fill($templateData);
        $template->save();

        /*
         * Extensibility
         */
        Event::fire('cms.template.save', [$this, $template, $type]);
        $this->fireEvent('template.save', [$template, $type]);

        Flash::success(Lang::get('cms::lang.template.saved'));

        $result = [
            'templatePath'  => $template->fileName,
            'templateMtime' => $template->mtime,
            'tabTitle'      => $this->getTabTitle($type, $template)
        ];

        if ($type == 'page') {
            $result['pageUrl'] = URL::to($template->url);
            $router = new Router($this->theme);
            $router->clearCache();
            CmsCompoundObject::clearCache($this->theme);
        }

        return $result;
    }

    public function onOpenConcurrencyResolveForm()
    {
        return $this->makePartial('concurrency_resolve_form');
    }

    public function onCreateTemplate()
    {
        $type = Request::input('type');
        $template = $this->createTemplate($type);

        if ($type == 'asset') {
            $template->setInitialPath($this->widget->assetList->getCurrentRelativePath());
        }

        $widget = $this->makeTemplateFormWidget($type, $template);

        $this->vars['templatePath'] = '';

        return [
            'tabTitle' => $this->getTabTitle($type, $template),
            'tab'   => $this->makePartial('form_page', [
                'form'          => $widget,
                'templateType'  => $type,
                'templateTheme' => $this->theme->getDirName(),
                'templateMtime' => null
            ])
        ];
    }

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

        /*
         * Extensibility
         */
        Event::fire('cms.template.delete', [$this, $type]);
        $this->fireEvent('template.delete', [$type]);

        return [
            'deleted' => $deleted,
            'error'   => $error,
            'theme'   => Request::input('theme')
        ];
    }

    public function onDelete()
    {
        $this->validateRequestTheme();

        $type = Request::input('templateType');

        $this->loadTemplate($type, trim(Request::input('templatePath')))->delete();

        /*
         * Extensibility
         */
        Event::fire('cms.template.delete', [$this, $type]);
        $this->fireEvent('template.delete', [$type]);
    }

    public function onGetTemplateList()
    {
        $this->validateRequestTheme();

        $page = new Page($this->theme);
        return [
            'layouts' => $page->getLayoutOptions()
        ];
    }

    public function onExpandMarkupToken()
    {
        if (!$alias = post('tokenName')) {
            throw new ApplicationException(trans('cms::lang.component.no_records'));
        }

        // Can only expand components at this stage
        if ((!$type = post('tokenType')) && $type != 'component') {
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

    protected function validateRequestTheme()
    {
        if ($this->theme->getDirName() != Request::input('theme')) {
            throw new ApplicationException(trans('cms::lang.theme.edit.not_match'));
        }
    }

    protected function resolveTypeClassName($type)
    {
        $types = [
            'page'    => '\Cms\Classes\Page',
            'partial' => '\Cms\Classes\Partial',
            'layout'  => '\Cms\Classes\Layout',
            'content' => '\Cms\Classes\Content',
            'asset'   => '\Cms\Classes\Asset',
        ];

        if (!array_key_exists($type, $types)) {
            throw new ApplicationException(trans('cms::lang.template.invalid_type'));
        }

        return $types[$type];
    }

    protected function loadTemplate($type, $path)
    {
        $class = $this->resolveTypeClassName($type);

        if (!($template = call_user_func(array($class, 'load'), $this->theme, $path))) {
            throw new ApplicationException(trans('cms::lang.template.not_found'));
        }

        Event::fire('cms.template.processSettingsAfterLoad', [$this, $template]);

        return $template;
    }

    protected function createTemplate($type)
    {
        $class = $this->resolveTypeClassName($type);

        if (!($template = new $class($this->theme))) {
            throw new ApplicationException(trans('cms::lang.template.not_found'));
        }

        return $template;
    }

    protected function getTabTitle($type, $template)
    {
        if ($type == 'page') {
            $result = $template->title ?: $template->getFileName();
            if (!$result) {
                $result = trans('cms::lang.page.new');
            }

            return $result;
        }

        if ($type == 'partial' || $type == 'layout' || $type == 'content' || $type == 'asset') {
            $result = in_array($type, ['asset', 'content']) ? $template->getFileName() : $template->getBaseFileName();
            if (!$result) {
                $result = trans('cms::lang.'.$type.'.new');
            }

            return $result;
        }

        return $template->getFileName();
    }

    protected function makeTemplateFormWidget($type, $template)
    {
        $formConfigs = [
            'page'    => '~/modules/cms/classes/page/fields.yaml',
            'partial' => '~/modules/cms/classes/partial/fields.yaml',
            'layout'  => '~/modules/cms/classes/layout/fields.yaml',
            'content' => '~/modules/cms/classes/content/fields.yaml',
            'asset'   => '~/modules/cms/classes/asset/fields.yaml',
        ];

        if (!array_key_exists($type, $formConfigs)) {
            throw new ApplicationException(trans('cms::lang.template.not_found'));
        }

        $widgetConfig = $this->makeConfig($formConfigs[$type]);
        $widgetConfig->model = $template;
        $widgetConfig->alias = 'form'.studly_case($type).md5($template->getFileName()).uniqid();

        $widget = $this->makeWidget('Backend\Widgets\Form', $widgetConfig);

        return $widget;
    }

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

            for ($index = 0; $index < $count; $index ++) {
                $componentName = $componentNames[$index];
                $componentAlias = $componentAliases[$index];

                $section = $componentName;
                if ($componentAlias != $componentName) {
                    $section .= ' '.$componentAlias;
                }

                $properties = json_decode($componentProperties[$index], true);
                unset($properties['oc.alias']);
                unset($properties['inspectorProperty']);
                unset($properties['inspectorClassName']);
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

        /*
         * Extensibility
         */
        $dataHolder = (object)[
            'settings' => $settings
        ];

        Event::fire('cms.template.processSettingsBeforeSave', [$this, $dataHolder]);

        return $dataHolder->settings;
    }

    /**
     * Replaces Windows style (/r/n) line endings with unix style (/n)
     * line endings.
     * @param string $markup The markup to convert to unix style endings
     * @return string
     */
    protected function convertLineEndings($markup)
    {
        $markup = str_replace("\r\n", "\n", $markup);
        $markup = str_replace("\r", "\n", $markup);
        return $markup;
    }
}
