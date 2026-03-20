<?php namespace System\Classes\SiteManager;

use App;
use System\Models\SiteDefinition;
use Closure;

/**
 * HasSiteContext
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasSiteContext
{
    /**
     * @var bool globalContext disables site filters globally.
     */
    protected $globalContext = false;

    /**
     * @var SiteDefinition|null siteContext overrides the current site context.
     */
    protected $siteContext = null;

    /**
     * getSiteIdFromContext
     * @return int|null
     */
    public function getSiteIdFromContext()
    {
        $site = $this->getSiteFromContext();

        if (!$site || !$site->id) {
            return null;
        }

        return (int) $site->id;
    }

    /**
     * getSiteGroupIdFromContext returns the site group id for the active site.
     * @return int
     */
    public function getSiteGroupIdFromContext()
    {
        $site = $this->getSiteFromContext();

        return (int) ($site->group_id ?? 1);
    }

    /**
     * getSiteCodeFromContext
     * @return string|null
     */
    public function getSiteCodeFromContext()
    {
        $site = $this->getSiteFromContext();

        if (!$site || !$site->code) {
            return null;
        }

        return (string) $site->code;
    }

    /**
     * getSiteFromContext
     * @return SiteDefinition
     */
    public function getSiteFromContext()
    {
        if ($this->siteContext !== null) {
            return $this->siteContext;
        }

        return App::runningInBackend()
            ? $this->getEditSite()
            : $this->getActiveSite();
    }

    /**
     * hasGlobalContext
     */
    public function hasGlobalContext(): bool
    {
        return $this->globalContext;
    }

    /**
     * withGlobalContext
     */
    public function withGlobalContext(Closure $callback)
    {
        $previous = $this->globalContext;

        $this->globalContext = true;

        try {
            return $callback();
        }
        finally {
            $this->globalContext = $previous;
        }
    }

    /**
     * withContext
     */
    public function withContext($siteId, Closure $callback)
    {
        $previous = $this->siteContext;

        $site = $this->getSiteFromId($siteId);

        if ($site) {
            $this->broadcastSiteChange($site->id);
        }

        try {
            $this->siteContext = $site;

            return $callback();
        }
        finally {
            $this->siteContext = $previous;

            if ($previousId = $this->getSiteIdFromContext()) {
                $this->broadcastSiteChange($previousId);
            }
        }
    }
}
