<?php namespace Cms\Helpers;

use Url;
use Site;
use View;
use Route;
use Config;
use Request;
use Redirect;
use Response;
use Cms\Classes\Page;
use Cms\Classes\Controller;
use System\Helpers\DateTime as DateTimeHelper;
use Illuminate\Routing\Exceptions\UrlGenerationException;
use Exception;

/**
 * Cms Helper
 *
 * @package october\cms
 * @see \Cms\Facades\Cms
 * @author Alexey Bobkov, Samuel Georges
 */
class Cms
{
    use \Cms\Helpers\Cms\HasSites;

    /**
     * @var bool actionExists determines if the run action exists
     */
    protected static $actionExists;

    /**
     * @var string urlPathPrefix prefixes every URL
     */
    protected $urlPathPrefix;

    /**
     * setUrlPrefix sets a prefix for every URL
     */
    public function setUrlPrefix(string $prefix)
    {
        $this->urlPathPrefix = trim($prefix, '/');
    }

    /**
     * url returns a URL in context of the frontend
     */
    public function url($path = null)
    {
        // Process path
        if (substr($path, 0, 1) === '/') {
            $path = substr($path, 1);
        }

        if ($this->urlPathPrefix !== null) {
            $path = $this->urlPathPrefix . '/' . $path;
        }

        // Use the router
        $routeAction = 'Cms\Classes\CmsController@run';

        if (self::$actionExists === null) {
            self::$actionExists = Route::getRoutes()->getByAction($routeAction) !== null;
        }

        if (self::$actionExists) {
            try {
                $result = Url::action($routeAction, ['slug' => $path]);
            }
            catch (UrlGenerationException $ex) {
                $result = strtr(rawurlencode((string) $path), ['%2F' => '/']);
            }
        }
        else {
            $result = $path;
        }

        // Use the base URL
        return Url::toRelative($result);
    }

    /**
     * pageUrl returns a URL for a CMS page, this fires up the CMS controller
     * to generate the value for maximum performance.
     */
    public function pageUrl($name, $parameters = [])
    {
        return (Controller::getController() ?: new Controller)
            ->pageUrl($name, $parameters, false);
    }

    /**
     * fullUrl returns a complete URL considering the current site context
     * and base URL, including prefix and hostname.
     */
    public function fullUrl($path = null)
    {
        $path = '/' . ltrim($path, '/');

        if ($site = Site::getSiteFromContext()) {
            return rtrim($site->base_url . $path, '/');
        }

        return Url::to($path);
    }

    /**
     * entryUrl returns an entry point URL from the CMS theme based on a component name
     * and the isDefault component property to assign it explicitly.
     */
    public function entryUrl($componentName, array $parameters = [], ?array $componentProps = null)
    {
        // @todo check cached, if not, see \Tailor\Behaviors\PreviewController for example -sg
        $pages = $componentProps
            ? Page::whereComponent($componentName, $componentProps)
            : Page::withComponent($componentName);

        $page = $pages->first();

        if ($pages->count() > 1) {
            $page = $pages->whereComponent($componentName, ['isDefault' => true])->first() ?: $page;
        }

        if (!$page) {
            return null;
        }

        return $this->pageUrl($page->getBaseFileName(), $parameters);
    }

    /**
     * redirect creates a new redirect to a CMS page or URL, the second argument
     * contains the CMS page parameters or the status code.
     */
    public function redirect($to, $parameters = [], $status = 302)
    {
        if (is_int($parameters)) {
            $status = $parameters;
            $parameters = [];
        }

        $url = $this->pageUrl($to, $parameters) ?: $to;

        return Redirect::to($url, $status);
    }

    /**
     * redirectFromPost performs a redirect after an action using a "redirect" postback
     * value. Setting to false or 0 will disable the redirect. This method will only
     * redirect to a relative path for security reasons.
     */
    public function redirectFromPost($defaultTo = null, $key = null)
    {
        return $this->makePostRedirect($defaultTo, $key);
    }

    /**
     * redirectIntendedFromPost
     */
    public function redirectIntendedFromPost($defaultTo = null, $key = null)
    {
        return $this->makePostRedirect($defaultTo, $key, 'intended');
    }

    /**
     * makePostRedirect
     */
    protected function makePostRedirect($defaultTo = null, $key = null, $method = 'to')
    {
        if ($defaultTo === null) {
            $defaultTo = Request::path();
        }

        if ($key === null) {
            $key = 'redirect';
        }

        $property = post($key);

        // No redirect (false)
        if (!$property || $property === 'false') {
            return;
        }

        // Refresh current page (true)
        if (in_array($property, ['1', 'true'])) {
            return Redirect::$method($defaultTo);
        }

        // Specify a CMS page name
        if ($redirectUrl = $this->pageUrl($property)) {
            return Redirect::$method($redirectUrl);
        }

        // Specify a relative URL
        return Redirect::$method(Url::makeRelative($property));
    }

    /**
     * flashFromPost requests a flash message from the "message" postback.
     */
    public function flashFromPost($message, $key = 'message')
    {
        $property = post($key);

        if (in_array($property, ['0', 'false'])) {
            return;
        }

        return $property ?: $message;
    }

    /**
     * pageNotFound returns a 404 page response
     */
    public function pageNotFound()
    {
        $controller = (Controller::getController() ?: new Controller);

        $router = $controller->getRouter();

        if ($router->findByUrl('/404')) {
            return $controller->run('/404');
        }

        return Response::make(View::make('cms::404'), 404);
    }

    /**
     * pageError returns a 500 page response
     */
    public function pageError()
    {
        try {
            $controller = (Controller::getController() ?: new Controller);

            $router = $controller->getRouter();

            if ($router->findByUrl('/error')) {
                return $controller->run('/error');
            }
        }
        catch (Exception $ex) {
        }

        return Response::make(View::make('cms::error'), 500);
    }

    /**
     * makeCarbon converts mixed inputs to a Carbon object and sets the CMS timezone
     * @return \Carbon\Carbon
     */
    public function makeCarbon($value, $throwException = true)
    {
        $carbon = DateTimeHelper::makeCarbon($value, $throwException);

        $carbon->setTimezone(Config::get('cms.timezone', Config::get('app.timezone')));

        return $carbon;
    }

    /**
     * urlHasException checks if the url pattern has an exception for the specified type
     */
    public function urlHasException(string $url, string $type): bool
    {
        $exceptions = (array) Config::get('cms.url_exceptions', []);
        if (!$exceptions) {
            return false;
        }

        // Normalize URL
        $haystack = '/' . trim($url, '/ ');

        foreach ($exceptions as $urlPattern => $exceptionStr) {
            $exceptionTypes = explode('|', $exceptionStr);
            if (!in_array($type, $exceptionTypes)) {
                continue;
            }

            // Normalize slash prefix, remove wildcard end
            $needle = '/' . ltrim(rtrim($urlPattern, '*'), '/ ');
            if (str_ends_with($urlPattern, '*') && str_starts_with($haystack, $needle)) {
                return true;
            }

            if ($haystack === $needle) {
                return true;
            }
        }

        return false;
    }

    /**
     * clearCache
     */
    public static function clearCache()
    {
        self::$actionExists = null;
    }
}
