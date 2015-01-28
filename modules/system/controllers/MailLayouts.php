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
 * Mail layouts controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailLayouts extends Controller
{
    public $implement = [
        'Backend.Behaviors.FormController',
    ];

    public $requiredPermissions = ['system.manage_mail_templates'];

    public $formConfig = 'config_form.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'mail_templates');
    }
}
