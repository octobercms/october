<?php namespace System\Models;

use Model;

/**
 * Model for logging system errors and debug trace messages
 */
class TraceLog extends Model
{

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_trace_log';

    /**
     * Creates a log record
     * @param string $message Specifies the message text
     * @param string $level Specifies the logging level
     * @param string $details Specifies the error details string
     * @return self
     */
    public static function add($message, $level = 'info', $details = null)
    {
        $record = new static;
        $record->message = $message;
        $record->level = $level;
        $record->details = $details;
        $record->save();

        return $record;
    }

}