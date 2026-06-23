<?php namespace Cms\Classes;

use File;
use Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * ThemeFileController serves theme files stored in the storage layer
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeFileController
{
    /**
     * show a stored theme file
     */
    public function show(string $themeDir, string $filePath)
    {
        $theme = Theme::load($themeDir);

        if (!$theme->isValid()) {
            return Response::make('File not found', 404);
        }

        $relativePath = File::normalizePath($filePath);

        if (!ThemeFiles::isStoredFile($theme, $relativePath)) {
            return Response::make('File not found', 404);
        }

        $localPath = ThemeFiles::getLocalPath($theme, $relativePath);

        if (!$localPath || !is_file($localPath)) {
            return Response::make('File not found', 404);
        }

        return new BinaryFileResponse($localPath);
    }
}
