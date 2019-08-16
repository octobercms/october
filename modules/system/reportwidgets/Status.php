<?php namespace System\ReportWidgets;

use Lang;
use Config;
use BackendAuth;
use System\Models\Parameter;
use System\Models\LogSetting;
use System\Classes\UpdateManager;
use System\Classes\PluginManager;
use Backend\Classes\ReportWidgetBase;
use System\Models\EventLog;
use System\Models\RequestLog;
use System\Models\PluginVersion;
use Exception;

/**
 * System status report widget.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Status extends ReportWidgetBase
{
    /**
     * @var string A unique alias to identify this widget.
     */
    protected $defaultAlias = 'status';

    /**
     * Renders the widget.
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

    public function defineProperties()
    {
        return [
            'title' => [
                'title'             => 'backend::lang.dashboard.widget_title_label',
                'default'           => 'backend::lang.dashboard.status.widget_title_default',
                'type'              => 'string',
                'validationPattern' => '^.+$',
                'validationMessage' => 'backend::lang.dashboard.widget_title_error',
            ]
        ];
    }

    protected function loadData()
    {
        $manager = UpdateManager::instance();

        $this->vars['canUpdate'] = BackendAuth::getUser()->hasAccess('system.manage_updates');
        $this->vars['updates']   = $manager->check();
        $this->vars['warnings']  = $this->getSystemWarnings();
        $this->vars['coreBuild'] = Parameter::get('system::core.build');

        $this->vars['eventLog']      = EventLog::count();
        $this->vars['eventLogMsg']   = LogSetting::get('log_events', false) ? false : true;
        $this->vars['requestLog']    = RequestLog::count();
        $this->vars['requestLogMsg'] = LogSetting::get('log_requests', false) ? false : true;

        $this->vars['appBirthday'] = PluginVersion::orderBy('created_at')->value('created_at');
    }

    public function onLoadWarningsForm()
    {
        $this->vars['warnings'] = $this->getSystemWarnings();
        return $this->makePartial('warnings_form');
    }

    protected function getSystemWarnings()
    {
        $warnings = [];

        $missingPlugins = PluginManager::instance()->findMissingDependencies();

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

        if (in_array('Cms', Config::get('cms.loadModules', []))) {
            $writablePaths[] = themes_path();
        }

        if (Config::get('app.debug', true)) {
            $warnings[] = Lang::get('backend::lang.warnings.debug');
        }

        if (Config::get('develop.decompileBackendAssets', false)) {
            $warnings[] = Lang::get('backend::lang.warnings.decompileBackendAssets');
        }

        $requiredExtensions = [
            'GD'       => extension_loaded('gd'),
            'fileinfo' => extension_loaded('fileinfo'),
            'Zip'      => class_exists('ZipArchive'),
            'cURL'     => function_exists('curl_init') && defined('CURLOPT_FOLLOWLOCATION'),
            'OpenSSL'  => function_exists('openssl_random_pseudo_bytes'),
        ];

        foreach ($writablePaths as $path) {
            if (!is_writable($path)) {
                $warnings[] = Lang::get('backend::lang.warnings.permissions', ['name' => '<strong>'.$path.'</strong>']);
            }
        }

        foreach ($requiredExtensions as $extension => $installed) {
            if (!$installed) {
                $warnings[] = Lang::get('backend::lang.warnings.extension', ['name' => '<strong>'.$extension.'</strong>']);
            }
        }

        foreach ($missingPlugins as $pluginCode) {
            $warnings[] = Lang::get('backend::lang.warnings.plugin_missing', ['name' => '<strong>'.$pluginCode.'</strong>']);
        }

        return $warnings;
    }
}
