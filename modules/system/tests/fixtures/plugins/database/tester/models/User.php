<?php namespace Database\Tester\Models;

use Model;

class User extends Model
{
    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_users';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Relations
     */
    public $hasOne = [
        'author' => [
            Author::class,
        ]
    ];

    public $hasOneThrough = [
        'phone' => [
            Phone::class,
            'through' => Author::class,
        ],
    ];

    public $attachOne = [
        'avatar' => \System\Models\File::class
    ];

    public $attachMany = [
        'photos' => \System\Models\File::class
    ];
}

class SoftDeleteUser extends User
{
    use \October\Rain\Database\Traits\SoftDelete;
}

class UserWithPhotosValidation extends User
{
    use \October\Rain\Database\Traits\Validation;

    public $rules = [
        'photos' => 'required',
    ];
}

class UserWithAuthor extends User
{
    public $hasOne = [
        'author' => [
            Author::class,
            'key' => 'user_id',
            'delete' => true
        ],
    ];
}

class UserWithSoftAuthor extends User
{
    public $hasOne = [
        'author' => [
            SoftDeleteAuthor::class,
            'key' => 'user_id',
            'softDelete' => true
        ],
    ];
}

class UserWithAuthorAndSoftDelete extends UserWithAuthor
{
    use \October\Rain\Database\Traits\SoftDelete;
}

class UserWithSoftAuthorAndSoftDelete extends UserWithSoftAuthor
{
    use \October\Rain\Database\Traits\SoftDelete;
}
