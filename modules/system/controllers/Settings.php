<?php namespace System\Controllers;

use Lang;
use Flash;
use Backend;
use Redirect;
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
     * @var WidgetBase formWidget reference to the widget object
     */
    protected $formWidget;

    /**
     * @var array requiredPermissions to view this page
     */
    public $requiredPermissions = [];

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        if ($this->action == 'backend_preferences') {
            $this->requiredPermissions = ['preferences'];
        }

        $this->addCss('/modules/system/assets/css/pages/settings.css', 'global');

        BackendMenu::setContext('October.System', 'system', 'settings');
    }

    /**
     * index action
     */
    public function index()
    {
        if ($first = array_first(SettingsManager::instance()->listAllItems('system'))) {
            return Redirect::intended($first->url);
        }

        return Backend::redirect('/');
    }

    /**
     * mysettings action
     */
    public function mysettings()
    {
        if ($first = array_first(SettingsManager::instance()->listAllItems('mysettings'))) {
            return Redirect::intended($first->url);
        }

        return Backend::redirect('/');
    }

    //
    // Generated Form
    //

    /**
     * update action
     */
    public function update($author, $plugin, $code = null)
    {
        SettingsManager::setContext($author.'.'.$plugin, $code);

        $this->vars['parentLink'] = Backend::url('system/settings');
        $this->vars['parentLabel'] = __('Settings');

        try {
            if (!$item = $this->findSettingItem($author, $plugin, $code)) {
                throw new ApplicationException(__('Unable to find the specified settings.'));
            }

            $this->pageTitle = $item->label;
            $this->pageSize = Backend::sizeToPixels($item->size) ?: null;

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

    /**
     * update_onSave AJAX handler
     */
    public function update_onSave($author, $plugin, $code = null)
    {
        $item = $this->findSettingItem($author, $plugin, $code);
        $model = $this->createModel($item);
        $this->initWidgets($model);

        $saveData = $this->formWidget->getSaveData();
        foreach ($saveData as $attribute => $value) {
            $model->{$attribute} = $value;
        }

        // Multisite
        if ($this->formHasMultisite($model)) {
            $this->tagMultisiteModel($model);
        }

        $model->save(['propagate' => true, 'sessionKey' => $this->formWidget->getSessionKey()]);

        Flash::success(__(':name settings updated', ['name' => __($item->label)]));

        // Handle redirect
        if ($redirectUrl = post('redirect', true)) {
            $redirectUrl = ($item->context == 'mysettings')
                ? 'system/settings/mysettings'
                : 'system/settings';

            return Backend::redirect($redirectUrl);
        }
    }

    /**
     * update_onResetDefault AJAX handler
     */
    public function update_onResetDefault($author, $plugin, $code = null)
    {
        $item = $this->findSettingItem($author, $plugin, $code);
        $model = $this->createModel($item);
        $model->resetDefault();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Backend::redirect('system/settings/update/'.$author.'/'.$plugin.'/'.$code);
    }

    /**
     * formRender renders the form
     */
    public function formRender($options = [])
    {
        if (!$this->formWidget) {
            throw new ApplicationException(Lang::get('backend::lang.form.behavior_not_ready'));
        }

        return $this->formWidget->render($options);
    }

    /**
     * initWidgets prepare the widgets used by this action
     * @param Model $model
     */
    protected function initWidgets($model)
    {
        $config = $model->getFieldConfig();
        $config->model = $model;
        $config->arrayName = class_basename($model);
        $config->context = 'update';

        $widget = $this->makeWidget(\Backend\Widgets\Form::class, $config);
        $widget->bindToController();
        $this->formWidget = $widget;
    }

    /**
     * createModel is an internal method to prepare the form model object
     */
    protected function createModel($item)
    {
        if (!isset($item->class) || !strlen($item->class)) {
            throw new ApplicationException(__('The settings page is missing a Model definition.'));
        }

        $class = $item->class;
        return $class::instance();
    }

    /**
     * findSettingItem locates a setting item for a module or plugin
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

    /**
     * formHasMultisite
     */
    protected function formHasMultisite($model)
    {
        return $model &&
            $model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) &&
            $model->isMultisiteEnabled();
    }

    /**
     * tagMultisiteModel
     */
    public function tagMultisiteModel($model)
    {
        if ($model->site_root_id) {
            return;
        }

        $rootModel = $this->findMultisiteRootModel($model);
        if (!$rootModel) {
            return;
        }

        $model->site_root_id = $rootModel->id;
    }

    /**
     * findMultisiteRootModel
     */
    public function findMultisiteRootModel($model)
    {
        // Find nearest existing model
        if (!$model->exists) {
            $model = $model->newQuery()->withSites()->first();
            if (!$model) {
                return;
            }
        }

        // Model is root
        if ((int) $model->site_root_id === (int) $model->id) {
            return $model;
        }

        // Find root model
        return $model->newQuery()->withSites()
            ->where('id', $model->site_root_id)
            ->first();
    }
}
