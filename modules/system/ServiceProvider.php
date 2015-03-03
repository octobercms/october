<?php namespace System;

use App;
use Lang;
use Event;
use Config;
use Backend;
use Request;
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
use October\Rain\Router\Helper as RouterHelper;

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
         * Register singletons
         */
        App::singleton('backend.helper', function () {
            return new \Backend\Helpers\Backend;
        });
        App::singleton('backend.menu', function () {
            return \Backend\Classes\NavigationManager::instance();
        });
        App::singleton('backend.auth', function () {
            return \Backend\Classes\AuthManager::instance();
        });

        $this->registerPrivilegedActions();

        /*
         * Register all plugins
         */
        $pluginManager = PluginManager::instance();
        $pluginManager->registerAll();

        /*
         * Allow plugins to use the scheduler
         */
        Event::listen('console.schedule', function($schedule) use ($pluginManager) {
            foreach ($pluginManager->getPlugins() as $plugin) {
                if (method_exists($plugin, 'registerSchedule')) {
                    $plugin->registerSchedule($schedule);
                }
            }
        });

        /*
         * Error handling for uncaught Exceptions
         */
        Event::listen('exception.beforeRender', function ($exception, $httpCode, $request){
            $handler = new ErrorHandler;
            return $handler->handleException($exception);
        });

        /*
         * Write all log events to the database
         */
        Event::listen('illuminate.log', function ($level, $message, $context) {
            if (DbDongle::hasDatabase() && !defined('OCTOBER_NO_EVENT_LOGGING')) {
                EventLog::add($message, $level);
            }
        });

        /*
         * Register basic Twig
         */
        App::singleton('twig', function ($app) {
            $twig = new Twig_Environment(new TwigLoader(), ['auto_reload' => true]);
            $twig->addExtension(new TwigExtension);
            return $twig;
        });

        /*
         * Register .htm extension for Twig views
         */
        App::make('view')->addExtension('htm', 'twig', function () {
            return new TwigEngine(App::make('twig'));
        });

        /*
         * Register Twig that will parse strings
         */
        App::singleton('twig.string', function ($app) {
            $twig = $app['twig'];
            $twig->setLoader(new Twig_Loader_String);
            return $twig;
        });

        /*
         * Override system mailer with mail settings
         */
        Event::listen('mailer.beforeRegister', function () {
            if (MailSettings::isConfigured()) {
                MailSettings::applyConfigValues();
            }
        });

        /*
         * Override standard Mailer content with template
         */
        Event::listen('mailer.beforeAddContent', function ($mailer, $message, $view, $data) {
            if (MailTemplate::addContentToMailer($message, $view, $data)) {
                return false;
            }
        });

        /*
         * Register other module providers
         */
        foreach (Config::get('cms.loadModules', []) as $module) {
            if (strtolower(trim($module)) == 'system') {
                continue;
            }
            App::register('\\' . $module . '\ServiceProvider');
        }

        /*
         * Register navigation
         */
        BackendMenu::registerCallback(function ($manager) {
            $manager->registerMenuItems('October.System', [
                'system' => [
                    'label'       => 'system::lang.settings.menu_label',
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
        WidgetManager::instance()->registerReportWidgets(function ($manager) {
            $manager->registerReportWidget('System\ReportWidgets\Status', [
                'label'   => 'backend::lang.dashboard.status.widget_title_default',
                'context' => 'dashboard'
            ]);
        });

        /*
         * Register permissions
         */
        BackendAuth::registerCallback(function ($manager) {
            $manager->registerPermissions('October.System', [
                'system.manage_updates' => [
                    'label' => 'system::lang.permissions.manage_software_updates',
                    'tab' => 'system::lang.permissions.name'
                ],
                'system.manage_mail_settings' => [
                    'label' => 'system::lang.permissions.manage_mail_settings',
                    'tab' => 'system::lang.permissions.name'
                ],
                'system.manage_mail_templates' => [
                    'label' => 'system::lang.permissions.manage_mail_templates',
                    'tab' => 'system::lang.permissions.name'
                ]
            ]);
        });

        /*
         * Register markup tags
         */
        MarkupManager::instance()->registerCallback(function ($manager) {
            $manager->registerFunctions([
                // Functions
                'input'          => 'input',
                'post'           => 'post',
                'get'            => 'get',
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
                'form_macro'     => ['Form', '__call']
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
                'trans'          => ['Lang', 'get'],
                'transchoice'    => ['Lang', 'choice'],
                'md'             => ['Markdown', 'parse'],
            ]);
        });

        /*
         * Register settings
         */
        SettingsManager::instance()->registerCallback(function ($manager) {
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
                    'permissions' => ['system.manage_mail_settings'],
                    'order'       => 400
                ],
                'mail_templates' => [
                    'label'       => 'system::lang.mail_templates.menu_label',
                    'description' => 'system::lang.mail_templates.menu_description',
                    'category'    => SettingsManager::CATEGORY_MAIL,
                    'icon'        => 'icon-envelope-square',
                    'url'         => Backend::url('system/mailtemplates'),
                    'permissions' => ['system.manage_mail_templates'],
                    'order'       => 500
                ]
            ]);
        });

        /*
         * Add CMS based cache clearing to native command
         */
        Event::listen('cache:cleared', function() {
            \System\Helpers\Cache::clear();
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
         * Register the sidebar for the System main menu
         */
        BackendMenu::registerContextSidenavPartial(
            'October.System',
            'system',
            '~/modules/system/partials/_system_sidebar.htm'
        );
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

    /**
     * Check for CLI or system/updates route and disable any plugin initialization
     */
    protected function registerPrivilegedActions()
    {
        $requests = ['/combine', '@/system/updates', '@/backend/auth'];
        $commands = ['october:up', 'october:update'];

        /*
         * Requests
         */
        $path = RouterHelper::normalizeUrl(Request::path());
        foreach ($requests as $request) {
            if (substr($request, 0, 1) == '@') {
                $request = Config::get('cms.backendUri') . substr($request, 1);
            }

            if (stripos($path, $request) === 0) {
                PluginManager::$noInit = true;
            }
        }

        /*
         * CLI
         */
        if (App::runningInConsole() && count(array_intersect($commands, Request::server('argv'))) > 0) {
            PluginManager::$noInit = true;
        }

    }

}
