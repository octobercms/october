<?php namespace Backend\Models;

use October\Rain\Auth\Models\Throttle as ThrottleBase;

/**
 * Administrator throttling model
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class UserThrottle extends ThrottleBase
{
    /**
     * @var string The database table used by the model.
     */
    protected $table = 'backend_user_throttle';

    /**
     * @var array Relations
     */
    public $belongsTo = [
        'user' => ['Backend\Models\User']
    ];
}
