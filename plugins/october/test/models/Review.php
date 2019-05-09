<?php namespace October\Test\Models;

use Model;

/**
 * Review Model
 */
class Review extends Model
{
    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_reviews';

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
    public $morphTo = [
        'product' => []
    ];

    public $attachOne = [
        'photo' => ['System\Models\File']
    ];
}
