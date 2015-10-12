<?php namespace Cms\Classes;

use Ini;
use Str;

/**
 * This class parses CMS object files (pages, partials and layouts).
 * Returns the structured file information.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class SectionParser
{
    const SECTION_SEPARATOR = '==';

    /**
     * Parses a CMS object file content. 
     * The expected file format is following:
     * <pre>
     * INI settings section
     * ==
     * PHP code section
     * ==
     * Twig markup section
     * </pre>
     * If the content has only 2 sections they are considered as settings and Twig.
     * If there is only a single section, it is considered as Twig.
     * @param string $content Specifies the file content.
     * @return array Returns an array with the following indexes: 'settings', 'markup', 'code'.
     * The 'markup' and 'code' elements contain strings. The 'settings' element contains the 
     * parsed INI file as array. If the content string doesn't contain a section, the corresponding
     * result element has null value.
     */
    public static function parse($content)
    {
        $sections = preg_split('/^={2,}\s*/m', $content, -1);
        $count = count($sections);
        foreach ($sections as &$section) {
            $section = trim($section);
        }

        $result = [
            'settings' => [],
            'code'     => null,
            'markup'   => null
        ];

        if ($count >= 3) {
            $result['settings'] = Ini::parse($sections[0], true);
            $result['code'] = $sections[1];

            $result['code'] = preg_replace('/^\s*\<\?php/', '', $result['code']);
            $result['code'] = preg_replace('/^\s*\<\?/', '', $result['code']);
            $result['code'] = preg_replace('/\?\>\s*$/', '', $result['code']);

            $result['markup'] = $sections[2];
        }
        elseif ($count == 2) {
            $result['settings'] = Ini::parse($sections[0], true);
            $result['markup'] = $sections[1];
        }
        elseif ($count == 1) {
            $result['markup'] = $sections[0];
        }

        return $result;
    }

    /**
     * Same as parse method, except the line number where the respective section
     * begins is returned.
     * @param string $content Specifies the file content.
     * @return array Returns an array with the following indexes: 'settings', 'markup', 'code'.
     */
    public static function parseOffset($content)
    {
        $content = Str::normalizeEol($content);
        $sections = preg_split('/^={2,}\s*/m', $content, -1);
        $count = count($sections);

        $result = [
            'settings' => null,
            'code'     => null,
            'markup'   => null
        ];

        if ($count >= 3) {
            $result['settings'] = self::adjustLinePosition($content);
            $result['code'] = self::calculateLinePosition($content);
            $result['markup'] = self::calculateLinePosition($content, 2);
        }
        elseif ($count == 2) {
            $result['settings'] = self::adjustLinePosition($content);
            $result['markup'] = self::calculateLinePosition($content);
        }
        elseif ($count == 1) {
            $result['markup'] = 1;
        }

        return $result;
    }

    /**
     * Returns the line number of a found instance of CMS object section separator (==).
     * @param string $content Object content
     * @param int $instance Which instance to look for
     * @return int The line number the instance was found.
     */
    private static function calculateLinePosition($content, $instance = 1)
    {
        $count = 0;
        $lines = explode(PHP_EOL, $content);
        foreach ($lines as $number => $line) {
            if (trim($line) == self::SECTION_SEPARATOR) {
                $count++;
            }

            if ($count == $instance) {
                return static::adjustLinePosition($content, $number);
            }
        }

        return null;
    }

    /**
     * Pushes the starting line number forward since it is not always directly
     * after the separator (==). There can be an opening tag or white space in between
     * where the section really begins.
     * @param string $content Object content
     * @param int $startLine The calculated starting line from calculateLinePosition()
     * @return int The adjusted line number.
     */
    private static function adjustLinePosition($content, $startLine = -1)
    {
        // Account for the separator itself.
        $startLine++;

        $lines = array_slice(explode(PHP_EOL, $content), $startLine);
        foreach ($lines as $line) {
            $line = trim($line);

            /*
             * Empty line
             */
            if ($line == '') {
                $startLine++;
                continue;
            }

            /*
             * PHP line
             */
            if ($line == '<?php' || $line == '<?') {
                $startLine++;
                continue;
            }

            /*
             * PHP namespaced line (use x;) {
             * Don't increase the line count, it will be rewritten by Cms\Classes\CodeParser
             */
            if (preg_match_all('/(use\s+[a-z0-9_\\\\]+;\n?)/mi', $line) == 1) {
                continue;
            }

            break;
        }

        // Line 0 does not exist.
        return ++$startLine;
    }
}
