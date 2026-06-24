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
     * isStoredFile checks if a file is tracked by a storage datasource layer
     */
    public static function isStoredFile(Theme $theme, string $relativePath): bool
    {
        return static::resolveStorageTheme($theme, $relativePath) !== null;
    }

    /**
     * resolveStorageTheme returns the theme whose storage layer owns a file
     */
    public static function resolveStorageTheme(Theme $theme, string $relativePath): ?Theme
    {
        if (!$theme->filesLayerEnabled()) {
            return null;
        }

        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);

        if ($theme->databaseFilesEnabled()) {
            $datasource = static::makeStorageDatasource($theme);

            if ($datasource->hasTemplate($dirName, $fileName, $extension)) {
                return $theme;
            }
        }

        if (($parent = $theme->getParentTheme()) && $parent->databaseFilesEnabled()) {
            $datasource = static::makeStorageDatasource($parent);

            if ($datasource->hasTemplate($dirName, $fileName, $extension)) {
                return $parent;
            }
        }

        return null;
    }

    /**
     * isTrashed checks if a theme file has been tombstoned in the database layer
     */
    public static function isTrashed(Theme $theme, string $relativePath): bool
    {
        if (!$theme->filesLayerEnabled()) {
            return false;
        }

        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);

        if (static::makeStorageDatasource($theme)->isTemplateTrashed($dirName, $fileName, $extension)) {
            return true;
        }

        if (($parent = $theme->getParentTheme()) && $parent->databaseFilesEnabled()) {
            return static::makeStorageDatasource($parent)->isTemplateTrashed($dirName, $fileName, $extension);
        }

        return false;
    }

    /**
     * getPublicUrl returns a public or local URL for a stored theme file
     */
    public static function getPublicUrl(Theme $theme, string $relativePath): string
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        $datasource = $theme->getFileDatasource();
        $storageTheme = static::resolveStorageTheme($theme, $relativePath) ?: $theme;
        $publicBase = Config::get('system.themes_asset_url');
        $context = [
            'theme' => $theme,
        ];

        if ($datasource instanceof AutoDatasource) {
            $resolvedUrl = $datasource->resolvePublicUrl($dirName, $fileName, $extension, $context);
            if ($resolvedUrl) {
                return $resolvedUrl;
            }
        }

        if ($publicBase) {
            return rtrim($publicBase, '/') . '/' . $storageTheme->getDirName() . '/' . ltrim($relativePath, '/');
        }

        return Url::to('cms/theme-files/' . $storageTheme->getDirName() . '/' . ltrim($relativePath, '/'));
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
     * getCombinerPath returns a local filesystem path for asset combiner input
     */
    public static function getCombinerPath(Theme $theme, string $relativePath): ?string
    {
        $storageTheme = static::resolveStorageTheme($theme, $relativePath);

        if (!$storageTheme) {
            return null;
        }

        $localPath = static::getLocalPath($theme, $relativePath);
        if ($localPath && is_file($localPath)) {
            return $localPath;
        }

        $diskPath = static::getDiskPath($storageTheme, $relativePath);
        $disk = static::disk();

        if (!$disk->exists($diskPath)) {
            return null;
        }

        $cacheDir = temp_path('cms-theme-files/' . $storageTheme->getDirName());
        File::makeDirectory($cacheDir, 0755, true, true);

        $extension = pathinfo($relativePath, PATHINFO_EXTENSION);
        $cachePath = $cacheDir . '/' . md5($relativePath) . '.' . $extension;

        if (!File::isFile($cachePath) || File::lastModified($cachePath) < $disk->lastModified($diskPath)) {
            File::put($cachePath, $disk->get($diskPath));
        }

        return $cachePath;
    }

    /**
     * listAssetsAtPath returns asset navigator entries from database-tracked storage
     */
    public static function listAssetsAtPath(Theme $theme, string $filterPath = ''): array
    {
        if (!$theme->databaseFilesEnabled()) {
            return [];
        }

        $filterPath = trim(File::normalizePath($filterPath), '/');
        $prefix = 'assets' . ($filterPath !== '' ? '/' . $filterPath : '');

        $paths = Db::table('cms_theme_files')
            ->where('source', $theme->getDirName())
            ->whereNull('content')
            ->whereNull('deleted_at')
            ->where('path', 'like', $prefix . '/%')
            ->pluck('path');

        $editableAssetTypes = Asset::getEditableExtensions();
        $children = [];

        foreach ($paths as $path) {
            $remainder = substr($path, strlen($prefix) + 1);
            if ($remainder === '' || $remainder === false) {
                continue;
            }

            $parts = explode('/', $remainder);
            $name = $parts[0];
            $isFolder = count($parts) > 1;

            if (!isset($children[$name])) {
                $children[$name] = [
                    'filename' => $name,
                    'isFolder' => $isFolder ? 1 : 0,
                    'isEditable' => !$isFolder && in_array(strtolower(pathinfo($name, PATHINFO_EXTENSION)), $editableAssetTypes),
                    'path' => $name,
                ];
                continue;
            }

            if ($isFolder) {
                $children[$name]['isFolder'] = 1;
                $children[$name]['isEditable'] = 0;
            }
        }

        return array_values($children);
    }

    /**
     * hasAssetDirectory checks if a virtual asset directory contains stored files
     */
    public static function hasAssetDirectory(Theme $theme, string $assetPath): bool
    {
        if (!$theme->filesLayerEnabled()) {
            return false;
        }

        return static::resolveAssetDirectoryOwner($theme, $assetPath) !== null;
    }

    /**
     * resolveAssetDirectoryOwner returns the theme that owns stored files under a directory
     */
    public static function resolveAssetDirectoryOwner(Theme $theme, string $assetPath): ?Theme
    {
        if (static::themeHasAssetDirectory($theme, $assetPath, $theme)) {
            return $theme;
        }

        if (($parent = $theme->getParentTheme()) && $parent->databaseFilesEnabled()) {
            if (static::themeHasAssetDirectory($parent, $assetPath, $theme)) {
                return $parent;
            }
        }

        return null;
    }

    /**
     * themeHasAssetDirectory checks stored files under a directory for a specific theme
     */
    protected static function themeHasAssetDirectory(Theme $owner, string $assetPath, Theme $context): bool
    {
        if (!$owner->databaseFilesEnabled()) {
            return false;
        }

        $assetPath = trim(File::normalizePath($assetPath), '/');
        $prefix = 'assets' . ($assetPath !== '' ? '/' . $assetPath : '');

        $paths = Db::table('cms_theme_files')
            ->where('source', $owner->getDirName())
            ->whereNull('content')
            ->whereNull('deleted_at')
            ->where('path', 'like', $prefix . '/%')
            ->pluck('path');

        foreach ($paths as $path) {
            if (!static::isTrashed($context, $path)) {
                return true;
            }
        }

        return false;
    }

    /**
     * deleteAssetsUnderPrefix removes all stored files under an asset directory prefix
     */
    public static function deleteAssetsUnderPrefix(Theme $theme, string $assetPath): void
    {
        $owner = static::resolveAssetDirectoryOwner($theme, $assetPath);

        if (!$owner) {
            return;
        }

        $assetPath = trim(File::normalizePath($assetPath), '/');
        $prefix = 'assets' . ($assetPath !== '' ? '/' . $assetPath : '');

        $paths = Db::table('cms_theme_files')
            ->where('source', $owner->getDirName())
            ->whereNull('content')
            ->whereNull('deleted_at')
            ->where('path', 'like', $prefix . '/%')
            ->orderByDesc('path')
            ->pluck('path');

        foreach ($paths as $path) {
            if (static::isTrashed($theme, $path)) {
                continue;
            }

            static::delete($theme, $path);
        }
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
        $storageTheme = static::resolveStorageTheme($theme, $relativePath);

        if (
            $storageTheme &&
            $storageTheme->getDirName() !== $theme->getDirName() &&
            !$theme->databaseFilesEnabled()
        ) {
            static::makeStorageDatasource($theme)->tombstone($dirName, $fileName, $extension);
            return;
        }

        $datasource = $theme->getFileDatasource();

        if ($datasource->hasTemplate($dirName, $fileName, $extension)) {
            $datasource->delete($dirName, $fileName, $extension);
            return;
        }

        static::purgeOrphanMetadata($theme, $relativePath);

        if (($parent = $theme->getParentTheme()) && $parent->databaseFilesEnabled()) {
            static::purgeOrphanMetadata($parent, $relativePath);
        }
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

            if ($disk->exists($oldDiskPath) && !$disk->move($oldDiskPath, $newDiskPath)) {
                continue;
            }

            Db::table('cms_theme_files')
                ->where('id', $row->id)
                ->update(['path' => $newPath]);
        }

        static::flushStorageCache($theme);
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
     * disk returns the default Laravel filesystem disk for theme file bytes
     */
    public static function disk()
    {
        return Storage::disk();
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

        $diskName = Config::get('filesystems.default', 'local');
        $root = Config::get('filesystems.disks.' . $diskName . '.root');

        return rtrim($root, '/') . '/' . $theme->getDirName();
    }

    /**
     * deleteThemeDirectory removes all stored files for a theme
     */
    public static function deleteThemeDirectory(Theme $theme): void
    {
        static::disk()->deleteDirectory($theme->getDirName());
    }

    /**
     * purgeOrphanMetadata removes metadata rows that no longer have loadable file bytes
     */
    protected static function purgeOrphanMetadata(Theme $theme, string $relativePath): void
    {
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        $path = ltrim(File::normalizePath($relativePath), '/');

        $deleted = Db::table('cms_theme_files')
            ->where('source', $theme->getDirName())
            ->where('path', $path)
            ->whereNull('content')
            ->whereNull('deleted_at')
            ->delete();

        if ($deleted) {
            static::flushStorageCache($theme);
        }
    }

    /**
     * flushStorageCache clears cached metadata for a theme's storage datasource
     */
    public static function flushStorageCache(Theme $theme): void
    {
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        static::makeStorageDatasource($theme)->flushStorageCache();
    }
}
