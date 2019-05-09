<?php namespace October\Test\Models;

use Model;

/**
 * Comment Model
 */
class Comment extends Model
{

    use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'october_test_comments';

    /**
     * @var array Guarded fields
     */
    protected $guarded = ['*'];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array Jsonable fields
     */
    protected $jsonable = ['breakdown', 'mood'];

    /**
     * @var array Rules
     */
    public $rules = [
        'name' => 'required',
    ];

    /**
     * @var array Relations
     */
    public $belongsTo = [
        'user' => ['October\Test\Models\User'],
        'post' => ['October\Test\Models\Post']
    ];

    public $attachOne = [
        'photo' => ['System\Models\File']
    ];

    public function scopeIsVisible($query)
    {
        return $query->where('is_visible', true);
    }
    
    public function getFeelingOptions()
    {
        return [
            'sad'      => 'Sad',
            'happy'    => 'Happy',
            'trolling' => "Just trollin' y'all",
        ];
    }
}
