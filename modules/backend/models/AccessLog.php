<?php namespace Backend\Models;

use Model;
use Request;

/**
 * Model for logging access to the back-end
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class AccessLog extends Model
{
    /**
     * @var string The database table used by the model.
     */
    protected $table = 'backend_access_log';

    /**
     * @var array Relations
     */
    public $belongsTo = [
        'user' => User::class
    ];

    /**
     * Creates a log record
     * @param Backend\Models\User $user Admin user
     * @return self
     */
    public static function add($user)
    {
        $record = new static;
        $record->user = $user;
        $record->ip_address = Request::getClientIp();
        $record->save();

        return $record;
    }

    /**
     * Returns a recent entry, latest entry is not considered recent
     * if the creation day is the same as today.
     * @return self
     */
    public static function getRecent($user)
    {
        $records = static::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(2)
            ->get()
        ;

        if (!count($records)) {
            return null;
        }

        $first = $records->first();

        return !$first->created_at->isToday() ? $first : $records->pop();
    }
}
