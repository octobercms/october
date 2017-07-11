<?php namespace Backend\Models;

use October\Rain\Auth\Models\Role as RoleBase;

/**
 * Administrator role
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class UserRole extends RoleBase
{
    /**
     * @var string The default role code.
     */
    const DEFAULT_CODE = 'default';

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'backend_user_roles';

    /**
     * @var array Validation rules
     */
    public $rules = [
        'name' => 'required|between:2,128|unique:backend_user_roles',
    ];

    /**
     * @var array Relations
     */
    public $hasMany = [
        'users' => [User::class, 'key' => 'role_id'],
        'users_count' => [User::class, 'key' => 'role_id', 'count' => true]
    ];
}
