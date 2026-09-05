<?php namespace Cms\Classes;

use Site;
use Lang;
use Date;
use File;
use Cache;
use Event;
use Config;
use October\Rain\Router\Router as RainRouter;
use October\Rain\Router\Helper as RouterHelper;
use Throwable;

/**
 * Router parses page URL patterns and finds pages by URLs.
 *
 * The page URL format is explained below.
 *
 *     /blog/post/:post_id
 *
 * Name of parameters should be compatible with PHP variable names. To make a parameter optional
 * add the question mark after its name:
 *
 *     /blog/post/:post_id?
 *
 * By default parameters in the middle of the URL are required, for example:
 *
 *     /blog/:post_id?/comments - although the :post_id parameter is marked as optional,
 *
 * it will be processed as required.
 *
 * Optional parameters can have default values which are used as fallback values in case if the real
 * parameter value is not presented in the URL. Default values cannot contain the pipe symbols and question marks.
 *
 * Specify the default value after the question mark:
 *
 *     /blog/category/:category_id?10 - The category_id parameter would be 10 for this URL: /blog/category
 *
 * You can also add regular expression validation to parameters. To add a validation expression
 * add the pipe symbol after the parameter name (or the question mark) and specify the expression.
 * The forward slash symbol is not allowed in the expressions. Examples:
 *
 *     /blog/:post_id|^[0-9]+$/comments - this will match /blog/post/10/comments
 *     /blog/:post_id|^[0-9]+$ - this will match /blog/post/3
 *     /blog/:post_name?|^[a-z0-9\-]+$ - this will match /blog/my-blog-post
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Router
{
    /**
     * @var \Cms\Classes\Theme A reference to the CMS theme containing the object.
     */
    protected $theme;

    /**
     * @var string The last URL to be looked up using findByUrl().
     */
    protected $url;

    /**
     * @var array A list of parameters names and values extracted from the URL pattern and URL string.
     */
    protected $parameters = [];

    /**
     * October\Rain\Router\Router Router object with routes preloaded.
     */
    protected $routerObj;

    /**
     * October\Rain\Router\Router Router object with default URLs that have translated overrides.
     */
    protected $aliasRouterObj;

    /**
     * __construct the router instance.
     * @param \Cms\Classes\Theme $theme Specifies the theme being processed.
     */
    public function __construct(Theme $theme)
    {
        $this->theme = $theme;
    }

    /**
     * build builds a rain router based on the theme, with translated URLs for a site.
     * @param \System\Models\SiteDefinition|null $site
     * @return RainRouter
     */
    public function build($site = null)
    {
        return $this->buildRouterObject($site);
    }

    /**
     * buildAlias builds a rain router of default URLs that are translated for a site.
     * @param \System\Models\SiteDefinition|null $site
     * @return RainRouter
     */
    public function buildAlias($site = null)
    {
        return $this->buildAliasRouterObject($site);
    }

    /**
     * findByUrl finds a page by its URL. Returns the page object and sets the $parameters property.
     * @param string $url The requested URL string.
     * @return \Cms\Classes\Page Returns \Cms\Classes\Page object or null if the page cannot be found.
     */
    public function findByUrl($url)
    {
        $this->url = $url = RouterHelper::normalizeUrl($url);

        /**
         * @event cms.router.beforeRoute
         * Fires before the CMS Router handles a route
         *
         * Example usage:
         *
         *     Event::listen('cms.router.beforeRoute', function ((string) $url, (\Cms\Classes\Router) $thisRouterInstance) {
         *         return \Cms\Classes\Page::loadCached('trick-theme-code', 'page-file-name');
         *     });
         *
         */
        $apiResult = Event::fire('cms.router.beforeRoute', [$url, $this], true);
        if ($apiResult !== null) {
            return $apiResult;
        }

        for ($pass = 1; $pass <= 2; $pass++) {
            // Find the page by URL, matching is compiled and bounded by the
            // number of pages, visited URLs are not cached individually
            //
            $fileName = null;
            $router = $this->getRouterObject();
            if ($router->match($url)) {
                $this->parameters = $router->getParameters();
                $fileName = $router->matchedRoute();
            }

            // Return the page
            //
            if ($fileName) {
                if (($page = Page::loadCached($this->theme, $fileName)) === null) {
                    // If the page was not found on the disk, clear the route cache
                    // and repeat the routing process.
                    if ($pass === 1) {
                        $this->clearCache();
                        continue;
                    }

                    return null;
                }

                return $page;
            }

            return null;
        }
    }

    /**
     * findByFile finds a URL by its page. Returns the URL route for linking to the page and
     * uses the supplied parameters in its address.
     * @param string $fileName Page file name.
     * @param array $parameters Route parameters to consider in the URL.
     * @return string|null
     */
    public function findByFile($fileName, $parameters = [])
    {
        if (!strlen(File::extension($fileName))) {
            $fileName .= '.htm';
        }

        $router = $this->getRouterObject();

        return $router->url($fileName, $parameters);
    }

    /**
     * findAliasRedirect matches a URL against default page URLs that have been replaced
     * by a translated URL, returning the translated path to redirect to.
     * @param string $url
     * @return string|null
     */
    public function findAliasRedirect($url)
    {
        $url = RouterHelper::normalizeUrl($url);

        $router = $this->getAliasRouterObject();
        if (!$router->match($url)) {
            return null;
        }

        $page = Page::loadCached($this->theme, $router->matchedRoute());
        if (!$page) {
            return null;
        }

        $pattern = $page->getTranslatableUrl();
        if (!$pattern) {
            return null;
        }

        return (new RainRouter)->urlFromPattern($pattern, $router->getParameters());
    }

    /**
     * setParameters sets the current routing parameters.
     * @param  array $parameters
     * @return array
     */
    public function setParameters(array $parameters)
    {
        $this->parameters = $parameters;
    }

    /**
     * getParameters returns the current routing parameters.
     * @return array
     */
    public function getParameters()
    {
        return $this->parameters;
    }

    /**
     * getUrl returns the last URL to be looked up.
     * @return string
     */
    public function getUrl()
    {
        return $this->url;
    }

    /**
     * getParameter returns a routing parameter.
     * @return array
     */
    public function getParameter($name, $default = null)
    {
        if (
            isset($this->parameters[$name]) &&
            ($this->parameters[$name] === '0' || !empty($this->parameters[$name]))
        ) {
            return $this->parameters[$name];
        }

        return $default;
    }

    /**
     * getRouterObject autoloads the URL map only allowing a single execution.
     * @return October\Rain\Router\Router Returns the URL map.
     */
    protected function getRouterObject()
    {
        if ($this->routerObj !== null) {
            return $this->routerObj;
        }

        return $this->routerObj = $this->buildCachedRouterObject();
    }

    /**
     * buildRouterObject builds the URL map, substituting translated URLs for a site.
     */
    protected function buildRouterObject($site = null)
    {
        $router = new RainRouter;

        foreach ($this->theme->listPages() as $page) {
            $pattern = ($site ? $page->getTranslatableUrl($site) : null) ?: $page->url;
            if ($pattern) {
                $router->route($page->getFileName(), $pattern);
            }
        }

        $router->sortRules();

        return $router;
    }

    /**
     * getAliasRouterObject autoloads the alias URL map only allowing a single execution.
     * @return October\Rain\Router\Router
     */
    protected function getAliasRouterObject()
    {
        if ($this->aliasRouterObj !== null) {
            return $this->aliasRouterObj;
        }

        return $this->aliasRouterObj = $this->buildCachedAliasRouterObject();
    }

    /**
     * buildAliasRouterObject builds a map of default URLs for pages with a translated URL.
     */
    protected function buildAliasRouterObject($site = null)
    {
        $router = new RainRouter;

        if (!$site) {
            return $router;
        }

        foreach ($this->theme->listPages() as $page) {
            if (!$page->url) {
                continue;
            }

            $pattern = $page->getTranslatableUrl($site);
            if ($pattern && $pattern !== $page->url) {
                $router->route($page->getFileName(), $page->url);
            }
        }

        $router->sortRules();

        return $router;
    }

    /**
     * buildCachedAliasRouterObject
     */
    protected function buildCachedAliasRouterObject()
    {
        $router = new RainRouter;

        // Use manifest cache, only when the primary manifest routes are usable
        if ($this->theme->themeIsCached() && $this->getManifestRouteCache()) {
            $router->fromArray($this->getManifestAliasRouteCache());
            return $router;
        }

        // Use dynamic cache
        if (($cachedArr = $this->getAliasRouteCache()) !== null) {
            $router->fromArray($cachedArr);
            return $router;
        }

        // No cache
        $router = $this->buildAliasRouterObject(Site::getActiveSite());

        // Store dynamic cache
        $this->putAliasRouteCache($router->toArray());

        return $router;
    }

    /**
     * buildCachedRouterObject
     */
    protected function buildCachedRouterObject()
    {
        $router = new RainRouter;

        // Use manifest cache, an empty manifest falls through to a fresh build
        if ($this->theme->themeIsCached() && ($manifestArr = $this->getManifestRouteCache())) {
            $router->fromArray($manifestArr);
            return $router;
        }

        // Use dynamic cache
        if ($cachedArr = $this->getMapRouteCache()) {
            $router->fromArray($cachedArr);
            return $router;
        }

        // No cache
        $router = $this->buildRouterObject(Site::getActiveSite());

        // Store dynamic cache
        $this->putMapRouteCache($router->toArray());

        return $router;
    }

    /**
     * clearCache invalidates the router cache for every locale by bumping the cache generation.
     */
    public function clearCache()
    {
        $generation = (int) Cache::get('cms.router.generation', 1);

        Cache::memo()->forever('cms.router.generation', $generation + 1);

        $this->routerObj = null;
        $this->aliasRouterObj = null;
    }

    /**
     * getCacheKey returns the caching URL key depending on the theme.
     * @param string $keyName Specifies the base key name.
     * @return string Returns the theme-specific key name.
     */
    protected function getCacheKey($keyName)
    {
        return md5($this->theme->getPath()).$keyName.Lang::getLocale().'.'.$this->getCacheGeneration();
    }

    /**
     * getCacheGeneration returns the current router cache generation number.
     */
    protected function getCacheGeneration(): int
    {
        // Stored on first use, otherwise every request misses this key
        return (int) Cache::memo()->rememberForever('cms.router.generation', function () {
            return 1;
        });
    }

    /**
     * getMapRouteCacheKey returns the cache key name for the URL list.
     * @return string
     */
    protected function getMapRouteCacheKey()
    {
        return $this->getCacheKey('page-url-map');
    }

    /**
     * getAliasRouteCacheKey returns the cache key name for the alias URL list.
     * @return string
     */
    protected function getAliasRouteCacheKey()
    {
        return $this->getCacheKey('page-url-alias-map');
    }

    /**
     * putAliasRouteCache
     */
    protected function putAliasRouteCache($urlMap)
    {
        $cacheKey = $this->getAliasRouteCacheKey();
        $cacheable = Config::get('cms.enable_route_cache');
        if (!$cacheable) {
            return;
        }

        Cache::put(
            $cacheKey,
            base64_encode(serialize($urlMap)),
            Date::now()->addMinutes(Config::get('cms.url_cache_ttl', 60))
        );
    }

    /**
     * getAliasRouteCache returns the cached alias map, or null when not cached.
     */
    protected function getAliasRouteCache()
    {
        // Cache preferences
        $cacheKey = $this->getAliasRouteCacheKey();
        $cacheable = Config::get('cms.enable_route_cache');
        if (!$cacheable) {
            return null;
        }

        $cached = Cache::get($cacheKey, false);
        if (!$cached) {
            return null;
        }

        $unserialized = @unserialize(@base64_decode($cached), ['allowed_classes' => false]);
        if (!is_array($unserialized)) {
            return null;
        }

        return $unserialized;
    }

    /**
     * putMapRouteCache
     */
    protected function putMapRouteCache($urlMap)
    {
        $cacheKey = $this->getMapRouteCacheKey();
        $cacheable = Config::get('cms.enable_route_cache');
        if (!$cacheable) {
            return;
        }

        Cache::put(
            $cacheKey,
            base64_encode(serialize($urlMap)),
            Date::now()->addMinutes(Config::get('cms.url_cache_ttl', 60))
        );
    }

    /**
     * getMapRouteCache
     */
    protected function getMapRouteCache()
    {
        // Cache preferences
        $cacheKey = $this->getMapRouteCacheKey();
        $cacheable = Config::get('cms.enable_route_cache');
        if (!$cacheable) {
            return null;
        }

        $cached = Cache::get($cacheKey, false);
        if (!$cached) {
            return null;
        }

        $unserialized = @unserialize(@base64_decode($cached), ['allowed_classes' => false]);
        if (!$unserialized) {
            return null;
        }

        return $unserialized;
    }

    /**
     * getManifestRouteCache returns the cached route map from the theme
     */
    protected function getManifestRouteCache(): array
    {
        $manifest = $this->getManifestArray();

        if ($site = Site::getActiveSite()) {
            $routes = $manifest['siteRoutes'][$site->hard_locale] ?? null;
            if (is_array($routes)) {
                return $routes;
            }
        }

        return $manifest['routes'] ?? [];
    }

    /**
     * getManifestAliasRouteCache returns the cached alias route map from the theme
     */
    protected function getManifestAliasRouteCache(): array
    {
        $manifest = $this->getManifestArray();

        if ($site = Site::getActiveSite()) {
            $routes = $manifest['siteAliasRoutes'][$site->hard_locale] ?? null;
            if (is_array($routes)) {
                return $routes;
            }
        }

        return [];
    }

    /**
     * getManifestArray returns the theme cache manifest contents.
     */
    protected function getManifestArray(): array
    {
        $manifestPath = $this->theme->getCachedThemePath();

        if (!file_exists($manifestPath)) {
            return [];
        }

        try {
            if (is_array($manifest = File::getRequire($manifestPath))) {
                return $manifest;
            }
        }
        catch (Throwable $ex) {
        }

        return [];
    }
}
