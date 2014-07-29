<?php namespace Cms\Models;

use Model;
use Request;

/**
 * Model for logging 404 errors
 */
class ErrorLog extends Model
{

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'cms_error_log';

    /**
     * @var array The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * Creates a log record
     * @return self
     */
    public static function add()
    {
        $record = static::firstOrNew([
            'url' => Request::fullUrl(),
            'referer' => Request::header('referer'),
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