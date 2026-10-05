<?php namespace System\Traits;

/**
 * HasLessFunctions trait cleans user supplied values before they reach the LESS compiler
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasLessFunctions
{
    /**
     * stripLessFileAccess removes LESS import directives and file reading functions until none remain.
     */
    protected static function stripLessFileAccess(string $css): string
    {
        do {
            $previous = $css;
            $css = preg_replace('/@\s*import?(?![\w-])/i', '', $css);
            $css = preg_replace('/(data-?uri|image-?(size|width|height))\s*\(/i', '(', $css);
        } while ($css !== $previous);

        return $css;
    }

    /**
     * makeLessColorValue returns the value when it is a plain CSS color, otherwise the default, so no LESS source reaches the parser.
     */
    protected static function makeLessColorValue($value, string $default): string
    {
        $value = is_string($value) ? trim($value) : '';

        $isColor = preg_match('/^(#[0-9a-f]{3,8}|[a-z]+|(rgb|rgba|hsl|hsla)\([0-9.,%\s\/]*\))$/iD', $value);

        return $isColor ? $value : $default;
    }

    /**
     * makeLessSizeValue returns the value when it is made of plain CSS size keywords and lengths, otherwise the default.
     */
    protected static function makeLessSizeValue($value, string $default): string
    {
        $value = is_string($value) ? trim($value) : '';

        return preg_match('/^[a-z0-9.%\s]+$/iD', $value) ? $value : $default;
    }
}
