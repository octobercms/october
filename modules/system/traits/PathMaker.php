<?php namespace System\Traits;

/**
 * Path Maker Trait
 *
 * Converts path symbols to relevant points in the filesystem.
 *
 *   $ - Relative to the plugins directory
 *   ~ - Relative to the application directory
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */

trait PathMaker
{

    /**
     * @var array Known path symbols and their prefixes.
     */
    protected $pathSymbols = [
        '$' => PATH_PLUGINS,
        '~' => PATH_BASE,
        // '/' => PATH_BASE, // @deprecated
        '@' => PATH_BASE, // @deprecated
    ];

    /**
     * Converts a path.
     * @param  string $path
     * @return string
     */
    public function makePath($path, $default = false)
    {
        if (!$firstChar = $this->isPathSymbol($path))
            return $default;

        $_path = substr($path, 1);
        return $this->pathSymbols[$firstChar] . $_path;
    }

    /**
     * Returns true if the path uses a symbol.
     * @param  string  $path
     * @return boolean
     */
    public function isPathSymbol($path)
    {
        $firstChar = substr($path, 0, 1);
        if (isset($this->pathSymbols[$firstChar]))
            return $firstChar;

        return false;
    }

}