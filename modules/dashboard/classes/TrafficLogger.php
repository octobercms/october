<?php

namespace Dashboard\Classes;

use App;
use Str;
use Site;
use Event;
use Config;
use Cookie;
use Request;
use BackendAuth;
use Dashboard\Models\DashboardSetting;
use Dashboard\Models\TrafficStatisticsPageview;
use Carbon\Carbon;

/**
 * TrafficLogger logs pageviews for Internal Traffic Statistics.
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class TrafficLogger
{
    /**
     * @var \Dashboard\Models\DashboardSetting settingModel
     */
    protected $settingModel;

    /**
     * __construct this class
     */
    public function __construct()
    {
        $this->settingModel = DashboardSetting::instance();
    }

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('dashboard.traffic.logger');
    }

    /**
     * isEnabled checks if the Internal Traffic Statistics feature is enabled.
     * Returns true if the feature is enabled, and false otherwise.
     */
    public function isEnabled(): bool
    {
        return (bool) $this->settingModel->traffic_stats_enabled;
    }

    /**
     * getTimezone retrieves the timezone setting for the Internal Traffic Statistics feature.
     * If no specific timezone is set for the feature, it defaults to the general CMS timezone.
     * Returns the timezone identifier string.
     */
    public function getTimezone(): string
    {
        $result = $this->settingModel->traffic_stats_timezone;

        if (!$result) {
            $result = Config::get('cms.timezone') ?? Config::get('app.timezone');
        }

        return (string) $result;
    }

    /**
     * getRetentionMonths returns data retention, in months.
     * Returns the number of months or null for indefinite retention.
     */
    public function getRetentionMonths(): ?int
    {
        $retention = $this->settingModel->traffic_stats_retention;

        if ($retention && strlen($retention) && is_int($retention)) {
            return (int) $retention;
        }

        return null;
    }

    /**
     * logPageview logs a pageview for the Internal Traffic Statistics.
     * This method should be called whenever a page is viewed
     * to keep the statistics up-to-date. Creates a client
     * ID cookie if it doesn't exist.
     */
    public function logPageview()
    {
        if (!self::isEnabled()) {
            return;
        }

        if (Request::method() !== 'GET') {
            return;
        }

        if (Request::ajax() && !Request::pjax()) {
            return;
        }

        if ($this->settingModel->filter_exclude_bots && Request::isCrawler()) {
            return;
        }

        if ($this->isAdminRoleExcluded()) {
            return;
        }

        $referrer = Request::header('X-PJAX-REFERRER');
        if (!$referrer) {
            $referrer = Request::header('Referer');
        }

        $clientId = $this->getClientId();
        $firstTimeVisit = false;
        if (!$clientId) {
            $clientId = $this->generateClientId();
            $firstTimeVisit = true;
        }

        $evDateTime = $this->makeEventDateTime();

        $pageview = new TrafficStatisticsPageview;
        $pageview->user_authenticated = $this->isUserAuthenticated();
        $pageview->ev_datetime = $evDateTime->toDateTimeString();
        $pageview->ev_date = $evDateTime->toDateString();

        $pageview->ev_year_month_day = $evDateTime->toDateString();
        $pageview->ev_year = $evDateTime->copy()->startOfYear()->toDateString();
        $pageview->ev_year_quarter  = $evDateTime->copy()->startOfQuarter()->toDateString();
        $pageview->ev_year_month  = $evDateTime->copy()->startOfMonth()->toDateString();
        $pageview->ev_year_week  = $evDateTime->copy()->startOfWeek(Carbon::MONDAY)->toDateString();

        $pageview->client_id = $clientId;
        $pageview->first_time_visit = $firstTimeVisit;
        $pageview->user_agent = Str::substr((string) Request::header('User-Agent'), 0, 255);
        $pageview->ip = Str::substr((string) Request::ip(), 0, 255);
        $pageview->page_path = Str::substr((string) Request::path(), 0, 255);
        $pageview->referral_domain = Str::substr((string) parse_url($referrer ?: '', PHP_URL_HOST), 0, 255);
        $pageview->ev_timestamp = gmdate('Y-m-d H:i:s', time());

        if (Site::hasFeature('dashboard_traffic_statistics')) {
            $pageview->site_id = Site::getActiveSite()?->id;
        }

        $pageview->save();

        if (rand(1, 100) === 1) {
            TrafficStatisticsPageview::purgeOldRecords();
        }
    }

    /**
     * makeEventDateTime returns the current event date and time in the configured timezone.
     * Returns the event date and time string.
     */
    protected function makeEventDateTime(): Carbon
    {
        return Carbon::now($this->getTimezone());
    }

    /**
     * getClientId retrieves the client ID from the cookie. The client ID must have
     * a maximum length of 64, as enforced by the database.
     */
    protected function getClientId()
    {
        $value = Cookie::get('oc_clid');

        if (is_string($value)) {
            return substr($value, 0, 64);
        }

        return null;
    }

    /**
     * generateClientId generates a random client ID string.
     */
    protected function generateClientId(): string
    {
        $result = Str::random(32);

        Cookie::queue('oc_clid', $result, 60 * 24 * 365 * 5); // 5 years

        return $result;
    }

    /**
     * isUserAuthenticated checks if the user is currently authenticated. Returns
     * true if the user is authenticated, and false otherwise.
     */
    protected function isUserAuthenticated(): bool
    {
        /**
         * @event cms.internalTrafficStatistics.isUserAuthenticated
         * Verifies if there's a currently authenticated user.
         *
         * Example usage:
         *
         *     Event::listen('cms.internalTrafficStatistics.isUserAuthenticated', function() {
         *         return true;
         *     });
         *
         */
        $result = Event::fire('cms.internalTrafficStatistics.isUserAuthenticated', [], true);
        if ($result === true) {
            return $result;
        }

        return false;
    }

    /**
     * isAdminRoleExcluded determines if an administrator role is excluded
     */
    protected function isAdminRoleExcluded(): bool
    {
        if (!$this->settingModel->filter_exclude_roles) {
            return false;
        }

        $user = BackendAuth::getUser();
        if (!$user) {
            return false;
        }

        foreach ((array) $this->settingModel->filter_exclude_roles as $roleId) {
            if ($roleId === '*') {
                return true;
            }

            if ((int) $user->role_id === (int) $roleId) {
                return true;
            }
        }

        return false;
    }
}
