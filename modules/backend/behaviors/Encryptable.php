<?php namespace Backend\Behaviors;

use Crypt;
use Exception;

class Encryptable extends \October\Rain\Extension\ExtensionBase
{
    protected $parent;

    public function __construct($parent)
    {
        $this->parent = $parent;
        $this->bootEncryptable()
    }

    /**
     * @var array List of attribute names which should be encrypted
     *
     * protected $encryptable = [];
     */
    /**
     * @var array List of original attribute values before they were encrypted.
     */
    protected $originalEncryptableValues = [];
    /**
     * Boot the encryptable trait for a model.
     * @return void
     */
    public function bootEncryptable()
    {
        if (!isset(this->parent->encryptable)) {
            throw new Exception(sprintf(
                'You must define a $encryptable property in %s to use the Encryptable behaviour.', get_class(this->parent)
            ));
        }
        /*
         * Encrypt required fields when necessary
         */
        $parent_class = get_class($this->parent);
        $parent_class::extend(function($model) {
            $encryptable = $model->getEncryptableAttributes();
            $model->bindEvent('model.beforeSetAttribute', function($key, $value) use ($model, $encryptable) {
                if (in_array($key, $encryptable) && !empty($value)) {
                    return $model->makeEncryptableValue($key, $value);
                }
            });
            $model->bindEvent('model.beforeGetAttribute', function($key) use ($model, $encryptable) {
                if (in_array($key, $encryptable) && array_get($model->attributes, $key) != null) {
                    return $model->getEncryptableValue($key);
                }
            });
        });
    }
    /**
     * Encrypts an attribute value and saves it in the original locker.
     * @param  string $key   Attribute
     * @param  string $value Value to encrypt
     * @return string        Encrypted value
     */
    public function makeEncryptableValue($key, $value)
    {
        $this->originalEncryptableValues[$key] = $value;
        return Crypt::encrypt($value);
    }
    /**
     * Decrypts an attribute value
     * @param  string $key Attribute
     * @return string      Decrypted value
     */
    public function getEncryptableValue($key)
    {
        return Crypt::decrypt($this->parent->attributes[$key]);
    }
    /**
     * Returns a collection of fields that will be encrypted.
     * @return array
     */
    public function getEncryptableAttributes()
    {
        return $this->parent->encryptable;
    }
    /**
     * Returns the original values of any encrypted attributes.
     * @return array
     */
    public function getOriginalEncryptableValues()
    {
        return $this->originalEncryptableValues;
    }
    /**
     * Returns the original values of any encrypted attributes.
     * @return mixed
     */
    public function getOriginalEncryptableValue($attribute)
    {
        return isset($this->originalEncryptableValues[$attribute])
            ? $this->originalEncryptableValues[$attribute]
            : null;
    }
}
