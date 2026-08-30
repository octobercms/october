<?php namespace Tailor\Classes\Blueprint;

use File;
use Lang;
use Cms\Models\SourceFile;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use ApplicationException;

/**
 * HasOperations implements editor-side CRUD operations against a Tailor
 * blueprints directory. Pulled out of Editor\Traits\FileSystemFunctions so
 * the Blueprint class is the single seam for any future cross-cutting
 * concerns (shared storage publishing, audit logging, events, etc.).
 *
 * Consuming class must provide the blueprints base path via
 * {@link getBasePath()}.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasOperations
{
    /**
     * upload accepts a single uploaded file into a destination directory
     * under the blueprints root.
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

        if ($this->databaseLayerEnabled()) {
            $destinationPath = trim($this->normalizeOperationPath($destinationDir), '/');
            $newPath = strlen($destinationPath) ? $destinationPath.'/'.$fileName : $fileName;

            SourceFile::upsertAt(
                $this->getSourceIdentifier(),
                $newPath,
                (string) file_get_contents($uploadedFile->getRealPath())
            );
            return;
        }

        $destinationFullPath = $this->getBasePath().'/'.$destinationDir;
        if (!File::isDirectory($destinationFullPath)) {
            File::makeDirectory($destinationFullPath, 0755, true, true);
        }

        if (!file_exists($destinationFullPath) || !is_dir($destinationFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.destination_not_found'));
        }

        $uploadedFile->move($destinationFullPath, $fileName);
    }

    /**
     * rename renames a single file or directory within the blueprints root.
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

        if ($this->databaseLayerEnabled()) {
            $this->renameWithDatabase($newName, $originalPath);
            return;
        }

        $basePath = $this->getBasePath();
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
     * directory under the blueprints root.
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

        if ($this->databaseLayerEnabled()) {
            $this->moveWithDatabase($selectedList, $destinationDir);
            return;
        }

        $basePath = $this->getBasePath();
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
     * blueprints root.
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

        $newFullPath = $this->getBasePath().'/'.$parent.'/'.$newName;
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
     * blueprints root. Directories must be empty.
     */
    public function deletePaths(array $fileList): void
    {
        usort($fileList, function ($a, $b) {
            return strlen($b) - strlen($a);
        });

        if ($this->databaseLayerEnabled()) {
            $this->deletePathsWithDatabase($fileList);
            return;
        }

        $basePath = $this->getBasePath();

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
     * renameWithDatabase performs a rename against the database layer
     */
    protected function renameWithDatabase(string $newName, string $originalPath): void
    {
        $source = $this->getSourceIdentifier();
        $basePath = $this->getBasePath();
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
            $newFullPath = $basePath.'/'.$newPath;
            if (file_exists($newFullPath)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.already_exists'));
            }

            if ($isFsDir && !@rename($originalFullPath, $newFullPath)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.error_renaming'));
            }

            $this->rewriteRowPathPrefixes($originalPath, $newPath);
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

        $content = $activeRow
            ? (string) $activeRow->getContents()
            : (string) File::get($originalFullPath);

        SourceFile::upsertAt($source, $newPath, $content);
        SourceFile::tombstoneAt($source, $originalPath);
    }

    /**
     * moveWithDatabase relocates files and directories against the database layer
     */
    protected function moveWithDatabase(array $selectedList, string $destinationDir): void
    {
        $source = $this->getSourceIdentifier();
        $basePath = $this->getBasePath();
        $destinationPath = trim($this->normalizeOperationPath($destinationDir), '/');

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
                $newFullPath = $basePath.'/'.$newPath;
                if (is_dir($newFullPath)) {
                    throw new ApplicationException(Lang::get(
                        'editor::lang.filesystem.destination_exists',
                        ['name' => $basename]
                    ));
                }

                if ($isFsDir) {
                    if (!@File::copyDirectory($originalFullPath, $newFullPath)) {
                        throw new ApplicationException(Lang::get(
                            'editor::lang.filesystem.error_moving_directory',
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

                $this->rewriteRowPathPrefixes($path, $newPath);
                continue;
            }

            // Missing or tombstoned originals have nothing to move
            if (!$activeRow && (!$isFsFile || $isTombstoned)) {
                continue;
            }

            $this->assertNoDatabaseCollision($source, $basePath, $newPath, $basename);

            $content = $activeRow
                ? (string) $activeRow->getContents()
                : (string) File::get($originalFullPath);

            SourceFile::upsertAt($source, $newPath, $content);
            SourceFile::tombstoneAt($source, $path);
        }
    }

    /**
     * deletePathsWithDatabase deletes against the database layer
     */
    protected function deletePathsWithDatabase(array $fileList): void
    {
        $source = $this->getSourceIdentifier();
        $basePath = $this->getBasePath();

        foreach ($fileList as $path) {
            if (!$this->validateOperationPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $path = $this->normalizeOperationPath($path);
            $fullPath = $basePath.'/'.$path;

            $activeRow = SourceFile::findByPath($source, $path);

            // Directory delete
            if (!$activeRow && !File::isFile($fullPath) && File::isDirectory($fullPath)) {
                $hasActiveChildRows = SourceFile::query()->bySource($source)->byPathPrefix($path)->exists();

                if ($hasActiveChildRows || !File::isDirectoryEmpty($fullPath)) {
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
                continue;
            }

            // Tombstone when an active row or an unsuppressed filesystem copy exists
            if ($activeRow || File::isFile($fullPath)) {
                SourceFile::tombstoneAt($source, $path);
            }
        }
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
     * rewriteRowPathPrefixes moves every row, including tombstones, from the old
     * directory prefix to the new one.
     */
    protected function rewriteRowPathPrefixes(string $oldPrefix, string $newPrefix): void
    {
        $source = $this->getSourceIdentifier();
        $oldPrefix = rtrim($oldPrefix, '/');
        $newPrefix = rtrim($newPrefix, '/');

        $rows = SourceFile::withTrashed()
            ->bySource($source)
            ->byPathPrefix($oldPrefix)
            ->get();

        foreach ($rows as $row) {
            $row->path = $newPrefix.'/'.substr($row->path, strlen($oldPrefix) + 1);
            $row->save();
        }
    }

    /**
     * normalizeOperationPath produces the canonical relative path used as the
     * SourceFile path key, matching the normalization in Blueprint::getInternal().
     */
    protected function normalizeOperationPath(string $path): string
    {
        return ltrim(File::normalizePath(trim($path)), '/');
    }

    /**
     * getOperationExtensions returns allowed extensions for upload/rename
     * operations. Blueprints are always YAML.
     */
    protected function getOperationExtensions(): array
    {
        return ['yaml'];
    }

    /**
     * validateOperationPath ensures a relative path does not escape the
     * blueprints root or contain unsafe characters.
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
