<?php namespace October\Test\Models;

use Model;

/**
 * Category Model
 */
class Category extends Model
{

    use \October\Rain\Database\Traits\Sortable;
    use \October\Rain\Database\Traits\SimpleTree;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_categories';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Relations
     */
    public $hasOne = [];
    public $hasMany = [];
    public $belongsTo = [];
    public $belongsToMany = [];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [];
    public $attachMany = [];

}