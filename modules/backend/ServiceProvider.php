<?php namespace Backend;

use App;
use Lang;
use Backend;
use BackendMenu;
use BackendAuth;
use Backend\Classes\WidgetManager;
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
         * Register permissions
         */
        BackendAuth::registerCallback(function($manager) {
            $manager->registerPermissions('October.Backend', [
                'backend.access_dashboard' => ['label' => 'View the dashboard', 'tab' => 'System'],
                'backend.manage_users'     => ['label' => 'Manage other administrators', 'tab' => 'System'],
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
