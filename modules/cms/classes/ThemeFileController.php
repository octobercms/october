<?php namespace Cms\Classes;

use File;
use Response;
use Storage;
use Cms\Helpers\File as FileHelper;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

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

        $relativePath = ltrim(File::normalizePath($filePath), '/');

        if (!FileHelper::validatePath($relativePath, null)) {
            return Response::make('File not found', 404);
        }

        if (!ThemeFiles::isStoredFile($theme, $relativePath)) {
            return Response::make('File not found', 404);
        }

        $localPath = ThemeFiles::getLocalPath($theme, $relativePath);

        if ($localPath && is_file($localPath)) {
            return new BinaryFileResponse($localPath);
        }

        $diskPath = ThemeFiles::getDiskPath($theme, $relativePath);
        $disk = ThemeFiles::disk();

        if (!$disk->exists($diskPath)) {
            return Response::make('File not found', 404);
        }

        return new StreamedResponse(function () use ($disk, $diskPath) {
            echo $disk->get($diskPath);
        }, 200, [
            'Content-Type' => $disk->mimeType($diskPath) ?: 'application/octet-stream',
        ]);
    }
}
