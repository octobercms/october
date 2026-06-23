<?php namespace Cms\Classes\EditorExtension;

use File;
use Input;
use Request;
use System;
use Cms\Classes\ThemeFiles;
use Editor\Classes\ApiHelpers;
use Cms\Classes\EditorExtension;
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

        $this->editorDeleteFileOrDirectory($this->getAssetsPath($this->getTheme()), $fileList);
        $this->syncDeletedThemeFiles($fileList);
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
        $assetExtensions = $this->getSafeAssetExtensions();

        $this->editorRenameFileOrDirectory($this->getAssetsPath($this->getTheme()), $newName, $originalPath, $assetExtensions);

        $parent = dirname($originalPath);
        $newPath = ($parent === '.' ? '' : $parent . '/') . $newName;
        $this->syncRenamedThemeFile($originalPath, $newPath);
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
        $this->editorMoveFilesOrDirectories($this->getAssetsPath($this->getTheme()), $selectedList, $destinationDir);
        $this->syncMovedThemeFiles($selectedList, $destinationDir);
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

    /**
     * syncDeletedThemeFiles updates the database layer after filesystem deletes
     */
    protected function syncDeletedThemeFiles(array $fileList)
    {
        $theme = $this->getTheme();
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        foreach ($fileList as $path) {
            $fullPath = $this->getAssetFullPath($path);
            if (File::isDirectory($fullPath)) {
                continue;
            }

            ThemeFiles::delete($theme, 'assets/' . $path);
        }
    }

    /**
     * syncRenamedThemeFile updates the database layer after a filesystem rename
     */
    protected function syncRenamedThemeFile(string $originalPath, string $newPath)
    {
        $theme = $this->getTheme();
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        ThemeFiles::rename($theme, 'assets/' . $originalPath, 'assets/' . $newPath);
    }

    /**
     * syncMovedThemeFiles updates the database layer after filesystem moves
     */
    protected function syncMovedThemeFiles(array $selectedList, string $destinationDir)
    {
        $theme = $this->getTheme();
        if (!$theme->databaseFilesEnabled()) {
            return;
        }

        foreach ($selectedList as $path) {
            $fullPath = $this->getAssetFullPath($path);
            if (File::isDirectory($fullPath)) {
                continue;
            }

            $newPath = trim($destinationDir . '/' . basename($path), '/');
            ThemeFiles::rename($theme, 'assets/' . $path, 'assets/' . $newPath);
        }
    }
}
