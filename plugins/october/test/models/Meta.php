<?php namespace October\Test\Models;

use Model;

class Meta extends Model
{
    use \October\Rain\Database\Traits\Validation;
    
    public $table = 'october_test_meta';

    public $timestamps = false;

    public $morphTo = [
        'taggable' => []
    ];

    public $rules = [
        'meta_title'       => 'required',
        'meta_description' => 'required',
        'meta_keywords'    => 'required',
        'canonical_url'    => 'url',
        'redirect_url'     => 'url'
    ];
    
    public $fillable = [
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'redirect_url',
        'robot_index',
        'robot_follow'
    ];
}
