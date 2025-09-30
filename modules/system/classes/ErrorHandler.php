<?php namespace System\Classes;

use App;
use View;
use Lang;
use Config;
use System;
use October\Rain\Exception\ErrorHandler as ErrorHandlerBase;
use October\Rain\Exception\ApplicationException;
use October\Rain\Exception\ForbiddenException;
use October\Rain\Exception\SystemException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Exception;

/**
 * ErrorHandler handles application exception events
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ErrorHandler extends ErrorHandlerBase
{
    /**
     * beforeReport allows hooking the application exception handler
     */
    public function beforeReport($exception)
    {
        $handler = App::make(ExceptionHandler::class);

        $handler->map(\Twig\Error\RuntimeError::class, function($e) {
            return $this->handleTwigRuntimeError($e);
        });
    }

    /**
     * handleTwigRuntimeError maps errors that occur within Twig, usually masking Http exceptions
     */
    protected function handleTwigRuntimeError($exception)
    {
        if (!$previousException = $exception->getPrevious()) {
            return $exception;
        }

        // The Twig runtime error is not very useful sometimes, so
        // uncomment this for an alternative debugging option
        // if (!$previousException instanceof \Cms\Classes\CmsException) {
        //     $exception = $previousException;
        // }

        // Convert HTTP exceptions
        if (
            $previousException instanceof SystemException ||
            $previousException instanceof HttpException ||
            $previousException instanceof HttpResponseException
        ) {
            $exception = $previousException;
        }

        // Convert Not Found exceptions
        if ($this->isNotFoundException($previousException)) {
            $exception = $previousException;
        }

        return $exception;
    }

    /**
     * handleCustomError
     */
    public function handleCustomError($exception)
    {
        if ($exception instanceof ForbiddenException) {
            return $this->handleCustomAccessDenied();
        }

        if ($this->isNotFoundException($exception)) {
            return $this->handleCustomNotFound();
        }

        if (!System::checkDebugMode()) {
            return $this->handleCustomGeneralError();
        }
    }

    /**
     * handleCustomGeneralError looks up an error page using the CMS route "/error". If the route
     * does not exist, this function will use the error view found in the CMS module.
     * @return mixed
     */
    protected function handleCustomGeneralError()
    {
        if (System::hasModule('Cms')) {
            $result = \Cms::pageError();
        }
        else {
            $result = View::make('system::error');
        }

        // Extract content from response object
        if ($result instanceof \Symfony\Component\HttpFoundation\Response) {
            $result = $result->getContent();
        }

        return $result;
    }

    /**
     * handleCustomAccessDenied checks if running the backend and shows the backend
     * access denied page.
     * @return mixed
     */
    protected function handleCustomAccessDenied()
    {
        if (App::runningInBackend()) {
            return View::make('backend::access_denied');
        }

        return View::make('system::error');
    }

    /**
     * handleCustomNotFound checks if using a custom 404 page, if so return the contents.
     * Return NULL if a custom 404 is not set up.
     * @return mixed
     */
    protected function handleCustomNotFound()
    {
        if (System::hasModule('Cms')) {
            $result = \Cms::pageNotFound();
        }
        elseif (App::runningInBackend()) {
            $result = View::make('backend::404');
        }
        else {
            $result = View::make('system::404');
        }

        // Extract content from response object
        if ($result instanceof \Symfony\Component\HttpFoundation\Response) {
            $result = $result->getContent();
        }

        return $result;
    }

    /**
     * handleDetailedError displays the detailed system exception page.
     * @return View
     */
    public function handleDetailedError($exception)
    {
        // Ensure System view path is registered
        View::addNamespace('system', base_path('modules/system/views'));

        return View::make('system::exception', ['exception' => $exception]);
    }

    /**
     * getDetailedMessage returns a more descriptive error message based on the context.
     * @param Exception $exception
     * @return string
     */
    public static function getDetailedMessage($exception)
    {
        // Access denied error
        if ($exception instanceof ForbiddenException) {
            return $exception->getMessage() ?: __("Access Denied");
        }

        // Not found error
        if ($exception instanceof NotFoundHttpException) {
            return $exception->getMessage() ?: __("Not Found");
        }

        // ApplicationException never displays a detailed error
        if ($exception instanceof ApplicationException) {
            return $exception->getMessage() ?: __("An Error Occurred");
        }

        // ValidationException should be shown to user
        if ($exception instanceof ValidationException) {
            return $exception->getMessage();
        }

        // Safe message interface
        if (method_exists($exception, 'getSafeMessage')) {
            return $exception->{'getSafeMessage'}();
        }

        // Debug mode is on
        if (System::checkDebugMode()) {
            return parent::getDetailedMessage($exception);
        }

        // Legacy exception logic
        if (Config::get('cms.exception_policy_v1', false)) {
            if (
                $exception instanceof \Illuminate\Database\QueryException ||
                $exception instanceof \ErrorException
            ) {
                return Lang::get('system::lang.page.custom_error.help');
            }

            return $exception->getMessage();
        }

        return Lang::get('system::lang.page.custom_error.help');
    }
}
