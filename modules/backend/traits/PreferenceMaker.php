<?php namespace Backend\Traits;

use Str;
use Backend\Models\UserPreference;

/**
 * Preference Maker Trait
 *
 * Adds methods for modifying user preferences in a controller class, or a class
 * that contains a `$controller` property referencing a controller.
 */
trait PreferenceMaker
{
    /**
     * Cache for retrieved user preferences.
     *
     * @var array
     */
    protected static $preferenceCache = [];

    /**
     * Saves a widget related key/value pair in to the users preferences
     * @param string $key Unique key for the data store.
     * @param mixed $value The value to store.
     * @return void
     */
    public function putUserPreference(string $key, $value)
    {
        $preferences = $this->getUserPreferences();
        $preferences[$key] = $value;

        $this->getPreferenceStorage()->set($this->getPreferenceKey(), $preferences);

        // Re-cache user preferences
        self::$preferenceCache[$this->getPreferenceKey()] = $preferences;
    }

    /**
     * Retrieves a widget related key/value pair from the user preferences
     *
     * @param string $key Unique key for the data store.
     * @param mixed $default A default value to use when value is not found.
     * @return mixed
     */
    public function getUserPreference(string $key = null, $default = null)
    {
        $preferences = $this->getUserPreferences();

        return (isset($preferences[$key])) ? $preferences[$key] : $default;
    }

    /**
     * Retrieves and caches all user preferences for this particular controller/widget.
     *
     * @return array
     */
    public function getUserPreferences()
    {
        if (isset(self::$preferenceCache[$this->getPreferenceKey()])) {
            return self::$preferenceCache[$this->getPreferenceKey()];
        }

        $preferences = $this->getPreferenceStorage()->get($this->getPreferenceKey(), []);

        // Cache user preferences
        self::$preferenceCache[$this->getPreferenceKey()] = $preferences;

        return $preferences;
    }

    /**
     * Clears a single preference key from the user preferences for this controller/widget.
     *
     * @param string $key Unique key for the data store.
     * @return void
     */
    public function clearUserPreference(string $key)
    {
        $preferences = $this->getUserPreferences();

        if (!isset($preferences[$key])) {
            return;
        }

        unset($preferences[$key]);

        if (count($preferences)) {
            $this->getPreferenceStorage()->set($this->getPreferenceKey(), $preferences);

            // Re-cache user preferences
            self::$preferenceCache[$this->getPreferenceKey()] = $preferences;
        } else {
            // Remove record from user preferences
            $this->clearUserPreferences();
        }
    }

    /**
     * Clears all user preferences for this controller/widget.
     *
     * @return void
     */
    public function clearUserPreferences()
    {
        $this->getPreferenceStorage()->reset($this->getPreferenceKey());

        self::$preferenceCache[$this->getPreferenceKey()] = [];
    }

    /**
     * Returns a unique identifier for this widget and controller action for preference storage.
     *
     * @return string
     */
    protected function getPreferenceKey()
    {
        $controller = (property_exists($this, 'controller') && $this->controller)
            ? $this->controller
            : $this;

        $uniqueId = (method_exists($this, 'getId')) ? $this->getId() : $controller->getId();

        // Removes Class name and "Controllers" directory
        $rootNamespace = Str::getClassId(Str::getClassNamespace(Str::getClassNamespace($controller)));

        // The controller action is intentionally omitted, preferences should be shared for all actions
        return $rootNamespace . '::' . strtolower(class_basename($controller)) . '.' . strtolower($uniqueId);
    }

    /**
     * Specifies the model used for storing the user preferences.
     *
     * @return October\Rain\Database\Model
     */
    protected function getPreferenceStorage()
    {
        return UserPreference::forUser();
    }
}
