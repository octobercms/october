<?php namespace System\Controllers;

use Lang;
use Flash;
use Config;
use Redirect;
use BackendMenu;
use Backend\Classes\Controller;
use System\Classes\SettingsManager;
use System\Classes\MailManager;
use System\Models\MailTemplate;

/**
 * Mail layouts controller
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class MailLayouts extends Controller
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
     * update
     */
    public function update($recordId = null)
    {
        $this->addJs('/modules/system/assets/js/pages/mailformpreview.js');
        return $this->asExtension('FormController')->update($recordId);
    }

    /**
     * onPreviewLayout
     */
    public function onPreviewLayout($recordId = null): array
    {
        $postData = post('MailLayout', []);

        $layout = $this->formFindModelObject($recordId);
        $layout->fill([
            'content_html' => $postData['content_html'] ?? null,
            'content_css' => $postData['content_css'] ?? null,
            'content_text' => $postData['content_text'] ?? null,
            'options' => $postData['options'] ?? [],
        ]);

        $template = new MailTemplate;
        $template->layout = $layout;

        $data = [
            'subject' => Config::get('app.name'),
            'appName' => Config::get('app.name'),
            'texts' => Lang::get('system::lang.mail_brand.sample_template'),
        ];

        return ['previewHtml' => MailManager::instance()->renderTemplate($template, $data)];
    }

    /**
     * update_onResetDefault handler
     */
    public function update_onResetDefault($recordId)
    {
        $model = $this->formFindModelObject($recordId);

        $model->fillFromCode();
        $model->save();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Redirect::refresh();
    }
}
