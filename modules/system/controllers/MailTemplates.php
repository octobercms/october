<?php namespace System\Controllers;

use Mail;
use Flash;
use BackendMenu;
use Backend\Classes\Controller;
use System\Models\MailTemplate;
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
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class,
        \Backend\Behaviors\ListController::class
    ];

    /**
     * @var array `FormController` configuration.
     */
    public $formConfig = 'config_form.yaml';

    /**
     * @var array `ListController` configuration.
     */
    public $listConfig = [
        'templates' => 'config_templates_list.yaml',
        'layouts' => 'config_layouts_list.yaml',
        'partials' => 'config_partials_list.yaml'
    ];

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

    public function index($tab = null)
    {
        MailTemplate::syncAll();
        $this->asExtension('ListController')->index();
        $this->bodyClass = 'compact-container';

        $this->vars['activeTab'] = $tab ?: 'templates';
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
