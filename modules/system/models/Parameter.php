<?php namespace System\Models;

use Cache;
use October\Rain\Database\Model;
use Exception;

/**
 * Parameters model
 * Used for storing internal application parameters.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class Parameter extends Model
{
    use \October\Rain\Support\Traits\KeyParser;

    /**
     * @var string The database table used by the model.
     */
    protected $table = 'system_parameters';

    public $timestamps = false;

    protected static $cache = [];

    /**
     * @var array List of attribute names which are json encoded and decoded from the database.
     */
    protected $jsonable = ['value'];

    /**
     * Clear the cache after saving.
     */
    public function afterSave()
    {
        Cache::forget(implode('-', [$this->table, $this->namespace, $this->group, $this->item]));
    }

    /**
     * Returns a setting value by the module (or plugin) name and setting name.
     * @param string $key Specifies the setting key value, for example 'system:updates.check'
     * @param mixed $default The default value to return if the setting doesn't exist in the DB.
     * @return mixed Returns the setting value loaded from the database or the default value.
     */
    public static function get($key, $default = null)
    {
        if (array_key_exists($key, static::$cache)) {
            return static::$cache[$key];
        }

        $record = static::findRecord($key);
        if (!$record) {
            return static::$cache[$key] = $default;
        }

        return static::$cache[$key] = $record->value;
    }

    /**
     * Stores a setting value to the database.
     * @param string $key Specifies the setting key value, for example 'system:updates.check'
     * @param mixed $value The setting value to store, serializable.
     * @return bool
     */
    public static function set($key, $value = null)
    {
        if (is_array($key)) {
            foreach ($key as $_key => $_value) {
                static::set($_key, $_value);
            }
            return true;
        }

        $record = static::findRecord($key);
        if (!$record) {
            $record = new static;
            list($namespace, $group, $item) = $record->parseKey($key);
            $record->namespace = $namespace;
            $record->group = $group;
            $record->item = $item;
        }

        $record->value = $value;
        $record->save();

        static::$cache[$key] = $value;
        return true;
    }

    /**
     * Resets a setting value by deleting the record.
     * @param string $key Specifies the setting key value.
     * @return bool
     */
    public function reset($key)
    {
        $record = static::findRecord($key);
        if (!$record) {
            return false;
        }

        $record->delete();

        unset(static::$cache[$key]);
        return true;
    }

    /**
     * Returns a record (cached)
     * @return self
     */
    public static function findRecord($key)
    {
        $record = new static;

        list($namespace, $group, $item) = $record->parseKey($key);

        return $record
            ->applyKey($key)
            ->remember(5, implode('-', [$record->getTable(), $namespace, $group, $item]))
            ->first();
    }

    /**
     * Scope to find a setting record for the specified module (or plugin) name and setting name.
     * @param string $key Specifies the setting key value, for example 'system:updates.check'
     * @param mixed $default The default value to return if the setting doesn't exist in the DB.
     * @return QueryBuilder
     */
    public function scopeApplyKey($query, $key)
    {
        list($namespace, $group, $item) = $this->parseKey($key);

        $query = $query
            ->where('namespace', $namespace)
            ->where('group', $group)
            ->where('item', $item);

        return $query;
    }
}
