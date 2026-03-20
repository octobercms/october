<?php namespace System\Models;

use Log;
use Site;
use Cache;
use System;
use Artisan;
use October\Rain\Database\ExpandoModel;
use Exception;

/**
 * SettingModel base class
 *
 * Add this the model class definition:
 *
 *     public $settingsCode = 'author_plugin_code';
 *     public $settingsFields = 'fields.yaml';
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class SettingModel extends ExpandoModel
{
    use \System\Traits\ConfigMaker;
    use \System\Models\SettingModel\HasMultisite;
    use \System\Models\SettingModel\HasMultisiteGroup;

    /**
     * @var string table associated with the model
     */
    protected $table = 'system_settings';

    /**
     * @var bool timestamps enabled
     */
    public $timestamps = false;

    /**
     * @var string expandoColumn name to store the data
     */
    protected $expandoColumn = 'value';

    /**
     * @var array expandoPassthru attributes that should not be serialized
     */
    protected $expandoPassthru = ['item', 'site_id', 'site_root_id', 'site_group_id'];

    /**
     * @var array fieldConfig
     */
    protected $fieldConfig;

    /**
     * @var array instances is an internal cache of model objects.
     */
    protected static $instances = [];

    /**
     * __construct
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->bindEvent('model.beforeSave', [$this, 'settingBeforeSave']);
        $this->bindEvent('model.afterSave', [$this, 'settingAfterSave']);
    }

    /**
     * settingBeforeSave
     */
    public function settingBeforeSave()
    {
        $this->item = $this->settingsCode;
    }

    /**
     * settingAfterSave, clear the cached query entry
     * and restart queue workers so they have the latest settings
     * @return void
     */
    public function settingAfterSave()
    {
        $this->clearCache();

        try {
            Artisan::call('queue:restart');
        }
        catch (Exception $e) {
            Log::warning($e->getMessage());
        }
    }

    /**
     * instance of the settings model
     */
    public static function instance()
    {
        $model = new static;

        $cacheKey = $model->getCacheKey();
        if (isset(static::$instances[$cacheKey])) {
            return static::$instances[$cacheKey];
        }

        $item = $model->getSettingsRecord();
        if (!$item) {
            $model->initSettingsData();
            $model->fireEvent('model.initSettingsData');
            $item = $model;
        }

        return static::$instances[$cacheKey] = $item;
    }

    /**
     * isConfigured checks if the model has been set up previously
     * @return bool
     */
    public static function isConfigured()
    {
        return (new static)->getSettingsRecord() !== null;
    }

    /**
     * set a single or array key pair of values
     */
    public static function set($key, $value = null)
    {
        $data = is_array($key) ? $key : [$key => $value];

        $obj = static::instance();

        $obj->forceFill($data);

        return $obj->save();
    }

    /**
     * get helper
     */
    public static function get($key, $default = null)
    {
        return array_get(static::instance(), $key, $default);
    }

    /**
     * initSettingsData default values to set for this model, method override
     */
    public function initSettingsData()
    {
    }

    /**
     * resetDefault, this will delete the record model
     */
    public function resetDefault()
    {
        if ($record = $this->getSettingsRecord()) {
            $record->delete();
        }

        $this->clearCache();
        unset(self::$instances[$this->settingsCode]);
    }

    /**
     * clearCache
     */
    public function clearCache()
    {
        Cache::forget($this->getCacheKey());
    }

    /**
     * getSettingsRecord returns the raw Model record that stores the settings.
     * @return Model
     */
    public function getSettingsRecord()
    {
        if (!System::hasDatabase()) {
            return null;
        }

        $record = $this->newQuery()
            ->remember(1440, $this->getCacheKey())
            ->first();

        return $record ?: null;
    }

    /**
     * newQuery applies a local scope
     */
    public function newQuery()
    {
        $query = $this->registerGlobalScopes($this->newQueryWithoutScopes());

        return $query->where('item', $this->settingsCode);
    }

    /**
     * getFieldConfig returns the field configuration used by this model.
     */
    public function getFieldConfig()
    {
        if ($this->fieldConfig !== null) {
            return $this->fieldConfig;
        }

        return $this->fieldConfig = $this->makeConfig($this->settingsFields);
    }

    /**
     * getCacheKey returns a cache key for this record.
     */
    public function getCacheKey()
    {
        $key = 'system::setting.' . $this->settingsCode;

        if (
            $this->isClassInstanceOf(\October\Contracts\Database\MultisiteInterface::class) &&
            $this->isMultisiteEnabled()
        ) {
            $key .= '-' . ($this->site_id ?: Site::getSiteIdFromContext());
        }
        elseif (
            $this->isClassInstanceOf(\October\Contracts\Database\MultisiteGroupInterface::class) &&
            $this->isMultisiteGroupEnabled()
        ) {
            $key .= '-g' . ($this->site_group_id ?: Site::getSiteGroupIdFromContext());
        }

        return $key;
    }

    /**
     * clearInternalCache of model instances.
     * @return void
     */
    public static function clearInternalCache()
    {
        static::$instances = [];
    }
}
