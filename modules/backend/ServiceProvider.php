<?php namespace Backend;

use App;
use Lang;
use Backend;
use BackendMenu;
use BackendAuth;
use Backend\Classes\WidgetManager;
use October\Rain\Support\ModuleServiceProvider;
use System\Models\MailTemplate;
use System\Classes\SettingsManager;

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
        WidgetManager::instance()->registerFormWidgets(function($manager){
            $manager->registerFormWidget('Backend\FormWidgets\CodeEditor', [
                'label' => 'Code editor',
                'alias' => 'codeeditor'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\RichEditor', [
                'label' => 'Rich editor',
                'alias' => 'richeditor'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\FileUpload', [
                'label' => 'File uploader',
                'alias' => 'fileupload'
            ]);

            $manager->registerFormWidget('Backend\FormWidgets\Relation', [
                'label' => 'Relationship',
                'alias' => 'relation'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\Datepicker', [
                'label' => 'Date picker',
                'alias' => 'datepicker'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\DataGrid', [
                'label' => 'Data Grid',
                'alias' => 'datagrid'
            ]);
            $manager->registerFormWidget('Backend\FormWidgets\RecordFinder', [
                'label' => 'Record Finder',
                'alias' => 'recordfinder'
            ]);
        });

        /*
         * Register navigation
         */
        BackendMenu::registerCallback(function($manager) {
            $manager->registerMenuItems('October.Backend', [
                'dashboard' => [
                    'label'       => 'backend::lang.dashboard.menu_label',
                    'icon'        => 'icon-home',
                    'url'         => Backend::url('backend'),
                    'permissions' => ['backend.access_dashboard'],
                    'order'       => 1
                ]
            ]);
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function($manager){
            $manager->registerSettingItems('October.Backend', [
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
                    'keywords'    => 'backend::lang.myaccount.menu_keywords',
                ],
                'access_logs' => [
                    'label'       => 'backend::lang.access_log.menu_label',
                    'description' => 'backend::lang.access_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-lock',
                    'url'         => Backend::url('backend/accesslogs'),
                    'permissions' => ['backend.access_admin_logs'],
                    'order'       => 800
                ],
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function($manager) {
            $manager->registerPermissions('October.Backend', [
                'backend.access_dashboard' => ['label' => 'system::lang.permissions.view_the_dashboard', 'tab' => 'System'],
                'backend.manage_users'     => ['label' => 'system::lang.permissions.manage_other_administrators', 'tab' => 'System'],
            ]);
        });

        /*
         * Register mail templates
         */
        MailTemplate::registerCallback(function($template){
            $template->registerMailTemplates([
                'backend::mail.invite'  => 'Invitation for newly created administrators.',
                'backend::mail.restore' => 'Password reset instructions for backend-end administrators.',
            ]);
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
