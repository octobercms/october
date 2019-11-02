<?php namespace System\Traits;

use Response;

/**
 * Response Maker Trait
 * Stores attributes the can be used to prepare a response from the server.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ResponseMaker
{
    /**
     * @var int Response status code
     */
    protected $statusCode = 200;

    /**
     * @var mixed Override the standard controller response.
     */
    protected $responseOverride = null;

    /**
     * Sets the status code for the current web response.
     * @param int $code Status code
     * @return self
     */
    public function setStatusCode($code)
    {
        $this->statusCode = (int) $code;
        return $this;
    }

     /**
     * Returns the status code for the current web response.
     * @return int Status code
     */
    public function getStatusCode()
    {
        return $this->statusCode;
    }

    /**
     * Sets the response for the current page request cycle, this value takes priority
     * over the standard response prepared by the controller.
     * @param mixed $response Response object or string
     */
    public function setResponse($response)
    {
        $this->responseOverride = $response;
        return $this;
    }

    /**
     * Prepares a response that considers overrides and custom responses.
     * @param mixed $contents
     * @return mixed
     */
    public function makeResponse($contents)
    {
        if ($this->responseOverride !== null) {
            $contents = $this->responseOverride;
        }

        if (!is_string($contents)) {
            return $contents;
        }

        return Response::make($contents, $this->statusCode);
    }
}
