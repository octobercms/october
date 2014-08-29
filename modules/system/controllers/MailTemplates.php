<?php namespace System\Controllers;

use Str;
use Lang;
use File;
use Mail;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use BackendAuth;
use Backend\Classes\Controller;
use System\Models\MailTemplate;
use System\Classes\ApplicationException;
use System\Classes\SettingsManager;
use Exception;

/**
 * Mail templates controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class MailTemplates extends Controller
{

    public $implement = [
        'Backend.Behaviors.FormController',
        'Backend.Behaviors.ListController'
    ];

    public $requiredPermissions = ['system.manage_mail_templates'];

    public $listConfig = ['templates' => 'config_templates_list.yaml', 'layouts' => 'config_layouts_list.yaml'];
    public $formConfig = 'config_form.yaml';

    public function __construct()
    {
        parent::__construct();

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'mail_templates');
    }

    public function index()
    {
        /* @todo Remove line if year >= 2015 */ if (!\System\Models\MailLayout::whereCode('default')->count()) { \Eloquent::unguard(); with(new \System\Database\Seeds\SeedSetupMailLayouts)->run(); }

        MailTemplate::syncAll();
        $this->asExtension('ListController')->index();
        $this->bodyClass = 'compact-container';
    }

    public function formBeforeSave($model)
    {
        $model->is_custom = true;
    }

    public function onTest($recordId)
    {
        try {
            $model = $this->formFindModelObject($recordId);
            $user = BackendAuth::getUser();

            $vars = [
                'email' => $user->email,
                'name'  => $user->full_name,
            ];
            Mail::send($model->code, [], function($message) use ($vars) {
                extract($vars);
                $message->to($email, $name);
            });

            Flash::success('The test message has been successfully sent.');
        }
        catch (Exception $ex) {
            Flash::error($ex->getMessage());
        }
    }

}