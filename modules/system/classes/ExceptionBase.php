<?php namespace System\Classes;

use URL;
use File;
use Exception;

/**
 * The base exception class.
 * This class represents a base interface and set of properties
 * for system and application exceptions.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ExceptionBase extends Exception
{

    /**
     * @var Exception If this exception is acting as a mask, this property stores the face exception.
     */
    protected $mask;

    /**
     * @var string Hint Message to help the user with troubleshooting the error (optional).
     */
    public $hint;

    /**
     * @var array File content relating to the exception, each value of the array is a file line number.
     */
    protected $fileContent = [];

    /**
     * @var string Class name of the called Exception.
     */
    protected $className;

    /**
     * @var string Error type derived from the error code. Will be 'Undefined' if no code is used.
     */
    protected $errorType;

    /**
     * @var stdObject Cached code information for highlighting code.
     */
    protected $highlight;

    /**
     * CMS base exception class constructor. Inherits the native PHP Exception.
     * All CMS related classes should inherit this class, it creates a set of unified properties
     * and an interface for displaying the CMS exception page.
     * @param string $message Error message.
     * @param int $code Error code.
     * @param Exception $previous Previous exception.
     * @return void
     */
    public function __construct($message = "", $code = 0, Exception $previous = null)
    {
        if ($this->className === null) {
            $this->className = get_called_class();
        }

        if ($this->errorType === null)  {
            $this->errorType = 'Undefined';
        }

        parent::__construct($message, $code, $previous);
    }

    /**
     * Returns the class name of the called Exception.
     * @return string
     */
    public function getClassName()
    {
        return $this->className;
    }

    /**
     * Returns the error type derived from the error code used.
     * @return string
     */
    public function getErrorType()
    {
        return $this->errorType;
    }

    /**
     * Masks an exception with the called class. This should catch fatal and php errors.
     * It should always be followed by the unmask() method to remove the mask.
     * @param string $message Error message.
     * @param int $code Error code.
     * @return void
     */
    public static function mask($message = null, $code = 0)
    {
        $calledClass = get_called_class();
        $exception = new $calledClass($message, $code);
        ErrorHandler::applyMask($exception);
    }

    /**
     * Removes the active mask from the called class.
     * @return void
     */
    public static function unmask()
    {
        ErrorHandler::removeMask();
    }

    /**
     * If this exception acts as a mask, sets the face for the foreign exception.
     * @param Exception $exception Face for the mask, the underlying exception.
     * @return void
     */
    public function setMask(Exception $exception)
    {
        $this->mask = $exception;
        $this->applyMask($exception);
    }

    /**
     * This method is used when applying the mask exception to the face exception. 
     * It can be used as an override for child classes who may use different masking logic.
     * @param Exception $exception Face exception being masked.
     * @return void
     */
    public function applyMask(Exception $exception)
    {
        $this->file = $exception->getFile();
        $this->message = $exception->getMessage();
        $this->line = $exception->getLine();
        $this->className = get_class($exception);
    }

    /**
     * If this exception is acting as a mask, return the face exception. Otherwise return
     * this exception as the true one. 
     * @return Exception The underlying exception, or this exception if no mask is applied.
     */
    public function getTrueException()
    {
        if ($this->mask !== null)
            return $this->mask;

        return $this;
    }

    /**
     * Generates information used for highlighting the area of code in context of the exception line number.
     * The highlighted block of code will be six (6) lines before and after the problem line number.
     * @return array Highlight information as an array, the following keys are supplied:
     * startLine - The starting line number, 6 lines before the error line.
     * endLine - The ending line number, 6 lines after the error line.
     * errorLine - The focused error line number.
     * lines - An array of all the lines to be highlighted, each value is a line of code.
     */
    public function getHighlight()
    {
        if ($this->highlight !== null)
            return $this->highlight;

        if (!$this->fileContent && File::exists($this->file) && is_readable($this->file)) {
            $this->fileContent = @file($this->file);
        }

        $errorLine = $this->line - 1;
        $startLine = $errorLine - 6;

        if ($startLine < 0)
            $startLine = 0;

        $endLine = $startLine + 12;
        $lineNum = count($this->fileContent);
        if ($endLine > $lineNum-1)
            $endLine = $lineNum-1;

        $areaLines = array_slice($this->fileContent, $startLine, $endLine - $startLine + 1);

        $result = [
            'startLine' => $startLine,
            'endLine' => $endLine,
            'errorLine' => $errorLine,
            'lines' => []
        ];

        foreach ($areaLines as $index => $line) {
            $result['lines'][$startLine + $index] = $line;
        }

        return $this->highlight = (object)$result;
    }
    
    /**
     * Returns an array of line numbers used for highlighting the problem area of code.
     * This will be six (6) lines before and after the error line number.
     * @return array Array of code lines.
     */
    public function getHighlightLines()
    {
        $lines = $this->getHighlight()->lines;
        foreach ($lines as $index => $line) {
            $lines[$index] = strlen(trim($line)) ? htmlentities($line) : '&nbsp;'.PHP_EOL;
        }
        return $lines;
    }

    /**
     * Returns the call stack as an array of values containing a stack information object.
     * @return Array with stack information, each value will be an object with these values:
     * id - The stack ID number.
     * code - The class and function name being called.
     * args - The arguments passed to the code function above.
     * file - Reference to the file containing the called code.
     * line - Reference to the line number of the file.
     */
    public function getCallStack()
    {
        $result = [];
        $traceInfo = $this->filterCallStack($this->getTrueException()->getTrace());
        $lastIndex = count($traceInfo) - 1;
        
        foreach ($traceInfo as $index => $event) {

            $functionName = (isset($event['class']) && strlen($event['class'])) 
                ? $event['class'].$event['type'].$event['function'] 
                : $event['function'];

            $file = isset($event['file']) ? URL::to(str_replace(public_path(), '', $event['file'])) : null;
            $line = isset($event['line']) ? $event['line'] : null;

            $args = null;
            if (isset($event['args']) && count($event['args'])) {
                $args = $this->formatStackArguments($event['args'], false);
            }
            
            $result[] = (object)[
                'id'   => $lastIndex - $index + 1,
                'code' => $functionName,
                'args' => $args ? htmlentities($args) : '',
                'file' => $file,
                'line' => $line
            ];
        }

        return $result;
    }

    /**
     * Removes the final steps of a call stack, which add no value for the user.
     * The following exceptions and any trace information afterwards will be filtered:
     * - Illuminate\Exception\Handler
     *
     * @param array $traceInfo The trace information from getTrace() or debug_backtrace().
     * @return array The filtered array containing the trace information.
     */
    protected function filterCallStack($traceInfo)
    {
        /*
         * Determine if filter should be used at all.
         */
        $useFilter = false;
        foreach ($traceInfo as $event) {
            if (isset($event['class']) && $event['class'] == 'Illuminate\Exception\Handler' && $event['function'] == 'handleError') {
                $useFilter = true;
            }
        }

        if (!$useFilter)
            return $traceInfo;

        $filterResult = [];
        $pruneResult = true;
        foreach ($traceInfo as $index => $event) {
            /*
             * Prune the tail end of the trace from the framework exception handler.
             */
            if (isset($event['class']) && $event['class'] == 'Illuminate\Exception\Handler' && $event['function'] == 'handleError') {
                $pruneResult = false;
                continue;
            }

            if ($pruneResult)
                continue;

            $filterResult[$index] = $event;
        }

        return $filterResult;
    }

    /**
     * Prepares a function or method argument list for display in HTML or text format
     * @param array arguments A list of the function or method arguments
     * @return string
     */
    protected function formatStackArguments($arguments)
    {
        $argsArray = array();
        foreach ($arguments as $argument) {
            $arg = null;

            if (is_array($argument)) {
                $items = array();

                foreach ($argument as $index => $obj) {
                    if (is_array($obj))
                        $value = 'array('.count($obj).')';

                    elseif (is_object($obj))
                        $value = 'object('.get_class($obj).')';

                    elseif (is_integer($obj))
                        $value = $obj;

                    elseif ($obj === null)
                        $value = "null";

                    else
                        $value = "'".$obj."'";

                    $items[] = $index . ' => ' . $value;
                }

                if (count($items))
                    $arg = 'array(' . count($argument) . ') [' . implode(', ', $items) . ']';
                else
                    $arg = 'array(0)';
            }
            elseif (is_object($argument))
                $arg = 'object('.get_class($argument).')';
            elseif ($argument === null)
                $arg = "null";
            elseif (is_integer($argument))
                $arg = $argument;
            else
                $arg = "'".$argument."'";

            $argsArray[] = $arg;
        }

        return implode(', ', $argsArray);
    }

}
