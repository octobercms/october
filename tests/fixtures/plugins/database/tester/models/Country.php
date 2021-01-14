<?php namespace Database\Tester\Models;

use Model;

class Country extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_countries';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    public $hasMany = [
        'users' => [
            'Database\Tester\Models\User',
        ],
    ];

    public $hasManyThrough = [
        'posts' => [
            'Database\Tester\Models\Post',
            'through' => 'Database\Tester\Models\Author',
        ]
    ];
}

class SoftDeleteCountry extends Country
{
    use \October\Rain\Database\Traits\SoftDelete;
}
