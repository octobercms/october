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
    public $hasMany = [
        'posts' => 'Database\Tester\Models\Post',
    ];

    /**
     * @var array Relations
     */
    public $hasOne = [
        'phone' => 'Database\Tester\Models\Phone',
    ];

}