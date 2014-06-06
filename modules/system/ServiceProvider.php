<?php namespace System;

use App;
use Lang;
use Event;
use Config;
use Backend;
use BackendMenu;
use BackendAuth;
use Twig_Environment;
use System\Classes\ErrorHandler;
use System\Classes\PluginManager;
use System\Classes\SettingsManager;
use System\Twig\Engine as TwigEngine;
use System\Twig\Loader as TwigLoader;
use System\Models\EmailSettings;
use System\Models\EmailTemplate;
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
        /*
         * Register self
         */
        parent::register('system');

        /*
         * Register core providers
         */
        App::register('October\Rain\Config\ConfigServiceProvider');
        App::register('October\Rain\Translation\TranslationServiceProvider');

        /*
         * Define path constants
         */
        if (!defined('PATH_APP')) define('PATH_APP', app_path());
        if (!defined('PATH_BASE')) define('PATH_BASE', base_path());
        if (!defined('PATH_PUBLIC')) define('PATH_PUBLIC', public_path());
        if (!defined('PATH_STORAGE')) define('PATH_STORAGE', storage_path());
        if (!defined('PATH_PLUGINS')) define('PATH_PLUGINS', base_path() . Config::get('cms.pluginsDir'));

        /*
         * Register singletons
         */
        App::singleton('string', function(){ return new \October\Rain\Support\Str; });
        App::singleton('backend.helper', function(){ return new \Backend\Classes\BackendHelper; });
        App::singleton('backend.menu', function() { return \Backend\Classes\NavigationManager::instance(); });
        App::singleton('backend.auth', function() { return \Backend\Classes\AuthManager::instance(); });

        /*
         * Register all plugins
         */
        $pluginManager = PluginManager::instance();
        $pluginManager->registerAll();

        /*
         * Error handling for uncaught Exceptions
         */
        App::error(function(\Exception $exception, $httpCode, $isConsole){
            $handler = new ErrorHandler;
            return $handler->handleException($exception, $httpCode, $isConsole);
        });

        /*
         * Register basic twig
         */
        App::bindShared('twig', function($app) {
            return new Twig_Environment(new TwigLoader(), ['auto_reload' => true]);
        });

        /*
         * Register .htm extension for Twig views
         */
        App::make('view')->addExtension('htm', 'twig', function() {
            return new TwigEngine(App::make('twig'));
        });

        /*
         * Override system email with email settings
         */
        Event::listen('mailer.beforeRegister', function() {
            if (EmailSettings::isConfigured())
                EmailSettings::applyConfigValues();
        });

        /*
         * Override standard Mailer content with template
         */
        Event::listen('mailer.register', function() {
            App::make('mailer')->bindEvent('content.beforeAdd', function($message, $view, $plain, $data){
                if (EmailTemplate::addContentToMailer($message, $view, $data))
                    return false;
            });
        });

        /*
         * Register other module providers
         */
        foreach (Config::get('cms.loadModules', []) as $module) {
            if (strtolower(trim($module)) == 'system') continue;
            App::register('\\' . $module . '\ServiceProvider');
        }

        /*
         * Register navigation
         */
        BackendMenu::registerCallback(function($manager) {
            $manager->registerMenuItems('October.System', [
                'system' => [
                    'label'       => 'system::lang.system.menu_label',
                    'icon'        => 'icon-cog',
                    'url'         => Backend::url('system/settings'),
                    'permissions' => ['backend.*', 'system.*'],
                    'order'       => 1000,

                    'sideMenu' => [
                        'settings' => [
                            'label'       => 'system::lang.settings.menu_label',
                            'icon'        => 'icon-cogs',
                            'url'         => Backend::url('system/settings'),
                            'permissions' => ['system.manage_settings']
                        ],
                        'users' => [
                            'label'       => 'backend::lang.user.menu_label',
                            'icon'        => 'icon-user',
                            'url'         => Backend::url('backend/users'),
                            'permissions' => ['backend.manage_users']
                        ],
                        'updates' => [
                            'label'       => 'system::lang.updates.menu_label',
                            'icon'        => 'icon-cloud-download',
                            'url'         => Backend::url('system/updates'),
                            'permissions' => ['system.manage_updates']
                        ]
                    ]

                ]
            ]);
        });

        /*
         * Register report widgets
         */
        WidgetManager::instance()->registerReportWidgets(function($manager){
            $manager->registerReportWidget('System\ReportWidgets\Status', [
                'label'   => 'System status',
                'context' => 'dashboard'
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function($manager) {
            $manager->registerPermissions('October.System', [
                'system.manage_settings'        => ['label' => 'Manage system settings', 'tab' => 'System'],
                'system.manage_updates'         => ['label' => 'Manage software updates', 'tab' => 'System'],
                'system.manage_email_templates' => ['label' => 'Manage email templates', 'tab' => 'System'],
            ]);
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function($manager){
            $manager->registerSettingItems('October.System', [
                'email_settings' => [
                    'label'       => 'system::lang.email.menu_label',
                    'description' => 'system::lang.email.menu_description',
                    'category'    => 'System',
                    'icon'        => 'icon-envelope',
                    'class'       => 'System\Models\EmailSettings',
                    'sort'        => 100
                ],
                'email_templates' => [
                    'label'       => 'system::lang.email_templates.menu_label',
                    'description' => 'system::lang.email_templates.menu_description',
                    'category'    => 'System',
                    'icon'        => 'icon-envelope-square',
                    'url'         => Backend::url('system/emailtemplates'),
                    'sort'        => 100
                ],
            ]);
        });

        /*
         * Register console commands
         */
        $this->registerConsoleCommand('october.up', 'System\Console\OctoberUp');
        $this->registerConsoleCommand('october.down', 'System\Console\OctoberDown');
        $this->registerConsoleCommand('october.update', 'System\Console\OctoberUpdate');
        $this->registerConsoleCommand('plugin.install', 'System\Console\PluginInstall');
        $this->registerConsoleCommand('plugin.remove', 'System\Console\PluginRemove');
        $this->registerConsoleCommand('plugin.refresh', 'System\Console\PluginRefresh');

        /*
         * Override clear cache command
         */
        App::bindShared('command.cache.clear', function($app) {
            return new \System\Console\CacheClear($app['cache'], $app['files']);
        });
    }

    /**
     * Bootstrap the module events.
     *
     * @return void
     */
    public function boot()
    {
        /*
         * Boot plugins
         */
        $pluginManager = PluginManager::instance();
        $pluginManager->bootAll();

        parent::boot('system');
    }
}
