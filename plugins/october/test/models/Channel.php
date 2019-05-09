<?php namespace October\Test\Models;

use Model;

/**
 * Channel Model
 */
class Channel extends Model
{

    use \October\Rain\Database\Traits\NestedTree;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_channels';

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
    public $belongsTo = [
        'user' => 'October\Test\Models\User'
    ];
    public $belongsToMany = [
        'related' => [
            'October\Test\Models\Channel',
            'table' => 'october_test_related_channels',
            'key' => 'related_id'
        ]
    ];
    public $morphTo = [];
    public $morphOne = [];
    public $morphMany = [];
    public $attachOne = [];
    public $attachMany = [];

    public function getCustomTitleAttribute()
    {
        return $this->title.' (#'.$this->id.')';
    }

}