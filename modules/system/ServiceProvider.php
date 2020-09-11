<?php namespace System;

use Db;
use App;
use View;
use Event;
use Config;
use Backend;
use Request;
use BackendMenu;
use BackendAuth;
use Backend\Models\UserRole;
use Twig\Extension\SandboxExtension;
use Twig\Environment as TwigEnvironment;
use System\Classes\MailManager;
use System\Classes\ErrorHandler;
use System\Classes\MarkupManager;
use System\Classes\PluginManager;
use System\Classes\SettingsManager;
use System\Classes\UpdateManager;
use System\Twig\Engine as TwigEngine;
use System\Twig\Loader as TwigLoader;
use System\Twig\Extension as TwigExtension;
use System\Twig\SecurityPolicy as TwigSecurityPolicy;
use System\Models\EventLog;
use System\Models\MailSetting;
use System\Classes\CombineAssets;
use Backend\Classes\WidgetManager;
use October\Rain\Support\ModuleServiceProvider;
use October\Rain\Router\Helper as RouterHelper;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Schema;

class ServiceProvider extends ModuleServiceProvider
{
    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        parent::register('system');

        $this->registerSingletons();
        $this->registerPrivilegedActions();

        /*
         * Register all plugins
         */
        PluginManager::instance()->registerAll();

        $this->registerConsole();
        $this->registerErrorHandler();
        $this->registerLogging();
        $this->registerTwigParser();
        $this->registerMailer();
        $this->registerMarkupTags();
        $this->registerAssetBundles();
        $this->registerValidator();
        $this->registerGlobalViewVars();

        /*
         * Register other module providers
         */
        foreach (Config::get('cms.loadModules', []) as $module) {
            if (strtolower(trim($module)) != 'system') {
                App::register('\\' . $module . '\ServiceProvider');
            }
        }

        /*
         * Backend specific
         */
        if (App::runningInBackend()) {
            $this->registerBackendNavigation();
            $this->registerBackendReportWidgets();
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
        // Fix UTF8MB4 support for MariaDB < 10.2 and MySQL < 5.7
        $this->applyDatabaseDefaultStringLength();

        // Fix use of Storage::url() for local disks that haven't been configured correctly
        foreach (Config::get('filesystems.disks') as $key => $config) {
            if ($config['driver'] === 'local' && ends_with($config['root'], '/storage/app') && empty($config['url'])) {
                Config::set("filesystems.disks.$key.url", '/storage/app');
            }
        }

        Paginator::defaultSimpleView('system::pagination.simple-default');

        /*
         * Boot plugins
         */
        PluginManager::instance()->bootAll();

        parent::boot('system');
    }

    /**
     * Register singletons
     */
    protected function registerSingletons()
    {
        App::singleton('cms.helper', function () {
            return new \Cms\Helpers\Cms;
        });

        App::singleton('backend.helper', function () {
            return new \Backend\Helpers\Backend;
        });

        App::singleton('backend.menu', function () {
            return \Backend\Classes\NavigationManager::instance();
        });

        App::singleton('backend.auth', function () {
            return \Backend\Classes\AuthManager::instance();
        });
    }

    /**
     * Check for CLI or system/updates route and disable any plugin initialization
     */
    protected function registerPrivilegedActions()
    {
        $requests = ['/combine/', '@/system/updates', '@/system/install', '@/backend/auth'];
        $commands = ['october:up', 'october:update'];

        /*
         * Requests
         */
        $path = RouterHelper::normalizeUrl(Request::path());
        $backendUri = RouterHelper::normalizeUrl(Config::get('cms.backendUri', 'backend'));
        foreach ($requests as $request) {
            if (substr($request, 0, 1) == '@') {
                $request = $backendUri . substr($request, 1);
            }

            if (stripos($path, $request) === 0) {
                PluginManager::$noInit = true;
            }
        }

        /*
         * CLI
         */
        if (App::runningInConsole() && count(array_intersect($commands, Request::server('argv', []))) > 0) {
            PluginManager::$noInit = true;
        }
    }

    /*
     * Register markup tags
     */
    protected function registerMarkupTags()
    {
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
                'url_*'          => ['Url', '*'],
                'html_*'         => ['Html', '*'],
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
                'md_safe'        => ['Markdown', 'parseSafe'],
                'time_since'     => ['System\Helpers\DateTime', 'timeSince'],
                'time_tense'     => ['System\Helpers\DateTime', 'timeTense'],
            ]);
        });
    }

    /**
     * Register command line specifics
     */
    protected function registerConsole()
    {
        /*
         * Allow plugins to use the scheduler
         */
        Event::listen('console.schedule', function ($schedule) {
            // Fix initial system migration with plugins that use settings for scheduling - see #3208
            if (App::hasDatabase() && !Schema::hasTable(UpdateManager::instance()->getMigrationTableName())) {
                return;
            }

            $plugins = PluginManager::instance()->getPlugins();
            foreach ($plugins as $plugin) {
                if (method_exists($plugin, 'registerSchedule')) {
                    $plugin->registerSchedule($schedule);
                }
            }
        });

        /*
         * Add CMS based cache clearing to native command
         */
        Event::listen('cache:cleared', function () {
            \System\Helpers\Cache::clearInternal();
        });

        /*
         * Register console commands
         */
        $this->registerConsoleCommand('october.up', 'System\Console\OctoberUp');
        $this->registerConsoleCommand('october.down', 'System\Console\OctoberDown');
        $this->registerConsoleCommand('october.update', 'System\Console\OctoberUpdate');
        $this->registerConsoleCommand('october.util', 'System\Console\OctoberUtil');
        $this->registerConsoleCommand('october.mirror', 'System\Console\OctoberMirror');
        $this->registerConsoleCommand('october.fresh', 'System\Console\OctoberFresh');
        $this->registerConsoleCommand('october.env', 'System\Console\OctoberEnv');
        $this->registerConsoleCommand('october.install', 'System\Console\OctoberInstall');
        $this->registerConsoleCommand('october.passwd', 'System\Console\OctoberPasswd');

        $this->registerConsoleCommand('plugin.install', 'System\Console\PluginInstall');
        $this->registerConsoleCommand('plugin.remove', 'System\Console\PluginRemove');
        $this->registerConsoleCommand('plugin.disable', 'System\Console\PluginDisable');
        $this->registerConsoleCommand('plugin.enable', 'System\Console\PluginEnable');
        $this->registerConsoleCommand('plugin.refresh', 'System\Console\PluginRefresh');
        $this->registerConsoleCommand('plugin.rollback', 'System\Console\PluginRollback');
        $this->registerConsoleCommand('plugin.list', 'System\Console\PluginList');

        $this->registerConsoleCommand('theme.install', 'System\Console\ThemeInstall');
        $this->registerConsoleCommand('theme.remove', 'System\Console\ThemeRemove');
        $this->registerConsoleCommand('theme.list', 'System\Console\ThemeList');
        $this->registerConsoleCommand('theme.use', 'System\Console\ThemeUse');
        $this->registerConsoleCommand('theme.sync', 'System\Console\ThemeSync');
    }

    /*
     * Error handling for uncaught Exceptions
     */
    protected function registerErrorHandler()
    {
        Event::listen('exception.beforeRender', function ($exception, $httpCode, $request) {
            $handler = new ErrorHandler;
            return $handler->handleException($exception);
        });
    }

    /*
     * Write all log events to the database
     */
    protected function registerLogging()
    {
        Event::listen(\Illuminate\Log\Events\MessageLogged::class, function ($event) {
            if (EventLog::useLogging()) {
                EventLog::add($event->message, $event->level);
            }
        });
    }

    /*
     * Register text twig parser
     */
    protected function registerTwigParser()
    {
        /*
         * Register system Twig environment
         */
        App::singleton('twig.environment', function ($app) {
            $twig = new TwigEnvironment(new TwigLoader, ['auto_reload' => true]);
            $twig->addExtension(new TwigExtension);
            $twig->addExtension(new SandboxExtension(new TwigSecurityPolicy, true));
            return $twig;
        });

        /*
         * Register .htm extension for Twig views
         */
        App::make('view')->addExtension('htm', 'twig', function () {
            return new TwigEngine(App::make('twig.environment'));
        });
    }

    /**
     * Register mail templating and settings override.
     */
    protected function registerMailer()
    {
        /*
         * Register system layouts
         */
        MailManager::instance()->registerCallback(function ($manager) {
            $manager->registerMailLayouts([
                'default' => 'system::mail.layout-default',
                'system' => 'system::mail.layout-system',
            ]);

            $manager->registerMailPartials([
                'header' => 'system::mail.partial-header',
                'footer' => 'system::mail.partial-footer',
                'button' => 'system::mail.partial-button',
                'panel' => 'system::mail.partial-panel',
                'table' => 'system::mail.partial-table',
                'subcopy' => 'system::mail.partial-subcopy',
                'promotion' => 'system::mail.partial-promotion',
            ]);
        });

        /*
         * Override system mailer with mail settings
         */
        Event::listen('mailer.beforeRegister', function () {
            if (MailSetting::isConfigured()) {
                MailSetting::applyConfigValues();
            }
        });

        /*
         * Override standard Mailer content with template
         */
        Event::listen('mailer.beforeAddContent', function ($mailer, $message, $view, $data, $raw, $plain) {
            $method = $raw === null ? 'addContentToMailer' : 'addRawContentToMailer';
            $plainOnly = $view === null; // When "plain-text only" email is sent, $view is null, this sets the flag appropriately
            return !MailManager::instance()->$method($message, $raw ?: $view ?: $plain, $data, $plainOnly);
        });
    }

    /*
     * Register navigation
     */
    protected function registerBackendNavigation()
    {
        BackendMenu::registerCallback(function ($manager) {
            $manager->registerMenuItems('October.System', [
                'system' => [
                    'label'       => 'system::lang.settings.menu_label',
                    'icon'        => 'icon-cog',
                    'iconSvg'     => 'modules/system/assets/images/cog-icon.svg',
                    'url'         => Backend::url('system/settings'),
                    'permissions' => [],
                    'order'       => 1000
                ]
            ]);
        });

        /*
         * Register the sidebar for the System main menu
         */
        BackendMenu::registerContextSidenavPartial(
            'October.System',
            'system',
            '~/modules/system/partials/_system_sidebar.htm'
        );

        /*
         * Remove the October.System.system main menu item if there is no subpages to display
         */
        Event::listen('backend.menu.extendItems', function ($manager) {
            $systemSettingItems = SettingsManager::instance()->listItems('system');
            $systemMenuItems = $manager->listSideMenuItems('October.System', 'system');

            if (empty($systemSettingItems) && empty($systemMenuItems)) {
                $manager->removeMainMenuItem('October.System', 'system');
            }
        }, -9999);
    }

    /*
     * Register report widgets
     */
    protected function registerBackendReportWidgets()
    {
        WidgetManager::instance()->registerReportWidgets(function ($manager) {
            $manager->registerReportWidget(\System\ReportWidgets\Status::class, [
                'label'   => 'backend::lang.dashboard.status.widget_title_default',
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
            $manager->registerPermissions('October.System', [
                'system.manage_updates' => [
                    'label' => 'system::lang.permissions.manage_software_updates',
                    'tab' => 'system::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                ],
                'system.access_logs' => [
                    'label' => 'system::lang.permissions.access_logs',
                    'tab' => 'system::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                ],
                'system.manage_mail_settings' => [
                    'label' => 'system::lang.permissions.manage_mail_settings',
                    'tab' => 'system::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                ],
                'system.manage_mail_templates' => [
                    'label' => 'system::lang.permissions.manage_mail_templates',
                    'tab' => 'system::lang.permissions.name',
                    'roles' => UserRole::CODE_DEVELOPER,
                ]
            ]);
        });
    }

    /*
     * Register settings
     */
    protected function registerBackendSettings()
    {
        Event::listen('system.settings.extendItems', function ($manager) {
            \System\Models\LogSetting::filterSettingItems($manager);
        });

        SettingsManager::instance()->registerCallback(function ($manager) {
            $manager->registerSettingItems('October.System', [
                'updates' => [
                    'label'       => 'system::lang.updates.menu_label',
                    'description' => 'system::lang.updates.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-cloud-download',
                    'url'         => Backend::url('system/updates'),
                    'permissions' => ['system.manage_updates'],
                    'order'       => 300
                ],
                'administrators' => [
                    'label'       => 'backend::lang.user.menu_label',
                    'description' => 'backend::lang.user.menu_description',
                    'category'    => SettingsManager::CATEGORY_SYSTEM,
                    'icon'        => 'icon-users',
                    'url'         => Backend::url('backend/users'),
                    'permissions' => ['backend.manage_users'],
                    'order'       => 400
                ],
                'mail_templates' => [
                    'label'       => 'system::lang.mail_templates.menu_label',
                    'description' => 'system::lang.mail_templates.menu_description',
                    'category'    => SettingsManager::CATEGORY_MAIL,
                    'icon'        => 'icon-envelope-square',
                    'url'         => Backend::url('system/mailtemplates'),
                    'permissions' => ['system.manage_mail_templates'],
                    'order'       => 610
                ],
                'mail_settings' => [
                    'label'       => 'system::lang.mail.menu_label',
                    'description' => 'system::lang.mail.menu_description',
                    'category'    => SettingsManager::CATEGORY_MAIL,
                    'icon'        => 'icon-envelope',
                    'class'       => 'System\Models\MailSetting',
                    'permissions' => ['system.manage_mail_settings'],
                    'order'       => 620
                ],
                'mail_brand_settings' => [
                    'label'       => 'system::lang.mail_brand.menu_label',
                    'description' => 'system::lang.mail_brand.menu_description',
                    'category'    => SettingsManager::CATEGORY_MAIL,
                    'icon'        => 'icon-paint-brush',
                    'url'         => Backend::url('system/mailbrandsettings'),
                    'permissions' => ['system.manage_mail_templates'],
                    'order'       => 630
                ],
                'event_logs' => [
                    'label'       => 'system::lang.event_log.menu_label',
                    'description' => 'system::lang.event_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-exclamation-triangle',
                    'url'         => Backend::url('system/eventlogs'),
                    'permissions' => ['system.access_logs'],
                    'order'       => 900,
                    'keywords'    => 'error exception'
                ],
                'request_logs' => [
                    'label'       => 'system::lang.request_log.menu_label',
                    'description' => 'system::lang.request_log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-file-o',
                    'url'         => Backend::url('system/requestlogs'),
                    'permissions' => ['system.access_logs'],
                    'order'       => 910,
                    'keywords'    => '404 error'
                ],
                'log_settings' => [
                    'label'       => 'system::lang.log.menu_label',
                    'description' => 'system::lang.log.menu_description',
                    'category'    => SettingsManager::CATEGORY_LOGS,
                    'icon'        => 'icon-dot-circle-o',
                    'class'       => 'System\Models\LogSetting',
                    'permissions' => ['system.manage_logs'],
                    'order'       => 990
                ],
            ]);
        });
    }

    /**
     * Register asset bundles
     */
    protected function registerAssetBundles()
    {
        /*
         * Register asset bundles
         */
        CombineAssets::registerCallback(function ($combiner) {
            $combiner->registerBundle('~/modules/system/assets/less/styles.less');
            $combiner->registerBundle('~/modules/system/assets/ui/storm.less');
            $combiner->registerBundle('~/modules/system/assets/ui/storm.js');
            $combiner->registerBundle('~/modules/system/assets/js/framework.js');
            $combiner->registerBundle('~/modules/system/assets/js/framework.combined.js');
            $combiner->registerBundle('~/modules/system/assets/css/framework.extras.css');
        });
    }

    /**
     * Extends the validator with custom rules
     */
    protected function registerValidator()
    {
        $this->app->resolving('validator', function ($validator) {
            /*
             * Allowed file extensions, as opposed to mime types.
             * - extensions: png,jpg,txt
             */
            $validator->extend('extensions', function ($attribute, $value, $parameters) {
                $extension = strtolower($value->getClientOriginalExtension());
                return in_array($extension, $parameters);
            });

            $validator->replacer('extensions', function ($message, $attribute, $rule, $parameters) {
                return strtr($message, [':values' => implode(', ', $parameters)]);
            });
        });
    }

    protected function registerGlobalViewVars()
    {
        View::share('appName', Config::get('app.name'));
    }

    /**
     * Fix UTF8MB4 support for old versions of MariaDB (<10.2) and MySQL (<5.7)
     */
    protected function applyDatabaseDefaultStringLength()
    {
        if (Db::getDriverName() !== 'mysql') {
            return;
        }

        $defaultStrLen = Db::getConfig('varcharmax');

        if ($defaultStrLen === null && Db::getConfig('charset') === 'utf8mb4') {
            $defaultStrLen = 191;
        }

        if ($defaultStrLen !== null) {
            Schema::defaultStringLength((int) $defaultStrLen);
        }
    }
}
