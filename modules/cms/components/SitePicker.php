<?php namespace Cms\Components;

use Cms;
use Site;
use Cms\Classes\Page;
use Cms\Classes\ComponentModuleBase;
use Exception;

/**
 * SitePicker component
 */
class SitePicker extends ComponentModuleBase
{
    /**
     * @var array sitesCache for multiple calls
     */
    protected $sitesCache;

    /**
     * @var array allSitesCache for multiple calls
     */
    protected $allSitesCache;

    /**
     * componentDetails
     * @return array
     */
    public function componentDetails()
    {
        return [
            'name' => 'Site Picker',
            'description' => 'Displays links for selecting a different site.',
            'icon' => 'icon-globe'
        ];
    }

    /**
     * isEnabled returns true if the site picker should be displayed
     */
    public function isEnabled()
    {
        return Site::hasMultiSite();
    }

    /**
     * sites lazily loads the available sites
     */
    public function sites()
    {
        return $this->sitesCache ??= $this->allSites()->inSiteGroup();
    }

    /**
     * allSites lazily loads the available sites
     */
    public function allSites()
    {
        if ($this->allSitesCache !== null) {
            return $this->allSitesCache;
        }

        $sites = $this->cloneSites(Site::listEnabled());

        foreach ($sites as $site) {
            $site->setUrlOverride(Cms::siteUrl(
                $this->getPage(),
                $site,
                $this->getRouter()->getParameters()
            ));
        }

        return $this->allSitesCache = $sites;
    }

    /**
     * pageSites returns a CMS page for all available sites
     */
    public function pageSites($pageName, $params = [])
    {
        try {
            $page = Page::loadCached($this->getTheme(), $pageName);
            if (!$page) {
                return [];
            }
        }
        catch (Exception $ex) {
            return [];
        }

        $sites = $this->cloneSites(Site::listEnabled());

        foreach ($sites as $site) {
            $site->setUrlOverride(Cms::siteUrl($page, $site, (array) $params));
        }

        return $sites;
    }

    /**
     * cloneSites so a URL override set here does not leak into the shared
     * site definitions used elsewhere in the request
     */
    protected function cloneSites($sites)
    {
        return $sites->map(function ($site) {
            return clone $site;
        });
    }
}
