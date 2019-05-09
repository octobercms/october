<?php namespace October\Test\Models;

use Model;

/**
 * Theme Model
 */
class Theme extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_themes';

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
    public $morphMany = [
        'reviews' => ['October\Test\Models\Review', 'name' => 'product'],
    ];

    public $morphOne = [
        'meta' => ['October\Test\Models\Meta', 'name' => 'taggable'],
    ];
}