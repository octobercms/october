<?php namespace Backend\Behaviors;

use System\Behaviors\SettingsModel;
use Backend\Models\UserPreference;

/**
 * User Preferences model extension, identical to System\Behaviors\SettingsModel
 * except values are set against the logged in user's preferences via Backend\Models\UserPreference
 *
 * Add this the model class definition:
 *
 *     public $implement = ['Backend.Behaviors.UserPreferencesModel'];
 *     public $settingsCode = 'author.plugin::code';
 *     public $settingsFields = 'fields.yaml';
 *
 */
class UserPreferencesModel extends SettingsModel
{
    /**
     * @var array Internal cache of model objects.
     */
    private static $instances = [];

    /**
     * Constructor
     */
    public function __construct($model)
    {
        parent::__construct($model);

        $this->model->setTable('backend_user_preferences');
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
     * Checks if the model has been set up previously, intended as a static method
     */
    public function isConfigured()
    {
        return $this->getSettingsRecord() !== null;
    }

    /**
     * Returns the raw Model record that stores the settings.
     * @return Model
     */
    public function getSettingsRecord()
    {
        $item = UserPreference::forUser();
        $record = $item
            ->scopeApplyKeyAndUser($this->model, $this->recordCode, $item->userContext)
            ->remember(1440, $this->getCacheKey())
            ->first();

        return $record ?: null;
    }

    /**
     * Before the model is saved, ensure the record code is set
     * and the jsonable field values
     */
    public function beforeModelSave()
    {
        $preferences = UserPreference::forUser();
        list($namespace, $group, $item) = $preferences->parseKey($this->recordCode);
        $this->model->item = $item;
        $this->model->group = $group;
        $this->model->namespace = $namespace;
        $this->model->user_id = $preferences->userContext->id;

        if ($this->fieldValues) {
            $this->model->value = $this->fieldValues;
        }
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
        if ($key == 'namespace' || $key == 'group') {
            return true;
        }

        return parent::isKeyAllowed($key);
    }

    /**
     * Returns a cache key for this record.
     */
    protected function getCacheKey()
    {
        $item = UserPreference::forUser();
        $userId = $item->userContext ? $item->userContext->id : 0;
        return $this->recordCode.'-userpreference-'.$userId;
    }
}
