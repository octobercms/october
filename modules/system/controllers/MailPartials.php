<?php namespace System\Controllers;

use Lang;
use Flash;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;

/**
 * Mail partials controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailPartials extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array Permissions required to view this page.
     */
    public $requiredPermissions = ['mail.templates'];

    /**
     * __construct
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'mail_templates');
    }

    /**
     * formBeforeSave event
     */
    public function formBeforeSave($model)
    {
        $model->is_custom = true;
    }

    /**
     * update_onResetDefault reverts a system-provided partial to its default content.
     */
    public function update_onResetDefault($recordId)
    {
        $model = $this->formFindModelObject($recordId);

        $model->resetToDefault();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Redirect::refresh();
    }
}
