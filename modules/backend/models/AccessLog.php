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
        'user' => ['Backend\Models\User']
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
}
