<?php namespace Cms\Classes;

use Illuminate\Http\Response;
use October\Rain\Exception\ApplicationException;
use October\Rain\Exception\ValidationException;
use October\Rain\Exception\ForbiddenException;
use October\Rain\Exception\NotFoundException;
use Illuminate\Http\RedirectResponse;
use ArrayAccess;

/**
 * AjaxResponse
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class AjaxApiResponse extends Response implements ArrayAccess
{
    /**
     * @var array pageVars are variables included on the page
     */
    protected $pageVars = [];

    /**
     * @var string ajaxRedirectUrl
     */
    protected $ajaxRedirectUrl;

    /**
     * @var array ajaxFlashMessages
     */
    protected $ajaxFlashMessages;

    /**
     * addPageVars is used internally
     */
    public function addPageVars($vars): static
    {
        $this->pageVars = (array) $vars;

        return $this;
    }

    /**
     * withPageVars includes the page vars in the response. This does not happen by default
     * for security reasons.
     */
    public function withPageVars(): static
    {
        $this->original['data'] = array_merge($this->original['data'] ?? [], $this->pageVars);

        $this->setContent($this->original);

        return $this;
    }

    /**
     * addFlashMessages is used internally
     */
    public function addFlashMessages($messages): static
    {
        $this->ajaxFlashMessages = $messages;

        return $this;
    }

    /**
     * setContent captures the variables from a handler and merges any resulting data
     */
    public function setHandlerResponse($content): static
    {
        if ($content instanceof RedirectResponse) {
            $this->setAjaxRedirect($content);
        }

        if (is_string($content)) {
            $data = ['result' => $content];
        }
        elseif (is_array($content)) {
            $data = $content;
        }
        else {
            $data = [];
        }

        $response = [
            'data' => $data
        ];

        if ($this->ajaxRedirectUrl) {
            $response['redirect'] = $this->ajaxRedirectUrl;
        }

        if ($this->ajaxFlashMessages) {
            $response['flash'] = $this->ajaxFlashMessages;
        }

        $this->setContent($response);

        return $this;
    }

    /**
     * setException
     */
    public function setHandlerException($exception): static
    {
        $this->exception = $exception;

        $error = [];
        $error['message'] = $exception->getMessage();

        if ($exception instanceof ValidationException) {
            $this->setStatusCode(422);
            $error['fields'] = $exception->getFields();
        }
        elseif ($exception instanceof ApplicationException) {
            $this->setStatusCode(400);
        }
        elseif ($exception instanceof ForbiddenException) {
            $this->setStatusCode(403);
        }
        elseif ($exception instanceof NotFoundException) {
            $this->setStatusCode(404);
        }
        else {
            $this->setStatusCode(500);
        }

        $this->setContent([
            'error' => $error
        ]);

        return $this;
    }

    /**
     * isAjaxRedirect
     */
    public function isAjaxRedirect(): bool
    {
        return $this->ajaxRedirectUrl !== null;
    }

    /**
     * getRedirectUrl
     */
    public function getAjaxRedirectUrl(): string
    {
        return $this->ajaxRedirectUrl;
    }

    /**
     * setRedirectUrl
     */
    public function setAjaxRedirect($response)
    {
        $this->ajaxRedirectUrl = $response->getTargetUrl();
    }

    /**
     * offsetExists implementation
     */
    public function offsetExists($offset): bool
    {
        return isset($this->original[$offset]) || isset($this->pageVars[$offset]);
    }

    /**
     * offsetSet implementation
     */
    public function offsetSet($offset, $value): void
    {
        $this->original[$offset] = $value;
    }

    /**
     * offsetUnset implementation
     */
    public function offsetUnset($offset): void
    {
        unset($this->original[$offset]);
    }

    /**
     * offsetGet implementation
     */
    public function offsetGet($offset): mixed
    {
        return $this->original[$offset] ?? ($this->pageVars[$offset] ?? null);
    }

    /**
     * withVars the given variables in to the response data.
     */
    public function withVars(array $vars): static
    {
        $this->original['data'] = array_merge($this->original['data'] ?? [], $vars);

        $this->setContent($this->original);

        return $this;
    }
}
