<?php namespace Cms\Classes;

use App;
use Db;
use File;
use October\Rain\Halcyon\Datasource\AutoDatasource;
use October\Rain\Halcyon\Datasource\DbDatasource;
use October\Rain\Halcyon\Datasource\FileDatasource;

/**
 * ThemeBlueprints provides database storage for blueprint YAML files
 *
 * Blueprints are stored in the shared `cms_theme_files` table with content,
 * using paths prefixed with `blueprints/`. App blueprints use source `app`;
 * theme blueprints use the theme directory name. Enabled by CMS_DB_FILES only.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeBlueprints
{
    /**
     * @var string APP_SOURCE database source identifier for app blueprints
     */
    const APP_SOURCE = 'app';

    /**
     * @var string PREFIX for blueprint paths in the database
     */
    const PREFIX = 'blueprints';

    /**
     * usesDatabase checks if blueprints for a source should be stored in the database
     */
    public static function usesDatabase(string $source): bool
    {
        if (!App::hasDatabase()) {
            return false;
        }

        if ($source === static::APP_SOURCE) {
            return Theme::databaseFilesGloballyEnabled();
        }

        $theme = Theme::load($source);

        return $theme && $theme->databaseFilesEnabled();
    }

    /**
     * has checks if a blueprint exists in the database layer
     */
    public static function has(string $source, string $fileName): bool
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);

        return static::getDatasource($source)->hasTemplate($dirName, $name, $extension);
    }

    /**
     * read returns blueprint content and metadata
     */
    public static function read(string $source, string $fileName): ?array
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);
        $result = static::getDatasource($source)->selectOne($dirName, $name, $extension);

        return $result ?: null;
    }

    /**
     * write stores blueprint content in the database layer
     */
    public static function write(string $source, string $fileName, string $content): void
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);
        ThemeFiles::upsert(static::getDatasource($source), $dirName, $name, $extension, $content);
    }

    /**
     * delete removes a blueprint through the datasource
     */
    public static function delete(string $source, string $fileName): void
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);
        static::getDatasource($source)->delete($dirName, $name, $extension);
    }

    /**
     * rename moves a blueprint to a new file name
     */
    public static function rename(string $source, string $oldFileName, string $newFileName): void
    {
        $oldFileName = ltrim(File::normalizePath($oldFileName), '/');
        $newFileName = ltrim(File::normalizePath($newFileName), '/');

        if ($oldFileName === $newFileName) {
            return;
        }

        ThemeFiles::renameSegments(
            static::getDatasource($source),
            static::parseFileName($oldFileName),
            static::parseFileName($newFileName)
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
        $newFileName = $destinationDir === '' ? $fileName : $destinationDir . '/' . $fileName;

        static::rename($source, $oldFileName, $newFileName);
    }

    /**
     * renamePathPrefix renames all database blueprint paths under a directory
     */
    public static function renamePathPrefix(string $source, string $oldPrefix, string $newPrefix): void
    {
        $oldPrefix = ltrim(File::normalizePath($oldPrefix), '/');
        $newPrefix = ltrim(File::normalizePath($newPrefix), '/');

        if ($oldPrefix === $newPrefix) {
            return;
        }

        $rows = Db::table('cms_theme_files')
            ->where('source', $source)
            ->whereNotNull('content')
            ->whereNull('deleted_at')
            ->where('path', 'like', $oldPrefix . '/%')
            ->get();

        foreach ($rows as $row) {
            $newPath = $newPrefix . substr($row->path, strlen($oldPrefix));

            Db::table('cms_theme_files')
                ->where('id', $row->id)
                ->update([
                    'path' => $newPath,
                    'updated_at' => $row->updated_at,
                ]);
        }
    }

    /**
     * renameBlueprintPathPrefix renames database paths for a blueprint-relative prefix
     */
    public static function renameBlueprintPathPrefix(string $source, string $oldRelative, string $newRelative): void
    {
        static::renamePathPrefix(
            $source,
            static::PREFIX . '/' . ltrim($oldRelative, '/'),
            static::PREFIX . '/' . ltrim($newRelative, '/')
        );
    }

    /**
     * isTrashed checks if a blueprint has been tombstoned in the database layer
     */
    public static function isTrashed(string $source, string $fileName): bool
    {
        if (!static::usesDatabase($source)) {
            return false;
        }

        $path = static::PREFIX . '/' . ltrim(File::normalizePath($fileName), '/');

        return Db::table('cms_theme_files')
            ->where('source', $source)
            ->where('path', $path)
            ->whereNotNull('content')
            ->whereNotNull('deleted_at')
            ->exists();
    }

    /**
     * listAtPath returns blueprint entries at a path for navigator merging
     */
    public static function listAtPath(string $source, string $filterPath = ''): array
    {
        if (!static::usesDatabase($source)) {
            return [];
        }

        $prefix = static::PREFIX . '/';
        if ($filterPath !== '') {
            $prefix .= trim($filterPath, '/') . '/';
        }

        $paths = Db::table('cms_theme_files')
            ->where('source', $source)
            ->whereNotNull('content')
            ->whereNull('deleted_at')
            ->where('path', 'like', $prefix . '%')
            ->pluck('path');

        $entries = [];

        foreach ($paths as $path) {
            $remainder = substr($path, strlen($prefix));
            if ($remainder === '' || $remainder === false) {
                continue;
            }

            $parts = explode('/', $remainder);
            $first = $parts[0];
            $entryPath = $filterPath === '' ? $first : trim($filterPath, '/') . '/' . $first;

            $entries[$first] = [
                'fileName' => $first,
                'isFolder' => count($parts) === 1 ? 0 : 1,
                'isEditable' => count($parts) === 1 && strtolower(pathinfo($first, PATHINFO_EXTENSION)) === 'yaml',
                'path' => $entryPath,
            ];
        }

        return array_values($entries);
    }

    /**
     * getLatestMtime returns the latest updated_at timestamp for a blueprint source
     */
    public static function getLatestMtime(string $source): ?int
    {
        if (!static::usesDatabase($source)) {
            return null;
        }

        $dbMtime = Db::table('cms_theme_files')
            ->where('source', $source)
            ->where('path', 'like', static::PREFIX . '/%')
            ->whereNotNull('content')
            ->whereNull('deleted_at')
            ->max('updated_at');

        return $dbMtime ? strtotime($dbMtime) : null;
    }

    /**
     * parseFileName splits a blueprint-relative file name into datasource segments
     */
    public static function parseFileName(string $fileName): array
    {
        return ThemeFiles::parseRelativePath(static::PREFIX . '/' . ltrim(File::normalizePath($fileName), '/'));
    }

    /**
     * getDatasource returns the Halcyon datasource for blueprints
     */
    public static function getDatasource(string $source)
    {
        $resolver = App::make('halcyon');
        $key = $source . '-blueprints';

        if (!$resolver->hasDatasource($key)) {
            $datasources = [
                new DbDatasource($source, 'cms_theme_files'),
                new FileDatasource(static::getFilesystemRoot($source), App::make('files')),
            ];

            if ($source !== static::APP_SOURCE) {
                $theme = Theme::load($source);
                if ($theme && ($parent = $theme->getParentTheme())) {
                    $datasources[] = new FileDatasource($parent->getPath(), App::make('files'));
                }
            }

            $resolver->addDatasource($key, new AutoDatasource($datasources));
        }

        return $resolver->datasource($key);
    }

    /**
     * getFilesystemRoot returns the filesystem root for blueprint file lookups
     */
    protected static function getFilesystemRoot(string $source): string
    {
        if ($source === static::APP_SOURCE) {
            return base_path('app');
        }

        return Theme::load($source)->getPath();
    }
}
