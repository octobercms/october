<?php namespace Backend\Models;

use October\Rain\Auth\Models\Group as GroupBase;

/**
 * Administrator group
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class UserGroup extends GroupBase
{
    /**
     * @var string The database table used by the model.
     */
    protected $table = 'backend_user_groups';

    /**
     * @var array Validation rules
     */
    public $rules = [
        'name' => 'required|between:4,16|unique:backend_user_groups',
    ];

    /**
     * @var array Relations
     */
    public $belongsToMany = [
        'users' => ['Backend\Models\User', 'table' => 'backend_users_groups']
    ];
}
