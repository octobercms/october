<?php namespace Tailor\Classes\EditorExtension;

use Lang;
use File;
use Input;
use Config;
use Request;
use System;
use BackendAuth;
use SystemException;
use ApplicationException;
use Cms\Classes\Theme;
use Cms\Classes\ThemeBlueprints;
use Cms\Helpers\File as FileHelper;
use Tailor\Classes\EditorExtension;
use Tailor\Classes\Blueprint;
use Tailor\Classes\ThemeBlueprint;
use Editor\Classes\ApiHelpers;
use Tailor\Classes\BlueprintIndexer;
use Tailor\Classes\BlueprintVerifier;
use Tailor\Classes\BlueprintException;
use Tailor\Classes\BlueprintErrorData;

/**
 * HasExtensionCrud implements CRUD operations for the Tailor Editor Extension
 */
trait HasExtensionCrud
{
    /**
     * command_onOpenDocument
     */
    protected function command_onOpenDocument()
    {
        $documentData = post('documentData');
        if (!is_array($documentData)) {
            throw new SystemException('Document data is not provided');
        }

        $key = ApiHelpers::assertGetKey($documentData, 'key');
        $documentType = ApiHelpers::assertGetKey($documentData, 'type');
        $this->assertDocumentTypePermissions($documentType);

        $extraData = $this->getRequestExtraData();

        $isResetFromTemplateFileRequest = isset($extraData['resetFromTemplateFile']);
        if ($isResetFromTemplateFileRequest) {
            $this->resetFromTemplateFile($documentType, $key);
        }

        $template = $this->loadTemplate($documentType, $key);
        $templateData = [
            'content' => $template->content,
            'fileName' => ltrim($template->fileName, '/')
        ];

        $result = [
            'document' => $templateData,
            'metadata' => $this->loadTemplateMetadata($template, $documentData)
        ];

        return $result;
    }

    /**
     * command_onSaveDocument
     */
    protected function command_onSaveDocument()
    {
        $documentData = $this->getRequestDocumentData();
        $metadata = $this->getRequestMetadata();
        $documentType = ApiHelpers::assertGetKey($metadata, 'type');
        $this->assertDocumentTypePermissions($documentType);

        $templatePath = trim(ApiHelpers::assertGetKey($metadata, 'path'));
        $template = $this->loadOrCreateTemplate($documentType, $templatePath);
        $templateData = [];

        $fields = ['fileName', 'content'];
        foreach ($fields as $field) {
            if (array_key_exists($field, $documentData)) {
                $templateData[$field] = $documentData[$field];
            }
        }

        $templateData = $this->handleLineEndings($templateData);
        if ($response = $this->handleMtimeMismatch($template, $metadata)) {
            return $response;
        }

        try {
            $template->content = $templateData['content'];
            $template->fileName = $templateData['fileName'];
            $originalContent = $template->content;
            $template->save();
        }
        catch (BlueprintException $ex) {
            return BlueprintErrorData::fromException($ex)->toResponse();
        }

        $result = $this->getUpdateResponse($template, $originalContent);

        // Attach any blueprint warnings (e.g. duplicate handles) to the response
        $warnings = BlueprintVerifier::instance()->getWarnings();
        if ($warnings) {
            $result['blueprintWarnings'] = $warnings;
        }

        return $result;
    }

    /**
     * command_onDeleteDocument
     */
    protected function command_onDeleteDocument()
    {
        $metadata = $this->getRequestMetadata();

        [$template, $documentType] = $this->loadRequestedTemplate($metadata);
        $this->assertDocumentTypePermissions($documentType);

        $template->delete();
    }

    /**
     * command_onMigrateBlueprint
     */
    protected function command_onMigrateBlueprint($controller)
    {
        $template = $this->loadBlueprintForUpdate();

        BlueprintIndexer::instance()->migrateBlueprint($template);

        return [
            'mainMenu' => $controller->makeLayoutPartial('mainmenu'),
            'mainMenuLeft' => $controller->makeLayoutPartial('mainmenu', ['isVerticalMenu'=>true]),
            'sidenavResponsive' => $controller->makeLayoutPartial('sidenav-responsive')
        ];
    }

    /**
     * command_onBlueprintCreateDirectory
     */
    protected function command_onBlueprintCreateDirectory()
    {
        $this->assertBlueprintPermissions();

        $documentData = $this->getRequestDocumentData();
        // $metadata = $this->getRequestMetadata();

        $newName = trim(ApiHelpers::assertGetKey($documentData, 'name'));
        $parent = ApiHelpers::assertGetKey($documentData, 'parent');

        $this->editorCreateDirectory($this->getBlueprintsPath(), $newName, $parent);
    }

    /**
     * command_onBlueprintRename
     */
    protected function command_onBlueprintRename()
    {
        $this->assertBlueprintPermissions();

        $documentData = $this->getRequestDocumentData();

        $newName = trim(ApiHelpers::assertGetKey($documentData, 'name'));
        $originalPath = trim(ApiHelpers::assertGetKey($documentData, 'originalPath'));

        if ($this->blueprintDatabaseEnabled()) {
            $parent = dirname($originalPath);
            $newPath = ($parent === '.' ? '' : $parent . '/') . $newName;
            $this->renameDatabaseBlueprint($originalPath, $newPath, $newName);
            return;
        }

        $blueprintExtensions = Blueprint::getAllowedExtensions();
        $this->editorRenameFileOrDirectory($this->getBlueprintsPath(), $newName, $originalPath, $blueprintExtensions);
    }

    /**
     * command_onBlueprintDelete
     */
    protected function command_onBlueprintDelete()
    {
        $this->assertBlueprintPermissions();

        $documentData = $this->getRequestDocumentData();
        $fileList = ApiHelpers::assertGetKey($documentData, 'files');
        ApiHelpers::assertIsArray($fileList);

        if ($this->blueprintDatabaseEnabled()) {
            $this->deleteDatabaseBlueprints($fileList);
            return;
        }

        $this->editorDeleteFileOrDirectory($this->getBlueprintsPath(), $fileList);
    }

    /**
     * command_onBlueprintMove
     */
    protected function command_onBlueprintMove()
    {
        $this->assertBlueprintPermissions();

        $documentData = $this->getRequestDocumentData();

        $selectedList = ApiHelpers::assertGetKey($documentData, 'source');
        $destinationDir = ApiHelpers::assertGetKey($documentData, 'destination');

        if ($this->blueprintDatabaseEnabled()) {
            $this->moveDatabaseBlueprints($selectedList, $destinationDir);
            return;
        }

        $this->editorMoveFilesOrDirectories($this->getBlueprintsPath(), $selectedList, $destinationDir);
    }

    /**
     * command_onBlueprintUpload
     */
    protected function command_onBlueprintUpload()
    {
        $this->assertBlueprintPermissions();

        $this->editorUploadFiles($this->getBlueprintsPath(), Blueprint::getAllowedExtensions());
        $this->syncUploadedBlueprint();
    }

    /**
     * deleteDatabaseBlueprints removes blueprints through the database layer
     */
    protected function deleteDatabaseBlueprints(array $fileList)
    {
        usort($fileList, function ($a, $b) {
            return strlen($b) - strlen($a);
        });

        $source = $this->getBlueprintCrudSource();

        foreach ($fileList as $path) {
            if ($this->isBlueprintDirectory($path)) {
                $this->deleteBlueprintDirectory($path);
                continue;
            }

            ThemeBlueprints::delete($source, $path);
        }
    }

    /**
     * renameDatabaseBlueprint renames a blueprint through the database layer
     */
    protected function renameDatabaseBlueprint(string $originalPath, string $newPath, string $newName)
    {
        if ($this->isBlueprintDirectory($originalPath)) {
            $this->renameBlueprintDirectory($originalPath, $newPath);
            return;
        }

        $extensions = Blueprint::getAllowedExtensions();
        if (!FileHelper::validateExtension($newName, $extensions, false)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $extensions)]
            ));
        }

        ThemeBlueprints::rename($this->getBlueprintCrudSource(), $originalPath, $newPath);
    }

    /**
     * moveDatabaseBlueprints moves blueprints through the database layer
     */
    protected function moveDatabaseBlueprints(array $selectedList, string $destinationDir)
    {
        $source = $this->getBlueprintCrudSource();

        foreach ($selectedList as $path) {
            if ($this->isBlueprintDirectory($path)) {
                $this->moveBlueprintDirectory($path, $destinationDir);
                continue;
            }

            ThemeBlueprints::move($source, $path, $destinationDir);
        }
    }

    /**
     * isBlueprintDirectory checks if a blueprint path resolves to a directory
     */
    protected function isBlueprintDirectory(string $path): bool
    {
        $fullPath = $this->resolveBlueprintFilesystemPath($path);

        return $fullPath && File::isDirectory($fullPath);
    }

    /**
     * resolveBlueprintFilesystemPath returns the filesystem path for a blueprint
     */
    protected function resolveBlueprintFilesystemPath(string $path): ?string
    {
        $root = $this->getBlueprintFilesystemRoot();
        if (!$root) {
            return null;
        }

        $fullPath = $root . '/' . ltrim($path, '/');

        return File::exists($fullPath) ? $fullPath : null;
    }

    /**
     * deleteBlueprintDirectory removes an empty blueprint directory from disk
     */
    protected function deleteBlueprintDirectory(string $path)
    {
        $fullPath = $this->resolveBlueprintFilesystemPath($path);

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
     * renameBlueprintDirectory renames a blueprint directory on disk
     */
    protected function renameBlueprintDirectory(string $originalPath, string $newPath)
    {
        $originalFullPath = $this->resolveBlueprintFilesystemPath($originalPath);
        $root = $this->getBlueprintFilesystemRoot();
        $newFullPath = $root . '/' . ltrim($newPath, '/');

        if (!$originalFullPath || !File::isDirectory($originalFullPath)) {
            return;
        }

        if (File::exists($newFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_renaming_dir',
                ['name' => $originalPath]
            ));
        }

        if (!rename($originalFullPath, $newFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_renaming_dir',
                ['name' => $originalPath]
            ));
        }

        if ($this->blueprintDatabaseEnabled()) {
            ThemeBlueprints::renamePathPrefix(
                $this->getBlueprintCrudSource(),
                ThemeBlueprints::PREFIX . '/' . ltrim($originalPath, '/'),
                ThemeBlueprints::PREFIX . '/' . ltrim($newPath, '/')
            );
        }
    }

    /**
     * moveBlueprintDirectory moves a blueprint directory on disk
     */
    protected function moveBlueprintDirectory(string $path, string $destinationDir)
    {
        $originalFullPath = $this->resolveBlueprintFilesystemPath($path);
        $root = $this->getBlueprintFilesystemRoot();
        $destinationDir = trim($destinationDir, '/');
        $newPath = ($destinationDir === '' ? '' : $destinationDir . '/') . basename($path);
        $newFullPath = $root . '/' . $newPath;

        if (!$originalFullPath || !File::isDirectory($originalFullPath)) {
            return;
        }

        if (File::exists($newFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_moving_dir',
                ['dir' => basename($path)]
            ));
        }

        if (!rename($originalFullPath, $newFullPath)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_moving_dir',
                ['dir' => basename($path)]
            ));
        }

        if ($this->blueprintDatabaseEnabled()) {
            $destinationPath = trim($destinationDir, '/');
            $newPrefix = ($destinationPath === '' ? '' : $destinationPath . '/') . basename($path);
            ThemeBlueprints::renamePathPrefix(
                $this->getBlueprintCrudSource(),
                ThemeBlueprints::PREFIX . '/' . ltrim($path, '/'),
                ThemeBlueprints::PREFIX . '/' . $newPrefix
            );
        }
    }

    /**
     * syncUploadedBlueprint registers an uploaded blueprint in the database layer
     */
    protected function syncUploadedBlueprint()
    {
        $source = $this->getBlueprintCrudSource();
        if (!$source || !ThemeBlueprints::usesDatabase($source)) {
            return;
        }

        $uploadedFile = Input::file('file');
        if (!is_object($uploadedFile)) {
            return;
        }

        $destinationDir = trim(Request::input('destination'), '/');
        $fileName = $uploadedFile->getClientOriginalName();
        $blueprintPath = trim($destinationDir . '/' . $fileName, '/');
        $diskPath = $this->getBlueprintFilesystemRoot() . '/' . $blueprintPath;

        if (!File::isFile($diskPath)) {
            return;
        }

        ThemeBlueprints::write($source, $blueprintPath, File::get($diskPath));
        File::delete($diskPath);
    }

    /**
     * blueprintDatabaseEnabled checks if blueprint CRUD should use the database
     */
    protected function blueprintDatabaseEnabled(): bool
    {
        $source = $this->getBlueprintCrudSource();

        return $source && ThemeBlueprints::usesDatabase($source);
    }

    /**
     * getBlueprintCrudSource returns the database source for the current blueprint request
     */
    protected function getBlueprintCrudSource(): ?string
    {
        if ($this->isThemeBlueprintDocument()) {
            $theme = Theme::getEditTheme() ?: Theme::getActiveTheme();

            return $theme?->getDirName();
        }

        if ($this->isAppBlueprintDocument()) {
            return ThemeBlueprints::APP_SOURCE;
        }

        return null;
    }

    /**
     * getBlueprintFilesystemRoot returns the filesystem root for the current blueprint request
     */
    protected function getBlueprintFilesystemRoot(): ?string
    {
        $source = $this->getBlueprintCrudSource();

        if ($source === ThemeBlueprints::APP_SOURCE) {
            return base_path('app/blueprints');
        }

        if ($source && System::hasModule('Cms')) {
            $theme = Theme::load($source);

            return $theme ? $theme->getPath() . '/blueprints' : null;
        }

        return null;
    }

    /**
     * isAppBlueprintDocument checks if the current request is for an app blueprint
     */
    protected function isAppBlueprintDocument(): bool
    {
        $type = post('documentType', post('documentMetadata[documentType]'));

        return $type === EditorExtension::DOCUMENT_TYPE_BLUEPRINT;
    }

    /**
     * isThemeBlueprintDocument checks if the current request is for a theme blueprint
     */
    protected function isThemeBlueprintDocument(): bool
    {
        $type = post('documentType', post('documentMetadata[documentType]'));

        return $type === EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT;
    }

    /**
     * loadTemplate returns an existing template of a given type
     * @param string $documentType
     * @param string $path
     * @return mixed
     */
    private function loadTemplate($documentType, $path)
    {
        $class = $this->resolveTypeClassName($documentType);

        if (!($template = call_user_func([$class, 'load'], $path))) {
            throw new ApplicationException(trans('tailor::lang.blueprint.not_found'));
        }

        return $template;
    }

    /**
     * resolveTypeClassName resolves a template type to its class name
     * @param string $documentType
     * @return string
     */
    private function resolveTypeClassName($documentType)
    {
        $types = [
            EditorExtension::DOCUMENT_TYPE_BLUEPRINT => Blueprint::class,
            EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT => ThemeBlueprint::class
        ];

        if (!array_key_exists($documentType, $types)) {
            throw new SystemException(trans('tailor::lang.editor.invalid_type'));
        }

        return $types[$documentType];
    }

    /**
     * makeMetadataForNewTemplate builds meta data for new templates
     */
    protected function makeMetadataForNewTemplate(string $documentType): array
    {
        return [
            'mtime' => null,
            'path' => null,
            'type' => $documentType,
            'isNewDocument' => true
        ];
    }

    /**
     * loadTemplateMetadata
     */
    private function loadTemplateMetadata($template, $documentData)
    {
        $typeNames = [
            EditorExtension::DOCUMENT_TYPE_BLUEPRINT => Lang::get('tailor::lang.editor.blueprint'),
            EditorExtension::DOCUMENT_TYPE_THEME_BLUEPRINT => Lang::get('tailor::lang.editor.blueprint')
        ];

        $documentType = $documentData['type'];
        if (!array_key_exists($documentType, $typeNames)) {
            throw new SystemException(sprintf('Document type name is not defined: %s', $documentData['type']));
        }

        $fileName = ltrim($template->fileName, '/');

        $result = [
            'mtime' => $template->mtime,
            'path' => $fileName,
            'type' => $documentType,
            'typeName' => $typeNames[$documentType]
        ];

        return $result;
    }

    /**
     * getRequestMetadata
     */
    private function getRequestMetadata()
    {
        $metadata = Request::input('documentMetadata');
        if (!is_array($metadata)) {
            throw new SystemException('Invalid documentMetadata');
        }

        return $metadata;
    }

    /**
     * getRequestExtraData
     */
    private function getRequestExtraData()
    {
        $extraData = Request::input('extraData');
        if (!is_array($extraData)) {
            return [];
        }

        return $extraData;
    }

    /**
     * getRequestDocumentData
     */
    private function getRequestDocumentData()
    {
        $documentData = Request::input('documentData');
        if (!is_array($documentData)) {
            throw new SystemException('Invalid documentData');
        }

        return $documentData;
    }

    /**
     * createTemplate
     */
    private function createTemplate($documentType)
    {
        $class = $this->resolveTypeClassName($documentType);

        $template = new $class();

        return $template;
    }

    /**
     * loadOrCreateTemplate
     */
    private function loadOrCreateTemplate($documentType, $templatePath)
    {
        if ($templatePath) {
            return $this->loadTemplate($documentType, $templatePath);
        }

        return $this->createTemplate($documentType);
    }

    /**
     * handleLineEndings
     */
    private function handleLineEndings($templateData)
    {
        $convertLineEndings = Config::get('system.convert_line_endings', false) === true;
        if (!$convertLineEndings) {
            return $templateData;
        }

        if (!empty($templateData['content'])) {
            $templateData['content'] = $this->convertLineEndings($templateData['content']);
        }

        return $templateData;
    }

    /**
     * Replaces Windows style (/r/n) line endings with unix style (/n)
     * line endings.
     * @param string $markup The markup to convert to unix style endings
     * @return string
     */
    private function convertLineEndings($markup)
    {
        $markup = str_replace(["\r\n", "\r"], "\n", $markup);

        return $markup;
    }

    /**
     * handleMtimeMismatch
     */
    private function handleMtimeMismatch($template, $metadata)
    {
        $requestMtime = ApiHelpers::assertGetKey($metadata, 'mtime');

        if (!$template->mtime) {
            return;
        }

        if (post('documentForceSave')) {
            return;
        }

        if ($requestMtime != $template->mtime) {
            return ['mtimeMismatch' => true];
        }
    }

    /**
     * getUpdateResponse
     */
    private function getUpdateResponse($template, $originalContent)
    {
        $navigatorPath = dirname($template->fileName);
        if ($navigatorPath == '.') {
            $navigatorPath = "";
        }

        $result = [
            'metadata' => [
                'mtime' => $template->mtime,
                'path' => $template->fileName,
                'navigatorPath' => $navigatorPath,
                'uniqueKey' => $template->fileName,
                'fileName' => basename($template->fileName)
            ],
            'contentChanged' => $originalContent != $template->content
        ];

        $result['fileName'] = $template->fileName;

        return $result;
    }

    /**
     * loadRequestedTemplate
     */
    private function loadRequestedTemplate($metadata)
    {
        $metadata = $metadata ? $metadata : $this->getRequestMetadata();

        $documentType = ApiHelpers::assertGetKey($metadata, 'type');
        $templatePath = trim(ApiHelpers::assertGetKey($metadata, 'path'));

        return [
            $this->loadTemplate($documentType, $templatePath),
            $documentType
        ];
    }

    /**
     * assertDocumentTypePermissions
     */
    private function assertDocumentTypePermissions($documentType)
    {
        $user = BackendAuth::getUser();

        if (!EditorExtension::hasAccessToDocType($user, $documentType)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.editor.error_no_doctype_permissions',
                ['doctype' => $documentType]
            ));
        }
    }

    /**
     * assertBlueprintPermissions checks permissions for blueprint file operations,
     * resolving the document type from the request.
     */
    private function assertBlueprintPermissions()
    {
        $type = post('documentType', post('documentMetadata[documentType]'));

        if (!$type) {
            $type = EditorExtension::DOCUMENT_TYPE_BLUEPRINT;
        }

        $this->assertDocumentTypePermissions($type);
    }

    /**
     * getBlueprintsPath
     */
    private function getBlueprintsPath()
    {
        if ($type = post('documentType', post('documentMetadata[documentType]'))) {
            $className = $this->resolveTypeClassName($type);
            return (new $className)->getBasePath();
        }

        return (new Blueprint)->getBasePath();
    }

    /**
     * loadBlueprintForUpdate
     */
    private function loadBlueprintForUpdate()
    {
        $metadata = $this->getRequestMetadata();
        $documentType = ApiHelpers::assertGetKey($metadata, 'type');
        $this->assertDocumentTypePermissions($documentType);

        $templatePath = trim(ApiHelpers::assertGetKey($metadata, 'path'));
        return $this->loadTemplate($documentType, $templatePath);
    }
}
