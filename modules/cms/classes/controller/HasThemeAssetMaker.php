<?php namespace Cms\Classes\Controller;

use Url;
use File;
use Config;
use System\Classes\CombineAssets;

/**
 * ThemeAssetMaker adds theme-based asset methods to a class
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasThemeAssetMaker
{
    use \System\Traits\AssetMaker;

    /**
     * combineAssets
     * @inheritDoc
     */
    public function combineAssets(array $assets, $localPath = ''): string
    {
        if (empty($assets)) {
            return '';
        }

        $assetPath = $localPath ?: base_path($this->assetPath);

        return CombineAssets::combine(
            $this->getMultipleThemeAssetPaths($assets),
            $assetPath
        );
    }

    /**
     * getAssetPath
     * @inheritDoc
     */
    public function getAssetPath($fileName, $assetPath = null)
    {
        if (
            str_starts_with($fileName, '//') ||
            str_starts_with($fileName, 'http://') ||
            str_starts_with($fileName, 'https://')
        ) {
            return $fileName;
        }

        if (!$assetPath) {
            $assetPath = $this->assetPath;
        }

        if (
            $assetPath === null ||
            substr($fileName, 0, 1) === '/' ||
            File::isPathSymbol($fileName)
        ) {
            return $fileName;
        }

        return $this->getThemeAssetRelativePath($fileName);
    }

    /**
     * getMultipleThemeAssetPaths checks combiner paths in the theme
     * and rewrites them to parent assets, if necessary
     */
    protected function getMultipleThemeAssetPaths(array $paths): array
    {
        $theme = $this->getTheme();

        if (!$theme->hasParentTheme()) {
            return $paths;
        }

        foreach ($paths as &$path) {
            // Combiner alias
            if (substr($path, 0, 1) === '@') {
                continue;
            }

            // Path symbol
            if (File::isPathSymbol($path)) {
                continue;
            }

            // Fully qualified local path
            if (file_exists($path)) {
                continue;
            }

            // Parent asset
            if ($theme->useParentAsset($path)) {
                $path = $theme->getParentTheme()->getPath().'/'.$path;
            }
        }

        return $paths;
    }

    /**
     * getThemeAssetPath
     */
    protected function getThemeAssetRelativePath(?string $relativePath = null): string
    {
        $dirName = $this->getTheme()->getDirName();

        // Build path
        $path = "/themes/{$dirName}";
        if ($relativePath !== null) {
            $path .= '/' . $relativePath;
        }

        return $path;
    }

    /**
     * getThemeAssetUrl returns the public directory for theme assets
     */
    protected function getThemeAssetUrl(?string $relativePath = null): string
    {
        // Determine directory name for asset
        $theme = $this->getTheme();
        $dirName = $theme->getDirName();

        if (
            $relativePath !== null &&
            $theme->useParentAsset($relativePath) &&
            ($parentTheme = $theme->getParentTheme())
        ) {
            $dirName = $parentTheme->getDirName();
        }

        // Configuration for theme asset location, default to relative path
        $assetUrl = (string) Config::get('system.themes_asset_url') ?: '/themes';

        // Build path
        $path = $assetUrl . '/' . $dirName;
        if ($relativePath !== null) {
            $path .= '/' . $relativePath;
        }

        return $path;
    }
}
