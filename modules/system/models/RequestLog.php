<?php namespace System\Models;

use App;
use Model;
use Request;

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
        if (!App::hasDatabase()) {
            return;
        }

        if (!LogSetting::get('log_requests')) {
            return;
        }

        $record = static::firstOrNew([
            'url' => substr(Request::fullUrl(), 0, 191),
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
