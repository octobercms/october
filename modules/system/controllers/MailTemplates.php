<?php namespace System\Controllers;

use Mail;
use Flash;
use BackendMenu;
use Backend\Classes\Controller;
use System\Models\MailTemplate;
use System\Classes\SettingsManager;
use System\Classes\MailManager;
use ApplicationException;
use Throwable;

/**
 * MailTemplates controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailTemplates extends Controller
{
    /**
     * @var array implement extensions by this controller.
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
     * @var array requiredPermissions to view this page.
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
     * index
     */
    public function index($tab = null)
    {
        MailTemplate::syncAll();
        $this->asExtension('ListController')->index();
        $this->bodyClass = 'compact-container';

        $this->vars['activeTab'] = $tab ?: 'templates';
    }

    /**
     * update
     */
    public function update($recordId = null)
    {
        $this->addJs('/modules/system/assets/js/pages/mailformpreview.js');
        return $this->asExtension('FormController')->update($recordId);
    }

    /**
     * onPreviewTemplate
     */
    public function onPreviewTemplate($recordId = null)
    {
        $data = post('MailTemplate', []);

        $model = $this->formFindModelObject($recordId);

        $model->fill([
            'subject' => $data['subject'] ?? null,
            'description' => $data['description'] ?? null,
            'content_html' => $data['content_html'] ?? null,
            'content_text' => $data['content_text'] ?? null,
        ]);

        if (!empty($data['layout'])) {
            $model->setRelation('layout', \System\Models\MailLayout::find($data['layout']));
        }

        return ['previewHtml' => MailManager::instance()->renderTemplate($model, [])];
    }

    /**
     * formBeforeSave
     */
    public function formBeforeSave($model)
    {
        $model->is_custom = true;
    }

    /**
     * onTest
     */
    public function onTest($recordId)
    {
        try {
            $model = $this->formFindModelObject($recordId);
            $user = $this->user;

            Mail::sendTo([$user->email => $user->full_name], $model->code);

            Flash::success(__("Test message sent."));
        }
        catch (Throwable $ex) {
            throw new ApplicationException($ex->getMessage());
        }
    }
}
