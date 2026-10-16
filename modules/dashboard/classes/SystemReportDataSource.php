<?php namespace Dashboard\Classes;

use Db;
use Config;
use System;
use Backend;
use BackendAuth;
use Dashboard\Classes\ReportDimension;
use Dashboard\Classes\ReportData;
use Dashboard\Classes\ReportFetchDataResult;
use Dashboard\Classes\ReportFetchData;
use Dashboard\Classes\ReportDataSourceBase;
use System\Classes\PluginManager;
use System\Classes\UpdateManager;
use System\Models\RequestLog;
use System\Models\LogSetting;
use System\Models\EventLog;
use ForbiddenException;

/**
 * SystemReportDataSource providing the system information.
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class SystemReportDataSource extends ReportDataSourceBase
{
    /**
     * @var string DIMENSION_VERSION_INFORMATION
     */
    const DIMENSION_VERSION_INFORMATION = 'indicator@version_information';

    /**
     * @var string DIMENSION_SYSTEM_ISSUES
     */
    const DIMENSION_SYSTEM_ISSUES = 'indicator@system_issues';

    /**
     * @var string DIMENSION_EVENT_LOG
     */
    const DIMENSION_EVENT_LOG = 'indicator@event_log';

    /**
     * @var string DIMENSION_REQUEST_LOG
     */
    const DIMENSION_REQUEST_LOG = 'indicator@request_log';

    /**
     * __construct the data source
     */
    public function __construct()
    {
        ReportData::addIndicatorMetrics(
            $this->addCalculatedDimension(
                self::DIMENSION_VERSION_INFORMATION,
                "Core version information"
            )
            ->setDefaultWidgetConfig([
                'icon' => 'ph ph-package',
                'link_text' => __("View Available Updates"),
                'title' => __("System Build")
            ])
        );

        ReportData::addIndicatorMetrics(
            $this->addCalculatedDimension(
                self::DIMENSION_SYSTEM_ISSUES,
                "System Issues"
            )
            ->setDefaultWidgetConfig([
                'icon' => 'ph ph-gear-fine',
                'link_text' => __("View issues"),
                'title' => __("Configuration")
            ])
        );

        ReportData::addIndicatorMetrics(
            $this->addCalculatedDimension(
                self::DIMENSION_EVENT_LOG,
                "Event Log"
            )
            ->setDefaultWidgetConfig([
                'icon' => 'ph ph-bell-ringing',
                'link_text' => __("View event log"),
                'title' => __("Event Log")
            ])
        );

        ReportData::addIndicatorMetrics(
            $this->addCalculatedDimension(
                self::DIMENSION_REQUEST_LOG,
                "Request log"
            )
            ->setDefaultWidgetConfig([
                'icon' => 'ph ph-signpost',
                'link_text' => __("Bad requests"),
                'title' => __("Request Log")
            ])
        );
    }

    /**
     * onGetPopupData
     */
    protected function onGetPopupData()
    {
        if (!BackendAuth::getUser()?->isSuperUser()) {
            throw new ForbiddenException;
        }

        return [
            'title' => __("System Issues"),
            'content' => $this->makePartial('warnings', ['warnings' => $this->getSystemWarnings()])
        ];
    }

    /**
     * fetchData
     */
    protected function fetchData(ReportFetchData $data): ReportFetchDataResult
    {
        $result = new ReportFetchDataResult;

        if ($data->dimension->getCode() === self::DIMENSION_VERSION_INFORMATION) {
            return $this->getVersionInformationData($data->dimension, $result);
        }

        if ($data->dimension->getCode() === self::DIMENSION_SYSTEM_ISSUES) {
            return $this->getSystemIssuesData($data->dimension, $result);
        }

        if ($data->dimension->getCode() === self::DIMENSION_EVENT_LOG) {
            return $this->getEventLogData($data->dimension, $result);
        }

        if ($data->dimension->getCode() === self::DIMENSION_REQUEST_LOG) {
            return $this->getRequestLogData($data->dimension, $result);
        }

        return $result;
    }

    /**
     * getVersionInformationData
     */
    protected function getVersionInformationData(ReportDimension $dimension, ReportFetchDataResult $result): ReportFetchDataResult
    {
        $updatesAvailable = UpdateManager::instance()->check() > 0;
        $iconStatus = $updatesAvailable
            ? ReportData::INDICATOR_ICON_STATUS_IMPORTANT
            : ReportData::INDICATOR_ICON_STATUS_INFO;

        $iconComplication = $updatesAvailable
            ? ReportData::INDICATOR_ICON_COMPLICATION_UP
            : null;

        $linkEnabled = BackendAuth::userHasAccess('general.backend.perform_updates');

        return $result->setRows($this->makeResultRow($dimension, [
            ReportData::METRIC_VALUE => UpdateManager::instance()->getCurrentVersion(),
            ReportData::METRIC_INDICATOR_ICON_STATUS => $iconStatus,
            ReportData::METRIC_INDICATOR_ICON_COMPLICATION => $iconComplication,
            ReportData::METRIC_LINK_ENABLED => $linkEnabled,
            ReportData::METRIC_LINK_HREF => Backend::url('system/updates')
        ]));
    }

    /**
     * getSystemIssuesData
     */
    protected function getSystemIssuesData(ReportDimension $dimension, ReportFetchDataResult $result)
    {
        $hasIssues = count($this->getSystemWarnings()) > 0;
        $value = $hasIssues
            ? __("Issues found")
            : __("No issues");

        $iconStatus = $hasIssues
            ? ReportData::INDICATOR_ICON_STATUS_IMPORTANT
            : ReportData::INDICATOR_ICON_STATUS_INFO;

        $user = BackendAuth::getUser();

        return $result->setRows($this->makeResultRow($dimension, [
            ReportData::METRIC_VALUE => $value,
            ReportData::METRIC_INDICATOR_ICON_STATUS => $iconStatus,
            ReportData::METRIC_LINK_ENABLED => $user->isSuperUser() && $hasIssues,
            ReportData::METRIC_LINK_HREF => ReportData::INDICATOR_HREF_POPUP
        ]));
    }

    /**
     * getEventLogData
     */
    protected function getEventLogData(ReportDimension $dimension, ReportFetchDataResult $result)
    {
        $logEnabled = (bool)LogSetting::get('log_events', false);
        $recordCnt = $logEnabled ? EventLog::count() : 0;

        $recordCnt = $recordCnt >= 1000
            ? round($recordCnt / 1000) . 'K'
            : number_format($recordCnt, 0);

        $logHasRecords = $logEnabled
            ? $recordCnt
            : __("Disabled");

        $iconStatus = $logEnabled
            ? ReportData::INDICATOR_ICON_STATUS_INFO
            : ReportData::INDICATOR_ICON_STATUS_DISABLED;

        return $result->setRows($this->makeResultRow($dimension, [
            ReportData::METRIC_VALUE => $logHasRecords,
            ReportData::METRIC_INDICATOR_ICON_STATUS => $iconStatus,
            ReportData::METRIC_LINK_ENABLED => BackendAuth::userHasAccess('utilities.logs'),
            ReportData::METRIC_LINK_HREF => Backend::url('system/eventlogs')
        ]));
    }

    /**
     * getRequestLogData
     */
    protected function getRequestLogData(ReportDimension $dimension, ReportFetchDataResult $result)
    {
        $logEnabled = (bool)LogSetting::get('log_requests', false);
        $recordCnt = $logEnabled ? RequestLog::count() : 0;

        $iconStatus = ReportData::INDICATOR_ICON_STATUS_INFO;

        if (!$logEnabled) {
            $iconStatus = ReportData::INDICATOR_ICON_STATUS_DISABLED;
        }
        elseif ($recordCnt > 0) {
            $iconStatus = ReportData::INDICATOR_ICON_STATUS_IMPORTANT;
        }

        $recordCnt = $recordCnt >= 1000 ? round($recordCnt / 1000) . 'K' : number_format($recordCnt, 0);

        $logHasRecords = $logEnabled
            ? $recordCnt
            : __("Disabled");

        return $result->setRows($this->makeResultRow($dimension, [
            ReportData::METRIC_VALUE => $logHasRecords,
            ReportData::METRIC_INDICATOR_ICON_STATUS => $iconStatus,
            ReportData::METRIC_LINK_ENABLED => BackendAuth::userHasAccess('utilities.logs'),
            ReportData::METRIC_LINK_HREF => Backend::url('system/requestlogs')
        ]));
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
