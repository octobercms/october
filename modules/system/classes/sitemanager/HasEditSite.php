<?php namespace System\Classes\SiteManager;

use Cms;
use Event;
use Cookie;
use Config;
use BackendAuth;
use Backend\Models\UserPreference;
use System\Models\SiteDefinition;

/**
 * HasEditSite
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasEditSite
{
    /**
     * @var mixed editSiteCache
     */
    protected $editSiteCache;

    /**
     * getEditSiteFromRequest resolves the edit site from the current request
     * by checking cookie, user preference, and falling back to any edit site.
     */
    public function getEditSiteFromRequest()
    {
        /**
         * @event system.site.getEditSite
         * Overrides the edit site object.
         *
         * If a value is returned from this halting event, it will be used as the edit
         * site object. Example usage:
         *
         *     Event::listen('system.site.getEditSite', function() {
         *         return SiteDefinition::find(1);
         *     });
         *
         */
        $apiResult = Event::fire('system.site.getEditSite', [], true);
        if ($apiResult !== null) {
            return $apiResult;
        }

        $id = Cookie::get('admin_site');

        if (!$id && BackendAuth::getUser()) {
            $id = UserPreference::forUser()->get('system::site.edit', null);
        }

        if (!$id) {
            return $this->getAnyEditSite();
        }

        return $this->getSiteFromId($id) ?: $this->getAnyEditSite();
    }

    /**
     * applyEditSiteId
     */
    public function applyEditSiteId($id)
    {
        if ($site = $this->getSiteFromId($id)) {
            $this->applyEditSite($site);
        }
    }

    /**
     * applyEditSite applies edit site configuration values to the application,
     * typically used for backend requests.
     */
    public function applyEditSite(SiteDefinition $site)
    {
        if ($site->theme) {
            Config::set('cms.edit_theme', $site->theme);
        }

        if ($site->is_prefixed) {
            Cms::setUrlPrefix($site->route_prefix);
        }

        $this->setEditSite($site);
    }

    /**
     * getEditSite returns the edit theme
     */
    public function getEditSite()
    {
        if ($this->editSiteCache !== null) {
            return $this->editSiteCache;
        }

        $editSite = $this->getSiteFromId($this->getEditSiteId());

        if (!$editSite || !$editSite->matchesRole(BackendAuth::getUser())) {
            $editSite = $this->getAnyEditSite();
        }

        return $this->editSiteCache = $editSite;
    }

    /**
     * getEditSiteId
     */
    public function getEditSiteId()
    {
        return Config::get('system.edit_site');
    }

    /**
     * hasAnyEditSite returns true if there are edit sites
     */
    public function getAnyEditSite()
    {
        return $this->listEditEnabled()->isPrimary()->first()
            ?: $this->listEditEnabled()->first();
    }

    /**
     * hasAnyEditSite returns true if there are edit sites
     */
    public function hasAnyEditSite(): bool
    {
        return $this->listEditSites()->isEnabledEdit()->count() > 0;
    }

    /**
     * hasMultiEditSite returns true if there are multiple sites for editing
     */
    public function hasMultiEditSite(): bool
    {
        return $this->listEditSites()->isEnabledEdit()->count() > 1;
    }

    /**
     * listEditEnabled
     */
    public function listEditEnabled()
    {
        return $this->listEditSites()->isEnabledEdit();
    }

    /**
     * listEditSites
     */
    public function listEditSites()
    {
        return $this->listSites()->filter(function($site) {
            return $site->matchesRole(BackendAuth::getUser());
        });
    }

    /**
     * setEditSiteId
     */
    public function setEditSiteId($id)
    {
        $this->editSiteCache = null;

        Config::set('system.edit_site', $id);

        /**
         * @event system.site.setEditSite
         * Fires when the edit site has been changed.
         *
         * Example usage:
         *
         *     Event::listen('system.site.setEditSite', function($id) {
         *         \Log::info("Site has been changed to $id");
         *     });
         *
         */
        Event::fire('system.site.setEditSite', [$id]);

        $this->broadcastSiteChange($id);
    }

    /**
     * setEditSite
     */
    public function setEditSite($site)
    {
        $this->setEditSiteId($site->id);
    }

    /**
     * storeEditSitePreference persists the edit site selection to user
     * preference and cookie when the user actively switches sites.
     */
    public function storeEditSitePreference($id)
    {
        UserPreference::forUser()->set('system::site.edit', $id);

        Cookie::queue(Cookie::forever('admin_site', $id));

        $this->resetCache();

        /**
         * @event system.site.setEditSite
         * Fires when the edit site has been changed.
         *
         * Example usage:
         *
         *     Event::listen('system.site.setEditSite', function($id) {
         *         \Log::info("Site has been changed to $id");
         *     });
         *
         */
        Event::fire('system.site.setEditSite', [$id]);
    }
}
