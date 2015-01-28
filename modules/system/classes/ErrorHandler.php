<?php namespace System\Classes;

use View;
use Config;
use Cms\Classes\Theme;
use Cms\Classes\Router;
use Cms\Classes\Controller;
use October\Rain\Exception\ErrorHandler as ErrorHandlerBase;

/**
 * System Error Handler, this class handles application exception events.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ErrorHandler extends ErrorHandlerBase
{
    /**
     * Looks up an error page using the CMS route "/error". If the route does not
     * exist, this function will use the error view found in the Cms module.
     * @return mixed Error page contents.
     */
    public function handleCustomError()
    {
        if (Config::get('app.debug', false))
            return null;

        $theme = Theme::getActiveTheme();

        // Use the default view if no "/error" URL is found.
        $router = new Router($theme);
        if (!$router->findByUrl('/error')) {
            return View::make('cms::error');
        }

        // Route to the CMS error page.
        $controller = new Controller($theme);
        return $controller->run('/error');
    }

    /**
     * Displays the detailed system exception page.
     * @return View Object containing the error page.
     */
    public function handleDetailedError($exception)
    {
        // Ensure System view path is registered
        View::addNamespace('system', base_path().'/modules/system/views');

        return View::make('system::exception', ['exception' => $exception]);
    }
}
