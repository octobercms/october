<?php namespace System;

use App;
use Lang;
use Event;
use Config;
use Backend;
use DbDongle;
use BackendMenu;
use BackendAuth;
use Twig_Environment;
use Twig_Loader_String;
use System\Classes\ErrorHandler;
use System\Classes\MarkupManager;
use System\Classes\PluginManager;
use System\Classes\SettingsManager;
use System\Twig\Engine as TwigEngine;
use System\Twig\Loader as TwigLoader;
use System\Twig\Extension as TwigExtension;
use System\Models\EventLog;
use System\Models\MailSettings;
use System\Models\MailTemplate;
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
        App::error(function(\Exception $exception, $httpCode){
            $handler = new ErrorHandler;
            $isConsole = App::runningInConsole();
            return $handler->handleException($exception, $httpCode, $isConsole);
        });

        /*
         * Write all log events to the database
         */
        Event::listen('illuminate.log', function($level, $message, $context){
            if (!DbDongle::hasDatabase())
                return;

            EventLog::add($message, $level);
        });

        /*
         * Register basic Twig
         */
        App::bindShared('twig', function($app) {
            $twig = new Twig_Environment(new TwigLoader(), ['auto_reload' => true]);
            $twig->addExtension(new TwigExtension);
            return $twig;
        });

        /*
         * Register .htm extension for Twig views
         */
        App::make('view')->addExtension('htm', 'twig', function() {
            return new TwigEngine(App::make('twig'));
        });

        /*
         * Register Twig that will parse strings
         */
        App::bindShared('twig.string', function($app) {
            $twig = $app['twig'];
            $twig->setLoader(new Twig_Loader_String);
            return $twig;
        });

        /*
         * Override system mailer with mail settings
         */
        Event::listen('mailer.beforeRegister', function() {
            if (MailSettings::isConfigured())
                MailSettings::applyConfigValues();
        });

        /*
         * Override standard Mailer content with template
         */
        Event::listen('mailer.beforeAddContent', function($mailer, $message, $view, $plain, $data){
            if (MailTemplate::addContentToMailer($message, $view, $data))
                return false;
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
                    'permissions' => ['backend.manage_users', 'system.*'],
                    'order'       => 1000
                ]
            ]);
        });

        /*
         * Register report widgets
         */
        WidgetManager::instance()->registerReportWidgets(function($manager){
            $manager->registerReportWidget('System\ReportWidgets\Status', [
                'label'   => 'backend::lang.dashboard.status.widget_title_default',
                'context' => 'dashboard'
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function($manager) {
            $manager->registerPermissions('October.System', [
                'system.manage_settings'        => ['label' => 'system::lang.permissions.manage_system_settings', 'tab' => 'System'],
                'system.manage_updates'         => ['label' => 'system::lang.permissions.manage_software_updates', 'tab' => 'System'],
                'system.manage_mail_templates'  => ['label' => 'system::lang.permissions.manage_mail_templates', 'tab' => 'System'],
            ]);
        });

        /*
         * Register markup tags
         */
        MarkupManager::instance()->registerCallback(function($manager){
            $manager->registerFunctions([
                // Functions
                'post'           => 'post',
                'link_to'        => 'link_to',
                'link_to_asset'  => 'link_to_asset',
                'link_to_route'  => 'link_to_route',
                'link_to_action' => 'link_to_action',
                'asset'          => 'asset',
                'action'         => 'action',
                'url'            => 'url',
                'route'          => 'route',
                'secure_url'     => 'secure_url',
                'secure_asset'   => 'secure_asset',

                // Classes
                'str_*'          => ['Str', '*'],
                'url_*'          => ['URL', '*'],
                'html_*'         => ['HTML', '*'],
                'form_*'         => ['Form', '*'],
                'form_macro'     => ['Form', '__call'],
            ]);

            $manager->registerFilters([
                // Classes
                'slug'           => ['Str', 'slug'],
                'plural'         => ['Str', 'plural'],
                'singular'       => ['Str', 'singular'],
                'finish'         => ['Str', 'finish'],
                'snake'          => ['Str', 'snake'],
                'camel'          => ['Str', 'camel'],
                'studly'         => ['Str', 'studly'],
                'md'             => ['October\Rain\Support\Markdown', 'parse'],
            ]);
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function($manager){
            $manager->registerSettingItems('October.System', [
                'administrators' => [
                    'label'       => 'backend::lang.user.menu_label',
                    'description' => 'backend::lang.user.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-users',
                    'url'         => Backend::url('backend/users'),
                    'permissions' => ['backend.manage_users'],
                    'order'       => 600
                ],
                'updates' => [
                    'label'       => 'system::lang.updates.menu_label',
                    'description' => 'system::lang.updates.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-cloud-download',
                    'url'         => Backend::url('system/updates'),
                    'permissions' => ['system.manage_updates'],
                    'order'       => 700
                ],
                'event_logs' => [
                    'label'       => 'system::lang.event_log.menu_label',
                    'description' => 'system::lang.event_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-exclamation-triangle',
                    'url'         => Backend::url('system/eventlogs'),
                    'permissions' => ['system.access_event_logs'],
                    'order'       => 800
                ],
                'request_logs' => [
                    'label'       => 'system::lang.request_log.menu_label',
                    'description' => 'system::lang.request_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-file-o',
                    'url'         => Backend::url('system/requestlogs'),
                    'permissions' => ['system.access_request_logs'],
                    'order'       => 800
                ],
                'mail_settings' => [
                    'label'       => 'system::lang.mail.menu_label',
                    'description' => 'system::lang.mail.menu_description',
                    'category'    => SettingsManager::CATEGORY_MAIL,
                    'icon'        => 'icon-envelope',
                    'class'       => 'System\Models\MailSettings',
                    'order'       => 400,
                ],
                'mail_templates' => [
                    'label'       => 'system::lang.mail_templates.menu_label',
                    'description' => 'system::lang.mail_templates.menu_description',
                    'category'    => SettingsManager::CATEGORY_MAIL,
                    'icon'        => 'icon-envelope-square',
                    'url'         => Backend::url('system/mailtemplates'),
                    'order'       => 500,
                ],
            ]);
        });

        /*
         * Register console commands
         */
        $this->registerConsoleCommand('october.up', 'System\Console\OctoberUp');
        $this->registerConsoleCommand('october.down', 'System\Console\OctoberDown');
        $this->registerConsoleCommand('october.update', 'System\Console\OctoberUpdate');
        $this->registerConsoleCommand('october.util', 'System\Console\OctoberUtil');
        $this->registerConsoleCommand('plugin.install', 'System\Console\PluginInstall');
        $this->registerConsoleCommand('plugin.remove', 'System\Console\PluginRemove');
        $this->registerConsoleCommand('plugin.refresh', 'System\Console\PluginRefresh');

        /*
         * Override clear cache command
         */
        App::bindShared('command.cache.clear', function($app) {
            return new \System\Console\CacheClear($app['cache'], $app['files']);
        });

        /*
         * Register the sidebar for the System main menu
         */
        BackendMenu::registerContextSidenavPartial('October.System', 'system', '@/modules/system/partials/_system_sidebar.htm');
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
