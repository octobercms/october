<?php namespace System\Traits;

use Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\Response as BaseResponse;
use Larajax\Classes\AjaxResponse;

/**
 * ResponseMaker stores attributes the can be used to prepare a response from the server.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ResponseMaker
{
    /**
     * @var int statusCode for the response
     */
    protected $statusCode = 200;

    /**
     * @var mixed responseOverride for the standard controller response.
     */
    protected $responseOverride = null;

    /**
     * @var Symfony\Component\HttpFoundation\ResponseHeaderBag responseHeaderBag
     */
    protected $responseHeaderBag = null;

    /**
     * @var array responseBrowserEvents for the AJAX framework.
     */
    protected $responseBrowserEvents = [];

    /**
     * Sets the status code for the current web response.
     * @param int $code Status code
     * @return void
     */
    public function setStatusCode($code)
    {
        $this->statusCode = (int) $code;
    }

     /**
     * getStatusCode returns the status code for the current web response.
     * @return int Status code
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * setResponse for the current page request cycle, this value takes priority
     * over the standard response prepared by the controller.
     * @param mixed $response Response object or string
     * @return void
     */
    public function setResponse($response)
    {
        $this->responseOverride = $response;
    }

    /**
     * setResponseHeader value
     *
     * @param  string  $key
     * @param  array|string  $values
     * @param  bool    $replace
     * @return void
     */
    public function setResponseHeader($key, $values, $replace = true)
    {
        if ($this->responseHeaderBag === null) {
            $this->responseHeaderBag = new ResponseHeaderBag;
        }

        $this->responseHeaderBag->set($key, $values, $replace);
    }

    /**
     * setResponseCookie adds a cookie to the response.
     *
     * @param  \Symfony\Component\HttpFoundation\Cookie|mixed  $cookie
     * @return void
     */
    public function setResponseCookie($cookie)
    {
        if ($this->responseHeaderBag === null) {
            $this->responseHeaderBag = new ResponseHeaderBag;
        }

        if (is_string($cookie) && function_exists('cookie')) {
            $cookie = call_user_func_array('cookie', func_get_args());
        }

        $this->responseHeaderBag->setCookie($cookie);
    }

    /**
     * getResponseHeaders as a response header bag
     * @return Symfony\Component\HttpFoundation\ResponseHeaderBag|null
     */
    public function getResponseHeaders()
    {
        return $this->responseHeaderBag;
    }

    /**
     * dispatchBrowserEvent queues a browser event
     */
    public function dispatchBrowserEvent(string $event, ?array $data = null)
    {
        $this->responseBrowserEvents[] = [
            'event' => $event,
            'data' => $data,
            'async' => false
        ];
    }

    /**
     * dispatchBrowserEvent queues a browser event
     */
    public function dispatchBrowserEventAsync(string $event, ?array $data = null)
    {
        $this->responseBrowserEvents[] = [
            'event' => $event,
            'data' => $data,
            'async' => true
        ];
    }

    /**
     * getBrowserEvents returns the queued browser events
     */
    public function getBrowserEvents(): array
    {
        return $this->responseBrowserEvents;
    }

    /**
     * makeResponse prepares a response that considers overrides and custom responses.
     * @param mixed $contents
     * @return mixed
     */
    public function makeResponse($contents)
    {
        if ($this->responseOverride !== null) {
            $contents = $this->responseOverride;
        }

        if (is_string($contents)) {
            $contents = Response::make($contents, $this->getStatusCode(), ['Content-Type' => 'text/html']);
        }

        if ($responseHeaders = $this->getResponseHeaders()) {
            if ($contents instanceof BaseResponse && method_exists($contents, 'withHeaders')) {
                $contents = $contents->{'withHeaders'}($responseHeaders);
            }
            elseif ($contents instanceof AjaxResponse) {
                $contents->headers($responseHeaders->all());
            }
        }

        if ($responseEvents = $this->getBrowserEvents()) {
            if ($contents instanceof AjaxResponse) {
                foreach ($responseEvents as $event) {
                    if ($event['async'] ?? false) {
                        $contents->browserEvent($event['event'], $event['data']);
                    }
                    else {
                        $contents->browserEventAsync($event['event'], $event['data']);
                    }
                }
            }
        }

        return $contents;
    }
}
