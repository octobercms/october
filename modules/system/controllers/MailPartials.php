<?php namespace System\Controllers;

use Str;
use Lang;
use File;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use ApplicationException;
use System\Classes\SettingsManager;
use Exception;

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
    public $requiredPermissions = ['system.manage_mail_templates'];

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'mail_templates');
    }

    public function formBeforeSave($model)
    {
        $model->is_custom = 1;
    }
}
