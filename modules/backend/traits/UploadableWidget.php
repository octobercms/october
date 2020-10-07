<?php namespace Backend\Traits;

use Str;
use File;
use Lang;
use Request;
use Response;
use ApplicationException;
use System\Classes\MediaLibrary;
use October\Rain\Filesystem\Definitions as FileDefinitions;

/**
 * Uploadable Widget Trait
 * Adds media library upload features to back-end widgets
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
trait UploadableWidget
{
    // /**
    //  * @var string Path in the Media Library where uploaded files should be stored. If empty it will be pulled from Request::input('path');
    //  */
    // public $uploadPath;

    /**
     * Process file uploads submitted via AJAX
     *
     * @return void
     * @throws ApplicationException If the file "file_data" wasn't detected in the request or if the file failed to pass validation / security checks
     */
    public function onUpload()
    {
        if ($this->readOnly) {
            return;
        }

        try {
            if (!Request::hasFile('file_data')) {
                throw new ApplicationException('File missing from request');
            }

            $uploadedFile = Request::file('file_data');

            $fileName = $uploadedFile->getClientOriginalName();

            /*
             * Convert uppcare case file extensions to lower case
             */
            $extension = strtolower($uploadedFile->getClientOriginalExtension());
            $fileName = File::name($fileName).'.'.$extension;

            /*
             * File name contains non-latin characters, attempt to slug the value
             */
            if (!$this->validateFileName($fileName)) {
                $fileNameClean = $this->cleanFileName(File::name($fileName));
                $fileName = $fileNameClean . '.' . $extension;
            }

            /*
             * Check for unsafe file extensions
             */
            if (!$this->validateFileType($fileName)) {
                throw new ApplicationException(Lang::get('backend::lang.media.type_blocked'));
            }

            /*
             * See mime type handling in the asset manager
             */
            if (!$uploadedFile->isValid()) {
                if ($uploadedFile->getError() === UPLOAD_ERR_OK) {
                    $message = "The file \"{$uploadedFile->getClientOriginalName()}\" uploaded successfully but wasn't available at {$uploadedFile->getPathName()}. Check to make sure that nothing moved it away.";
                } else {
                    $message = $uploadedFile->getErrorMessage();
                }
                throw new ApplicationException($message);
            }

            // Use the configured upload path unless it's null, in which case use the user-provided path
            $path = !empty($this->uploadPath) ? $this->uploadPath : Request::input('path');
            $path = MediaLibrary::validatePath($path);
            $filePath = $path . '/' . $fileName;

            /*
             * getRealPath() can be empty for some environments (IIS)
             */
            $realPath = empty(trim($uploadedFile->getRealPath()))
                ? $uploadedFile->getPath() . DIRECTORY_SEPARATOR . $uploadedFile->getFileName()
                : $uploadedFile->getRealPath();

            MediaLibrary::instance()->put(
                $filePath,
                File::get($realPath)
            );

            /**
             * @event media.file.upload
             * Called after a file is uploaded
             *
             * Example usage:
             *
             *     Event::listen('media.file.upload', function ((\Backend\Widgets\MediaManager) $mediaWidget, (string) &$path, (\Symfony\Component\HttpFoundation\File\UploadedFile) $uploadedFile) {
             *         \Log::info($path . " was upoaded.");
             *     });
             *
             * Or
             *
             *     $mediaWidget->bindEvent('file.upload', function ((string) &$path, (\Symfony\Component\HttpFoundation\File\UploadedFile) $uploadedFile) {
             *         \Log::info($path . " was uploaded");
             *     });
             *
             */
            $this->fireSystemEvent('media.file.upload', [&$filePath, $uploadedFile]);

            $response = Response::make([
                'link' => MediaLibrary::url($filePath),
                'result' => 'success'
            ]);
        } catch (\Exception $ex) {
            throw new ApplicationException($ex->getMessage());
        }

        return $response;
    }

    /**
     * Validate a proposed media item file name.
     *
     * @param string
     * @return bool
     */
    protected function validateFileName($name)
    {
        if (!preg_match('/^[\w@\.\s_\-]+$/iu', $name)) {
            return false;
        }

        if (strpos($name, '..') !== false) {
            return false;
        }

        return true;
    }

    /**
     * Check for blocked / unsafe file extensions
     *
     * @param string
     * @return bool
     */
    protected function validateFileType($name)
    {
        $extension = strtolower(File::extension($name));

        $allowedFileTypes = FileDefinitions::get('defaultExtensions');

        if (!in_array($extension, $allowedFileTypes)) {
            return false;
        }

        return true;
    }

    /**
     * Creates a slug form the string. A modified version of Str::slug
     * with the main difference that it accepts @-signs
     *
     * @param string $name
     * @return string
     */
    protected function cleanFileName($name)
    {
        $title = Str::ascii($name);

        // Convert all dashes/underscores into separator
        $flip = $separator = '-';
        $title = preg_replace('!['.preg_quote($flip).']+!u', $separator, $title);

        // Remove all characters that are not the separator, letters, numbers, whitespace or @.
        $title = preg_replace('![^'.preg_quote($separator).'\pL\pN\s@]+!u', '', mb_strtolower($title));

        // Replace all separator characters and whitespace by a single separator
        $title = preg_replace('!['.preg_quote($separator).'\s]+!u', $separator, $title);

        return trim($title, $separator);
    }
}
