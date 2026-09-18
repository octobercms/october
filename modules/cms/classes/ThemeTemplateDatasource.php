<?php namespace Cms\Classes;

use Cache;
use Exception;
use October\Rain\Halcyon\Datasource\DbDatasource;

/**
 * ThemeTemplateDatasource caches the template index between requests.
 *
 * The mtime and tombstone indexes are already cached in memory for the
 * current process. This stores both in one application cache entry so the
 * next request does not query. Saving, deleting, or purging templates busts it.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeTemplateDatasource extends DbDatasource
{
    /**
     * lastModified date of an object
     */
    public function lastModified(string $dirName, string $fileName, string $extension): ?int
    {
        try {
            $this->rememberIndexes();
        }
        catch (Exception $ex) {
            return null;
        }

        return parent::lastModified($dirName, $fileName, $extension);
    }

    /**
     * getTrashedPaths returns tombstoned paths for this datasource source
     */
    protected function getTrashedPaths(): array
    {
        $this->rememberIndexes();

        return parent::getTrashedPaths();
    }

    /**
     * flushCache drops the in-memory indexes and the persistent copy
     */
    protected function flushCache()
    {
        parent::flushCache();

        static::clearCache($this->source);
    }

    /**
     * clearCache forgets the stored index for a theme source.
     * Used when rows are removed outside this datasource, such as a purge.
     */
    public static function clearCache(string $source)
    {
        unset(self::$pathCache[$source], self::$mtimeCache[$source], self::$trashedPathCache[$source]);

        Cache::memo()->forget(static::cacheKey($source));
    }

    /**
     * cacheKey returns the cache key for a theme's template index
     */
    public static function cacheKey(string $source): string
    {
        return 'cms.theme.templates.'.$source;
    }

    /**
     * rememberIndexes fills the in-memory mtime and tombstone indexes from
     * cache, or from the database when the cache is cold.
     */
    protected function rememberIndexes(): void
    {
        if (isset(self::$mtimeCache[$this->source], self::$trashedPathCache[$this->source])) {
            return;
        }

        $cacheKey = static::cacheKey($this->source);
        $cached = Cache::memo()->get($cacheKey);

        if (is_array($cached['mtime'] ?? null) && is_array($cached['trashed'] ?? null)) {
            self::$mtimeCache[$this->source] = $cached['mtime'];
            self::$trashedPathCache[$this->source] = $cached['trashed'];
            return;
        }

        self::$mtimeCache[$this->source] = $this->getQuery()->pluck('updated_at', 'path')->all();
        self::$trashedPathCache[$this->source] = array_fill_keys(
            $this->getQuery(false)->whereNotNull('deleted_at')->pluck('path')->all(),
            true
        );

        Cache::memo()->put($cacheKey, [
            'mtime' => self::$mtimeCache[$this->source],
            'trashed' => self::$trashedPathCache[$this->source],
        ], now()->addMinutes(1440));
    }
}
