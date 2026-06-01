<?php namespace System\Models;

use Str;
use File;
use Model;
use System;
use Exception;
use Throwable;

/**
 * EventLog model for logging system errors and debug trace messages
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class EventLog extends Model
{
    /**
     * @var string table associated with the model
     */
    protected $table = 'system_event_logs';

    /**
     * @var array jsonable attribute names that are json encoded and decoded from the database
     */
    protected $jsonable = ['details'];

    /**
     * useLogging returns true if this logger should be used
     */
    public static function useLogging(): bool
    {
        if (defined('OCTOBER_TRACING_SQL') || defined('OCTOBER_NO_EVENT_LOGGING')) {
            return false;
        }

        try {
            return (
                !defined('OCTOBER_NO_EVENT_LOGGING') &&
                class_exists('Model') &&
                Model::getConnectionResolver() &&
                System::hasDatabase() &&
                LogSetting::get('log_events')
            );
        }
        catch (Exception $ex) {
            return false;
        }
    }

    /**
     * add a log record
     * @param string $message Specifies the message text
     * @param string $level Specifies the logging level
     * @param array $details Specifies the error details string
     */
    public static function add($message, $level = 'info', $details = null): EventLog
    {
        $record = new static;
        $record->message = $message;
        $record->level = $level;

        if ($details !== null) {
            $record->details = static::normalizeDetails((array) $details);
        }

        try {
            $record->save();
        }
        catch (Exception $ex) {
        }

        return $record;
    }

    /**
     * normalizeDetails converts non-serializable values in the details array,
     * such as Throwable objects, into structured data that survives JSON encoding.
     */
    protected static function normalizeDetails(array $details): array
    {
        foreach ($details as $key => $value) {
            if ($value instanceof Throwable) {
                $details[$key] = static::normalizeException($value);
            }
        }

        return $details;
    }

    /**
     * normalizeException converts a Throwable into a JSON-safe array.
     */
    protected static function normalizeException(Throwable $exception): array
    {
        $result = [
            'class' => get_class($exception),
            'message' => $exception->getMessage(),
            'code' => $exception->getCode(),
            'file' => File::nicePath($exception->getFile()),
            'line' => $exception->getLine(),
            'trace' => array_map(function ($frame) {
                $parts = [];
                if (isset($frame['file'])) {
                    $parts['file'] = File::nicePath($frame['file']);
                }
                if (isset($frame['line'])) {
                    $parts['line'] = $frame['line'];
                }
                if (isset($frame['class'])) {
                    $parts['call'] = $frame['class'] . ($frame['type'] ?? '') . ($frame['function'] ?? '');
                }
                elseif (isset($frame['function'])) {
                    $parts['call'] = $frame['function'];
                }
                return $parts;
            }, $exception->getTrace()),
        ];

        if ($exception->getPrevious()) {
            $result['previous'] = static::normalizeException($exception->getPrevious());
        }

        return $result;
    }

    /**
     * getLevelAttribute will beautify the "level" value
     * @param  string $level
     * @return string
     */
    public function getLevelAttribute($level)
    {
        return ucfirst($level);
    }

    /**
     * getSummaryAttribute creates a shorter version of the message attribute,
     * extracts the exception message or limits by 100 characters.
     * @return string
     */
    public function getSummaryAttribute()
    {
        if (preg_match("/with message '(.+)' in/", $this->message, $match)) {
            return $match[1];
        }

        // Get first line of message
        preg_match('/^([^\n\r]+)/m', $this->message, $matches);

        return Str::limit($matches[1] ?? '', 500);
    }

    /**
     * getMessageFormattedAttribute returns the full message formatted with context data (details)
     */
    public function getMessageFormattedAttribute()
    {
        $formatted = $this->message;

        if (is_array($this->details) && count($this->details) > 0) {
            $formatted .= "\n\n" . json_encode(
                $this->details,
                JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PARTIAL_OUTPUT_ON_ERROR
            );
        }

        return $formatted;
    }
}
