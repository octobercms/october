<?php namespace Backend\Behaviors;

use System\Behaviors\SettingsModel;
use Backend\Models\UserPreferences;

/**
 * User Settings model extension, identical to System.Behaviors.SettingsModel
 * except values are set against the logged in user's preferences via Backend\Models\UserPreferences.
 *
 * Usage:
 *
 * In the model class definition: 
 *
 *   public $implement = ['Backend.Behaviors.UserSettingsModel'];
 *   public $settingsCode = 'author.plugin::code';
 *   public $settingsFields = 'fields.yaml';
 *
 */
class UserSettingsModel extends SettingsModel
{
    private static $instances = [];

    /**
     * Constructor
     */
    public function __construct($model)
    {
        parent::__construct($model);

        $this->model->table = 'backend_user_preferences';
    }

    /**
     * Create an instance of the settings model, intended as a static method
     */
    public function instance()
    {
        if (isset(self::$instances[$this->recordCode]))
            return self::$instances[$this->recordCode];

        $item = UserPreferences::forUser();
        $item = $item->scopeFindRecord($this->model, $this->recordCode, $item->userContext)->first();

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
        return UserPreferences::forUser()->findRecord($this->recordCode, $item->userContext)->count() > 0;
    }

    /**
     * Before the model is saved, ensure the record code is set
     * and the jsonable field values
     */
    public function beforeModelSave()
    {
        $preferences = UserPreferences::forUser();

        list($namespace, $group, $item) = $preferences->parseKey($this->recordCode);
        $this->model->item = $item;
        $this->model->group = $group;
        $this->model->namespace = $namespace;
        $this->model->user_id = $preferences->userContext->id;

        if ($this->fieldValues)
            $this->model->value = $this->fieldValues;
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
        if ($key == 'namespace' || $key == 'group')
            return true;

        return parent::isKeyAllowed($key);
    }
} 