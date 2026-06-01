<?php namespace Cms\Classes;

use File;
use Twig\Error\Error as TwigError;
use October\Rain\Exception\ApplicationException;
use October\Rain\Halcyon\Processors\SectionParser;
use ErrorException;
use CompileError;
use Throwable;

/**
 * CmsException handles CMS related errors. Allows the masking of other exception types which
 * uses actual source CMS files -- instead of cached files -- for their error content.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class CmsException extends ApplicationException
{
    /**
     * @var \Cms\Contracts\CmsObject compoundObject used for masking errors.
     */
    protected $cmsObject;

    /**
     * @var array errorCodes for each error distinction.
     */
    protected static $errorCodes = [
        100 => 'General',
        200 => 'INI Settings',
        300 => 'PHP Content',
        400 => 'Twig Template'
    ];

    /**
     * __construct the CMS exception object.
     * @param mixed $message The message to display as a string, or a CmsCompoundObject that is used
     * for using this exception as a mask for another exception type.
     * @param int $code Error code to specify the exception type:
     * Error 100: A general exception.
     * Error 200: Mask the exception as INI content.
     * Error 300: Mask the exception as PHP content.
     * Error 400: Mask the exception as Twig content.
     * @param Throwable $previous Previous exception.
     */
    public function __construct($message = null, $code = 100, ?Throwable  $previous = null)
    {
        if ($message instanceof \Cms\Contracts\CmsObject) {
            $this->cmsObject = $message;
            $message = '';
        }

        if (isset(static::$errorCodes[$code])) {
            $this->errorType = static::$errorCodes[$code];
        }

        parent::__construct($message, $code, $previous);
    }

    /**
     * processCompoundObject checks some conditions to confirm error has actually occurred
     * due to the CMS template code, not some external code. If the error
     * has occurred in external code, the function will return false. Otherwise return
     * true and modify the exception by overriding it's content, line and message values
     * to be accurate against a CMS object properties.
     * @param Throwable $exception The exception to modify.
     * @return bool
     */
    public function processCompoundObject(Throwable $exception)
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
            $this->file = $this->cmsObject->getFilePath();

            if (File::isFile($this->file) && is_readable($this->file)) {
                $this->fileContent = @file($this->file);
            }
        }

        return $result;
    }

    /**
     * processIni overrides properties of an exception specific to the INI section
     * of a CMS object.
     * @param Throwable $exception The exception to modify.
     * @return bool
     */
    protected function processIni(Throwable $exception)
    {
        $message = $exception->getMessage();

        // Expecting: syntax error, unexpected '!' in Unknown on line 4
        if (!str_starts_with($message, 'syntax error')) {
            return false;
        }
        if (strpos($message, 'Unknown') === false) {
            return false;
        }
        if (strpos($exception->getFile(), 'Ini.php') === false) {
            return false;
        }

        // Line number from parse_ini_string() error.
        // The last word should contain the line number.
        $parts = explode(' ', $message);
        $line = array_pop($parts);
        $this->line = (int) $line;

        // Find where the ini settings section begins
        $offsetArray = SectionParser::parseOffset($this->cmsObject->getContent());
        $this->line += $offsetArray['settings'];

        $this->message = $message;

        // Account for line 0
        $this->line--;

        return true;
    }

    /**
     * processPhp override properties of an exception specific to the PHP section
     * of a CMS object.
     * @param Throwable $exception The exception to modify.
     * @return bool
     */
    protected function processPhp(Throwable $exception)
    {
        // Default offset for the php namespace and bracket tag
        $lineOffset = -2;

        // Fatal or Compiler Error
        if ($exception instanceof ErrorException || $exception instanceof CompileError) {
            $check = false;
            $lineOffset++;

            // Expected: */modules/cms/classes/CodeParser.php(165) : eval()'d code line 7
            if (strpos($exception->getFile(), 'CodeParser.php')) {
                $check = true;
            }

            // Expected: */storage/cms/cache/39/05/home.htm.php
            if (strpos($exception->getFile(), $this->cmsObject->getFileName() . '.php')) {
                $check = true;
            }

            if (!$check) {
                return false;
            }
        }
        // Errors occurring the PHP code base class (Cms\Classes\CodeBase)
        else {
            $trace = $exception->getTrace();
            if ($class = $trace[0]['class'] ?? null) {
                if (!is_subclass_of($class, CodeBase::class)) {
                    return false;
                }
            }
        }

        // Fetch message and calculate line number
        $this->message = $exception->getMessage();
        $this->line = $exception->getLine() + $lineOffset;

        // Find where the php code section begins
        $offsetArray = SectionParser::parseOffset($this->cmsObject->getContent());
        $this->line += $offsetArray['code'];

        // Account for line 0
        $this->line--;

        return true;
    }

    /**
     * processTwig overrides properties of an exception specific to the Twig section
     * of a CMS object.
     * @param Throwable $exception The exception to modify.
     * @return bool
     */
    protected function processTwig(Throwable $exception)
    {
        // Must be a Twig related exception
        if (!$exception instanceof TwigError) {
            return false;
        }

        $this->message = $exception->getRawMessage();
        $this->line = $exception->getTemplateLine();

        // Find where the twig markup section begins
        $offsetArray = SectionParser::parseOffset($this->cmsObject->getContent());
        $this->line += $offsetArray['markup'];

        // Account for line 0
        $this->line--;

        return true;
    }

    /**
     * applyMask masks this exception with the details of the supplied. The error code for
     * this exception object will determine how the supplied exception is used.
     * Error 100: A general exception. Inherits \System\Classes\ExceptionBase::applyMask()
     * Error 200: Mask the exception as INI content.
     * Error 300: Mask the exception as PHP content.
     * Error 400: Mask the exception as Twig content.
     * @param Throwable $exception The exception to modify.
     * @return void
     */
    public function applyMask(Throwable $exception)
    {
        if ($this->code === 100 || $this->processCompoundObject($exception) === false) {
            parent::applyMask($exception);
            return;
        }
    }
}
