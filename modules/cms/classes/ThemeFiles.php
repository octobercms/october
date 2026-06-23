<?php namespace Cms\Classes;

use Url;
use File;
use Config;
use Db;
use October\Rain\Halcyon\Datasource\AutoDatasource;

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
     * @var string TABLE for theme file metadata
     */
    const TABLE = 'cms_theme_files';

    /**
     * @var string ROUTE_PREFIX for serving stored theme files locally
     */
    const ROUTE_PREFIX = 'cms/theme-files';

    /**
     * has checks if a theme-relative file path exists in any datasource layer
     */
    public static function has(Theme $theme, string $relativePath): bool
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);

        return static::getDatasource($theme)->hasTemplate($dirName, $fileName, $extension);
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
        $datasource = static::getDatasource($theme);

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

        return Db::table(static::TABLE)
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
        $datasource = static::getDatasource($theme);

        $publicBase = Config::get('system.themes_asset_url');
        $context = [
            'publicUrl' => $publicBase ? rtrim($publicBase, '/') . '/' . $theme->getDirName() : null,
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

        return Url::to(static::ROUTE_PREFIX . '/' . $theme->getDirName() . '/' . ltrim($relativePath, '/'));
    }

    /**
     * getLocalPath returns the absolute local path for a theme file
     */
    public static function getLocalPath(Theme $theme, string $relativePath): ?string
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        $datasource = static::getDatasource($theme);

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
        $datasource = static::getDatasource($theme);

        if ($datasource->hasTemplate($dirName, $fileName, $extension)) {
            $datasource->update($dirName, $fileName, $extension, $content);
        }
        else {
            $datasource->insert($dirName, $fileName, $extension, $content);
        }
    }

    /**
     * delete removes a theme file through the datasource
     */
    public static function delete(Theme $theme, string $relativePath): void
    {
        [$dirName, $fileName, $extension] = static::parseRelativePath($relativePath);
        static::getDatasource($theme)->delete($dirName, $fileName, $extension);
    }

    /**
     * rename moves a stored theme file to a new relative path
     */
    public static function rename(Theme $theme, string $oldRelativePath, string $newRelativePath): void
    {
        [$oldDir, $oldName, $oldExt] = static::parseRelativePath($oldRelativePath);
        [$newDir, $newName, $newExt] = static::parseRelativePath($newRelativePath);
        $datasource = static::getDatasource($theme);

        $result = $datasource->selectOne($oldDir, $oldName, $oldExt);
        $content = $result['content'] ?? '';

        $datasource->update($newDir, $newName, $newExt, $content, $oldName, $oldExt);
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
     * getStoragePath returns the storage root for a theme
     */
    public static function getStoragePath(Theme $theme): string
    {
        return storage_path('themes/' . $theme->getDirName());
    }

    /**
     * getDatasource returns the file datasource for a theme
     */
    public static function getDatasource(Theme $theme)
    {
        return $theme->getFileDatasource();
    }
}
