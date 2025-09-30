<?php namespace Cms\Classes\Controller;

use Lang;
use Flash;
use Request;
use Response;
use Cms\Classes\CmsException;
use Cms\Classes\PartialWatcher;
use Cms\Classes\AjaxResponse;
use Cms\Classes\Partial;
use October\Rain\Exception\AjaxException;
use October\Rain\Exception\ApplicationException;
use October\Rain\Exception\ValidationException;
use Illuminate\Http\RedirectResponse;
use Exception;

/**
 * HasAjaxRequests
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasAjaxRequests
{
    /**
     * getAjaxHandler returns the AJAX handler for the current request, if available.
     * @return string
     */
    public function getAjaxHandler()
    {
        if (!Request::ajax() || Request::method() !== 'POST') {
            return null;
        }

        if ($handler = Request::header('X_OCTOBER_REQUEST_HANDLER')) {
            return trim($handler);
        }

        return null;
    }

    /**
     * getAjaxPartialName returns a partial name or true
     */
    protected function getAjaxPartialName()
    {
        if (!Request::ajax() || Request::method() !== 'POST') {
            return null;
        }

        if ($ajaxPartial = Request::header('X_OCTOBER_REQUEST_PARTIAL')) {
            return $ajaxPartial;
        }

        return null;
    }

    /**
     * runPageCapture captures partial output and runs AJAX handlers in partials
     * if they are seen
     */
    protected function runPageCapture($page, $ajaxPartial)
    {
        // Set up watcher
        $this->partialWatcher = new PartialWatcher;
        $this->partialWatcher->startCapture(
            $ajaxPartial,
            $this->getAjaxHandlerPartialList()
        );

        // Run page in capture mode
        if ($result = $this->runPage($page, ['capture' => true])) {
            return $result;
        }

        // Execute AJAX event
        if ($ajaxResponse = $this->execAjaxHandlers()) {
            return $ajaxResponse;
        }
    }

    /**
     * getAjaxHandlerPartialList
     */
    protected function getAjaxHandlerPartialList(): array
    {
        $partialList = Request::header('X_OCTOBER_REQUEST_PARTIALS');

        if ($partialList && ($partialList = trim($partialList))) {
            $partials = explode('&', $partialList);

            foreach ($partials as $partial) {
                if (!Partial::validateRequestName($partial)) {
                    throw new CmsException(Lang::get('cms::lang.partial.invalid_name', ['name'=>e($partial)]));
                }
            }

            return $partials;
        }

        return [];
    }

    /**
     * execAjaxHandlers executes the page, layout, component and plugin AJAX handlers.
     * @return mixed Returns the AJAX Response object or null.
     */
    protected function execAjaxHandlers()
    {
        if ($handler = $this->getAjaxHandler()) {
            try {
                // Validate the handler name
                if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler)) {
                    throw new CmsException(Lang::get('cms::lang.ajax_handler.invalid_name', ['name'=>e($handler)]));
                }

                // Validates the handler partial list
                $partialList = $this->getAjaxHandlerPartialList();
                $responseContents = [];

                // Execute the handler
                $result = null;
                if ($this->partialWatcher) {
                    if ($exception = $this->partialWatcher->getHandlerException()) {
                        throw $exception;
                    }

                    $result = $this->partialWatcher->getHandlerResponse();
                }
                if (!$result) {
                    $result = $this->runAjaxHandler($handler);
                }
                if (!$result) {
                    throw new CmsException(Lang::get('cms::lang.ajax_handler.not_found', ['name'=>e($handler)]));
                }

                // If the handler returned a redirect, process the URL and dispose of it so
                // framework.js knows to redirect the browser and not the request!
                if ($result instanceof RedirectResponse) {
                    $responseContents['X_OCTOBER_REDIRECT'] = $result->getTargetUrl();
                    return Response::make($responseContents, $this->statusCode);
                }

                // Render partials and return the response as array that will be converted to JSON automatically.
                foreach ($partialList as $partial) {
                    $partialContents = null;
                    if ($this->partialWatcher) {
                        $partialContents = $this->partialWatcher->getPartialContents($partial);
                    }
                    if (!$partialContents) {
                        $partialContents = $this->renderPartial($partial);
                    }
                    $responseContents[$partial] = $partialContents;
                }

                // Look for any flash messages
                if (Request::header('X_OCTOBER_REQUEST_FLASH') && Flash::check()) {
                    $responseContents['X_OCTOBER_FLASH_MESSAGES'] = Flash::all();
                }

                // Look for browser events
                if ($browserEvents = $this->getBrowserEvents()) {
                    $responseContents['X_OCTOBER_DISPATCHES'] = $browserEvents;
                }

                // If the handler returned an array, we should add it to output for rendering.
                // If it is a string, add it to the array with the key "result".
                // If an object, pass it to Laravel as a response object.
                if (is_array($result)) {
                    $responseContents = array_merge($responseContents, $result);
                }
                elseif (is_string($result)) {
                    $responseContents['result'] = $result;
                }
                elseif (is_object($result)) {
                    return $result;
                }

                return Response::make($responseContents, $this->statusCode);
            }
            catch (ValidationException $ex) {
                // Handle validation errors
                $responseContents['X_OCTOBER_ERROR_FIELDS'] = $ex->getFields();
                $responseContents['X_OCTOBER_ERROR_MESSAGE'] = $ex->getMessage();
                if ($browserEvents = $this->getBrowserEvents()) {
                    $responseContents['X_OCTOBER_DISPATCHES'] = $browserEvents;
                }
                throw new AjaxException($responseContents);
            }
            catch (AjaxException $ex) {
                if ($browserEvents = $this->getBrowserEvents()) {
                    $ex->addContent('X_OCTOBER_DISPATCHES', $browserEvents);
                }
                throw $ex;
            }
            catch (Exception $ex) {
                throw $ex;
            }
        }

        return null;
    }

    /**
     * runAjaxHandlerResponse is used by the ajaxHandler Twig function.
     */
    public function runAjaxHandlerAsResponse($handler)
    {
        $response = new AjaxResponse;

        try {
            $result = $this->runAjaxHandler($handler);
            $response->addPageVars($this->pageObj->vars);

            if (Flash::check()) {
                $response->addFlashMessages(Flash::all());
            }

            $response->setHandlerResponse($result);
        }
        catch (Exception $ex) {
            $response->setHandlerException($ex);
        }

        return $response;
    }

    /**
     * execPostbackHandler is used internally to execute a postback version of an
     * AJAX handler. This process fails without any exceptions to keep the page
     * cycle going.
     */
    protected function execPostbackHandler()
    {
        if (Request::method() !== 'POST') {
            return null;
        }

        $handler = post('_handler');
        if (!$handler) {
            return null;
        }

        if (!$this->verifyCsrfToken()) {
            return null;
        }

        // Validate the handler name
        if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler)) {
            return null;
        }

        try {
            $handlerResponse = $this->runAjaxHandler($handler);
            if ($handlerResponse && $handlerResponse !== true) {
                return $handlerResponse;
            }
        }
        catch (ValidationException $ex) {
            $errors = $this->vars['errors'] ?? new \Illuminate\Support\ViewErrorBag;
            $this->vars['errors'] = $errors->put('default', $ex->getErrors());
            Flash::error($ex->getMessage());
        }
        catch (ApplicationException $ex) {
            Flash::error($ex->getMessage());
        }
        catch (Exception $ex) {
            if (method_exists($ex, 'getSafeMessage')) {
                Flash::error($ex->{'getSafeMessage'}());
            }
            else {
                throw $ex;
            }
        }

        return null;
    }

    /**
     * runAjaxHandler tries to find and run an AJAX handler in the page, layout, components and plugins.
     * The method stops as soon as the handler is found. It will return the response from the handler,
     * or true if the handler was found. Returns false otherwise.
     */
    protected function runAjaxHandler($handler)
    {
        /**
         * @event cms.ajax.beforeRunHandler
         * Provides an opportunity to modify an AJAX request
         *
         * The parameter provided is `$handler` (the requested AJAX handler to be run)
         *
         * Example usage (forwards AJAX handlers to a backend widget):
         *
         *     Event::listen('cms.ajax.beforeRunHandler', function ((\Cms\Classes\Controller) $controller, (string) $handler) {
         *         if (strpos($handler, '::')) {
         *             [$componentAlias, $handlerName] = explode('::', $handler);
         *             if ($componentAlias === $this->getBackendWidgetAlias()) {
         *                 return $this->backendControllerProxy->runAjaxHandler($handler);
         *             }
         *         }
         *     });
         *
         * Or
         *
         *     $this->controller->bindEvent('ajax.beforeRunHandler', function ((string) $handler) {
         *         if (strpos($handler, '::')) {
         *             [$componentAlias, $handlerName] = explode('::', $handler);
         *             if ($componentAlias === $this->getBackendWidgetAlias()) {
         *                 return $this->backendControllerProxy->runAjaxHandler($handler);
         *             }
         *         }
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.ajax.beforeRunHandler', [$handler])) {
            return $event;
        }

        // Process Component handler
        if (strpos($handler, '::')) {
            [$componentName, $handlerName] = explode('::', $handler);
            $componentObj = $this->findComponentByName($componentName);

            if ($componentObj && $componentObj->methodExists($handlerName)) {
                return $this->inComponentContext($componentObj, function() use ($componentObj, $handlerName) {
                    return $componentObj->runAjaxHandler($handlerName) ?: true;
                });
            }

            return false;
        }

        // Process partial code section handler
        if ($this->partialStack && ($partialObj = $this->partialStack->findPartialByHandler($handler))) {
            if (method_exists($partialObj, $handler)) {
                return $partialObj->$handler() ?: true;
            }
        }

        // Process page code section handler
        if (method_exists($this->pageObj, $handler)) {
            return $this->pageObj->$handler() ?: true;
        }

        // Process layout code section handler
        if (!$this->layout->isFallBack() && method_exists($this->layoutObj, $handler)) {
            return $this->layoutObj->$handler() ?: true;
        }

        // Cycle each component to locate a usable handler
        if (($componentObj = $this->findComponentByHandler($handler)) !== null) {
            return $this->inComponentContext($componentObj, function() use ($componentObj, $handler) {
                return $componentObj->runAjaxHandler($handler) ?: true;
            });
        }

        // Generic handler that does nothing
        if ($handler === 'onAjax') {
            return true;
        }

        return false;
    }
}
