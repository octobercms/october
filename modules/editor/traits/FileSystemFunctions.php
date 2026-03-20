<?php namespace Editor\Traits;

use Lang;
use File;
use Input;
use Request;
use SystemException;
use ApplicationException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * FileSystemFunctions implements common file and directory management functions for Tailor extensions.
 */
trait FileSystemFunctions
{
    /**
     * editorCreateDirectory
     */
    protected function editorCreateDirectory($basePath, $newName, $parent)
    {
        if (!strlen($basePath)) {
            throw new SystemException('The directory base path must not be empty');
        }

        if (!strlen($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.directory_name_cant_be_empty'));
        }

        if (!$this->validateFileSystemPath($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (strlen($parent) && !$this->validateFileSystemPath($parent)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (!$this->validateFileSystemName($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_name'));
        }

        $newFullPath = $basePath.'/'.$parent.'/'.$newName;
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
     * editorRenameFileOrDirectory
     */
    protected function editorRenameFileOrDirectory($basePath, $name, $originalPath, $allowedFileExtensions)
    {
        $newName = trim($name);
        if (!strlen($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.name_cant_be_empty'));
        }

        if (!$this->validateFileSystemPath($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        if (!$this->validateFileSystemName($newName)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_name'));
        }

        $originalPath = trim($originalPath);
        if (!$this->validateFileSystemPath($originalPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        $originalFullPath = $basePath.'/'.$originalPath;
        if (!file_exists($originalFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.original_not_found'));
        }

        if (!is_dir($originalFullPath) && !$this->validateFileSystemFileExtension($newName, $allowedFileExtensions)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $allowedFileExtensions)]
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
     * editorDeleteFileOrDirectory
     */
    protected function editorDeleteFileOrDirectory($basePath, $fileList)
    {
        // Delete leaves first
        usort($fileList, function($a, $b) {
            return strlen($b) - strlen($a);
        });

        foreach ($fileList as $path) {
            if (!$this->validateFileSystemPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $fullPath = $basePath.'/'.$path;
            if (File::exists($fullPath)) {
                if (!File::isDirectory($fullPath)) {
                    if (!@File::delete($fullPath)) {
                        throw new ApplicationException(Lang::get(
                            'editor::lang.filesystem.error_deleting_file',
                            ['name' => $path]
                        ));
                    }
                }
                else {
                    $empty = File::isDirectoryEmpty($fullPath);
                    if (!$empty) {
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
        }
    }

    /**
     * editorMoveFilesOrDirectories
     */
    protected function editorMoveFilesOrDirectories($basePath, $selectedList, $destinationDir)
    {
        if (!count($selectedList)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.selected_files_not_found'));
        }

        if (!strlen($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.select_destination_dir'));
        }

        if (!$this->validateFileSystemPath($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        // Ensure directory exists
        $destinationFullPath = $basePath.'/'.$destinationDir;
        if (!File::isDirectory($destinationFullPath)) {
            File::makeDirectory($destinationFullPath, 0755, true, true);
        }

        // Path is gone
        if (!file_exists($destinationFullPath) || !is_dir($destinationFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.destination_not_found'));
        }

        foreach ($selectedList as $path) {
            if (!$this->validateFileSystemPath($path)) {
                throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
            }

            $basename = basename($path);
            $originalFullPath = $basePath.'/'.$path;
            $newFullPath = rtrim($destinationFullPath, '/').'/'.$basename;
            $safeDir = $basePath;

            if ($originalFullPath == $newFullPath) {
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

                if (strpos($originalFullPath, $safeDir) !== 0) {
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
     * editorUploadFiles
     */
    protected function editorUploadFiles($basePath, $allowedExtensions)
    {
        $uploadedFile = Input::file('file');
        if (!is_object($uploadedFile)) {
            return;
        }

        $fileName = $uploadedFile->getClientOriginalName();

        // Check valid upload
        if (!$uploadedFile->isValid()) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.file_not_valid'));
        }

        // Check file size
        $maxSize = UploadedFile::getMaxFilesize();
        if ($uploadedFile->getSize() > $maxSize) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.too_large',
                ['max_size' => File::sizeToString($maxSize)]
            ));
        }

        // Check for valid file extensions
        if (!$this->validateFileSystemFileExtension($fileName, $allowedExtensions)) {
            throw new ApplicationException(Lang::get(
                'editor::lang.filesystem.type_not_allowed',
                ['allowed_types' => implode(', ', $allowedExtensions)]
            ));
        }

        // Validate destination path
        $destinationDir = trim(Request::input('destination'));
        if (!strlen($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.select_destination_dir'));
        }

        if (!$this->validateFileSystemPath($destinationDir)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.invalid_path'));
        }

        // Ensure directory exists
        $destinationFullPath = $basePath.'/'.$destinationDir;
        if (!File::isDirectory($destinationFullPath)) {
            File::makeDirectory($destinationFullPath, 0755, true, true);
        }

        // Path is gone
        if (!file_exists($destinationFullPath) || !is_dir($destinationFullPath)) {
            throw new ApplicationException(Lang::get('editor::lang.filesystem.destination_not_found'));
        }

        // Accept the uploaded file
        $destinationFileName = $uploadedFile->getClientOriginalName();
        if (strtolower(File::extension($fileName)) === 'svg') {
            $contents = \Html::cleanVector(file_get_contents($uploadedFile->getRealPath()));
            File::put($destinationFullPath.'/'.$destinationFileName, $contents);
        }
        else {
            $uploadedFile->move($destinationFullPath, $destinationFileName);
        }
    }

    /**
     * validateFileSystemPath validates a file system path
     * @param $path string
     */
    private function validateFileSystemPath($path): bool
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
     * validateFileSystemName
     * @param $name string
     */
    private function validateFileSystemName($name): bool
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
     * validateFileSystemFileExtension
     */
    private function validateFileSystemFileExtension($name, $allowedExtensions): bool
    {
        $extension = strtolower(File::extension($name));
        if (!in_array($extension, $allowedExtensions)) {
            return false;
        }

        return true;
    }
}
