<?php namespace Cms\Classes\Asset;

use File;
use Lang;
use Storage;
use Cms\Models\SourceFile;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApplicationException;
use ValidationException;

/**
 * HasOperations implements editor-side CRUD operations against a CMS theme's
 * assets directory. Pulled out of Editor\Traits\FileSystemFunctions so the
 * Asset class is the single seam for any future cross-cutting concerns
 * (shared storage publishing, audit logging, events, etc.).
 *
 * Consuming class must provide a {@link \Cms\Classes\Theme} via $this->theme
 * and an "assets" subdirectory name via $this->dirName.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasOperations
{
    /**
     * upload accepts a single uploaded file into a destination directory under
     * the theme's assets root. SVG content is sanitised before being written.
     */
    public function upload(UploadedFile $uploadedFile, string $destinationDir): void
    {
        if (!$uploadedFile->isValid()) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.file_not_valid'));
        }

        $fileName = $uploadedFile->getClientOriginalName();
        $allowedExtensions = $this->getOperationExtensions();

        $maxSize = UploadedFile::getMaxFilesize();
        if ($uploadedFile->getSize() > $maxSize) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.too_large',
                ['max_size' => File::sizeToString($maxSize)]
            ));
        }

        if (!$this->validateOperationFileExtension($fileName, $allowedExtensions)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $allowedExtensions)]
            ));
        }

        $destinationDir = trim($destinationDir);
        if (!strlen($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.select_destination_dir'));
        }

        if (!$this->validateOperationPath($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if ($this->theme->assetDatabaseLayerEnabled()) {
            $destinationPath = trim($this->normalizeOperationPath($destinationDir), '/');
            $newPath = strlen($destinationPath) ? $destinationPath.'/'.$fileName : $fileName;

            if (strtolower(File::extension($fileName)) === 'svg') {
                $bytes = (string) \Html::cleanVector(file_get_contents($uploadedFile->getRealPath()));
            }
            else {
                $bytes = (string) file_get_contents($uploadedFile->getRealPath());
            }

            $diskPath = $this->getDiskPath($this->theme, $newPath);

            SourceFile::upsertOnDiskAt(
                $this->getSourceIdentifier($this->theme),
                $newPath,
                $this->getDiskName(),
                $diskPath,
                $bytes,
                $uploadedFile->getMimeType() ?: null
            );

            $this->fireInvalidationEvent([$diskPath]);
            return;
        }

        $destinationFullPath = $this->getOperationBasePath().'/'.$destinationDir;
        if (!File::isDirectory($destinationFullPath)) {
            File::makeDirectory($destinationFullPath, 0755, true, true);
        }

        if (!file_exists($destinationFullPath) || !is_dir($destinationFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.destination_not_found'));
        }

        if (strtolower(File::extension($fileName)) === 'svg') {
            $contents = \Html::cleanVector(file_get_contents($uploadedFile->getRealPath()));
            File::put($destinationFullPath.'/'.$fileName, $contents);
        }
        else {
            $uploadedFile->move($destinationFullPath, $fileName);
        }
    }

    /**
     * rename renames a single file or directory within the assets root.
     */
    public function rename(string $newName, string $originalPath): void
    {
        $newName = trim($newName);
        if (!strlen($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.name_cant_be_empty'));
        }

        if (!$this->validateOperationPath($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (!$this->validateOperationName($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_name'));
        }

        $originalPath = trim($originalPath);
        if (!$this->validateOperationPath($originalPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if ($this->theme->assetDatabaseLayerEnabled()) {
            $this->renameWithDatabase($newName, $originalPath);
            return;
        }

        $basePath = $this->getOperationBasePath();
        $originalFullPath = $basePath.'/'.$originalPath;

        if (!file_exists($originalFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.original_not_found'));
        }

        $allowedExtensions = $this->getOperationExtensions();
        if (!is_dir($originalFullPath) && !$this->validateOperationFileExtension($newName, $allowedExtensions)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $allowedExtensions)]
            ));
        }

        $newFullPath = $basePath.'/'.dirname($originalPath).'/'.$newName;
        if (file_exists($newFullPath) && $newFullPath !== $originalFullPath) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.already_exists'));
        }

        if (!@rename($originalFullPath, $newFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.error_renaming'));
        }
    }

    /**
     * move relocates a list of files or directories into a destination
     * directory under the assets root.
     */
    public function move(array $selectedList, string $destinationDir): void
    {
        if (!count($selectedList)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.selected_files_not_found'));
        }

        if (!strlen($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.select_destination_dir'));
        }

        if (!$this->validateOperationPath($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if ($this->theme->assetDatabaseLayerEnabled()) {
            $this->moveWithDatabase($selectedList, $destinationDir);
            return;
        }

        $basePath = $this->getOperationBasePath();
        $destinationFullPath = $basePath.'/'.$destinationDir;

        if (!File::isDirectory($destinationFullPath)) {
            File::makeDirectory($destinationFullPath, 0755, true, true);
        }

        if (!file_exists($destinationFullPath) || !is_dir($destinationFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.destination_not_found'));
        }

        foreach ($selectedList as $path) {
            if (!$this->validateOperationPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $basename = basename($path);
            $originalFullPath = $basePath.'/'.$path;
            $newFullPath = rtrim($destinationFullPath, '/').'/'.$basename;

            if ($originalFullPath === $newFullPath) {
                continue;
            }

            if ((is_file($originalFullPath) && is_file($newFullPath))
                || (is_dir($originalFullPath) && is_dir($newFullPath))) {
                throw new ApplicationException(Lang::get(
                    'editor::lang.filesystem.destination_exists',
                    ['name' => $basename]
                ));
            }

            if (is_file($originalFullPath)) {
                if (!@File::move($originalFullPath, $newFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_moving_file',
                        ['file' => $basename]
                    ));
                }
            }
            elseif (is_dir($originalFullPath)) {
                if (!@File::copyDirectory($originalFullPath, $newFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_moving_directory',
                        ['dir' => $basename]
                    ));
                }

                if (strpos($originalFullPath, '../') !== false) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_deleting_directory',
                        ['dir' => $basename]
                    ));
                }

                if (strpos($originalFullPath, $basePath) !== 0) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_deleting_directory',
                        ['dir' => $basename]
                    ));
                }

                if (!@File::deleteDirectory($originalFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_deleting_directory',
                        ['dir' => $basename]
                    ));
                }
            }
        }
    }

    /**
     * createDirectory creates a directory under a parent path within the
     * assets root.
     */
    public function createDirectory(string $newName, string $parent): void
    {
        if (!strlen($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.directory_name_cant_be_empty'));
        }

        if (!$this->validateOperationPath($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (strlen($parent) && !$this->validateOperationPath($parent)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (!$this->validateOperationName($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_name'));
        }

        if ($this->theme->assetDatabaseLayerEnabled()) {
            $parentPath = trim($this->normalizeOperationPath($parent), '/');
            $dirPath = strlen($parentPath) ? $parentPath.'/'.$newName : $newName;
            $source = $this->getSourceIdentifier($this->theme);
            $fullPath = $this->getOperationBasePath().'/'.$dirPath;

            $targetTaken = (file_exists($fullPath) && is_dir($fullPath))
                || SourceFile::query()->bySource($source)->byPathPrefix($dirPath)->exists();

            if ($targetTaken) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.already_exists'));
            }

            // Placeholder row makes the folder visible across instances and
            // round-trips to git as a conventional keep file
            SourceFile::upsertAt($source, $dirPath.'/.gitkeep', '');
            return;
        }

        $newFullPath = $this->getOperationBasePath().'/'.$parent.'/'.$newName;
        if (file_exists($newFullPath) && is_dir($newFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.already_exists'));
        }

        if (!File::makeDirectory($newFullPath, 0755, true, true)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.error_creating_directory',
                ['name' => $newName]
            ));
        }
    }

    /**
     * deletePaths removes the given list of files or directories under the
     * assets root. Directories must be empty.
     */
    public function deletePaths(array $fileList): void
    {
        usort($fileList, function ($a, $b) {
            return strlen($b) - strlen($a);
        });

        if ($this->theme->assetDatabaseLayerEnabled()) {
            $this->deletePathsWithDatabase($fileList);
            return;
        }

        $basePath = $this->getOperationBasePath();

        foreach ($fileList as $path) {
            if (!$this->validateOperationPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $fullPath = $basePath.'/'.$path;
            if (!File::exists($fullPath)) {
                continue;
            }

            if (!File::isDirectory($fullPath)) {
                if (!@File::delete($fullPath)) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_deleting_file',
                        ['name' => $path]
                    ));
                }
                continue;
            }

            if (!File::isDirectoryEmpty($fullPath)) {
                throw new ApplicationException(Lang::get(
                    'editor::lang.filesystem.error_deleting_dir_not_empty',
                    ['name' => $path]
                ));
            }

            if (!@rmdir($fullPath)) {
                throw new ApplicationException(Lang::get(
                    'editor::lang.filesystem.error_deleting_dir',
                    ['name' => $path]
                ));
            }
        }
    }

    /**
     * renameWithDatabase performs a rename against the database layer and
     * the assets disk. Directory renames re-key every file beneath the
     * prefix so shipped assets keep working at their new URLs across all
     * instances, leaving the local filesystem untouched.
     */
    protected function renameWithDatabase(string $newName, string $originalPath): void
    {
        $source = $this->getSourceIdentifier($this->theme);
        $basePath = $this->getOperationBasePath();
        $originalPath = $this->normalizeOperationPath($originalPath);
        $originalFullPath = $basePath.'/'.$originalPath;

        $parentDir = dirname($originalPath);
        $newPath = $parentDir === '.' ? $newName : $parentDir.'/'.$newName;

        if ($newPath === $originalPath) {
            return;
        }

        $activeRow = SourceFile::findByPath($source, $originalPath);
        $isTombstoned = SourceFile::onlyTrashed()->bySource($source)->byPath($originalPath)->exists();
        $isFsFile = File::isFile($originalFullPath);
        $isFsDir = File::isDirectory($originalFullPath);
        $hasChildRows = SourceFile::query()->bySource($source)->byPathPrefix($originalPath)->exists();

        // Directory rename: no active row or file at the exact path, but a
        // filesystem directory or child rows exist beneath it
        if (!$activeRow && !$isFsFile && ($isFsDir || $hasChildRows)) {
            $targetTaken = file_exists($basePath.'/'.$newPath)
                || SourceFile::existsAt($source, $newPath)
                || SourceFile::query()->bySource($source)->byPathPrefix($newPath)->exists();

            if ($targetTaken) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.already_exists'));
            }

            $invalidatePaths = [];
            foreach ($this->listTransferablePathsUnderPrefix($originalPath) as $childPath) {
                $newChildPath = $newPath.substr($childPath, strlen($originalPath));
                $this->transferPathWithDatabase($childPath, $newChildPath, $invalidatePaths);
            }

            if (count($invalidatePaths)) {
                $this->fireInvalidationEvent($invalidatePaths);
            }
            return;
        }

        // File rename: tombstoned paths report as missing even with an FS copy
        if (!$activeRow && (!$isFsFile || $isTombstoned)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.original_not_found'));
        }

        $allowedExtensions = $this->getOperationExtensions();
        if (!$this->validateOperationFileExtension($newName, $allowedExtensions)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $allowedExtensions)]
            ));
        }

        $this->assertNoDatabaseCollision($source, $basePath, $newPath);

        $invalidatePaths = [];
        $this->transferPathWithDatabase($originalPath, $newPath, $invalidatePaths);
        $this->fireInvalidationEvent($invalidatePaths);
    }

    /**
     * moveWithDatabase relocates files and directories against the database
     * layer and the assets disk, re-keying directory contents the same way
     * as renameWithDatabase.
     */
    protected function moveWithDatabase(array $selectedList, string $destinationDir): void
    {
        $source = $this->getSourceIdentifier($this->theme);
        $basePath = $this->getOperationBasePath();
        $destinationPath = trim($this->normalizeOperationPath($destinationDir), '/');

        $invalidatePaths = [];

        foreach ($selectedList as $path) {
            if (!$this->validateOperationPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $path = $this->normalizeOperationPath($path);
            $basename = basename($path);
            $newPath = strlen($destinationPath) ? $destinationPath.'/'.$basename : $basename;

            if ($newPath === $path) {
                continue;
            }

            $originalFullPath = $basePath.'/'.$path;

            $activeRow = SourceFile::findByPath($source, $path);
            $isTombstoned = SourceFile::onlyTrashed()->bySource($source)->byPath($path)->exists();
            $isFsFile = File::isFile($originalFullPath);
            $isFsDir = File::isDirectory($originalFullPath);
            $hasChildRows = SourceFile::query()->bySource($source)->byPathPrefix($path)->exists();

            // Directory move
            if (!$activeRow && !$isFsFile && ($isFsDir || $hasChildRows)) {
                $targetTaken = is_dir($basePath.'/'.$newPath)
                    || SourceFile::query()->bySource($source)->byPathPrefix($newPath)->exists();

                if ($targetTaken) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.destination_exists',
                        ['name' => $basename]
                    ));
                }

                foreach ($this->listTransferablePathsUnderPrefix($path) as $childPath) {
                    $newChildPath = $newPath.substr($childPath, strlen($path));
                    $this->transferPathWithDatabase($childPath, $newChildPath, $invalidatePaths);
                }
                continue;
            }

            // Missing or tombstoned originals have nothing to move
            if (!$activeRow && (!$isFsFile || $isTombstoned)) {
                continue;
            }

            $this->assertNoDatabaseCollision($source, $basePath, $newPath, $basename);

            $this->transferPathWithDatabase($path, $newPath, $invalidatePaths);
        }

        if (count($invalidatePaths)) {
            $this->fireInvalidationEvent($invalidatePaths);
        }
    }

    /**
     * deletePathsWithDatabase deletes against the database layer, removing
     * assets disk objects and tombstoning rows.
     */
    protected function deletePathsWithDatabase(array $fileList): void
    {
        $source = $this->getSourceIdentifier($this->theme);
        $basePath = $this->getOperationBasePath();

        $invalidatePaths = [];

        foreach ($fileList as $path) {
            if (!$this->validateOperationPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $path = $this->normalizeOperationPath($path);
            $fullPath = $basePath.'/'.$path;

            $activeRow = SourceFile::findByPath($source, $path);
            $isFsFile = File::isFile($fullPath);
            $isFsDir = File::isDirectory($fullPath);
            $childRowPaths = SourceFile::query()->bySource($source)->byPathPrefix($path)->pluck('path')->all();

            // Directory delete: placeholder rows do not count as content
            if (!$activeRow && !$isFsFile && ($isFsDir || count($childRowPaths))) {
                $contentRows = array_filter($childRowPaths, function ($childPath) {
                    return substr(basename($childPath), 0, 1) !== '.';
                });
                $fsNotEmpty = $isFsDir && !File::isDirectoryEmpty($fullPath);

                if (count($contentRows) || $fsNotEmpty) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_deleting_dir_not_empty',
                        ['name' => $path]
                    ));
                }

                // Tombstone placeholder rows so the folder disappears everywhere
                foreach ($childRowPaths as $childPath) {
                    SourceFile::tombstoneAt($source, $childPath);
                }

                if ($isFsDir && !@rmdir($fullPath)) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.error_deleting_dir',
                        ['name' => $path]
                    ));
                }
                continue;
            }

            // Tombstone when an active row or a filesystem copy exists
            if ($activeRow || $isFsFile) {
                SourceFile::tombstoneAt($source, $path);

                $diskPath = $this->getDiskPath($this->theme, $path);
                Storage::disk($this->getDiskName())->delete($diskPath);
                $invalidatePaths[] = $diskPath;
            }
        }

        if (count($invalidatePaths)) {
            $this->fireInvalidationEvent($invalidatePaths);
        }
    }

    /**
     * transferPathWithDatabase re-keys a single file from one path to
     * another: bytes land at the new disk key, the old row is tombstoned and
     * its disk object removed. Inline rows (directory placeholders) stay
     * inline and touch no disk objects.
     */
    protected function transferPathWithDatabase(string $oldPath, string $newPath, array &$invalidatePaths): void
    {
        $source = $this->getSourceIdentifier($this->theme);
        $row = SourceFile::findByPath($source, $oldPath);

        $bytes = $row
            ? (string) $row->getContents()
            : (string) File::get($this->getOperationBasePath().'/'.$oldPath);

        if ($row && !$row->isDiskBacked()) {
            SourceFile::upsertAt($source, $newPath, $bytes);
            SourceFile::tombstoneAt($source, $oldPath);
            return;
        }

        $newDiskPath = $this->getDiskPath($this->theme, $newPath);

        SourceFile::upsertOnDiskAt(
            $source,
            $newPath,
            $this->getDiskName(),
            $newDiskPath,
            $bytes,
            $row ? $row->mime_type : null
        );

        SourceFile::tombstoneAt($source, $oldPath);

        $oldDiskPath = $this->getDiskPath($this->theme, $oldPath);
        Storage::disk($this->getDiskName())->delete($oldDiskPath);

        $invalidatePaths[] = $newDiskPath;
        $invalidatePaths[] = $oldDiskPath;
    }

    /**
     * listTransferablePathsUnderPrefix returns the union of active row paths
     * and unsuppressed filesystem file paths beneath a directory prefix.
     */
    protected function listTransferablePathsUnderPrefix(string $prefix): array
    {
        $source = $this->getSourceIdentifier($this->theme);
        $paths = [];

        $rowPaths = SourceFile::query()
            ->bySource($source)
            ->byPathPrefix($prefix)
            ->pluck('path')
            ->all();

        foreach ($rowPaths as $rowPath) {
            $paths[$rowPath] = true;
        }

        $fullPrefix = $this->getOperationBasePath().'/'.$prefix;
        if (File::isDirectory($fullPrefix)) {
            $tombstoned = array_flip(
                SourceFile::onlyTrashed()->bySource($source)->byPathPrefix($prefix)->pluck('path')->all()
            );

            foreach (File::allFiles($fullPrefix) as $fileInfo) {
                $relPath = $prefix.'/'.str_replace('\\', '/', $fileInfo->getRelativePathname());
                if (!isset($tombstoned[$relPath])) {
                    $paths[$relPath] = true;
                }
            }
        }

        return array_keys($paths);
    }

    /**
     * assertNoDatabaseCollision throws when the target path is already
     * occupied by an active row or an unsuppressed filesystem file.
     */
    protected function assertNoDatabaseCollision(string $source, string $basePath, string $newPath, ?string $name = null): void
    {
        $targetRow = SourceFile::existsAt($source, $newPath);
        $targetTombstoned = SourceFile::onlyTrashed()->bySource($source)->byPath($newPath)->exists();
        $targetFsFile = File::isFile($basePath.'/'.$newPath);

        if ($targetRow || ($targetFsFile && !$targetTombstoned)) {
            throw new ApplicationException($name !== null
                ? Lang::get('editor::lang.filesystem.destination_exists', ['name' => $name])
                : Lang::get('editor::lang.filesystem.already_exists'));
        }
    }

    /**
     * normalizeOperationPath produces the canonical relative path used as the
     * SourceFile path key, matching the normalization in Asset::getInternal().
     */
    protected function normalizeOperationPath(string $path): string
    {
        return ltrim(File::normalizePath(trim($path)), '/');
    }

    /**
     * getOperationBasePath returns the absolute path to the theme's assets
     * directory, used as the root for all operations.
     */
    protected function getOperationBasePath(): string
    {
        return $this->theme->getPath().'/'.$this->dirName;
    }

    /**
     * getOperationExtensions returns allowed extensions for upload/rename
     * operations. Includes all asset types defined in the asset definitions,
     * with preprocessor types removed when safe mode is enabled.
     */
    protected function getOperationExtensions(): array
    {
        $extensions = \October\Rain\Filesystem\Definitions::get('asset_extensions');

        if (\System::checkSafeMode()) {
            $extensions = array_diff($extensions, ['less', 'sass', 'scss']);
        }

        return array_values($extensions);
    }

    /**
     * validateOperationPath ensures a relative path does not escape the
     * assets root or contain unsafe characters.
     */
    protected function validateOperationPath(string $path): bool
    {
        if (!preg_match('/^[\@0-9a-z\.\s_\-\/]+$/i', $path)) {
            return false;
        }

        if (strpos($path, '..') !== false || strpos($path, './') !== false) {
            return false;
        }

        return true;
    }

    /**
     * validateOperationName ensures a single file or directory name contains
     * only safe characters.
     */
    protected function validateOperationName(string $name): bool
    {
        if (!preg_match('/^[\@0-9a-z\.\s_\-]+$/i', $name)) {
            return false;
        }

        if (strpos($name, '..') !== false) {
            return false;
        }

        return true;
    }

    /**
     * validateOperationFileExtension checks a filename against the allowed
     * extension list.
     */
    protected function validateOperationFileExtension(string $name, array $allowedExtensions): bool
    {
        return in_array(strtolower(File::extension($name)), $allowedExtensions);
    }
}
