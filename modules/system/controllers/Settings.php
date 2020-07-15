<?php namespace System\Controllers;

use Lang;
use Flash;
use Config;
use Request;
use Backend;
use BackendMenu;
use System\Classes\SettingsManager;
use Backend\Classes\Controller;
use ApplicationException;
use Exception;

/**
 * Settings controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class Settings extends Controller
{
    /**
     * @var WidgetBase Reference to the widget object.
     */
    protected $formWidget;

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = [];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        if ($this->action == 'backend_preferences') {
            $this->requiredPermissions = ['backend.manage_preferences'];
        }

        $this->addCss('/modules/system/assets/css/settings/settings.css', 'core');

        BackendMenu::setContext('October.System', 'system', 'settings');
    }

    public function index()
    {
        $this->pageTitle = 'system::lang.settings.menu_label';
        $this->vars['items'] = SettingsManager::instance()->listItems('system');
        $this->bodyClass = 'compact-container sidenav-tree-root';
    }

    public function mysettings()
    {
        BackendMenu::setContextSideMenu('mysettings');
        $this->pageTitle = 'backend::lang.mysettings.menu_label';
        $this->vars['items'] = SettingsManager::instance()->listItems('mysettings');
        $this->bodyClass = 'compact-container';
    }

    //
    // Generated Form
    //

    public function update($author, $plugin, $code = null)
    {
        SettingsManager::setContext($author.'.'.$plugin, $code);

        $this->vars['parentLink'] = Backend::url('system/settings');
        $this->vars['parentLabel'] = Lang::get('system::lang.settings.menu_label');

        try {
            if (!$item = $this->findSettingItem($author, $plugin, $code)) {
                throw new ApplicationException(Lang::get('system::lang.settings.not_found'));
            }

            $this->pageTitle = $item->label;

            if ($item->context == 'mysettings') {
                $this->vars['parentLink'] = Backend::url('system/settings/mysettings');
                $this->vars['parentLabel'] = Lang::get('backend::lang.mysettings.menu_label');
            }

            $model = $this->createModel($item);
            $this->initWidgets($model);
        }
        catch (Exception $ex) {
            $this->handleError($ex);
        }
    }

    public function update_onSave($author, $plugin, $code = null)
    {
        $item = $this->findSettingItem($author, $plugin, $code);
        $model = $this->createModel($item);
        $this->initWidgets($model);

        $saveData = $this->formWidget->getSaveData();
        foreach ($saveData as $attribute => $value) {
            $model->{$attribute} = $value;
        }
        $model->save(null, $this->formWidget->getSessionKey());

        Flash::success(Lang::get('system::lang.settings.update_success', ['name' => Lang::get($item->label)]));

        /*
         * Handle redirect
         */
        if ($redirectUrl = post('redirect', true)) {
            $redirectUrl = ($item->context == 'mysettings')
                ? 'system/settings/mysettings'
                : 'system/settings';

            return Backend::redirect($redirectUrl);
        }
    }

    public function update_onResetDefault($author, $plugin, $code = null)
    {
        $item = $this->findSettingItem($author, $plugin, $code);
        $model = $this->createModel($item);
        $model->resetDefault();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Backend::redirect('system/settings/update/'.$author.'/'.$plugin.'/'.$code);
    }

    /**
     * Render the form.
     */
    public function formRender($options = [])
    {
        if (!$this->formWidget) {
            throw new ApplicationException(Lang::get('backend::lang.form.behavior_not_ready'));
        }

        return $this->formWidget->render($options);
    }

    /**
     * Returns the form widget used by this behavior.
     *
     * @return \Backend\Widgets\Form
     */
    public function formGetWidget()
    {
        if (is_null($this->formWidget)) {
            $item = $this->findSettingItem();
            $model = $this->createModel($item);
            $this->initWidgets($model);
        }

        return $this->formWidget;
    }

    /**
     * Prepare the widgets used by this action
     * Model $model
     */
    protected function initWidgets($model)
    {
        $config = $model->getFieldConfig();
        $config->model = $model;
        $config->arrayName = class_basename($model);
        $config->context = 'update';

        $widget = $this->makeWidget('Backend\Widgets\Form', $config);
        $widget->bindToController();
        $this->formWidget = $widget;
    }

    /**
     * Internal method, prepare the list model object
     */
    protected function createModel($item)
    {
        if (!isset($item->class) || !strlen($item->class)) {
            throw new ApplicationException(Lang::get('system::lang.settings.missing_model'));
        }

        $class = $item->class;
        return $class::instance();
    }

    /**
     * Locates a setting item for a module or plugin.
     *
     * If none of the parameters are provided, they will be auto-guessed from the URL.
     *
     * @param string|null $author
     * @param string|null $plugin
     * @param string|null $code
     *
     * @return array
     */
    protected function findSettingItem($author = null, $plugin = null, $code = null)
    {
        if (is_null($author) || is_null($plugin)) {
            [$author, $plugin, $code] = $this->guessSettingItem();
        }

        $manager = SettingsManager::instance();

        $moduleOwner = $author;
        $moduleCode = $plugin;
        $item = $manager->findSettingItem($moduleOwner, $moduleCode);

        if (!$item) {
            $pluginOwner = $author . '.' . $plugin;
            $pluginCode = $code;
            $item = $manager->findSettingItem($pluginOwner, $pluginCode);
        }

        return $item;
    }

    /**
     * Guesses the requested setting item from the current URL segments provided by the Request object.
     *
     * @return array
     */
    protected function guessSettingItem()
    {
        $segments = Request::segments();

        if (!empty(Config::get('cms.backendUri', 'backend'))) {
            array_splice($segments, 0, 4);
        } else {
            array_splice($segments, 0, 3);
        }

        // Ensure there's at least 3 segments
        return array_pad($segments, 3, null);
    }
}
