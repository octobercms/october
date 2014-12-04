<?php namespace Cms\Models;

use Model;

/**
 * Customization data used by a theme
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeData extends Model
{
    // use \October\Rain\Database\Traits\Validation;

    /**
     * @var string The database table used by the model.
     */
    public $table = 'cms_theme_data';

    /**
     * @var array Guarded fields
     */
    protected $guarded = [];

    /**
     * @var array Fillable fields
     */
    protected $fillable = [];

    /**
     * @var array List of attribute names which are json encoded and decoded from the database.
     */
    protected $jsonable = ['data'];

    public function beforeSave()
    {
        /*
         * Dynamic attributes are stored in the jsonable attribute 'data'.
         */
        $staticAttributes = ['id', 'theme', 'data'];
        $dynamicAttributes = array_except($this->getAttributes(), $staticAttributes);

        $this->data = $dynamicAttributes;
        $this->setRawAttributes(array_only($this->getAttributes(), $staticAttributes));
    }
    
    public function afterFetch()
    {
        /*
         * Fill this model with the jsonable attributes kept in 'data'.
         */
        $this->setRawAttributes((array) $this->getAttributes() + (array) $this->data, true);
    }
}
