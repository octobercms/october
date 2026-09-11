<?php namespace Cms\Models;

use Cache;
use Model;
use Event;
use October\Rain\Html\Helper as HtmlHelper;
use Cms\Classes\Theme as CmsTheme;
use System\Classes\CombineAssets;
use System\Models\File;
use Exception;

/**
 * ThemeData for theme customization
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
     * @var array guarded fields
     */
    protected $guarded = [];

    /**
     * @var array fillable fields
     */
    protected $fillable = [];

    /**
     * @var array jsonable attribute names that are json encoded and decoded from the database
     */
    protected $jsonable = ['data'];

    /**
     * @var array rules to be applied to the data.
     */
    public $rules = [];

    /**
     * @var array customMessages to be applied to the data.
     */
    public $customMessages = [];

    /**
     * @var array attributeNames to be applied to the data.
     */
    public $attributeNames = [];

    /**
     * @var array attachOne relations
     */
    public $attachOne = [];

    /**
     * @var ThemeData instances of cached objects
     */
    protected static $instances = [];

    /**
     * clear cached theme data when the record is removed.
     */
    public function afterDelete()
    {
        $this->clearCache($this->theme);
    }

    /**
     * beforeSave the model, strip dynamic attributes applied from config.
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
     * afterSave clears asset cache after saving to ensure `assetVar` form fields take
     * immediate effect.
     */
    public function afterSave()
    {
        try {
            $this->clearCache($this->theme);
            CombineAssets::resetCache();
        }
        catch (Exception $ex) {
        }
    }

    /**
     * forTheme returns a cached version of this model, based on a Theme object
     */
    public static function forTheme(CmsTheme $theme): ThemeData
    {
        $dirName = $theme->getDirName();
        if ($themeData = array_get(self::$instances, $dirName)) {
            return $themeData;
        }

        $cacheKey = static::getCacheKey($dirName);

        if (is_array($cacheData = Cache::get($cacheKey))) {
            return self::$instances[$dirName] = static::newFromCache($cacheData);
        }

        try {
            $themeData = static::createThemeDataModel()->firstOrCreate(['theme' => $dirName]);
        }
        catch (Exception $ex) {
            // Database failed
            $themeData = static::createThemeDataModel(['theme' => $dirName]);
        }

        $themeData->initFormFields();

        self::$instances[$dirName] = $themeData;

        if ($themeData->exists) {
            Cache::put($cacheKey, static::getCacheableAttributes($themeData), now()->addMinutes(1440));
        }

        return $themeData;
    }

    /**
     * getCacheableAttributes returns the persisted columns stored in cache
     */
    protected static function getCacheableAttributes(ThemeData $themeData): array
    {
        $data = $themeData->getOriginal('data') ?? $themeData->data;

        if (is_string($data)) {
            $data = json_decode($data, true) ?: [];
        }

        return [
            'id' => $themeData->getOriginal('id') ?? $themeData->getKey(),
            'theme' => $themeData->getOriginal('theme') ?? $themeData->theme,
            'data' => (array) $data,
            'created_at' => (string) ($themeData->getOriginal('created_at') ?? $themeData->created_at),
            'updated_at' => (string) ($themeData->getOriginal('updated_at') ?? $themeData->updated_at),
        ];
    }

    /**
     * newFromCache rehydrates a model from cached row attributes
     */
    protected static function newFromCache(array $attributes): ThemeData
    {
        return static::createThemeDataModel()->newFromBuilder($attributes);
    }

    /**
     * afterFetch the model, intiialize model relationships based on form field definitions.
     */
    public function afterFetch()
    {
        $this->initFormFields();

        // Fill this model with the jsonable attributes kept in 'data' and
        // purge the relations that don't need to exist as local attributes
        $data = (array) $this->data + $this->getDefaultValues();

        $toPurge = ['fileupload'];
        foreach ($this->getFormFields() as $id => $field) {
            if (isset($field['type']) && in_array($field['type'], $toPurge)) {
                unset($data[$id]);
            }
        }

        $this->setRawAttributes((array) $this->getAttributes() + $data, true);
    }

    /**
     * clearCache forgets the stored query result
     */
    public function clearCache($dirName)
    {
        Cache::forget(static::getCacheKey($dirName));
    }

    /**
     * beforeValidate set the default values.
     */
    public function beforeValidate()
    {
        if (!$this->exists) {
            $this->setDefaultValues();
        }
    }

    /**
     * initFormFields sets relations and others based on field definitions.
     */
    public function initFormFields()
    {
        foreach ($this->getFormFields() as $id => $field) {
            if (strpos($id, '[') !== false) {
                $idSeg = HtmlHelper::nameToArray($id)[0];
                if (!$this->isJsonable($idSeg)) {
                    $this->addJsonable($idSeg);
                }

                continue;
            }

            if (!isset($field['type'])) {
                continue;
            }

            if (in_array($field['type'], ['repeater', 'nestedform'])) {
                if (!$this->isJsonable($id)) {
                    $this->addJsonable($id);
                }
            }
            elseif ($field['type'] === 'mediafinder' && isset($field['maxItems'])) {
                $maxItems = (int) $field['maxItems'];
                if ($maxItems !== 1 && !$this->isJsonable($id)) {
                    $this->addJsonable($id);
                }
            }
            elseif ($field['type'] === 'fileupload') {
                $this->attachOne[$id] = File::class;
            }
        }
    }

    /**
     * setDefaultValues on this model based on form field definitions.
     */
    public function setDefaultValues()
    {
        foreach ($this->getDefaultValues() as $attribute => $value) {
            $this->{$attribute} = $value;
        }
    }

    /**
     * getDefaultValues for this model based on form field definitions.
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
     * getFormFields defined for this model, based on form field definitions.
     * @return array
     */
    public function getFormFields()
    {
        $theme = CmsTheme::load($this->theme);

        if (!$theme->isValid()) {
            return [];
        }

        $config = $theme->getFormConfig();

        return (array) array_get($config, 'fields') +
            (array) array_get($config, 'tabs.fields') +
            (array) array_get($config, 'secondaryTabs.fields');
    }

    /**
     * getAssetVariables returns variables that should be passed to the asset combiner.
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
     * applyAssetVariablesToCombinerFilters that support it
     */
    public static function applyAssetVariablesToCombinerFilters($filters)
    {
        $theme = CmsTheme::getActiveTheme();

        if (!$theme || !$theme->hasCustomData()) {
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
     * getCacheKey returns a cache key for this theme data record
     */
    public static function getCacheKey(string $theme): string
    {
        return 'cms.theme.data.'.$theme;
    }

    /**
     * getCombinerCacheKey generates a cache key for the combiner, this allows variables to
     * bust the cache.
     * @return string
     */
    public static function getCombinerCacheKey()
    {
        $theme = CmsTheme::getActiveTheme();

        if (!$theme || !$theme->hasCustomData()) {
            return '';
        }

        $customData = $theme->getCustomData();

        return (string) $customData->updated_at ?: '';
    }

    /**
     * createThemeDataModel is an opportunity to override the theme data model
     */
    public static function createThemeDataModel(array $attributes = []): ThemeData
    {
        /**
         * @event cms.theme.createThemeDataModel
         * Overrides the theme data model used by the system, which must inherit the main model
         *
         * Example usage:
         *
         *     Event::listen('cms.theme.createThemeDataModel', function (array $attributes) {
         *         return new MyCustomThemeDataModel($attributes);
         *     });
         */
        if ($newModel = Event::fire('cms.theme.createThemeDataModel', [$attributes], true)) {
            if ($newModel instanceof ThemeData) {
                return $newModel;
            }
        }

        return new static($attributes);
    }
}
