<?php namespace Cms\Classes\Controller;

use Lang;
use Flash;
use Request;
use Cms\Classes\Partial;
use Cms\Classes\CmsException;
use Cms\Classes\PartialWatcher;
use Cms\Classes\AjaxApiResponse;
use October\Rain\Exception\ApplicationException;
use October\Rain\Exception\ValidationException;
use Exception;
use Throwable;

/**
 * HasAjaxRequests
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasAjaxRequests
{
    /**
     * @var \Larajax\Classes\AjaxRequest ajaxRequest
     */
    protected $ajaxRequest;

    /**
     * getAjaxRequest
     */
    public function getAjaxRequest()
    {
        return $this->ajaxRequest ??= ajax()->request();
    }

    /**
     * getAjaxHandler returns the AJAX handler for the current request, if available.
     * @return string
     */
    public function getAjaxHandler()
    {
        $request = $this->getAjaxRequest();

        if ($request->hasAjaxHandler()) {
            return $request->qualifiedHandler;
        }

        return null;
    }

    /**
     * getAjaxPartialName returns a partial name or true
     */
    protected function getAjaxPartialName()
    {
        $request = $this->getAjaxRequest();

        if ($request->hasAjaxHandler()) {
            return $request->partial;
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
        $request = $this->getAjaxRequest();

        if ($request->hasAjaxHandler()) {
            $partials = $request->partialList;

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
        $handler = $this->getAjaxHandler();
        if (!$handler) {
            return null;
        }

        try {
            // Validate the handler name
            if (!preg_match('/^(?:\w+\:{2})?on[A-Z]{1}[\w+]*$/', $handler)) {
                throw new CmsException(Lang::get('cms::lang.ajax_handler.invalid_name', ['name'=>e($handler)]));
            }

            // Validates the handler partial list
            $partialList = $this->getAjaxHandlerPartialList();

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

            $response = $result && $result !== true ? ajax()::wrap($result) : ajax();

            // Include partials
            if ($partialList = $this->ajaxRequest->partialList) {
                foreach ($partialList as $partial) {
                    $partialContents = null;
                    if ($this->partialWatcher) {
                        $partialContents = $this->partialWatcher->getPartialContents($partial);
                    }
                    if (!$partialContents) {
                        $partialContents = $this->renderPartial($partial);
                    }
                    $response->partial($partial, $partialContents);
                }
            }
        }
        catch (Throwable $ex) {
            report($ex);
            $response = ajax()->exception($ex);
        }

        if ($this->hasAssetsDefined()) {
            foreach ($this->getAssetPathsWithAttributes() as $type => $paths) {
                $response->asset($type, $paths);
            }
        }

        // Look for any flash messages, only if response is not redirecting
        if ($this->ajaxRequest->wantsFlash && !$response->isRedirect() && Flash::check()) {
            foreach (Flash::all() as $level => $text) {
                $response->flash($level, $text);
            }
        }

        return $response;
    }

    /**
     * runAjaxHandlerResponse is used by the ajaxHandler Twig function.
     */
    public function runAjaxHandlerAsResponse($handler)
    {
        $response = new AjaxApiResponse;

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
                return app()->call([$partialObj, $handler]) ?: true;
            }
        }

        // Process page code section handler
        if (method_exists($this->pageObj, $handler)) {
            return app()->call([$this->pageObj, $handler]) ?: true;
        }

        // Process layout code section handler
        if (!$this->layout->isFallBack() && method_exists($this->layoutObj, $handler)) {
            return app()->call([$this->layoutObj, $handler]) ?: true;
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
