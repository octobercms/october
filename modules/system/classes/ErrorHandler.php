<?php namespace System\Classes;

use App;
use View;
use Config;
use Request;
use Response;
use Cms\Classes\Theme;
use Cms\Classes\Router;
use Cms\Classes\Controller;
use System\Classes\BaseException;
use System\Classes\ApplicationException;

/**
 * System Error Handler, this class handles application exception events.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ErrorHandler
{

    /**
     * @var System\Classes\ExceptionBase A prepared mask exception used to mask any exception fired.
     */
    protected static $activeMask;

    /**
     * All exceptions are piped through this method from the framework workflow. This method will mask
     * any foreign exceptions with a "scent" of the native application's exception, so it can render
     * correctly when displayed on the error page.
     * @param Exception $proposedException The exception candidate that has been thrown.
     * @return View Object containing the error page.
     */
    public function handleException(\Exception $proposedException, $httpCode = 500, $isCli = false)
    {
        // Disable the error handler for CLI environment
        if ($isCli)
            return;

        // Disable the error handler for test environment
        if (Config::getEnvironment() == 'testing')
            return;

        // Detect AJAX request and use error 500
        if (Request::ajax())
           return Response::make($proposedException->getMessage(), $httpCode);

        // Clear the output buffer
        while (ob_get_level())
            ob_end_clean();

        // Friendly error pages are used
        if (Config::get('cms.customErrorPage'))
            return $this->handleCustomError();

        // If the exception is already our brand, use it.
        if ($proposedException instanceof BaseException) {
            $exception = $proposedException;
        }
        // If there is an active mask prepared, use that.
        elseif (static::$activeMask !== null) {
            $exception = static::$activeMask;
            $exception->setMask($proposedException);
        }
        // Otherwise we should mask it with our own default scent.
        else {
            $exception = new ApplicationException($proposedException->getMessage(), 0);
            $exception->setMask($proposedException);
        }

        // Ensure our system view path is registered
        View::addNamespace('system', base_path().'/modules/system/views');

        return View::make('system::exception', ['exception' => $exception]);
    }

    /**
     * Prepares a mask exception to be used when any exception fires.
     * @param Exception $exception The mask exception.
     * @return void
     */
    public static function applyMask(\Exception $exception)
    {
        static::$activeMask = $exception;
    }

    /**
     * Destroys the prepared mask by applyMask()
     * @return void
     */
    public static function removeMask()
    {
        static::$activeMask = null;
    }

    /**
     * Looks up an error page using the CMS route "/error". If the route does not
     * exist, this function will use the error view found in the Cms module.
     * @return mixed Error page contents.
     */
    public function handleCustomError()
    {
        $theme = Theme::getActiveTheme();

        // Use the default view if no "/error" URL is found.
        $router = new Router($theme);
        if (!$router->findByUrl('/error'))
            return View::make('cms::error');

        // Route to the CMS error page.
        $controller = new Controller($theme);
        return $controller->run('/error');
    }

}