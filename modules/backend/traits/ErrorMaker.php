<?php namespace Backend\Traits;

use System\Classes\ErrorHandler;

/**
 * Error Maker Trait
 * Adds exception based methods to a class, goes well with `System\Traits\ViewMaker`.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait ErrorMaker
{
    /**
     * @var string Object used for storing a fatal error.
     */
    protected $fatalError;

    /**
     * @return boolean Whether a fatal error has been set or not.
     */
    public function hasFatalError()
    {
        return !is_null($this->fatalError);
    }

    /**
     * @return string The fatal error message
     */
    public function getFatalError()
    {
        return $this->fatalError;
    }

    /**
     * Sets standard page variables in the case of a controller error.
     */
    public function handleError($exception)
    {
        $errorMessage = ErrorHandler::getDetailedMessage($exception);
        $this->fatalError = $errorMessage;
        $this->vars['fatalError'] = $errorMessage;
    }
}
