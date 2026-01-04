<?php namespace System\Models;

use Str;
use Model;
use System;
use Exception;

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
            $record->details = (array) $details;
        }

        try {
            $record->save();
        }
        catch (Exception $ex) {
        }

        return $record;
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

        if (is_array($this->details)) {
            $formatted .= " " . json_encode($this->details, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRESERVE_ZERO_FRACTION | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PARTIAL_OUTPUT_ON_ERROR);
        }

        return $formatted;
    }
}
