<?php namespace Backend\Behaviors;

use Hash;
use Exception;

class Hashable extends \October\Rain\Extension\ExtensionBase
{
    protected $parent;

    public function __construct($parent)
    {
        $this->parent = $parent;
        $this->bootHashable()
    }

    /**
     * @var array List of attribute names which should be hashed using the Bcrypt hashing algorithm.
     *
     * protected $hashable = [];
     */
    /**
     * @var array List of original attribute values before they were hashed.
     */
    protected $originalHashableValues = [];
    /**
     * Boot the hashable trait for a model.
     * @return void
     */
    public function bootHashable()
    {
        if (!isset(this->parent->hashable)) {
            throw new Exception(sprintf(
                'You must define a $hashable property in %s to use the Hashable behaviour.', get_class(this->parent)
            ));
        }
        /*
         * Hash required fields when necessary
         */
        $parent_class = get_class($this->parent);
        $parent_class::extend(function($parent){
            $parent->bindEvent('model.beforeSetAttribute', function($key, $value) use ($parent) {
                $hashable = $parent->getHashableAttributes();
                if (in_array($key, $hashable) && !empty($value)) {
                    return $parent->makeHashValue($key, $value);
                }
            });
        });
    }
    /**
     * Adds an attribute to the hashable attributes list
     * @param  array|string|null  $attributes
     * @return $this
     */
    public function addHashable($attributes = null)
    {
        $attributes = is_array($attributes) ? $attributes : func_get_args();
        $this->parent->hashable = array_merge($this->parent->hashable, $attributes);
        return $this->parent;
    }
    /**
     * Hashes an attribute value and saves it in the original locker.
     * @param  string $key   Attribute
     * @param  string $value Value to hash
     * @return string        Hashed value
     */
    public function makeHashValue($key, $value)
    {
        $this->originalHashableValues[$key] = $value;
        return Hash::make($value);
    }
    /**
     * Checks if the supplied plain value matches the stored hash value.
     * @param  string $key   Attribute to check
     * @param  string $value Value to check
     * @return bool
     */
    public function checkHashValue($key, $value)
    {
        return Hash::check($value, $this->parent->{$key});
    }
    /**
     * Returns a collection of fields that will be hashed.
     * @return array
     */
    public function getHashableAttributes()
    {
        return $this->parent->hashable;
    }
    /**
     * Returns the original values of any hashed attributes.
     * @return array
     */
    public function getOriginalHashValues()
    {
        return $this->originalHashableValues;
    }
    /**
     * Returns the original values of any hashed attributes.
     * @return mixed
     */
    public function getOriginalHashValue($attribute)
    {
        return isset($this->originalHashableValues[$attribute])
            ? $this->originalHashableValues[$attribute]
            : null;
    }
    /**
     * @deprecated use self::addHashable()
     * Remove this method if year >= 2018
     */
    public function addHashableAttribute($attribute)
    {
        traceLog('The addHashableAttribute() method is deprecated, use addHashable() instead.');
        return $this->parent->addHashable($attribute);
    }
}
