<?php namespace System\Models;

use Model;
use Request;
use DbDongle;

/**
 * Model for logging 404 errors
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
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
     * @var array List of attribute names which are json encoded and decoded from the database.
     */
    protected $jsonable = ['referer'];

    /**
     * Creates a log record
     * @return self
     */
    public static function add($statusCode = 404)
    {
        if (!DbDongle::hasDatabase()) return;

        $record = static::firstOrNew([
            'url' => Request::fullUrl(),
            'status_code' => $statusCode,
        ]);

        if ($referer = Request::header('referer')) {
            $referers = (array) $record->referer ?: [];
            $referers[] = $referer;
            $record->referer = $referers;
        }

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
