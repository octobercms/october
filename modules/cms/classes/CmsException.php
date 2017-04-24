<?php namespace Cms\Classes;

use File;
use Twig_Error;
use October\Rain\Exception\ApplicationException;
use October\Rain\Halcyon\Processors\SectionParser;
use Exception;

/**
 * The CMS exception class.
 * The exception class handles CMS related errors. Allows the masking of other exception types which
 * uses actual source CMS files -- instead of cached files -- for their error content.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsException extends ApplicationException
{
    /**
     * @var \Cms\Classes\CmsCompoundObject A reference to a CMS object used for masking errors.
     */
    protected $compoundObject;

    /**
     * @var array Collection of error codes for each error distinction.
     */
    protected static $errorCodes = [
        100 => 'General',
        200 => 'INI Settings',
        300 => 'PHP Content',
        400 => 'Twig Template'
    ];

    /**
     * Creates the CMS exception object.
     * @param mixed $message The message to display as a string, or a CmsCompoundObject that is used
     * for using this exception as a mask for another exception type.
     * @param int $code Error code to specify the exception type:
     * Error 100: A general exception.
     * Error 200: Mask the exception as INI content.
     * Error 300: Mask the exception as PHP content.
     * Error 400: Mask the exception as Twig content.
     * @param \Exception $previous Previous exception.
     */
    public function __construct($message = null, $code = 100, Exception $previous = null)
    {
        if ($message instanceof CmsCompoundObject || $message instanceof ComponentPartial) {
            $this->compoundObject = $message;
            $message = '';
        }

        if (isset(static::$errorCodes[$code])) {
            $this->errorType = static::$errorCodes[$code];
        }

        parent::__construct($message, $code, $previous);
    }

    /**
     * Checks some conditions to confirm error has actually occurred
     * due to the CMS template code, not some external code. If the error
     * has occurred in external code, the function will return false. Otherwise return
     * true and modify the exception by overriding it's content, line and message values
     * to be accurate against a CMS object properties.
     * @param \Exception $exception The exception to modify.
     * @return bool
     */
    public function processCompoundObject(Exception $exception)
    {
        switch ($this->code) {
            case 200:
                $result = $this->processIni($exception);
                break;

            case 300:
                $result = $this->processPhp($exception);
                break;

            case 400:
                $result = $this->processTwig($exception);
                break;
        }
        if ($result !== false) {
            $this->file = $this->compoundObject->getFilePath();

            if (File::isFile($this->file) && is_readable($this->file)) {
                $this->fileContent = @file($this->file);
            }
        }

        return $result;
    }

    /**
     * Override properties of an exception specific to the INI section
     * of a CMS object.
     * @param \Exception $exception The exception to modify.
     * @return bool
     */
    protected function processIni(Exception $exception)
    {
        $message = $exception->getMessage();

        /*
         * Expecting: syntax error, unexpected '!' in Unknown on line 4
         */
        if (!starts_with($message, 'syntax error')) {
            return false;
        }
        if (strpos($message, 'Unknown') === false) {
            return false;
        }
        if (strpos($exception->getFile(), 'Ini.php') === false) {
            return false;
        }

        /*
         * Line number from parse_ini_string() error.
         * The last word should contain the line number.
         */
        $parts = explode(' ', $message);
        $line = array_pop($parts);
        $this->line = (int)$line;

        // Find where the ini settings section begins
        $offsetArray = SectionParser::parseOffset($this->compoundObject->getContent());
        $this->line += $offsetArray['settings'];

        $this->message = $message;

        // Account for line 0
        $this->line--;

        return true;
    }

    /**
     * Override properties of an exception specific to the PHP section
     * of a CMS object.
     * @param \Exception $exception The exception to modify.
     * @return bool
     */
    protected function processPhp(Exception $exception)
    {
        /*
         * Fatal Error
         */
        if ($exception instanceof \Symfony\Component\Debug\Exception\FatalErrorException) {
            $check = false;

            // Expected: */modules/cms/classes/CodeParser.php(165) : eval()'d code line 7
            if (strpos($exception->getFile(), 'CodeParser.php')) {
                $check = true;
            }

            // Expected: */storage/cms/cache/39/05/home.htm.php
            if (strpos($exception->getFile(), $this->compoundObject->getFileName() . '.php')) {
                $check = true;
            }

            if (!$check) {
                return false;
            }
        /*
         * Errors occurring the PHP code base class (Cms\Classes\CodeBase)
         */
        }
        else {
            $trace = $exception->getTrace();
            if (isset($trace[1]['class'])) {
                $class = $trace[1]['class'];
                if (!is_subclass_of($class, 'Cms\Classes\CodeBase')) {
                    return false;
                }
            }
        }

        $this->message = $exception->getMessage();

        // Offset the php, namespace and bracket tags from the generated class.
        $this->line = $exception->getLine() - 3;

        // Find where the php code section begins
        $offsetArray = SectionParser::parseOffset($this->compoundObject->getContent());
        $this->line += $offsetArray['code'];

        // Account for line 0
        $this->line--;

        return true;
    }

    /**
     * Override properties of an exception specific to the Twig section
     * of a CMS object.
     * @param \Exception $exception The exception to modify.
     * @return bool
     */
    protected function processTwig(Exception $exception)
    {
        // Must be a Twig related exception
        if (!$exception instanceof Twig_Error) {
            return false;
        }

        $this->message = $exception->getRawMessage();
        $this->line = $exception->getTemplateLine();

        // Find where the twig markup section begins
        $offsetArray = SectionParser::parseOffset($this->compoundObject->getContent());
        $this->line += $offsetArray['markup'];

        // Account for line 0
        $this->line--;

        return true;
    }

    /**
     * Masks this exception with the details of the supplied. The error code for
     * this exception object will determine how the supplied exception is used.
     * Error 100: A general exception. Inherits \System\Classes\ExceptionBase::applyMask()
     * Error 200: Mask the exception as INI content.
     * Error 300: Mask the exception as PHP content.
     * Error 400: Mask the exception as Twig content.
     * @param \Exception $exception The exception to modify.
     * @return void
     */
    public function applyMask(Exception $exception)
    {
        if ($this->code == 100 || $this->processCompoundObject($exception) === false) {
            parent::applyMask($exception);
            return;
        }
    }
}
