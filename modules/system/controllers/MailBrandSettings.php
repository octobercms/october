<?php namespace System\Controllers;

use Lang;
use File;
use Flash;
use Config;
use Redirect;
use BackendMenu;
use System\Models\MailBrandSetting;
use System\Classes\SettingsManager;
use System\Classes\MailManager;
use Backend\Classes\Controller;
use System\Models\MailLayout;
use System\Models\MailTemplate;

/**
 * Mail brand customization controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class MailBrandSettings extends Controller
{
    /**
     * @var array Extensions implemented by this controller.
     */
    public $implement = [
        \Backend\Behaviors\FormController::class
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
     * @var string HTML body tag class
     */
    public $bodyClass = 'compact-container';

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->pageTitle = 'system::lang.mail_brand.page_title';

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'mail_brand_settings');
    }

    public function index()
    {
        $this->addJs('/modules/system/assets/js/mailbrandsettings/mailbrandsettings.js', 'core');
        $this->addCss('/modules/system/assets/css/mailbrandsettings/mailbrandsettings.css', 'core');

        $setting = MailBrandSetting::instance();

        $setting->resetCache();

        return $this->create();
    }

    public function index_onSave()
    {
        $setting = MailBrandSetting::instance();

        return $this->create_onSave();
    }

    public function index_onResetDefault()
    {
        $setting = MailBrandSetting::instance();

        $setting->resetDefault();

        Flash::success(Lang::get('backend::lang.form.reset_success'));

        return Redirect::refresh();
    }

    public function onUpdateSampleMessage()
    {
        $this->pageAction();

        $this->formGetWidget()->setFormValues();

        return ['previewHtml' => $this->renderSampleMessage()];
    }

    public function renderSampleMessage()
    {
        $data = [
            'subject' => Config::get('app.name'),
            'appName' => Config::get('app.name'),
            'texts' => Lang::get('system::lang.mail_brand.sample_template')
        ];

        $layout = new MailLayout;
        $layout->fillFromCode('default');

        $template = new MailTemplate;
        $template->layout = $layout;
        $template->content_html = File::get(base_path('modules/system/models/mailbrandsetting/sample_template.htm'));

        return MailManager::instance()->renderTemplate($template, $data);
    }

    public function formCreateModelObject()
    {
        return MailBrandSetting::instance();
    }
}
