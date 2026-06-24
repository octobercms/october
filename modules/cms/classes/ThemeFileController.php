<?php namespace Cms\Classes;

use File;
use Response;
use Cms\Helpers\File as FileHelper;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * ThemeFileController serves stored theme files when the disk has no public URL
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

        if (!ThemeFiles::isStored($theme, $relativePath)) {
            return Response::make('File not found', 404);
        }

        $disk = ThemeFiles::disk();
        $diskPath = ThemeFiles::diskPath($theme, $relativePath);

        if (method_exists($disk, 'path')) {
            $localPath = $disk->path($diskPath);
            if (is_file($localPath)) {
                return new BinaryFileResponse($localPath);
            }
        }

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
