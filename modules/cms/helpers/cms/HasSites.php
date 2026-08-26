<?php namespace Cms\Helpers\Cms;

use Site;
use Event;
use Cms\Classes\Page;
use System\Models\SiteDefinition;
use October\Rain\Router\Router as RainRouter;

/**
 * HasSites
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasSites
{
    /**
     * siteUrl returns a URL for a CMS page, this is similar to pageUrl except
     * supports a different site context.
     */
    public function siteUrl(Page $page, SiteDefinition $site, array $parameters = [])
    {
        $pattern = $this->getPatternFromPage($page, $site);

        $url = $this->withPreservedQueryString(
            $this->getUrlFromPattern($pattern, $page, $site, $parameters),
            $page,
            $site
        );

        return $url;
    }

    /**
     * getPatternFromPage
     */
    protected function getPatternFromPage(Page $page, SiteDefinition $site): string
    {
        $pattern = $page->getTranslatableUrl($site) ?: $page->url;

        /**
         * @event cms.sitePicker.overridePattern
         * Enables manipulating the URL route pattern
         *
         * You will have access to the page object, the old and new locale and the URL pattern.
         *
         * Example usage:
         *
         *     Event::listen('cms.sitePicker.overridePattern', function($page, $pattern, $currentSite, $proposedSite) {
         *        if ($page->baseFileName == 'your-page-filename') {
         *             return YourModel::overridePattern($pattern, $currentSite, $proposedSite);
         *         }
         *     });
         *
         */
        $translatedPattern = Event::fire('cms.sitePicker.overridePattern', [
            $page,
            $pattern,
            Site::getActiveSite(),
            $site
        ], true);

        if ($translatedPattern) {
            $pattern = $translatedPattern;
        }

        return $pattern;
    }

    /**
     * getUrlFromPattern
     */
    protected function getUrlFromPattern(string $urlPattern, Page $page, SiteDefinition $site, array $parameters): string
    {
        /**
         * @event cms.sitePicker.overrideParams
         * Enables manipulating the URL parameters
         *
         * You will have access to the page object, the old and new locale and the URL parameters.
         *
         * Example usage:
         *
         *     Event::listen('cms.sitePicker.overrideParams', function($page, $params, $currentSite, $proposedSite) {
         *        if ($page->baseFileName == 'your-page-filename') {
         *             return YourModel::overrideParams($params, $currentSite, $proposedSite);
         *         }
         *     });
         *
         */
        $translatedParams = Event::fire('cms.sitePicker.overrideParams', [
            $page,
            $parameters,
            Site::getActiveSite(),
            $site
        ], true);

        if ($translatedParams) {
            $parameters = $translatedParams;
        }

        $router = new RainRouter;

        $path = $router->urlFromPattern($urlPattern, $parameters);

        return rtrim($site->base_url . $path, '/');
    }

    /**
     * withPreservedQueryString makes sure to add any existing query string to the redirect url.
     */
    protected function withPreservedQueryString(string $url, Page $page, SiteDefinition $site): string
    {
        $query = get();

        /**
         * @event cms.sitePicker.overrideQuery
         * Enables manipulating the URL query parameters
         *
         * You will have access to the page object, the old and new site and the URL query parameters.
         *
         * Example usage:
         *
         *     Event::listen('cms.sitePicker.overrideQuery', function($page, $params, $currentSite, $proposedSite) {
         *        if ($page->baseFileName == 'your-page-filename') {
         *             return YourModel::translateQuery($params, $currentSite, $proposedSite);
         *         }
         *     });
         *
         */
        $translatedQuery = Event::fire('cms.sitePicker.overrideQuery', [
            $page,
            $query,
            Site::getActiveSite(),
            $site
        ], true);

        if ($translatedQuery) {
            $query = $translatedQuery;
        }

        $queryStr = http_build_query($query);

        return $queryStr ? $url . '?' . $queryStr : $url;
    }
}
