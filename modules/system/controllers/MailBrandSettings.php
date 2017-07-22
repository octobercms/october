<?php namespace System\Controllers;

use File;
use Flash;
use Backend;
use BackendMenu;
use ApplicationException;
use System\Models\MailBrandSetting;
use System\Classes\SettingsManager;
use System\Classes\MailManager;
use Backend\Classes\Controller;
use System\Models\MailLayout;
use System\Models\MailTemplate;
use Exception;

/**
 * Mail brand customization controller
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 *
 */
class MailBrandSettings extends Controller
{
    public $implement = [
        \Backend\Behaviors\FormController::class
    ];

    public $formConfig = 'config_form.yaml';

    public $requiredPermissions = ['system.manage_mail_templates'];

    public $bodyClass = 'compact-container';

    /**
     * Constructor.
     */
    public function __construct()
    {
        parent::__construct();

        $this->pageTitle = 'Customize mail appearance';

        BackendMenu::setContext('October.System', 'system', 'settings');
        SettingsManager::setContext('October.System', 'mail_brand_settings');
    }

    public function index()
    {
        $this->addJs('/modules/system/assets/js/mailbrandsettings/mailbrandsettings.js', 'core');
        $this->addCss('/modules/system/assets/css/mailbrandsettings/mailbrandsettings.css', 'core');

        $setting = MailBrandSetting::instance();

        if ($setting->exists) {
            return $this->update($setting->id);
        }
        else {
            return $this->create();
        }
    }

    public function renderSampleMessage()
    {
        $layout = new MailLayout;
        $layout->fillFromCode('default');

        $template = new MailTemplate;
        $template->layout = $layout;
        $template->content_html = File::get(base_path('modules/system/models/mailbrandsetting/sample_template.htm'));

        return MailManager::instance()->renderTemplate($template);
    }

    public function formCreateModelObject()
    {
        return MailBrandSetting::instance();
    }
}
