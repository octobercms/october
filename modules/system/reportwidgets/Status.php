<?php namespace System\ReportWidgets;

use Db;
use Config;
use System;
use BackendAuth;
use System\Models\LogSetting;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Backend\Classes\ReportWidgetBase;
use System\Models\EventLog;
use System\Models\RequestLog;
use System\Models\PluginVersion;
use Exception;

/**
 * Status report widget for reporting on the system status
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Status extends ReportWidgetBase
{
    /**
     * @var string defaultAlias is a unique alias to identify this widget.
     */
    protected $defaultAlias = 'status';

    /**
     * render the widget
     */
    public function render()
    {
        try {
            $this->loadData();
        }
        catch (Exception $ex) {
            $this->vars['error'] = $ex->getMessage();
        }

        return $this->makePartial('widget');
    }

    /**
     * defineProperties
     */
    public function defineProperties()
    {
        return [
            'title' => [
                'title' => "Widget title",
                'default' => "System status",
                'type' => 'string',
                'validationPattern' => '^.+$',
                'validationMessage' => "The Widget Title is required.",
            ]
        ];
    }

    /**
     * loadData
     */
    protected function loadData()
    {
        $this->vars['canUpdate'] = BackendAuth::userHasAccess('general.backend.perform_updates');
        $this->vars['updates'] = UpdateManager::instance()->check();
        $this->vars['warnings'] = $this->getSystemWarnings();
        $this->vars['coreBuild'] = UpdateManager::instance()->getCurrentVersion();

        $this->vars['eventLog'] = EventLog::count();
        $this->vars['eventLogMsg'] = LogSetting::get('log_events', false) ? false : true;
        $this->vars['requestLog'] = RequestLog::count();
        $this->vars['requestLogMsg'] = LogSetting::get('log_requests', false) ? false : true;

        $this->vars['appBirthday'] = PluginVersion::orderBy('created_at')->value('created_at');
    }

    /**
     * onLoadWarningsForm
     */
    public function onLoadWarningsForm()
    {
        $this->vars['warnings'] = $this->getSystemWarnings();
        return $this->makePartial('warnings_form');
    }

    /**
     * getSystemWarnings
     */
    protected function getSystemWarnings()
    {
        return array_merge(
            $this->getSecurityWarnings(),
            $this->getExtensionWarnings(),
            $this->getPluginWarnings(),
            $this->getPathWarnings()
        );
    }

    /**
     * getSecurityWarnings
     */
    protected function getSecurityWarnings(): array
    {
        $warnings = [];

        if (Config::get('app.debug', true)) {
            $warnings[] = __("Debug mode is enabled. This is not recommended for production installations.");
        }

        $backendUris = [
            'backend',
            'back-end',
            'login',
            'admin',
            'administration',
        ];

        $configUri = trim(ltrim((string) Config::get('backend.uri'), '/'));
        foreach ($backendUris as $uri) {
            if ($uri === $configUri) {
                $warnings[] = __("The backend URL :name is too generic. Please set to something more unique.", ['name' => '<strong>/'.$configUri.'</strong>']);
                break;
            }
        }

        $backendLogins = [
            'guest',
            'admin',
            'administrator',
            'root',
            'user'
        ];

        $foundLogins = Db::table('backend_users')->whereIn('login', $backendLogins)->pluck('login')->all();
        foreach ($foundLogins as $login) {
            $warnings[] = __("An account with a generic login :name was found. Please rename this administrator account.", ['name' => '<strong>'.$login.'</strong>']);
        }

        return $warnings;
    }

    /**
     * getExtensionWarnings
     */
    protected function getExtensionWarnings(): array
    {
        $warnings = [];
        $requiredExtensions = [
            'GD' => extension_loaded('gd'),
            'fileinfo' => extension_loaded('fileinfo'),
            'Zip' => class_exists('ZipArchive'),
            'cURL' => function_exists('curl_init') && defined('CURLOPT_FOLLOWLOCATION'),
            'OpenSSL' => function_exists('openssl_random_pseudo_bytes'),
        ];

        foreach ($requiredExtensions as $extension => $installed) {
            if (!$installed) {
                $warnings[] = __("The PHP extension :name is not installed. Please install this library and activate the extension.", ['name' => '<strong>'.$extension.'</strong>']);
            }
        }

        return $warnings;
    }

    /**
     * getPluginWarnings
     */
    protected function getPluginWarnings(): array
    {
        $warnings = [];
        $missingPlugins = PluginManager::instance()->findMissingDependencies();

        foreach ($missingPlugins as $pluginCode) {
            $warnings[] = __("The plugin :name is a dependency but is not installed. Please install this plugin.", ['name' => '<strong>'.$pluginCode.'</strong>']);
        }

        return $warnings;
    }

    /**
     * getPathWarnings
     */
    protected function getPathWarnings(): array
    {
        $warnings = [];
        $writablePaths = [
            temp_path(),
            storage_path(),
            storage_path('app'),
            storage_path('logs'),
            storage_path('framework'),
            storage_path('cms'),
            storage_path('cms/cache'),
            storage_path('cms/twig'),
            storage_path('cms/combiner'),
        ];

        if (System::hasModule('Cms')) {
            $writablePaths[] = themes_path();
        }

        foreach ($writablePaths as $path) {
            if (!is_writable($path)) {
                $warnings[] = __("Directory :name or its subdirectories is not writable for PHP. Please set corresponding permissions for the webserver on this directory.", ['name' => '<strong>'.$path.'</strong>']);
            }
        }

        return $warnings;
    }
}
