<?php namespace Cms\Controllers;

use Config;
use URL;
use Lang;
use Flash;
use Request;
use Response;
use Exception;
use BackendMenu;
use Backend\Classes\WidgetManager;
use Backend\Classes\Controller;
use Cms\Widgets\TemplateList;
use Cms\Widgets\ComponentList;
use Cms\Widgets\AssetList;
use Cms\Classes\Page;
use Cms\Classes\Partial;
use Cms\Classes\Layout;
use Cms\Classes\Content;
use Cms\Classes\Theme;
use System\Classes\ApplicationException;
use Cms\Classes\Router;
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

        BackendMenu::setContext('October.Cms', 'cms', 'pages');

        try {
            if (!($theme = Theme::getEditTheme()))
                throw new ApplicationException(Lang::get('cms::lang.theme.edit.not_found'));

            $this->theme = $theme;

            new TemplateList($this, 'pageList', function() use ($theme) {
                return Page::listInTheme($theme, true);
            });

            new TemplateList($this, 'partialList', function() use ($theme) {
                return Partial::listInTheme($theme, true);
            });

            new TemplateList($this, 'layoutList', function() use ($theme) {
                return Layout::listInTheme($theme, true);
            });

            new TemplateList($this, 'contentList', function() use ($theme) {
                return Content::listInTheme($theme, true);
            });

            new ComponentList($this, 'componentList');

            new AssetList($this, 'assetList');
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }

        $this->addJs('/modules/cms/assets/js/october.cmspage.js', 'core');
        $this->addJs('/modules/cms/assets/js/october.dragcomponents.js', 'core');
        $this->addCss('/modules/cms/assets/css/october.components.css', 'core');

        // Preload Ace editor modes explicitly, because they could be changed dynamically
        // depending on a content block type
        $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/ace/ace.js', 'core');

        $aceModes = ['markdown', 'plain_text', 'html', 'less', 'css', 'scss', 'sass', 'javascript'];
        foreach ($aceModes as $mode)
            $this->addJs('/modules/backend/formwidgets/codeeditor/assets/vendor/ace/mode-'.$mode.'.js', 'core');

        $this->bodyClass = 'compact-container side-panel-not-fixed';
        $this->pageTitle = Lang::get('cms::lang.cms.menu_label');
    }

    //
    // Pages
    //

    public function index()
    {
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
            'title' => $this->getTabTitle($type, $template),
            'tab'   => $this->makePartial('form_page', [
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

        $settings = $this->upgradeSettings(Request::input('settings'));

        $templateData = [];
        if (Request::input('settings'))
            $templateData['settings'] = $settings;

        $fields = ['markup', 'code', 'fileName', 'content'];
        foreach ($fields as $field) {
            if (array_key_exists($field, $_POST))
                $templateData[$field] = Request::input($field);
        }

        if (!empty($templateData['markup']) && Config::get('cms.convertLineEndings', false) === true) {
            $templateData['markup'] = $this->convertLineEndings($templateData['markup']);
        }

        if (!Request::input('templateForceSave') && $template->mtime) {
            if (Request::input('templateMtime') != $template->mtime)
                throw new ApplicationException('mtime-mismatch');
        }

        $template->fill($templateData);
        $template->save();

        Flash::success(Lang::get('cms::lang.template.saved'));

        $result = [
            'templatePath' => $template->fileName,
            'templateMtime' => $template->mtime,
            'title'        => $this->getTabTitle($type, $template)
        ];

        if ($type == 'page') {
            $result['pageUrl'] = URL::to($template->url);
            $router = new Router($this->theme);
            $router->clearCache();
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

        if ($type == 'asset')
            $template->setInitialPath($this->widget->assetList->getCurrentRelativePath());

        $widget = $this->makeTemplateFormWidget($type, $template);

        $this->vars['templatePath'] = '';

        return [
            'title' => $this->getTabTitle($type, $template),
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
            foreach ($templates as $path=>$selected) {
                if ($selected) {
                    $this->loadTemplate($type, $path)->delete();
                    $deleted[] = $path;
                }
            }
        }
        catch (Exception $ex) {
            $error = $ex->getMessage();
        }

        return [
            'deleted' => $deleted,
            'error'   => $error,
            'theme'   => Request::input('theme')
        ];
    }

    public function onDelete()
    {
        $this->validateRequestTheme();

        $this->loadTemplate(
            Request::input('templateType'), 
            trim(Request::input('templatePath')))->delete();
    }

    public function onGetTemplateList()
    {
        $this->validateRequestTheme();

        $page = new Page($this->theme);
        return [
            'layouts' => $page->getLayoutOptions()
        ];
    }

    //
    // Methods for the internal use
    //

    protected function validateRequestTheme()
    {
        if ($this->theme->getDirName() != Request::input('theme'))
            throw new ApplicationException(trans('cms::lang.theme.edit.not_match'));
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

        if (!array_key_exists($type, $types))
            throw new ApplicationException(trans('cms::lang.template.invalid_type'));

        return $types[$type];
    }

    protected function loadTemplate($type, $path)
    {
        $class = $this->resolveTypeClassName($type);

        if (!($template = call_user_func(array($class, 'load'), $this->theme, $path)))
            throw new ApplicationException(trans('cms::lang.template.not_found'));

        return $template;
    }

    protected function createTemplate($type)
    {
        $class = $this->resolveTypeClassName($type);

        if (!($template = new $class($this->theme)))
            throw new ApplicationException(trans('cms::lang.template.not_found'));

        return $template;
    }

    protected function getTabTitle($type, $template)
    {
        if ($type == 'page') {
            $result = $template->title ?: $template->getFileName();
            if (!$result)
                $result = trans('cms::lang.page.new');

            return $result;
        }

        if ($type == 'partial' || $type == 'layout' || $type == 'content' || $type == 'asset') {
            $result = in_array($type, ['asset', 'content']) ? $template->getFileName() : $template->getBaseFileName();
            if (!$result)
                $result = trans('cms::lang.'.$type.'.new');

            return $result;
        }

        return $template->getFileName();
    }

    protected function makeTemplateFormWidget($type, $template)
    {
        $formConfigs = [
            'page'    => '@/modules/cms/classes/page/fields.yaml',
            'partial' => '@/modules/cms/classes/partial/fields.yaml',
            'layout'  => '@/modules/cms/classes/layout/fields.yaml',
            'content' => '@/modules/cms/classes/content/fields.yaml',
            'asset'   => '@/modules/cms/classes/asset/fields.yaml',
        ];

        if (!array_key_exists($type, $formConfigs))
            throw new ApplicationException(trans('cms::lang.template.not_found'));

        $widgetConfig = $this->makeConfig($formConfigs[$type]);
        $widgetConfig->model = $template;
        $widgetConfig->alias = 'form'.studly_case($type).md5($template->getFileName()).uniqid();

        $widget = $this->makeWidget('Backend\Widgets\Form', $widgetConfig);

        return $widget;
    }

    protected function upgradeSettings($settings)
    {
        if (!array_key_exists('component_properties', $_POST))
            return $settings;

        if (!array_key_exists('component_names', $_POST) || !array_key_exists('component_aliases', $_POST))
            throw new ApplicationException(trans('cms::lang.component.invalid_request'));

        $count = count($_POST['component_properties']);
        if (count($_POST['component_names']) != $count || count($_POST['component_aliases']) != $count)
            throw new ApplicationException(trans('cms::lang.component.invalid_request'));

        for ($index = 0; $index < $count; $index ++) {
            $componentName = $_POST['component_names'][$index];
            $componentAlias = $_POST['component_aliases'][$index];

            $section = $componentName;
            if ($componentAlias != $componentName)
                $section .= ' '.$componentAlias;

            $properties = json_decode($_POST['component_properties'][$index], true);
            unset($properties['oc.alias']);
            unset($properties['inspectorProperty']);
            unset($properties['inspectorClassName']);
            $settings[$section] = $properties;
        }

        return $settings;
    }

    /**
     * Replaces Windows style (/r/n) line endings with unix style (/n)
     * line endings.
     * @param string $markup The markup to convert to unix style endings
     * @return string
     */
    private function convertLineEndings($markup)
    {
        $markup = str_replace("\r\n", "\n", $markup);
        $markup = str_replace("\r", "\n", $markup);
        return $markup;
    }

}
