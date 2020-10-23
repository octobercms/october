<?php namespace System\Classes;

use View;
use Config;
use Cms\Classes\Theme;
use Cms\Classes\Router;
use Cms\Classes\Controller as CmsController;
use October\Rain\Exception\ErrorHandler as ErrorHandlerBase;
use October\Rain\Exception\SystemException;
use Symfony\Component\HttpFoundation\Response;

/**
 * System Error Handler, this class handles application exception events.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ErrorHandler extends ErrorHandlerBase
{
    /**
     * @inheritDoc
     */
    // public function handleException(Exception $proposedException)
    // {
    //     // The Twig runtime error is not very useful
    //     if (
    //         $proposedException instanceof \Twig\Error\RuntimeError &&
    //         ($previousException = $proposedException->getPrevious()) &&
    //         (!$previousException instanceof CmsException)
    //     ) {
    //         $proposedException = $previousException;
    //     }

    //     return parent::handleException($proposedException);
    // }

    /**
     * Looks up an error page using the CMS route "/error". If the route does not
     * exist, this function will use the error view found in the Cms module.
     * @return mixed Error page contents.
     */
    public function handleCustomError()
    {
        if (Config::get('app.debug', false)) {
            return null;
        }

        if (class_exists(Theme::class) && in_array('Cms', Config::get('cms.loadModules', []))) {
            $theme = Theme::getActiveTheme();
            $router = new Router($theme);

            // Use the default view if no "/error" URL is found.
            if (!$router->findByUrl('/error')) {
                return View::make('cms::error');
            }

            // Route to the CMS error page.
            $controller = new CmsController($theme);
            $result = $controller->run('/error');
        } else {
            $result = View::make('system::error');
        }

        // Extract content from response object
        if ($result instanceof Response) {
            $result = $result->getContent();
        }

        return $result;
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
