<?php namespace Database\Tester\Models;

use Model;

class Post extends Model
{

    /**
     * @var string The database table used by the model.
     */
    public $table = 'database_tester_posts';

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

class SluggablePost extends Post
{

    use \October\Rain\Database\Traits\Sluggable;

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array List of attributes to automatically generate unique URL names (slugs) for.
     */
    protected $slugs = [
        'slug' => 'title'
    ];

}

class RevisionablePost extends Post
{

    use \October\Rain\Database\Traits\Revisionable;
    use \October\Rain\Database\Traits\SoftDeleting;

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Dates
     */
    protected $dates = ['published_at', 'deleted_at'];

    /**
     * @var array Monitor these attributes for changes.
     */
    protected $revisionable = [
        'title',
        'slug',
        'description',
        'is_published',
        'published_at',
        'deleted_at'
    ];

    /**
     * @var int Maximum number of revision records to keep.
     */
    public $revisionableLimit = 8;

    /**
     * @var array Relations
     */
    public $morphMany = [
        'revision_history' => ['System\Models\Revision', 'name' => 'revisionable']
    ];

    /**
     * The user who made the revision.
     */
    public function getRevisionableUser()
    {
        return 7;
    }

}