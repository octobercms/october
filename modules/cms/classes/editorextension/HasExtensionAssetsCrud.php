<?php namespace Cms\Classes\EditorExtension;

use File;
use Input;
use Lang;
use Request;
use System;
use Cms\Classes\ThemeFiles;
use Cms\Helpers\File as FileHelper;
use Editor\Classes\ApiHelpers;
use Cms\Classes\EditorExtension;
use ApplicationException;
use October\Rain\Filesystem\Definitions as FileDefinitions;

/**
 * HasExtensionAssetsCrud implements Assets CRUD operations for the CMS Editor Extension
 */
trait HasExtensionAssetsCrud
{
    /**
     * command_onAssetCreateDirectory
     */
    protected function command_onAssetCreateDirectory()
    {
        $this->assertDocumentTypePermissions(EditorExtension::DOCUMENT_TYPE_ASSET);

        $documentData = $this->getRequestDocumentData();
        $metadata = $this->getRequestMetadata();
        $this->validateRequestTheme($metadata);

        $newName = trim(ApiHelpers::assertGetKey($documentData, 'name'));
        $parent = ApiHelpers::assertGetKey($documentData, 'parent');

        $this->editorCreateDirectory($this->getAssetsPath($this->getTheme()), $newName, $parent);
    }

    /**
     * command_onAssetDelete
     */
    protected function command_onAssetDelete()
    {
        $this->assertDocumentTypePermissions(EditorExtension::DOCUMENT_TYPE_ASSET);

        $metadata = $this->getRequestMetadata();
        $this->validateRequestTheme($metadata);

        $documentData = $this->getRequestDocumentData();
        $fileList = ApiHelpers::assertGetKey($documentData, 'files');
        ApiHelpers::assertIsArray($fileList);

        if ($this->getTheme()->databaseFilesEnabled()) {
            $this->deleteDatabaseThemeAssets($fileList);
            return;
        }

        $this->editorDeleteFileOrDirectory($this->getAssetsPath($this->getTheme()), $fileList);
    }

    /**
     * command_onAssetRename
     */
    protected function command_onAssetRename()
    {
        $this->assertDocumentTypePermissions(EditorExtension::DOCUMENT_TYPE_ASSET);

        $metadata = $this->getRequestMetadata();
        $documentData = $this->getRequestDocumentData();
        $this->validateRequestTheme($metadata);

        $newName = trim(ApiHelpers::assertGetKey($documentData, 'name'));
        $originalPath = trim(ApiHelpers::assertGetKey($documentData, 'originalPath'));

        if ($this->getTheme()->databaseFilesEnabled()) {
            $parent = dirname($originalPath);
            $newPath = ($parent === '.' ? '' : $parent . '/') . $newName;
            $this->renameDatabaseThemeAsset($originalPath, $newPath, $newName);
            return;
        }

        $assetExtensions = $this->getSafeAssetExtensions();
        $this->editorRenameFileOrDirectory($this->getAssetsPath($this->getTheme()), $newName, $originalPath, $assetExtensions);
    }

    /**
     * command_onAssetMove
     */
    protected function command_onAssetMove()
    {
        $this->assertDocumentTypePermissions(EditorExtension::DOCUMENT_TYPE_ASSET);

        $metadata = $this->getRequestMetadata();
        $documentData = $this->getRequestDocumentData();
        $this->validateRequestTheme($metadata);

        $selectedList = ApiHelpers::assertGetKey($documentData, 'source');
        $destinationDir = ApiHelpers::assertGetKey($documentData, 'destination');

        if ($this->getTheme()->databaseFilesEnabled()) {
            $this->moveDatabaseThemeAssets($selectedList, $destinationDir);
            return;
        }

        $this->editorMoveFilesOrDirectories($this->getAssetsPath($this->getTheme()), $selectedList, $destinationDir);
    }

    /**
     * command_onAssetUpload
     */
    protected function command_onAssetUpload()
    {
        $this->assertDocumentTypePermissions(EditorExtension::DOCUMENT_TYPE_ASSET);

        $metadata = [
            'theme' => Request::input('theme')
        ];
        $this->validateRequestTheme($metadata);

        $assetExtensions = $this->getSafeAssetExtensions();
        $this->editorUploadFiles($this->getAssetsPath($this->getTheme()), $assetExtensions);
        $this->syncUploadedThemeFile();
    }

    /**
     * getAssetFullPath returns the full path for the current theme
     * @param $path string
     */
    protected function getAssetFullPath($path): string
    {
        return $this->getAssetsPath($this->getTheme()).'/'.ltrim($path, '/');
    }

    /**
     * getSafeAssetExtensions returns asset extensions with preprocessor
     * types removed when safe mode is enabled.
     */
    protected function getSafeAssetExtensions(): array
    {
        $extensions = FileDefinitions::get('asset_extensions');

        if (System::checkSafeMode()) {
            $extensions = array_diff($extensions, ['less', 'sass', 'scss']);
        }

        return array_values($extensions);
    }

    /**
     * deleteDatabaseThemeAssets removes assets through the unified file datasource
     */
    protected function deleteDatabaseThemeAssets(array $fileList)
    {
        usort($fileList, function ($a, $b) {
            return strlen($b) - strlen($a);
        });

        $theme = $this->getTheme();

        foreach ($fileList as $path) {
            if ($this->isAssetDirectory($path)) {
                $this->deleteAssetDirectory($path);
                continue;
            }

            ThemeFiles::delete($theme, 'assets/' . $path);
        }
    }

    /**
     * renameDatabaseThemeAsset renames an asset through the unified file datasource
     */
    protected function renameDatabaseThemeAsset(string $originalPath, string $newPath, string $newName)
    {
        if ($this->isAssetDirectory($originalPath)) {
            $this->renameAssetDirectory($originalPath, $newPath);
            return;
        }

        $assetExtensions = $this->getSafeAssetExtensions();
        if (!FileHelper::validateExtension($newName, $assetExtensions, false)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $assetExtensions)]
            ));
        }

        ThemeFiles::rename($this->getTheme(), 'assets/' . $originalPath, 'assets/' . $newPath);
    }

    /**
     * moveDatabaseThemeAssets moves assets through the unified file datasource
     */
    protected function moveDatabaseThemeAssets(array $selectedList, string $destinationDir)
    {
        $theme = $this->getTheme();

        foreach ($selectedList as $path) {
            if ($this->isAssetDirectory($path)) {
                $this->moveAssetDirectory($path, $destinationDir);
                continue;
            }

            ThemeFiles::move($theme, 'assets/' . $path, $destinationDir);
        }
    }

    /**
     * isAssetDirectory checks if an asset path resolves to a directory
     */
    protected function isAssetDirectory(string $path): bool
    {
        $fullPath = $this->resolveAssetFilesystemPath($path);

        return $fullPath && File::isDirectory($fullPath);
    }

    /**
     * resolveAssetFilesystemPath returns the filesystem path for an asset
     */
    protected function resolveAssetFilesystemPath(string $path): ?string
    {
        $path = ltrim($path, '/');
        $theme = $this->getTheme();
        $storageFullPath = $theme->getAssetsPath().'/'.$path;

        if (File::exists($storageFullPath)) {
            return $storageFullPath;
        }

        $themeFullPath = $theme->getPath().'/assets/'.$path;

        if (File::exists($themeFullPath)) {
            return $themeFullPath;
        }

        return null;
    }

    /**
     * deleteAssetDirectory removes an empty asset directory from disk
     */
    protected function deleteAssetDirectory(string $path)
    {
        $fullPath = $this->resolveAssetFilesystemPath($path);

        if (!$fullPath || !File::isDirectory($fullPath)) {
            return;
        }

        if (!File::isDirectoryEmpty($fullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_deleting_dir_not_empty',
                ['name' => $path]
            ));
        }

        if (!rmdir($fullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_deleting_dir',
                ['name' => $path]
            ));
        }
    }

    /**
     * renameAssetDirectory renames an asset directory on disk
     */
    protected function renameAssetDirectory(string $originalPath, string $newPath)
    {
        $originalFullPath = $this->resolveAssetFilesystemPath($originalPath);
        if (!$originalFullPath) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.original_not_found'));
        }

        $newFullPath = $this->getAssetsPath($this->getTheme()).'/'.ltrim($newPath, '/');
        if (file_exists($newFullPath) && $newFullPath !== $originalFullPath) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.already_exists'));
        }

        if (!rename($originalFullPath, $newFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.error_renaming'));
        }

        if ($this->getTheme()->databaseFilesEnabled()) {
            ThemeFiles::renamePathPrefix(
                $this->getTheme(),
                'assets/' . ltrim($originalPath, '/'),
                'assets/' . ltrim($newPath, '/')
            );
        }
    }

    /**
     * moveAssetDirectory moves an asset directory on disk
     */
    protected function moveAssetDirectory(string $path, string $destinationDir)
    {
        $originalFullPath = $this->resolveAssetFilesystemPath($path);
        if (!$originalFullPath) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.original_not_found'));
        }

        $destinationFullPath = rtrim($this->getAssetsPath($this->getTheme()).'/'.$destinationDir, '/');
        $newFullPath = $destinationFullPath.'/'.basename($path);

        if ($originalFullPath === $newFullPath) {
            return;
        }

        if (File::exists($newFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.destination_exists',
                ['name' => basename($path)]
            ));
        }

        if (!File::copyDirectory($originalFullPath, $newFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_moving_directory',
                ['dir' => basename($path)]
            ));
        }

        if (!File::deleteDirectory($originalFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_deleting_directory',
                ['dir' => basename($path)]
            ));
        }

        if ($this->getTheme()->databaseFilesEnabled()) {
            $destinationPath = trim($destinationDir, '/');
            $newPrefix = ($destinationPath === '' ? '' : $destinationPath . '/') . basename($path);
            ThemeFiles::renamePathPrefix(
                $this->getTheme(),
                'assets/' . ltrim($path, '/'),
                'assets/' . $newPrefix
            );
        }
    }

    /**
     * syncUploadedThemeFile registers an uploaded file in the database layer
     */
    protected function syncUploadedThemeFile()
    {
        $theme = $this->getTheme();
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        $uploadedFile = Input::file('file');
        if (!is_object($uploadedFile)) {
            return;
        }

        $destinationDir = trim(Request::input('destination'));
        $fileName = $uploadedFile->getClientOriginalName();
        $assetPath = trim($destinationDir . '/' . $fileName, '/');
        $fullPath = $this->getAssetFullPath($assetPath);

        if (!File::isFile($fullPath)) {
            return;
        }

        ThemeFiles::write($theme, 'assets/' . $assetPath, File::get($fullPath));
    }
}
