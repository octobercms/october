<?php namespace Cms\Classes;

/**
 * Defines some file-system helpers for the CMS system.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class FileHelper
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

    /**
     * Formats an INI file string from an array
     * @param array $data Data to format.
     * @param int $level Specifies the level of array value.
     * @return string Returns the INI file string.
     */
    public static function formatIniString($data, $level = 1)
    {
        $content = null;
        $sections = [];

        foreach ($data as $key => $value) {
            if (is_array($value)) {
                if ($level == 1) {
                    $sections[$key] = self::formatIniString($value, $level+1);
                }
                else {
                    foreach ($value as $val) {
                        $content .= $key.'[] = "'.self::escapeIniString($val).'"'.PHP_EOL;
                    }
                }
            }
            elseif (strlen($value)) {
                $content .= $key.' = "'.self::escapeIniString($value).'"'.PHP_EOL;
            }
        }

        foreach ($sections as $key => $section) {
            $content .= PHP_EOL.'['.$key.']'.PHP_EOL.$section.PHP_EOL;
        }

        return trim($content);
    }

    /**
     * Escapes a string for saving in INI format
     * @param string $string Specifies the string to escape
     * @return string Returns the processed string
     */
    public static function escapeIniString($string)
    {
        return str_replace('"', '\"', $string);
    }
}
