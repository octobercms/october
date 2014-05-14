<?php namespace System\Classes;

use Log;

/**
 * This class represents a critical system exception.
 * System exceptions are logged in the error log.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SystemException extends ExceptionBase
{
    public function __construct($message = "", $code = 0, \Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
        Log::error($this);
    }
}