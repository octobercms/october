<?php namespace Cms\Classes;

use App;
use Config;
use File;
use Db;

/**
 * ThemeBlueprints stores app and theme blueprint YAML on the default disk
 * with metadata in cms_theme_storage.
 */
class ThemeBlueprints
{
    /**
     * usesDatabase checks if blueprints for a source should use storage
     */
    public static function usesDatabase(string $source): bool
    {
        if (!App::hasDatabase()) {
            return false;
        }

        if ($source === 'app') {
            return (bool) Config::get('cms.database_files', false);
        }

        $theme = Theme::load($source);

        return $theme && $theme->databaseFilesEnabled();
    }

    /**
     * has checks if a blueprint exists in storage
     */
    public static function has(string $source, string $fileName): bool
    {
        return ThemeFiles::isStoredForSource($source, static::storagePath($fileName));
    }

    /**
     * read returns blueprint content and metadata
     */
    public static function read(string $source, string $fileName): ?array
    {
        return ThemeFiles::getForSource($source, static::storagePath($fileName));
    }

    /**
     * write stores blueprint content in storage
     */
    public static function write(string $source, string $fileName, string $content): void
    {
        ThemeFiles::putForSource($source, static::storagePath($fileName), $content);
    }

    /**
     * delete removes a blueprint from storage
     */
    public static function delete(string $source, string $fileName): void
    {
        ThemeFiles::deleteForSource($source, static::storagePath($fileName));
    }

    /**
     * deleteDirectory removes all stored blueprints under a directory
     */
    public static function deleteDirectory(string $source, string $directory): void
    {
        $prefix = static::storagePath(rtrim($directory, '/').'/');
        $paths = Db::table('cms_theme_storage')
            ->where('source', $source)
            ->where('path', 'like', $prefix.'%')
            ->pluck('path');

        foreach ($paths as $path) {
            ThemeFiles::deleteForSource($source, $path);
        }
    }

    /**
     * rename moves a blueprint to a new file name
     */
    public static function rename(string $source, string $oldFileName, string $newFileName): void
    {
        ThemeFiles::renameForSource(
            $source,
            static::storagePath($oldFileName),
            static::storagePath($newFileName)
        );
    }

    /**
     * move moves a blueprint to a new directory
     */
    public static function move(string $source, string $oldFileName, string $destinationDir): void
    {
        $oldFileName = ltrim(File::normalizePath($oldFileName), '/');
        $destinationDir = trim(File::normalizePath($destinationDir), '/');
        $fileName = basename($oldFileName);
        $newFileName = $destinationDir === '' ? $fileName : $destinationDir.'/'.$fileName;

        static::rename($source, $oldFileName, $newFileName);
    }

    /**
     * renamePathPrefix renames all stored blueprint paths under a directory
     */
    public static function renamePathPrefix(string $source, string $oldPrefix, string $newPrefix): void
    {
        ThemeFiles::renamePathPrefixForSource(
            $source,
            static::storagePath($oldPrefix),
            static::storagePath($newPrefix)
        );
    }

    /**
     * listAtPath returns blueprint entries at a path for navigator merging
     */
    public static function listAtPath(string $source, string $filterPath = ''): array
    {
        if (!static::usesDatabase($source)) {
            return [];
        }

        $filterPath = trim($filterPath, '/');
        $prefix = 'blueprints'.($filterPath !== '' ? '/'.$filterPath : '');

        return ThemeFiles::listAtPathForSource($source, $prefix, $filterPath, ['yaml']);
    }

    /**
     * getLatestMtime returns the latest updated_at timestamp for stored blueprints
     */
    public static function getLatestMtime(string $source): ?int
    {
        if (!static::usesDatabase($source)) {
            return null;
        }

        return ThemeFiles::getLatestMtime($source, 'blueprints');
    }

    /**
     * hasStoredChildren checks if a directory has stored blueprint files
     */
    public static function hasStoredChildren(string $source, string $directory): bool
    {
        $prefix = static::storagePath(rtrim($directory, '/').'/');

        return Db::table('cms_theme_storage')
            ->where('source', $source)
            ->where('path', 'like', $prefix.'%')
            ->exists();
    }

    /**
     * storagePath returns the storage-relative path for a blueprint file name
     */
    public static function storagePath(string $fileName): string
    {
        return 'blueprints/'.ltrim(File::normalizePath($fileName), '/');
    }
}
