<?php namespace System\Models;

use Model;
use Request;

/**
 * Model for logging 404 errors
 */
class RequestLog extends Model
{

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_request_logs';

    /**
     * @var array The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * Creates a log record
     * @return self
     */
    public static function add($statusCode = 404)
    {
        $record = static::firstOrNew([
            'url' => Request::fullUrl(),
            'referer' => Request::header('referer'),
            'status_code' => $statusCode,
        ]);

        if (!$record->exists) {
            $record->count = 1;
            $record->save();
        }
        else {
            $record->increment('count');
        }

        return $record;
    }

}