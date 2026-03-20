<?php namespace System\Traits;

/**
 * KeyCodeModel trait adds findByKey and findByCode cached methods to a model
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait KeyCodeModel
{
    /**
     * @var array cacheByKey cache of self, by key.
     */
    protected static $cacheByKey = [];

    /**
     * @var array cacheByCode cache of self, by code.
     */
    protected static $cacheByCode = [];

    /**
     * clearKeyCodeCache clears the static lookup caches
     */
    public static function clearKeyCodeCache()
    {
        self::$cacheByKey = [];
        self::$cacheByCode = [];
    }

    /**
     * findByKey locates a tax class by its key, cached.
     */
    public static function findByKey(?string $key = null): ?self
    {
        if (!$key) {
            return null;
        }

        if (isset(self::$cacheByKey[$key])) {
            return self::$cacheByKey[$key];
        }

        return self::$cacheByKey[$key] = self::find($key);
    }

    /**
     * findByCode locates a payment method by its code, cached.
     */
    public static function findByCode(?string $code = null): ?self
    {
        if (!$code) {
            return null;
        }

        if (isset(self::$cacheByCode[$code])) {
            return self::$cacheByCode[$code];
        }

        return self::$cacheByCode[$code] = self::where('code', $code)->first();
    }
}
