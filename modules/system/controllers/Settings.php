<?php namespace System\Controllers;

use Str;
use Lang;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use System\Classes\SettingsManager;
use Backend\Classes\Controller;
use System\Classes\ApplicationException;
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

    public $requiredPermissions = ['system.manage_settings'];

    public function __construct()
    {
        parent::__construct();

        $this->addCss('/modules/system/assets/css/settings.css', 'core');

        BackendMenu::setContext('October.System', 'system', 'settings');
    }

    public function index()
    {
        $this->pageTitle = Lang::get('system::lang.settings.menu_label');
        $this->vars['items'] = SettingsManager::instance()->listItems('system');
        $this->bodyClass = 'compact-container sidenav-tree-root';
    }

    public function mysettings()
    {
        BackendMenu::setContextSideMenu('mysettings');
        $this->pageTitle = Lang::get('backend::lang.mysettings.menu_label');
        $this->vars['items'] = SettingsManager::instance()->listItems('mysettings');
        $this->bodyClass = 'compact-container';
    }

    //
    // Generated Form
    //

    public function update($author, $plugin, $code = null)
    {
        SettingsManager::setContext($author.'.'.$plugin, $code);

        try {
            $item = $this->findSettingItem($author, $plugin, $code);
            $this->pageTitle = $item->label;

            if ($item->context == 'mysettings') {
                $this->vars['parentLink'] = Backend::url('system/settings/mysettings');
                $this->vars['parentLabel'] = Lang::get('backend::lang.mysettings.menu_label');
            }
            else {
                $this->vars['parentLink'] = Backend::url('system/settings');
                $this->vars['parentLabel'] = Lang::get('system::lang.settings.menu_label');
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

        if ($item->context == 'mysettings')
            return Redirect::to(Backend::url('system/settings/mysettings'));
        else
            return Redirect::to(Backend::url('system/settings'));
    }

    /**
     * Render the form.
     */
    public function formRender($options = [])
    {
        if (!$this->formWidget)
            throw new ApplicationException(Lang::get('backend::lang.form.behavior_not_ready'));

        return $this->formWidget->render($options);
    }

    /**
     * Prepare the widgets used by this action
     * Model $model
     */
    protected function initWidgets($model)
    {
        $config = $model->getFieldConfig();
        $config->model = $model;
        $config->arrayName = Str::getRealClass($model);
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
        if (!isset($item->class) || !strlen($item->class))
            throw new ApplicationException(Lang::get('system::lang.settings.missing_model'));


        $class = $item->class;
        $model = $class::instance();
        return $model;
    }

    /**
     * Locates a setting item for a module or plugin
     */
    protected function findSettingItem($author, $plugin, $code)
    {
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

}