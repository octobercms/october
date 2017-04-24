<?php namespace Database\Tester\Models;

use Model;

class Phone extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_phones';

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
    public $belongsTo = [
        'author' => 'Database\Tester\Models\Author',
    ];

}
