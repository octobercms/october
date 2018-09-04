<?php namespace Cms\Models;

use Lang;
use Model;
use Cms\Classes\Theme as CmsTheme;
use System\Classes\CombineAssets;
use Exception;
use System\Models\File;

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
     * @var array Relations
     */
    public $attachOne = [];

    /**
     * @var ThemeData Cached array of objects
     */
    protected static $instances = [];

    /**
     * Before saving the model, strip dynamic attributes applied from config.
     * @return void
     */
    public function beforeSave()
    {
        /*
         * Dynamic attributes are stored in the jsonable attribute 'data'.
         */
        $staticAttributes = ['id', 'theme', 'data', 'created_at', 'updated_at'];
        $dynamicAttributes = array_except($this->getAttributes(), $staticAttributes);

        $this->data = $dynamicAttributes;
        $this->setRawAttributes(array_only($this->getAttributes(), $staticAttributes));
    }

    /**
     * Clear asset cache after saving to ensure `assetVar` form fields take 
     * immediate effect.
     */
    public function afterSave()
    {
        try {
            CombineAssets::resetCache();
        }
        catch (Exception $ex) {}
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

        try {
            $themeData = self::firstOrCreate(['theme' => $dirName]);
        }
        catch (Exception $ex) {
            // Database failed
            $themeData = new self(['theme' => $dirName]);
        }

        return self::$instances[$dirName] = $themeData;
    }

    /**
     * After fetching the model, intiialize model relationships based
     * on form field definitions.
     * @return void
     */
    public function afterFetch()
    {
        $data = (array) $this->data + $this->getDefaultValues();

        /*
         * Repeater form fields store arrays and must be jsonable.
         */
        foreach ($this->getFormFields() as $id => $field) {
            if (!isset($field['type'])) {
                continue;
            }

            if ($field['type'] === 'repeater') {
                $this->jsonable[] = $id;
            }
            elseif ($field['type'] === 'fileupload') {
                $this->attachOne[$id] = File::class;
                unset($data[$id]);
            }
        }

        /*
         * Fill this model with the jsonable attributes kept in 'data'.
         */
        $this->setRawAttributes((array) $this->getAttributes() + $data, true);
    }

    /**
     * Before model is validated, set the default values.
     * @return void
     */
    public function beforeValidate()
    {
        if (!$this->exists) {
            $this->setDefaultValues();
        }
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
        foreach ($this->getDefaultValues() as $attribute => $value) {
            $this->{$attribute} = $value;
        }
    }

    /**
     * Gets default values for this model based on form field definitions.
     * @return array
     */
    public function getDefaultValues()
    {
        $result = [];

        foreach ($this->getFormFields() as $attribute => $field) {
            if (($value = array_get($field, 'default')) === null) {
                continue;
            }

            $result[$attribute] = $value;
        }

        return $result;
    }

    /**
     * Returns all fields defined for this model, based on form field definitions.
     * @return array
     */
    public function getFormFields()
    {
        if (!$theme = CmsTheme::load($this->theme)) {
            throw new Exception(Lang::get('Unable to find theme with name :name', $this->theme));
        }

        $config = $theme->getFormConfig();

        return array_get($config, 'fields', []) +
            array_get($config, 'tabs.fields', []) +
            array_get($config, 'secondaryTabs.fields', []);
    }

    /**
     * Returns variables that should be passed to the asset combiner.
     * @return array
     */
    public function getAssetVariables()
    {
        $result = [];

        foreach ($this->getFormFields() as $attribute => $field) {
            if (!$varName = array_get($field, 'assetVar')) {
                continue;
            }

            $result[$varName] = $this->{$attribute};
        }

        return $result;
    }

    /**
     * Applies asset variables to the combiner filters that support it.
     * @return void
     */
    public static function applyAssetVariablesToCombinerFilters($filters)
    {
        $theme = CmsTheme::getActiveTheme();

        if (!$theme){
            return;
        }

        if (!$theme->hasCustomData()) {
            return;
        }

        $assetVars = $theme->getCustomData()->getAssetVariables();

        foreach ($filters as $filter) {
            if (method_exists($filter, 'setPresets')) {
                $filter->setPresets($assetVars);
            }
        }
    }

    /**
     * Generate a cache key for the combiner, this allows variables to bust the cache.
     * @return string
     */
    public static function getCombinerCacheKey()
    {
        $theme = CmsTheme::getActiveTheme();
        if (!$theme->hasCustomData()) {
            return '';
        }

        $customData = $theme->getCustomData();

        return (string) $customData->updated_at ?: '';
    }
}
