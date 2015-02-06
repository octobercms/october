<?php namespace System\Behaviors;

use Cache;
use DbDongle;
use System\Classes\ModelBehavior;
use ApplicationException;

/**
 * Settings model extension
 *
 * Usage:
 *
 * In the model class definition:
 *
 *   public $implement = ['System.Behaviors.SettingsModel'];
 *   public $settingsCode = 'author_plugin_code';
 *   public $settingsFields = 'fields.yaml';
 *
 */
class SettingsModel extends ModelBehavior
{
    use \System\Traits\ConfigMaker;

    protected $recordCode;
    protected $fieldConfig;
    protected $fieldValues = [];

    private static $instances = [];

    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['settingsFields', 'settingsCode'];

    /**
     * Constructor
     */
    public function __construct($model)
    {
        parent::__construct($model);

        $this->model->table = 'system_settings';
        $this->model->jsonable = ['value'];
        $this->model->guarded = [];
        $this->model->timestamps = false;

        // Option A: (@todo Determine which is faster by benchmark)
        // $relativePath = strtolower(str_replace('\\', '/', get_class($model)));
        // $this->configPath = ['modules/' . $relativePath, 'plugins/' . $relativePath];

        // Option B:
        $this->configPath = $this->guessConfigPathFrom($model);

        /*
         * Access to model's overrides is unavailable, using events instead
         */
        $this->model->bindEvent('model.afterFetch', [$this, 'afterModelFetch']);
        $this->model->bindEvent('model.beforeSave', [$this, 'beforeModelSave']);
        $this->model->bindEvent('model.afterSave', [$this, 'afterModelSave']);
        $this->model->bindEvent('model.setAttribute', [$this, 'setSettingsValue']);
        $this->model->bindEvent('model.saveInternal', [$this, 'saveModelInternal']);

        /*
         * Parse the config
         */
        $this->fieldConfig = $this->makeConfig($this->model->settingsFields);
        $this->recordCode = $this->model->settingsCode;
    }

    /**
     * Create an instance of the settings model, intended as a static method
     */
    public function instance()
    {
        if (isset(self::$instances[$this->recordCode])) {
            return self::$instances[$this->recordCode];
        }

        if (!$item = $this->getSettingsRecord()) {
            $this->model->initSettingsData();
            $item = $this->model;
        }

        return self::$instances[$this->recordCode] = $item;
    }

    /**
     * Reset the settings to their defaults, this will delete the record model
     */
    public function resetDefault()
    {
        if ($record = $this->getSettingsRecord()) {
            $record->delete();
            unset(self::$instances[$this->recordCode]);
            Cache::forget($this->getCacheKey());
        }
    }

    /**
     * Checks if the model has been set up previously, intended as a static method
     */
    public function isConfigured()
    {
        return DbDongle::hasDatabase() && $this->getSettingsRecord() !== null;
    }

    /**
     * Returns the raw Model record that stores the settings.
     * @return Model
     */
    public function getSettingsRecord()
    {
        $record = $this->model
            ->where('item', $this->recordCode)
            ->remember(1440, $this->getCacheKey())
            ->first();

        return $record ?: null;
    }

    /**
     * Set a single or array key pair of values, intended as a static method
     */
    public function set($key, $value = null)
    {
        $data = is_array($key) ? $key : [$key => $value];
        $obj = self::instance();
        return $obj->save($data);
    }

    /**
     * Helper for getSettingsValue, intended as a static method
     */
    public function get($key, $default = null)
    {
        return $this->instance()->getSettingsValue($key, $default);
    }

    /**
     * Get a single setting value, or return a default value
     */
    public function getSettingsValue($key, $default = null)
    {
        if (array_key_exists($key, $this->fieldValues)) {
            return $this->fieldValues[$key];
        }

        return $default;
    }

    /**
     * Set a single setting value, if allowed.
     */
    public function setSettingsValue($key, $value)
    {
        if ($this->isKeyAllowed($key)) {
            return;
        }

        $this->fieldValues[$key] = $value;
    }

    /**
     * Default values to set for this model, override
     */
    public function initSettingsData()
    {
    }

    /**
     * Populate the field values from the database record.
     */
    public function afterModelFetch()
    {
        $this->fieldValues = $this->model->value ?: [];
        $this->model->attributes = array_merge($this->fieldValues, $this->model->attributes);
    }

    /**
     * Internal save method for the model
     * @return void
     */
    public function saveModelInternal()
    {
        // Purge the field values from the attributes
        $this->model->attributes = array_diff_key($this->model->attributes, $this->fieldValues);
    }

    /**
     * Before the model is saved, ensure the record code is set
     * and the jsonable field values
     */
    public function beforeModelSave()
    {
        $this->model->item = $this->recordCode;
        if ($this->fieldValues) {
            $this->model->value = $this->fieldValues;
        }
    }

    /**
     * After the model is saved, clear the cached query entry.
     * @return void
     */
    public function afterModelSave()
    {
        Cache::forget($this->getCacheKey());
    }

    /**
     * Checks if a key is legitimate or should be added to
     * the field value collection
     */
    protected function isKeyAllowed($key)
    {
        /*
         * Let the core columns through
         */
        if ($key == 'id' || $key == 'value' || $key == 'item') {
            return true;
        }

        /*
         * Let relations through
         */
        if ($this->model->hasRelation($key)) {
            return true;
        }

        return false;
    }

    /**
     * Returns the field configuration used by this model.
     */
    public function getFieldConfig()
    {
        return $this->fieldConfig;
    }

    /**
     * Returns a cache key for this record.
     */
    protected function getCacheKey()
    {
        return 'system::settings.'.$this->recordCode;
    }
}
