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
    const CODE_OWNERS = 'owners';

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'backend_user_groups';

    /**
     * @var array Validation rules
     */
    public $rules = [
        'name' => 'required|between:2,128|unique:backend_user_groups',
    ];

    /**
     * @var array Relations
     */
    public $belongsToMany = [
        'users' => [User::class, 'table' => 'backend_users_groups'],
        'users_count' => [User::class, 'table' => 'backend_users_groups', 'count' => true]
    ];

    public function afterCreate()
    {
        if ($this->is_new_user_default) {
            $this->addAllUsersToGroup();
        }
    }

    public function addAllUsersToGroup()
    {
        $this->users()->sync(User::lists('id'));
    }
}
