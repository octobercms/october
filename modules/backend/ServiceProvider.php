<?php namespace Backend;

use App;
use Lang;
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

        /*
         * Register widgets
         */
        WidgetManager::instance()->registerFormWidgets(function ($manager) {
            $manager->registerFormWidget('Backend\FormWidgets\CodeEditor', [
                'label' => 'Code editor',
                'code'  => 'codeeditor'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\RichEditor', [
                'label' => 'Rich editor',
                'code'  => 'richeditor'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\FileUpload', [
                'label' => 'File uploader',
                'code'  => 'fileupload'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\Relation', [
                'label' => 'Relationship',
                'code'  => 'relation'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\DatePicker', [
                'label' => 'Date picker',
                'code'  => 'datepicker'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\TimePicker', [
                'label' => 'Time picker',
                'code'  => 'timepicker'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\ColorPicker', [
                'label' => 'Color picker',
                'code'  => 'colorpicker'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\DataGrid', [
                'label' => 'Data Grid',
                'code'  => 'datagrid'
            ]); // @deprecated if year >= 2016
            $manager->registerFormWidget('Backend\FormWidgets\DataTable', [
                'label' => 'Data Table',
                'code'  => 'datatable'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\RecordFinder', [
                'label' => 'Record Finder',
                'code'  => 'recordfinder'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\Repeater', [
                'label' => 'Repeater',
                'code'  => 'repeater'
            ]);
        });

        /*
         * Register navigation
         */
        BackendMenu::registerCallback(function ($manager) {
            $manager->registerMenuItems('October.Backend', [
                'dashboard' => [
                    'label'       => 'backend::lang.dashboard.menu_label',
                    'icon'        => 'icon-dashboard',
                    'url'         => Backend::url('backend'),
                    'permissions' => ['backend.access_dashboard'],
                    'order'       => 1
                ]
            ]);
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function ($manager) {
            $manager->registerSettingItems('October.Backend', [
                'branding' => [
                    'label'       => 'backend::lang.branding.menu_label',
                    'description' => 'backend::lang.branding.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-paint-brush',
                    'class'       => 'Backend\Models\BrandSettings',
                    'order'       => 500
                ],
                'editor' => [
                    'label'       => 'backend::lang.editor.menu_label',
                    'description' => 'backend::lang.editor.menu_description',
                    'category'    => SettingsManager::CATEGORY_MYSETTINGS,
                    'icon'        => 'icon-code',
                    'url'         => Backend::URL('backend/editorpreferences'),
                    'order'       => 600,
                    'context'     => 'mysettings'
                ],
                'backend_preferences' => [
                    'label'       => 'backend::lang.backend_preferences.menu_label',
                    'description' => 'backend::lang.backend_preferences.menu_description',
                    'category'    => SettingsManager::CATEGORY_MYSETTINGS,
                    'icon'        => 'icon-laptop',
                    'class'       => 'Backend\Models\BackendPreferences',
                    'order'       => 500,
                    'context'     => 'mysettings'
                ],
                'myaccount' => [
                    'label'       => 'backend::lang.myaccount.menu_label',
                    'description' => 'backend::lang.myaccount.menu_description',
                    'category'    => SettingsManager::CATEGORY_MYSETTINGS,
                    'icon'        => 'icon-user',
                    'url'         => Backend::URL('backend/users/myaccount'),
                    'order'       => 400,
                    'context'     => 'mysettings',
                    'keywords'    => 'backend::lang.myaccount.menu_keywords'
                ],
                'access_logs' => [
                    'label'       => 'backend::lang.access_log.menu_label',
                    'description' => 'backend::lang.access_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-lock',
                    'url'         => Backend::url('backend/accesslogs'),
                    'permissions' => ['backend.access_admin_logs'],
                    'order'       => 800
                ]
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function ($manager) {
            $manager->registerPermissions('October.Backend', [
                'backend.access_dashboard' => [
                    'label' => 'system::lang.permissions.view_the_dashboard',
                    'tab'   => 'system::lang.permissions.name'
                ],
                'backend.manage_users' => [
                    'label' => 'system::lang.permissions.manage_other_administrators',
                    'tab'   => 'system::lang.permissions.name'
                ]
            ]);
        });

        /*
         * Register mail templates
         */
        MailTemplate::registerCallback(function ($template) {
            $template->registerMailTemplates([
                'backend::mail.invite'  => 'Invitation for newly created administrators.',
                'backend::mail.restore' => 'Password reset instructions for backend-end administrators.',
            ]);
        });

        /*
         * Register asset bundles
         */
        CombineAssets::registerCallback(function($combiner) {
            $combiner->registerBundle('~/modules/backend/assets/less/controls.less');
            $combiner->registerBundle('~/modules/backend/assets/less/october.less');
            $combiner->registerBundle('~/modules/backend/assets/js/october.js');
            $combiner->registerBundle('~/modules/backend/assets/js/vendor/vendor.js');
            $combiner->registerBundle('~/modules/backend/widgets/table/assets/js/build.js');
            $combiner->registerBundle('~/modules/backend/formwidgets/datepicker/assets/js/build.js');
            $combiner->registerBundle('~/modules/backend/formwidgets/richeditor/assets/less/richeditor.less');
            $combiner->registerBundle('~/modules/backend/formwidgets/richeditor/assets/js/build.js');
        });
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
}
