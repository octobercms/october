<?php namespace Database\Tester\Models;

use Model;

class Author extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_authors';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Relations
     */
    public $belongsTo = [
        'user' => ['Database\Tester\Models\User', 'delete' => true],
        'country' => ['Database\Tester\Models\Country'],
        'user_soft' => ['Database\Tester\Models\SoftDeleteUser', 'key' => 'user_id', 'softDelete' => true],
    ];

    public $hasMany = [
        'posts' => 'Database\Tester\Models\Post',
    ];

    public $hasOne = [
        'phone' => 'Database\Tester\Models\Phone',
    ];

    public $belongsToMany = [
        'roles' => [
            'Database\Tester\Models\Role',
            'table' => 'database_tester_authors_roles'
        ],
        'executive_authors' => [
            'Database\Tester\Models\Role',
            'table' => 'database_tester_authors_roles',
            'conditions' => 'is_executive = 1'
        ],
    ];

    public $morphMany = [
        'event_log' => ['Database\Tester\Models\EventLog', 'name' => 'related', 'delete' => true, 'softDelete' => true],
    ];

    public $morphOne = [
        'meta' => ['Database\Tester\Models\Meta', 'name' => 'taggable'],
    ];
}

class SoftDeleteAuthor extends Author
{
    use \October\Rain\Database\Traits\SoftDelete;
}
