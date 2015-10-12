<?php namespace Cms\Helpers;

/**
 * Defines some file-system helpers for the CMS system.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class File
{
    /**
     * Validates a CMS object file or directory name.
     * CMS object file names can contain only alphanumeric symbols, dashes, underscores and dots.
     * Name can also begin with a component name, eg: MyComponent::filename.
     * @param string $fileName Specifies a path to validate
     * @return boolean Returns true if the file name is valid. Otherwise returns false.
     */
    public static function validateName($fileName)
    {
        return preg_match('/^[a-z0-9\_\-\.\/]+$/i', $fileName) ? true : false;
    }

    /**
     * Validates whether a file has an allowed extension.
     * @param string $fileName Specifies a path to validate
     * @param array $allowedExtensions A list of allowed file extensions
     * @param boolean $allowEmpty Determines whether the file extension could be empty.
     * @return boolean Returns true if the file extension is valid. Otherwise returns false.
     */
    public static function validateExtension($fileName, $allowedExtensions, $allowEmpty = true)
    {
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        if (!strlen($extension)) {
            return $allowEmpty;
        }

        return in_array($extension, $allowedExtensions);
    }

    /**
     * Validates a CMS object path.
     * CMS object directory and file names can contain only alphanumeric symbols, dashes and dots.
     * CMS objects support only a single level of subdirectories.
     * @param string $filePath Specifies a path to validate
     * @param integer $maxNesting Specifies the maximum allowed nesting level
     * @return boolean Returns true if the file name is valid. Otherwise returns false.
     */
    public static function validatePath($filePath, $maxNesting = 2)
    {
        if (strpos($filePath, '..') !== false) {
            return false;
        }

        if (strpos($filePath, './') !== false || strpos($filePath, '//') !== false) {
            return false;
        }

        $segments = explode('/', $filePath);
        if ($maxNesting !== null && count($segments) > $maxNesting) {
            return false;
        }

        foreach ($segments as $segment) {
            if (!self::validateName($segment)) {
                return false;
            }
        }

        return true;
    }
}
