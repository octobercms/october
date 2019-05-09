<?php namespace October\Test\Models;

use Model;

/**
 * Model
 */
class Page extends Model
{
    use \October\Rain\Database\Traits\Validation;
    
    /*
     * Disable timestamps by default.
     * Remove this line if timestamps are defined in the database table.
     */
    public $timestamps = false;


    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_pages';

    public $jsonable = [
        'content'
    ];

    /**
     * @var array Validation rules
     */
    public $rules = [
        'type' => 'required',
        'content.title' => 'required|min:3'
    ];
}
