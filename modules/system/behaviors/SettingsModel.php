<?php namespace System\Behaviors;

use System\Classes\ModelBehavior;
use System\Classes\ApplicationException;

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
        $this->model->bindEvent('model.setAttribute', [$this, 'setModelAttribute']);

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
        if (isset(self::$instances[$this->recordCode]))
            return self::$instances[$this->recordCode];

        $item = $this->model->where('item', $this->recordCode)->first();

        if (!$item) {
            $this->model->initSettingsData();
            $this->model->forceSave();
            $this->model->reload();
            $item = $this->model;
        }

        return self::$instances[$this->recordCode] = $item;
    }

    /**
     * Checks if the model has been set up previously, intended as a static method
     */
    public function isConfigured()
    {
        return $this->model->where('item', $this->recordCode)->count() > 0;
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
     * Helper for getValue, intended as a static method
     */
    public function get($key, $default = null)
    {
        return $this->instance()->getValue($key, $default);
    }

    /**
     * Get a single setting value, or return a default value
     */
    public function getValue($key, $default = null)
    {
        if (array_key_exists($key, $this->fieldValues))
            return $this->fieldValues[$key];

        return $default;
    }

    /**
     * Default values to set for this model, override
     */
    public function initSettingsData(){}

    /**
     * Populate the field values from the database record.
     */
    public function afterModelFetch()
    {
        $this->fieldValues = $this->model->value ?: [];
        $this->model->attributes = array_merge($this->fieldValues, $this->model->attributes);
    }

    /**
     * Before the model is saved, ensure the record code is set
     * and the jsonable field values
     */
    public function beforeModelSave()
    {
        $this->model->item = $this->recordCode;
        if ($this->fieldValues)
            $this->model->value = $this->fieldValues;
    }

    /**
     * Add the field values to the model for validation,
     * then purge them again.
     */
    public function beforeValidate()
    {
        $this->model->purgeable = array_keys($this->fieldValues);
    }

    /**
     * Adulterate the model setter to use our field values instead.
     */
    public function setModelAttribute($key, $value)
    {
        if ($this->isKeyAllowed($key))
            return;

        $this->fieldValues[$key] = $value;
    }

    /**
     * Checks if a key is legitimate or should be added to
     * the field value collection
     */
    private function isKeyAllowed($key)
    {
        /*
         * Let the core columns through
         */
        if ($key == 'id' || $key == 'value' || $key == 'item')
            return true;

        /*
         * Let relations through
         */
        if ($this->model->hasRelation($key))
            return true;

        return false;
    }

    /**
     * Returns the field configuration used by this model.
     */
    public function getFieldConfig()
    {
        return $this->fieldConfig;
    }
} 