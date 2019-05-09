<?php namespace October\Test\Models;

use Model;

/**
 * Plugin Model
 */
class Plugin extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_plugins';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];
    
    /**
     * Validation Rules.
     */
    public $rules = [
        'name' => 'required',
        'code' => 'required',
        'content' => 'required'
    ];

    /**
     * @var array Relations
     */
    public $morphMany = [
        'reviews' => ['October\Test\Models\Review', 'name' => 'product'],
    ];

    public $morphOne = [
        'meta' => ['October\Test\Models\Meta', 'name' => 'taggable'],
    ];
}
