<?php namespace Cms\Classes;

use Url;
use File;
use Config;
use Db;
use Storage;
use Cms\Classes\Halcyon\DiskStorageFileDatasource;
use October\Rain\Halcyon\Datasource\AutoDatasource;
use October\Rain\Halcyon\Datasource\DatasourceInterface;
use October\Rain\Halcyon\Datasource\StorageFileDatasource;

/**
 * ThemeFiles provides unified lookup and URL resolution for theme files
 *
 * Theme templates and uploaded files share the `cms_theme_files` table.
 * Records with content are templates; records with null content are file metadata.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeFiles
{
    /**
     * has checks if a theme-relative file path exists in any datasource layer
     */
    public static function has(Theme $theme, string $relativePath): bool
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);

        return $theme->getFileDatasource()->hasTemplate($dirName, $fileName, $extension);
    }

    /**
     * isStoredFile checks if a file is tracked by the storage datasource
     */
    public static function isStoredFile(Theme $theme, string $relativePath): bool
    {
        if (!$theme->databaseFilesEnabled()) {
            return false;
        }

        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        $datasource = $theme->getFileDatasource();

        if (!$datasource instanceof AutoDatasource) {
            return false;
        }

        return $datasource->hasTemplateAtIndex(0, $dirName, $fileName, $extension);
    }

    /**
     * isTrashed checks if a theme file has been tombstoned in the database layer
     */
    public static function isTrashed(Theme $theme, string $relativePath): bool
    {
        if (!$theme->filesLayerEnabled()) {
            return false;
        }

        $relativePath = ltrim(File::normalizePath($relativePath), '/');

        return Db::table('cms_theme_files')
            ->where('source', $theme->getDirName())
            ->where('path', $relativePath)
            ->whereNull('content')
            ->whereNotNull('deleted_at')
            ->exists();
    }

    /**
     * getPublicUrl returns a public or local URL for a stored theme file
     */
    public static function getPublicUrl(Theme $theme, string $relativePath): string
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        $datasource = $theme->getFileDatasource();

        $disk = static::disk();
        $diskUrl = method_exists($disk, 'url') ? rtrim($disk->url($theme->getDirName()), '/') : null;
        $publicBase = Config::get('system.themes_asset_url');
        $context = [
            'publicUrl' => $diskUrl ?: ($publicBase ? rtrim($publicBase, '/') . '/' . $theme->getDirName() : null),
            'theme' => $theme,
        ];

        if ($datasource instanceof AutoDatasource) {
            $resolvedUrl = $datasource->resolvePublicUrl($dirName, $fileName, $extension, $context);
            if ($resolvedUrl) {
                return $resolvedUrl;
            }
        }

        if ($publicBase) {
            return rtrim($publicBase, '/') . '/' . $theme->getDirName() . '/' . ltrim($relativePath, '/');
        }

        return Url::to('cms/theme-files/' . $theme->getDirName() . '/' . ltrim($relativePath, '/'));
    }

    /**
     * getLocalPath returns the absolute local path for a theme file
     */
    public static function getLocalPath(Theme $theme, string $relativePath): ?string
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        $datasource = $theme->getFileDatasource();

        if ($datasource instanceof AutoDatasource) {
            return $datasource->resolveLocalPath($dirName, $fileName, $extension);
        }

        return null;
    }

    /**
     * write stores file content through the theme file datasource
     */
    public static function write(Theme $theme, string $relativePath, string $content): void
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        static::upsert($theme->getFileDatasource(), $dirName, $fileName, $extension, $content);
    }

    /**
     * delete removes a theme file through the datasource
     */
    public static function delete(Theme $theme, string $relativePath): void
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        $theme->getFileDatasource()->delete($dirName, $fileName, $extension);
    }

    /**
     * rename moves a theme file to a new relative path
     */
    public static function rename(Theme $theme, string $oldRelativePath, string $newRelativePath): void
    {
        $oldRelativePath = ltrim(File::normalizePath($oldRelativePath), '/');
        $newRelativePath = ltrim(File::normalizePath($newRelativePath), '/');

        if ($oldRelativePath === $newRelativePath) {
            return;
        }

        static::renameSegments(
            $theme->getFileDatasource(),
            static::parseRelativePath($oldRelativePath),
            static::parseRelativePath($newRelativePath)
        );
    }

    /**
     * move moves a theme file to a new directory
     */
    public static function move(Theme $theme, string $oldRelativePath, string $destinationDir): void
    {
        $oldRelativePath = ltrim(File::normalizePath($oldRelativePath), '/');
        $destinationDir = trim(File::normalizePath($destinationDir), '/');
        $topDir = strtok($oldRelativePath, '/');
        $fileName = basename($oldRelativePath);
        $newInner = $destinationDir === '' ? $fileName : $destinationDir . '/' . $fileName;
        $newRelativePath = $topDir . '/' . $newInner;

        static::rename($theme, $oldRelativePath, $newRelativePath);
    }

    /**
     * renamePathPrefix renames stored file metadata and disk paths under a directory
     */
    public static function renamePathPrefix(Theme $theme, string $oldPrefix, string $newPrefix): void
    {
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        $oldPrefix = ltrim(File::normalizePath($oldPrefix), '/');
        $newPrefix = ltrim(File::normalizePath($newPrefix), '/');

        if ($oldPrefix === $newPrefix) {
            return;
        }

        $rows = Db::table('cms_theme_files')
            ->where('source', $theme->getDirName())
            ->whereNull('content')
            ->whereNull('deleted_at')
            ->where('path', 'like', $oldPrefix . '/%')
            ->get();

        $disk = static::disk();

        foreach ($rows as $row) {
            $newPath = $newPrefix . substr($row->path, strlen($oldPrefix));
            $oldDiskPath = static::getDiskPath($theme, $row->path);
            $newDiskPath = static::getDiskPath($theme, $newPath);

            if ($disk->exists($oldDiskPath)) {
                $disk->move($oldDiskPath, $newDiskPath);
            }

            Db::table('cms_theme_files')
                ->where('id', $row->id)
                ->update(['path' => $newPath]);
        }
    }

    /**
     * upsert writes content through a Halcyon datasource
     */
    public static function upsert(
        DatasourceInterface $datasource,
        string $dirName,
        string $fileName,
        string $extension,
        string $content
    ): void {
        if ($datasource->hasTemplate($dirName, $fileName, $extension)) {
            $datasource->update($dirName, $fileName, $extension, $content);
        }
        else {
            $datasource->insert($dirName, $fileName, $extension, $content);
        }
    }

    /**
     * renameSegments moves a file between datasource path segments
     */
    public static function renameSegments(
        DatasourceInterface $datasource,
        array $oldSegments,
        array $newSegments
    ): void {
        [$oldDir, $oldName, $oldExt] = $oldSegments;
        [$newDir, $newName, $newExt] = $newSegments;

        $result = $datasource->selectOne($oldDir, $oldName, $oldExt);
        if (!$result) {
            return;
        }

        static::upsert($datasource, $newDir, $newName, $newExt, $result['content']);
        $datasource->delete($oldDir, $oldName, $oldExt);
    }

    /**
     * mergeListings combines path-keyed listings with override winning on conflicts
     */
    public static function mergeListings(array $base, array $override): array
    {
        return collect($base)
            ->keyBy('path')
            ->merge(collect($override)->keyBy('path'))
            ->values()
            ->all();
    }

    /**
     * parseRelativePath splits a theme-relative path into datasource segments
     */
    public static function parseRelativePath(string $relativePath): array
    {
        $relativePath = ltrim(File::normalizePath($relativePath), '/');
        $extension = pathinfo($relativePath, PATHINFO_EXTENSION);
        $dirName = pathinfo($relativePath, PATHINFO_DIRNAME);
        $fileName = pathinfo($relativePath, PATHINFO_FILENAME);

        if ($dirName === '.' || $dirName === '') {
            $dirName = '';
        }

        return [$dirName, $fileName, $extension];
    }

    /**
     * makeStorageDatasource builds the primary storage datasource for a theme
     */
    public static function makeStorageDatasource(Theme $theme): StorageFileDatasource
    {
        return new DiskStorageFileDatasource(
            $theme->getDirName(),
            'cms_theme_files',
            static::disk(),
            $theme->getDirName()
        );
    }

    /**
     * disk returns the configured theme files storage disk
     */
    public static function disk()
    {
        return Storage::disk(Config::get('cms.theme_files_disk', 'theme-files'));
    }

    /**
     * getDiskPath returns the object key for a theme-relative path
     */
    public static function getDiskPath(Theme $theme, string $relativePath): string
    {
        return trim($theme->getDirName(), '/') . '/' . ltrim(File::normalizePath($relativePath), '/');
    }

    /**
     * getStoragePath returns the local storage root for a theme, if available
     */
    public static function getStoragePath(Theme $theme): string
    {
        $disk = static::disk();

        if (method_exists($disk, 'path')) {
            return $disk->path($theme->getDirName());
        }

        return storage_path('app/theme-files/' . $theme->getDirName());
    }

    /**
     * deleteThemeDirectory removes all stored files for a theme
     */
    public static function deleteThemeDirectory(Theme $theme): void
    {
        $disk = static::disk();
        $prefix = $theme->getDirName();

        if (method_exists($disk, 'deleteDirectory')) {
            $disk->deleteDirectory($prefix);
            return;
        }

        File::deleteDirectory(static::getStoragePath($theme));
    }
}
