<?php namespace System\Controllers;

use Str;
use Lang;
use File;
use Mail;
use Flash;
use Backend;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use System\Models\MailTemplate;
use ApplicationException;
use System\Classes\SettingsManager;
use Exception;

/**
 * Mail templates controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
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
        MailTemplate::syncAll();
        $this->asExtension('ListController')->index();
        $this->bodyClass = 'compact-container';
    }

    public function formBeforeSave($model)
    {
        $model->is_custom = 1;
    }

    public function onTest($recordId)
    {
        try {
            $model = $this->formFindModelObject($recordId);
            $user = $this->user;

            Mail::sendTo([$user->email => $user->full_name], $model->code);

            Flash::success(trans('system::lang.mail_templates.test_success'));
        }
        catch (Exception $ex) {
            Flash::error($ex->getMessage());
        }
    }
}
