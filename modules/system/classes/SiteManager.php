<?php namespace System\Classes;

use App;
use Event;
use Config;
use Manifest;
use System\Models\SiteGroup;
use System\Models\SiteDefinition;
use October\Rain\Extension\Extendable;
use Exception;

/**
 * SiteManager class manages sites
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SiteManager extends Extendable
{
    use \October\Rain\Support\Traits\Emitter;
    use \System\Classes\SiteManager\HasEditSite;
    use \System\Classes\SiteManager\HasActiveSite;
    use \System\Classes\SiteManager\HasSiteContext;
    use \System\Classes\SiteManager\HasPreferredLanguage;

    /**
     * @var string keys for manifest storage
     */
    const MANIFEST_SITES = 'sites.all';

    /**
     * @var array sites collection of sites
     */
    protected $sites;

    /**
     * @var array siteIdCache caches sites by their identifier
     */
    protected $siteIdCache = [];

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('system.sites');
    }

    /**
     * hasFeature returns true if a multisite feature is enabled
     */
    public function hasFeature(?string $name = null): bool
    {
        if (!Config::get('multisite.enabled', true)) {
            return false;
        }

        if (!$name) {
            return true;
        }

        return (bool) Config::get("multisite.features.{$name}", false);
    }

    /**
     * getSiteFromRequest locates the site based on the hostname and URI
     */
    public function getSiteFromRequest(string $rootUrl, string $uri)
    {
        $sites = $this->listEnabled();
        $host = parse_url($rootUrl, PHP_URL_HOST);

        // Matching either the hostname or app URL
        $sites = $sites->filter(function($site) use ($host, $rootUrl) {
            return $site->is_host_restricted
                ? $site->matchesHostname($host)
                : $site->matchesBaseUrl($rootUrl);
        });

        // Begin fallback matching
        $rootSites = $sites;

        // Matching to the route prefix
        $sites = $sites->filter(function($site) use ($uri) {
            return $site->matchesRoutePrefix($uri);
        });

        // With multiples, handle prefix collisions
        if ($sites->count() > 1) {
            $sites = $sites->sortByDesc(function($site) {
                return $site->is_prefixed ? $site->route_prefix : '';
            });
        }

        // Found a root host match without any valid prefix
        if ($rootSites->count() > 0 && $sites->count() === 0) {
            $sites = $rootSites->each(function($site) {
                $site->isFallbackMatch = true;
            });
        }

        return $sites->first();
    }

    /**
     * getSiteFromId
     */
    public function getSiteFromId($id)
    {
        if (isset($this->siteIdCache[$id])) {
            return $this->siteIdCache[$id];
        }

        return $this->siteIdCache[$id] = $this->listSites()->find($id);
    }

    /**
     * getPrimarySite
     */
    public function getPrimarySite()
    {
        return $this->listSites()->isPrimary()->first();
    }

    /**
     * getAnySite returns any site, with priority to primary
     */
    public function getAnySite()
    {
        return $this->getPrimarySite() ?: $this->listEnabled()->first();
    }

    /**
     * hasAnySite returns true if there is a frontend
     */
    public function hasAnySite(): bool
    {
        return $this->listEnabled()->count() > 0;
    }

    /**
     * hasMultiSite returns true if there are multiple sites
     */
    public function hasMultiSite(): bool
    {
        return $this->listEnabled()->count() > 1;
    }

    /**
     * hasSiteGroups
     */
    public function hasSiteGroups(): bool
    {
        return $this->listSites()->where('group', '<>', null)->unique('group')->count() > 1;
    }

    /**
     * listEnabled
     */
    public function listEnabled()
    {
        return $this->listSites()->isEnabled();
    }

    /**
     * listSites
     */
    public function listSites()
    {
        if ($this->sites !== null) {
            return $this->sites;
        }

        if (Manifest::has(self::MANIFEST_SITES)) {
            $this->sites = $this->listSitesFromManifest(
                (array) Manifest::get(self::MANIFEST_SITES)
            );
        }
        else {
            try {
                $this->sites = SiteDefinition::with('group')->get();
            }
            catch (Exception $ex) {
                return new SiteCollection([SiteDefinition::makeFallbackInstance()]);
            }

            Manifest::put(
                self::MANIFEST_SITES,
                $this->listSitesForManifest($this->sites)
            );
        }

        return $this->sites;
    }

    /**
     * listSiteIds
     */
    public function listSiteIds()
    {
        return $this->listSites()->pluck('id')->all();
    }

    /**
     * listSiteIdsInGroup
     */
    public function listSiteIdsInGroup($siteId = null)
    {
        return $this->listSites()->inSiteGroup($siteId)->pluck('id')->all();
    }

    /**
     * listSiteIdsInLocale
     */
    public function listSiteIdsInLocale($siteId = null)
    {
        return $this->listSites()->inSiteLocale($siteId)->pluck('id')->all();
    }

    /**
     * listSitesFromManifest
     */
    protected function listSitesFromManifest($sites)
    {
        $items = [];

        foreach ($sites as $attributes) {
            $group = null;
            if ($groupAttrs = array_pull($attributes, 'group')) {
                $group = new SiteGroup;
                $group->attributes = $groupAttrs;
                $group->syncOriginal();
            }

            $site = new SiteDefinition;
            $site->setRelation('group', $group);
            $site->attributes = $attributes;
            $site->syncOriginal();
            $items[] = $site;
        }

        return new SiteCollection($items);
    }

    /**
     * listSitesForManifest
     */
    protected function listSitesForManifest($sites)
    {
        $items = [];

        foreach ($sites as $site) {
            $store = $site->attributes;
            $store['group'] = $site->group ? $site->group->attributes : null;
            $items[] = $store;
        }

        return $items;
    }

    /**
     * broadcastSiteChange is a generic event used when the site changes
     */
    protected function broadcastSiteChange($siteId)
    {
        /**
         * @event site.changed
         * Fires when the site has been changed.
         *
         * Example usage:
         *
         *     Event::listen('site.changed', function($id) {
         *         \Log::info("Site has been changed to $id");
         *     });
         *
         */
        Event::fire('site.changed', [$siteId]);
    }

    /**
     * resetCache resets any memory or cache involved with the sites
     */
    public function resetCache()
    {
        $this->sites = null;
        $this->siteIdCache = [];
        Manifest::forget(self::MANIFEST_SITES);
    }

    /**
     * @deprecated
     */
    public function listSiteIdsInContext()
    {
        return $this->listSiteIdsInGroup();
    }

    /**
     * isModelMultisite returns true if the model implements multisite. If an
     * attribute it will check that the attribute is multisite enabled (not propagated)
     */
    public function isModelMultisite($model, $attribute = null): bool
    {
        if (
            $model &&
            $model->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) &&
            $model->isMultisiteEnabled()
        ) {
            if ($attribute !== null && $model->isAttributePropagatable($attribute)) {
                return false;
            }

            return true;
        }

        return false;
    }
}
