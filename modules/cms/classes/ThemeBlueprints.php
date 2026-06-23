<?php namespace Cms\Classes;

use App;
use Db;
use File;
use October\Rain\Halcyon\Datasource\DbDatasource;

/**
 * ThemeBlueprints provides database storage for theme blueprint YAML files
 *
 * Blueprints are stored in the shared `cms_theme_files` table with content,
 * using paths prefixed with `blueprints/`. This is enabled by CMS_DB_FILES only.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeBlueprints
{
    /**
     * @var string TABLE for theme blueprint records
     */
    const TABLE = 'cms_theme_files';

    /**
     * @var string PREFIX for blueprint paths in the database
     */
    const PREFIX = 'blueprints';

    /**
     * usesDatabase checks if theme blueprints should be stored in the database
     */
    public static function usesDatabase(Theme $theme): bool
    {
        return $theme->databaseFilesEnabled() && App::hasDatabase();
    }

    /**
     * has checks if a blueprint exists in any datasource layer
     */
    public static function has(Theme $theme, string $fileName): bool
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);

        return static::getDatasource($theme)->hasTemplate($dirName, $name, $extension);
    }

    /**
     * read returns blueprint content and metadata
     */
    public static function read(Theme $theme, string $fileName): ?array
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);
        $result = static::getDatasource($theme)->selectOne($dirName, $name, $extension);

        return $result ?: null;
    }

    /**
     * write stores blueprint content in the database layer
     */
    public static function write(Theme $theme, string $fileName, string $content): void
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);
        $datasource = static::getDatasource($theme);

        if ($datasource->hasTemplate($dirName, $name, $extension)) {
            $datasource->update($dirName, $name, $extension, $content);
        }
        else {
            $datasource->insert($dirName, $name, $extension, $content);
        }
    }

    /**
     * delete removes a blueprint through the datasource
     */
    public static function delete(Theme $theme, string $fileName): void
    {
        [$dirName, $name, $extension] = static::parseFileName($fileName);
        static::getDatasource($theme)->delete($dirName, $name, $extension);
    }

    /**
     * rename moves a blueprint to a new file name
     */
    public static function rename(Theme $theme, string $oldFileName, string $newFileName): void
    {
        $oldFileName = ltrim(File::normalizePath($oldFileName), '/');
        $newFileName = ltrim(File::normalizePath($newFileName), '/');

        if ($oldFileName === $newFileName) {
            return;
        }

        [$oldDir, $oldName, $oldExt] = static::parseFileName($oldFileName);
        [$newDir, $newName, $newExt] = static::parseFileName($newFileName);
        $datasource = static::getDatasource($theme);

        $result = $datasource->selectOne($oldDir, $oldName, $oldExt);
        if (!$result) {
            return;
        }

        $content = $result['content'];

        if ($datasource->hasTemplate($newDir, $newName, $newExt)) {
            $datasource->update($newDir, $newName, $newExt, $content);
        }
        else {
            $datasource->insert($newDir, $newName, $newExt, $content);
        }

        $datasource->delete($oldDir, $oldName, $oldExt);
    }

    /**
     * move moves a blueprint to a new directory
     */
    public static function move(Theme $theme, string $oldFileName, string $destinationDir): void
    {
        $oldFileName = ltrim(File::normalizePath($oldFileName), '/');
        $destinationDir = trim(File::normalizePath($destinationDir), '/');
        $fileName = basename($oldFileName);
        $newFileName = $destinationDir === '' ? $fileName : $destinationDir . '/' . $fileName;

        static::rename($theme, $oldFileName, $newFileName);
    }

    /**
     * isTrashed checks if a blueprint has been tombstoned in the database layer
     */
    public static function isTrashed(Theme $theme, string $fileName): bool
    {
        if (!static::usesDatabase($theme)) {
            return false;
        }

        $path = static::PREFIX . '/' . ltrim(File::normalizePath($fileName), '/');

        return Db::table(static::TABLE)
            ->where('source', $theme->getDirName())
            ->where('path', $path)
            ->whereNotNull('content')
            ->whereNotNull('deleted_at')
            ->exists();
    }

    /**
     * listAtPath returns blueprint entries at a path for navigator merging
     */
    public static function listAtPath(Theme $theme, string $filterPath = ''): array
    {
        if (!static::usesDatabase($theme)) {
            return [];
        }

        $prefix = static::PREFIX . '/';
        if ($filterPath !== '') {
            $prefix .= trim($filterPath, '/') . '/';
        }

        $paths = Db::table(static::TABLE)
            ->where('source', $theme->getDirName())
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

            if (count($parts) === 1) {
                $entries[$first] = [
                    'fileName' => $first,
                    'isFolder' => 0,
                    'isEditable' => in_array(strtolower(pathinfo($first, PATHINFO_EXTENSION)), ['yaml', 'yml'], true),
                    'path' => $filterPath === '' ? $first : trim($filterPath, '/') . '/' . $first,
                ];
            }
            else {
                $entries[$first] = [
                    'fileName' => $first,
                    'isFolder' => 1,
                    'isEditable' => 0,
                    'path' => $filterPath === '' ? $first : trim($filterPath, '/') . '/' . $first,
                ];
            }
        }

        return array_values($entries);
    }

    /**
     * parseFileName splits a blueprint-relative file name into datasource segments
     */
    public static function parseFileName(string $fileName): array
    {
        return ThemeFiles::parseRelativePath(static::PREFIX . '/' . ltrim(File::normalizePath($fileName), '/'));
    }

    /**
     * getDatasource returns the Halcyon datasource for theme blueprints
     */
    public static function getDatasource(Theme $theme)
    {
        $resolver = App::make('halcyon');
        $key = $theme->getDirName() . '-blueprints';

        if (!$resolver->hasDatasource($key)) {
            $resolver->addDatasource($key, new DbDatasource($theme->getDirName(), static::TABLE));
        }

        return $resolver->datasource($key);
    }
}
