<?php namespace Cms\Classes;

use Cache;
use Exception;
use Carbon\Carbon;
use October\Rain\Halcyon\Datasource\DbDatasource;

/**
 * ThemeTemplateDatasource caches the template index between requests.
 *
 * Looking up a template checks cms_theme_templates for its mtime and for
 * tombstones. Those two indexes are already cached in memory for the current
 * process; this class also stores them in the application cache so the next
 * request does not query the database. Saving, deleting, or purging templates
 * busts that cache. Listeners on halcyon.datasource.db.extendQuery can change
 * the query, so the persistent cache is skipped while any are bound.
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
        if (!$this->usesPersistentIndexCache()) {
            return parent::lastModified($dirName, $fileName, $extension);
        }

        try {
            $this->rememberMtimeCache();

            $path = $this->makeFilePath($dirName, $fileName, $extension);
            if (!isset(self::$mtimeCache[$this->source][$path])) {
                return null;
            }

            return Carbon::parse(self::$mtimeCache[$this->source][$path])->timestamp;
        }
        catch (Exception $ex) {
            return null;
        }
    }

    /**
     * getTrashedPaths returns cached tombstoned paths for this datasource source
     */
    protected function getTrashedPaths(): array
    {
        if (!$this->usesPersistentIndexCache()) {
            return parent::getTrashedPaths();
        }

        if (!isset(self::$trashedPathCache[$this->source])) {
            $cacheKey = static::trashedCacheKey($this->table, $this->source);
            $cached = Cache::memo()->get($cacheKey);

            if (is_array($cached)) {
                self::$trashedPathCache[$this->source] = $cached;
            }
            else {
                self::$trashedPathCache[$this->source] = array_fill_keys(
                    $this->getQuery(false)->whereNotNull('deleted_at')->pluck('path')->all(),
                    true
                );

                Cache::memo()->put($cacheKey, self::$trashedPathCache[$this->source], now()->addMinutes(1440));
            }
        }

        return self::$trashedPathCache[$this->source];
    }

    /**
     * flushCache drops the in-memory indexes and the persistent copies
     */
    protected function flushCache()
    {
        parent::flushCache();

        static::clearCache($this->source, $this->table);
    }

    /**
     * clearCache forgets the stored indexes for a theme source.
     * Used when rows are removed outside this datasource, such as a purge.
     */
    public static function clearCache(string $source, string $table = 'cms_theme_templates')
    {
        unset(self::$pathCache[$source], self::$mtimeCache[$source], self::$trashedPathCache[$source]);

        foreach ([static::mtimeCacheKey($table, $source), static::trashedCacheKey($table, $source)] as $cacheKey) {
            Cache::forget($cacheKey);
            Cache::memo()->forget($cacheKey);
        }
    }

    /**
     * mtimeCacheKey returns the cache key for active template mtimes
     */
    public static function mtimeCacheKey(string $table, string $source): string
    {
        return 'cms.theme.templates.mtime.'.$table.'.'.$source;
    }

    /**
     * trashedCacheKey returns the cache key for tombstoned template paths
     */
    public static function trashedCacheKey(string $table, string $source): string
    {
        return 'cms.theme.templates.trashed.'.$table.'.'.$source;
    }

    /**
     * rememberMtimeCache fills the in-memory mtime index from cache or the database
     */
    protected function rememberMtimeCache(): void
    {
        if (isset(self::$mtimeCache[$this->source])) {
            return;
        }

        $cacheKey = static::mtimeCacheKey($this->table, $this->source);
        $cached = Cache::memo()->get($cacheKey);

        if (is_array($cached)) {
            self::$mtimeCache[$this->source] = $cached;
            return;
        }

        self::$mtimeCache[$this->source] = $this->getQuery()->pluck('updated_at', 'path')->all();

        Cache::memo()->put($cacheKey, self::$mtimeCache[$this->source], now()->addMinutes(1440));
    }

    /**
     * usesPersistentIndexCache is false when a listener may change the query
     */
    protected function usesPersistentIndexCache(): bool
    {
        return empty($this->emitterEventCollection['halcyon.datasource.db.extendQuery']);
    }
}
