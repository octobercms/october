<?php namespace Backend;

use App;
use Backend;
use BackendMenu;
use BackendAuth;
use Backend\Classes\WidgetManager;
use System\Models\MailTemplate;
use System\Classes\CombineAssets;
use System\Classes\SettingsManager;
use October\Rain\Support\ModuleServiceProvider;

class ServiceProvider extends ModuleServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        parent::register('backend');

        $this->registerMailer();
        $this->registerAssetBundles();

        /*
         * Backend specific
         */
        if (App::runningInBackend()) {
            $this->registerBackendNavigation();
            $this->registerBackendReportWidgets();
            $this->registerBackendWidgets();
            $this->registerBackendPermissions();
            $this->registerBackendSettings();
        }
    }

    /**
     * Bootstrap the module events.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot('backend');
    }

    /**
     * Register mail templates
     */
    protected function registerMailer()
    {
        MailTemplate::registerCallback(function ($template) {
            $template->registerMailTemplates([
                'backend::mail.invite'  => 'Invitation for newly created administrators.',
                'backend::mail.restore' => 'Password reset instructions for backend-end administrators.',
            ]);
        });
    }

    /**
     * Register asset bundles
     */
    protected function registerAssetBundles()
    {
        CombineAssets::registerCallback(function ($combiner) {
            $combiner->registerBundle('~/modules/backend/assets/less/october.less');
            $combiner->registerBundle('~/modules/backend/assets/js/october.js');
            $combiner->registerBundle('~/modules/backend/widgets/table/assets/js/build.js');
            $combiner->registerBundle('~/modules/backend/formwidgets/codeeditor/assets/less/codeeditor.less');
            $combiner->registerBundle('~/modules/backend/formwidgets/codeeditor/assets/js/build.js');
            $combiner->registerBundle('~/modules/backend/formwidgets/fileupload/assets/less/fileupload.less');

            /*
             * Rich Editor is protected by DRM
             */
            if (file_exists(base_path('modules/backend/formwidgets/richeditor/assets/vendor/froala_drm'))) {
                $combiner->registerBundle('~/modules/backend/formwidgets/richeditor/assets/less/richeditor.less');
                $combiner->registerBundle('~/modules/backend/formwidgets/richeditor/assets/js/build.js');
            }
        });
    }

    /*
     * Register navigation
     */
    protected function registerBackendNavigation()
    {
        BackendMenu::registerCallback(function ($manager) {
            $manager->registerMenuItems('October.Backend', [
                'dashboard' => [
                    'label'       => 'backend::lang.dashboard.menu_label',
                    'icon'        => 'icon-dashboard',
                    'iconSvg'     => 'modules/backend/assets/images/dashboard-icon.svg',
                    'url'         => Backend::url('backend'),
                    'permissions' => ['backend.access_dashboard'],
                    'order'       => 10
                ]
            ]);
        });
    }

    /*
     * Register report widgets
     */
    protected function registerBackendReportWidgets()
    {
        WidgetManager::instance()->registerReportWidgets(function ($manager) {
            $manager->registerReportWidget('Backend\ReportWidgets\Welcome', [
                'label'   => 'backend::lang.dashboard.welcome.widget_title_default',
                'context' => 'dashboard'
            ]);
        });
    }

    /*
     * Register permissions
     */
    protected function registerBackendPermissions()
    {
        BackendAuth::registerCallback(function ($manager) {
            $manager->registerPermissions('October.Backend', [
                'backend.access_dashboard' => [
                    'label' => 'system::lang.permissions.view_the_dashboard',
                    'tab'   => 'system::lang.permissions.name'
                ],
                'backend.manage_users' => [
                    'label' => 'system::lang.permissions.manage_other_administrators',
                    'tab'   => 'system::lang.permissions.name'
                ],
                'backend.manage_preferences' => [
                    'label' => 'system::lang.permissions.manage_preferences',
                    'tab'   => 'system::lang.permissions.name'
                ],
                'backend.manage_editor' => [
                    'label' => 'system::lang.permissions.manage_editor',
                    'tab'   => 'system::lang.permissions.name'
                ],
                'backend.manage_branding' => [
                    'label' => 'system::lang.permissions.manage_branding',
                    'tab'   => 'system::lang.permissions.name'
                ]
            ]);
        });
    }

    /*
     * Register widgets
     */
    protected function registerBackendWidgets()
    {
        WidgetManager::instance()->registerFormWidgets(function ($manager) {
            $manager->registerFormWidget('Backend\FormWidgets\CodeEditor', 'codeeditor');
            $manager->registerFormWidget('Backend\FormWidgets\RichEditor', 'richeditor');
            $manager->registerFormWidget('Backend\FormWidgets\MarkdownEditor', 'markdown');
            $manager->registerFormWidget('Backend\FormWidgets\FileUpload', 'fileupload');
            $manager->registerFormWidget('Backend\FormWidgets\Relation', 'relation');
            $manager->registerFormWidget('Backend\FormWidgets\DatePicker', 'datepicker');
            $manager->registerFormWidget('Backend\FormWidgets\TimePicker', 'timepicker');
            $manager->registerFormWidget('Backend\FormWidgets\ColorPicker', 'colorpicker');
            $manager->registerFormWidget('Backend\FormWidgets\DataTable', 'datatable');
            $manager->registerFormWidget('Backend\FormWidgets\RecordFinder', 'recordfinder');
            $manager->registerFormWidget('Backend\FormWidgets\Repeater', 'repeater');
            $manager->registerFormWidget('Backend\FormWidgets\TagList', 'taglist');
        });
    }

    /*
     * Register settings
     */
    protected function registerBackendSettings()
    {
        SettingsManager::instance()->registerCallback(function ($manager) {
            $manager->registerSettingItems('October.Backend', [
                'branding' => [
                    'label'       => 'backend::lang.branding.menu_label',
                    'description' => 'backend::lang.branding.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-paint-brush',
                    'class'       => 'Backend\Models\BrandSetting',
                    'permissions' => ['backend.manage_branding'],
                    'order'       => 500,
                    'keywords'    => 'brand style'
                ],
                'editor' => [
                    'label'       => 'backend::lang.editor.menu_label',
                    'description' => 'backend::lang.editor.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-code',
                    'class'       => 'Backend\Models\EditorSetting',
                    'permissions' => ['backend.manage_editor'],
                    'order'       => 500,
                    'keywords'    => 'html code class style'
                ],
                'myaccount' => [
                    'label'       => 'backend::lang.myaccount.menu_label',
                    'description' => 'backend::lang.myaccount.menu_description',
                    'category'    => SettingsManager::CATEGORY_MYSETTINGS,
                    'icon'        => 'icon-user',
                    'url'         => Backend::url('backend/users/myaccount'),
                    'order'       => 500,
                    'context'     => 'mysettings',
                    'keywords'    => 'backend::lang.myaccount.menu_keywords'
                ],
                'preferences' => [
                    'label'       => 'backend::lang.backend_preferences.menu_label',
                    'description' => 'backend::lang.backend_preferences.menu_description',
                    'category'    => SettingsManager::CATEGORY_MYSETTINGS,
                    'icon'        => 'icon-laptop',
                    'url'         => Backend::url('backend/preferences'),
                    'permissions' => ['backend.manage_preferences'],
                    'order'       => 510,
                    'context'     => 'mysettings'
                ],
                'access_logs' => [
                    'label'       => 'backend::lang.access_log.menu_label',
                    'description' => 'backend::lang.access_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-lock',
                    'url'         => Backend::url('backend/accesslogs'),
                    'permissions' => ['system.access_logs'],
                    'order'       => 920
                ]
            ]);
        });
    }
}
