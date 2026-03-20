<?php namespace Cms\Classes\EditorExtension;

use System;
use Request;
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
}
