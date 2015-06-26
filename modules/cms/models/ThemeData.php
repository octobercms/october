<?php namespace Cms\Models;

use Lang;
use Model;
use Cms\Classes\Theme as CmsTheme;

/**
 * Customization data used by a theme
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeData extends Model
{
    use \October\Rain\Database\Traits\Validation;

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

    /**
     * @var array The rules to be applied to the data.
     */
    public $rules = [];

    /**
     * @var ThemeData Cached array of objects
     */
    protected static $instances = [];

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

    /**
     * Returns a cached version of this model, based on a Theme object.
     * @param $theme Cms\Classes\Theme
     * @return self
     */
    public static function forTheme($theme)
    {
        $dirName = $theme->getDirName();
        if ($themeData = array_get(self::$instances, $dirName)) {
            return $themeData;
        }

        $themeData = ThemeData::firstOrCreate(['theme' => $dirName]);
        return self::$instances[$dirName] = $themeData;
    }

    public function afterFetch()
    {
        /*
         * Repeater form fields store arrays and must be jsonable.
         */
        foreach ($this->getFormFields() as $id => $field) {
            if (isset($field['type']) && $field['type'] == 'repeater') {
                $this->jsonable[] = $id;
            }
        }

        /*
         * Fill this model with the jsonable attributes kept in 'data'.
         */
        $this->setRawAttributes((array) $this->getAttributes() + (array) $this->data, true);
    }

    public function beforeValidate()
    {
        if (!$this->exists)
            $this->setDefaultValues();
    }

    /**
     * Creates relationships for this model based on form field definitions.
     */
    public function initFormFields()
    {

    }

    /**
     * Sets default values on this model based on form field definitions.
     */
    public function setDefaultValues()
    {
        foreach ($this->getFormFields() as $attribute => $field) {
            if (!$value = array_get($field, 'default')) {
                continue;
            }

            $this->{$attribute} = $value;
        }
    }

    /**
     * Returns all fields defined for this model, based on form field definitions.
     */
    public function getFormFields()
    {
        if (!$theme = CmsTheme::load($this->theme))
            throw new Exception(Lang::get('Unable to find theme with name :name', $this->theme));

        return $theme->getConfigValue('form.fields', []) +
            $theme->getConfigValue('form.tabs.fields', []) +
            $theme->getConfigValue('form.secondaryTabs.fields', []);
    }
}
