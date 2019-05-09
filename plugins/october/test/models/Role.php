<?php namespace October\Test\Models;

use Model;

/**
 * Role Model
 */
class Role extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_roles';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Relations
     */
    public $belongsToMany = [
        'users' => ['October\Test\Models\User', 'table' => 'october_test_users_roles']
    ];

    public $attachMany = [
        'photos' => ['System\Models\File'],
    ];

}