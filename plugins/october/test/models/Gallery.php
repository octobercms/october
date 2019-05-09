<?php

namespace October\Test\Models;

use Model;
use October\Rain\Database\Traits\Validation;

class Gallery extends Model
{
    use Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_galleries';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [
        'title',
    ];

    public $rules = [
        'title' => 'required|between:3,255',
    ];

    /**
     * @var array Relations
     */
    public $morphedByMany = [
        'posts' => [
            'October\Test\Models\Post',
            'name' => 'entity',
            'table' => 'october_test_gallery_entity'
        ],
    ];

    public $attachMany = [
        'images' => 'System\Models\File',
    ];
}
