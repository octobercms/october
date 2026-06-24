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
use Symfony\Component\HttpFoundation\File\UploadedFile;

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
            $this->deleteStoredAssets($fileList);
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
            $storedPath = 'assets/'.$originalPath;
            if (ThemeFiles::isStored($this->getTheme(), $storedPath)) {
                $parent = dirname($originalPath);
                $newPath = ($parent === '.' ? '' : $parent.'/').$newName;
                ThemeFiles::rename($this->getTheme(), $storedPath, 'assets/'.$newPath);
                return;
            }
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
            foreach ($selectedList as $path) {
                $storedPath = 'assets/'.$path;
                if (ThemeFiles::isStored($this->getTheme(), $storedPath)) {
                    ThemeFiles::move($this->getTheme(), $storedPath, $destinationDir);
                }
            }
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

        if ($this->getTheme()->databaseFilesEnabled()) {
            $this->uploadStoredAsset($assetExtensions);
            return;
        }

        $this->editorUploadFiles($this->getAssetsPath($this->getTheme()), $assetExtensions);
    }

    /**
     * uploadStoredAsset stores an uploaded file on the configured disk
     */
    protected function uploadStoredAsset(array $allowedExtensions): void
    {
        $uploadedFile = Input::file('file');
        if (!is_object($uploadedFile)) {
            return;
        }

        $fileName = $uploadedFile->getClientOriginalName();

        if (!$uploadedFile->isValid()) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.file_not_valid'));
        }

        $maxSize = UploadedFile::getMaxFilesize();
        if ($uploadedFile->getSize() > $maxSize) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.too_large',
                ['max_size' => File::sizeToString($maxSize)]
            ));
        }

        if (!FileHelper::validateExtension($fileName, $allowedExtensions, false)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $allowedExtensions)]
            ));
        }

        $destinationDir = trim(Request::input('destination'));
        if (!strlen($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.select_destination_dir'));
        }

        if (!preg_match('/^[\@0-9a-z\.\s_\-\/]+$/i', $destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (strtolower(File::extension($fileName)) === 'svg') {
            $content = \Html::cleanVector(file_get_contents($uploadedFile->getRealPath()));
        }
        else {
            $content = File::get($uploadedFile->getRealPath());
        }

        ThemeFiles::put(
            $this->getTheme(),
            'assets/'.trim($destinationDir.'/'.$fileName, '/'),
            $content
        );
    }

    /**
     * deleteStoredAssets removes stored assets selected in the editor
     */
    protected function deleteStoredAssets(array $fileList): void
    {
        $theme = $this->getTheme();

        foreach ($fileList as $path) {
            if (!$this->validateFileSystemPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            ThemeFiles::delete($theme, 'assets/'.$path);
        }
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
