<?php namespace October\Test\Models;

use Model;

/**
 * Post Model
 */
class Tag extends Model
{
    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_tags';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Rules
     */
    public $rules = [
        'name' => 'required',
    ];

    /**
     * @var bool Use timetamps
     */
    public $timestamps = false;

    /**
     * @var array Relations
     */
    public $belongsToMany = [
        'posts' => [
            Post::class,
            'table' => 'october_test_posts_tags',
            'key' => 'tag_id',
            'otherKey' => 'post_id'
        ]
    ];
}
