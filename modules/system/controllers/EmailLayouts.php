<?php namespace System\Controllers;

use Str;
use Lang;
use File;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\ApplicationException;
use Exception;

/**
 * Email layouts controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class EmailLayouts extends Controller
{

    public $implement = [
        'Backend.Behaviors.FormController',
    ];

    public $requiredPermissions = ['system.manage_email_templates'];

    public $formConfig = 'config_form.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
    }

}