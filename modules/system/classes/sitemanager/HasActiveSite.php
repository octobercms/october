<?php namespace System\Classes\SiteManager;

use App;
use Cms;
use Event;
use Config;
use System\Models\SiteDefinition;

/**
 * HasActiveSite
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasActiveSite
{
    /**
     * applyActiveSiteId
     */
    public function applyActiveSiteId($id)
    {
        if ($site = $this->getSiteFromId($id)) {
            $this->applyActiveSite($site);
        }
    }

    /**
     * applyActiveSite applies active site configuration values to the application,
     * typically used for frontend requests.
     */
    public function applyActiveSite(SiteDefinition $site)
    {
        if ($site->theme) {
            if (Config::get('cms.original_theme') === null) {
                Config::set('cms.original_theme', Config::get('cms.active_theme'));
            }

            Config::set('cms.active_theme', $site->theme);
        }

        if ($site->locale) {
            if (Config::get('app.original_locale') === null) {
                Config::set('app.original_locale', Config::get('app.locale'));
            }

            App::setLocale($site->locale);

            if ($site->fallback_locale) {
                if (Config::get('app.original_fallback_locale') === null) {
                    Config::set('app.original_fallback_locale', Config::get('app.fallback_locale'));
                }

                App::setFallbackLocale($site->fallback_locale);
            }
        }

        if ($site->is_custom_url) {
            Config::set('app.url', $site->app_url);
        }

        if ($site->timezone) {
            Config::set('cms.timezone', $site->timezone);
        }

        if ($site->is_prefixed) {
            Cms::setUrlPrefix($site->route_prefix);
        }

        $this->setActiveSite($site);
    }

    /**
     * getActiveSite
     */
    public function getActiveSite()
    {
        return $this->getSiteFromId($this->getActiveSiteId())
            ?: $this->getPrimarySite();
    }

    /**
     * getActiveSiteId
     */
    public function getActiveSiteId()
    {
        return Config::get('system.active_site');
    }

    /**
     * setActiveSiteId
     */
    public function setActiveSiteId($id)
    {
        Config::set('system.active_site', $id);

        /**
         * @event system.site.setActiveSite
         * Fires when the active site has been changed.
         *
         * Example usage:
         *
         *     Event::listen('system.site.setActiveSite', function($id) {
         *         \Log::info("Site has been changed to $id");
         *     });
         *
         */
        Event::fire('system.site.setActiveSite', [$id]);

        $this->broadcastSiteChange($id);
    }

    /**
     * setActiveSite
     */
    public function setActiveSite($site)
    {
        $this->setActiveSiteId($site->id);
    }
}
