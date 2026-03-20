<?php namespace System\Classes;

use Closure;
use October\Rain\Element\ElementBase;

/**
 * @deprecated
 */
class UiElement extends ElementBase
{
    use \System\Traits\ElementRenderer;

    /**
     * __construct
     */
    public function __construct($body = null)
    {
        if (
            is_string($body) ||
            $body instanceof Closure ||
            $body instanceof UiElement
        ) {
            $this->body($body);
        }

        parent::__construct([]);
    }
}
