<?php namespace Cms\Classes;

use Url;
use File;
use Config;
use Db;
use Storage;
use Carbon\Carbon;

/**
 * ThemeFiles stores theme asset bytes on the default filesystem disk
 * and tracks them in the cms_theme_storage table.
 */
class ThemeFiles
{
    /**
     * isStored checks if a theme-relative path is tracked in storage
     */
    public static function isStored(Theme $theme, string $relativePath): bool
    {
        if (!$theme->databaseFilesEnabled()) {
            return false;
        }

        $relativePath = static::normalizeRelativePath($relativePath);

        return Db::table('cms_theme_storage')
            ->where('source', $theme->getDirName())
            ->where('path', $relativePath)
            ->exists()
            && static::disk()->exists(static::diskPath($theme, $relativePath));
    }

    /**
     * get returns file content and metadata for a stored path
     */
    public static function get(Theme $theme, string $relativePath): ?array
    {
        if (!static::isStored($theme, $relativePath)) {
            return null;
        }

        $relativePath = static::normalizeRelativePath($relativePath);
        $diskPath = static::diskPath($theme, $relativePath);
        $row = Db::table('cms_theme_storage')
            ->where('source', $theme->getDirName())
            ->where('path', $relativePath)
            ->first();

        if (!$row) {
            return null;
        }

        return [
            'content' => static::disk()->get($diskPath),
            'mtime' => $row->updated_at ? Carbon::parse($row->updated_at)->timestamp : time(),
        ];
    }

    /**
     * put writes bytes to the disk and upserts metadata
     */
    public static function put(Theme $theme, string $relativePath, string $content): void
    {
        $relativePath = static::normalizeRelativePath($relativePath);
        $diskPath = static::diskPath($theme, $relativePath);

        if (!static::disk()->put($diskPath, $content)) {
            throw new \ApplicationException('Unable to save theme file: '.$relativePath);
        }

        $now = Carbon::now()->toDateTimeString();
        $attributes = [
            'file_size' => strlen($content),
            'updated_at' => $now,
        ];

        $exists = Db::table('cms_theme_storage')
            ->where('source', $theme->getDirName())
            ->where('path', $relativePath)
            ->exists();

        if ($exists) {
            Db::table('cms_theme_storage')
                ->where('source', $theme->getDirName())
                ->where('path', $relativePath)
                ->update($attributes);
        }
        else {
            Db::table('cms_theme_storage')->insert(array_merge($attributes, [
                'source' => $theme->getDirName(),
                'path' => $relativePath,
            ]));
        }
    }

    /**
     * delete removes metadata and disk bytes for a stored path
     */
    public static function delete(Theme $theme, string $relativePath): void
    {
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        $relativePath = static::normalizeRelativePath($relativePath);
        $diskPath = static::diskPath($theme, $relativePath);

        if (static::disk()->exists($diskPath)) {
            static::disk()->delete($diskPath);
        }

        Db::table('cms_theme_storage')
            ->where('source', $theme->getDirName())
            ->where('path', $relativePath)
            ->delete();
    }

    /**
     * rename moves a stored file to a new theme-relative path
     */
    public static function rename(Theme $theme, string $oldPath, string $newPath): void
    {
        $oldPath = static::normalizeRelativePath($oldPath);
        $newPath = static::normalizeRelativePath($newPath);

        if ($oldPath === $newPath) {
            return;
        }

        $data = static::get($theme, $oldPath);

        if ($data === null) {
            return;
        }

        static::put($theme, $newPath, $data['content']);
        static::delete($theme, $oldPath);
    }

    /**
     * move moves a stored file into another assets directory
     */
    public static function move(Theme $theme, string $oldPath, string $destinationDir): void
    {
        $oldPath = static::normalizeRelativePath($oldPath);
        $destinationDir = trim(File::normalizePath($destinationDir), '/');

        if (str_starts_with($destinationDir, 'assets/')) {
            $destinationDir = substr($destinationDir, strlen('assets/'));
        }

        $fileName = basename($oldPath);
        $newPath = 'assets/'.($destinationDir === '' ? $fileName : $destinationDir.'/'.$fileName);

        static::rename($theme, $oldPath, $newPath);
    }

    /**
     * listAssets returns asset navigator entries from stored files
     */
    public static function listAssets(Theme $theme, string $filterPath = ''): array
    {
        if (!$theme->databaseFilesEnabled()) {
            return [];
        }

        $filterPath = trim(File::normalizePath($filterPath), '/');
        $prefix = 'assets'.($filterPath !== '' ? '/'.$filterPath : '');

        $paths = Db::table('cms_theme_storage')
            ->where('source', $theme->getDirName())
            ->where('path', 'like', $prefix.'/%')
            ->pluck('path');

        $editableAssetTypes = Asset::getEditableExtensions();
        $children = [];

        foreach ($paths as $path) {
            if (!static::disk()->exists(static::diskPath($theme, $path))) {
                continue;
            }

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
     * mergeListings combines listings with stored entries winning conflicts
     */
    public static function mergeListings(array $base, array $stored): array
    {
        return collect($base)
            ->keyBy('path')
            ->merge(collect($stored)->keyBy('path'))
            ->values()
            ->all();
    }

    /**
     * getPublicUrl returns a URL for a stored theme file
     */
    public static function getPublicUrl(Theme $theme, string $relativePath): string
    {
        $relativePath = static::normalizeRelativePath($relativePath);
        $disk = static::disk();

        if (method_exists($disk, 'url')) {
            $url = $disk->url(static::diskPath($theme, $relativePath));
            if ($url) {
                return $url;
            }
        }

        $publicBase = Config::get('system.themes_asset_url');
        if ($publicBase) {
            return rtrim($publicBase, '/').'/'.$theme->getDirName().'/'.ltrim($relativePath, '/');
        }

        return Url::to('cms/theme-files/'.$theme->getDirName().'/'.ltrim($relativePath, '/'));
    }

    /**
     * getCombinerPath returns a local path for the asset combiner
     */
    public static function getCombinerPath(Theme $theme, string $relativePath): ?string
    {
        if (!static::isStored($theme, $relativePath)) {
            return null;
        }

        $relativePath = static::normalizeRelativePath($relativePath);
        $disk = static::disk();
        $diskPath = static::diskPath($theme, $relativePath);

        if (method_exists($disk, 'path')) {
            $localPath = $disk->path($diskPath);
            if (is_file($localPath)) {
                return $localPath;
            }
        }

        $cacheDir = temp_path('cms-theme-files/'.$theme->getDirName());
        File::makeDirectory($cacheDir, 0755, true, true);
        $cachePath = $cacheDir.'/'.md5($relativePath).'.'.pathinfo($relativePath, PATHINFO_EXTENSION);

        if (!File::isFile($cachePath) || File::lastModified($cachePath) < $disk->lastModified($diskPath)) {
            File::put($cachePath, $disk->get($diskPath));
        }

        return $cachePath;
    }

    /**
     * purgeTheme removes all stored files for a theme
     */
    public static function purgeTheme(Theme $theme): void
    {
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        Db::table('cms_theme_storage')
            ->where('source', $theme->getDirName())
            ->delete();

        static::disk()->deleteDirectory(static::diskPrefix($theme));
    }

    /**
     * disk returns the default filesystem disk
     */
    public static function disk()
    {
        return Storage::disk();
    }

    /**
     * diskPrefix returns the object key prefix for a theme
     */
    public static function diskPrefix(Theme $theme): string
    {
        return trim($theme->getDirName(), '/');
    }

    /**
     * diskPath returns the object key for a theme-relative path
     */
    public static function diskPath(Theme $theme, string $relativePath): string
    {
        return static::diskPrefix($theme).'/'.ltrim(static::normalizeRelativePath($relativePath), '/');
    }

    /**
     * normalizeRelativePath normalizes a theme-relative file path
     */
    protected static function normalizeRelativePath(string $relativePath): string
    {
        return ltrim(File::normalizePath($relativePath), '/');
    }
}
