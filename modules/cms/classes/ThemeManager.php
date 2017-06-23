<?php namespace Cms\Classes;

use File;
use ApplicationException;
use System\Models\Parameter;
use Cms\Classes\Theme as CmsTheme;

/**
 * Theme manager
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeManager
{
    use \October\Rain\Support\Traits\Singleton;

    //
    // Gateway spawned
    //

    /**
     * Returns a collection of themes installed via the update gateway
     * @return array
     */
    public function getInstalled()
    {
        return Parameter::get('system::theme.history', []);
    }

    /**
     * Checks if a theme has ever been installed before.
     * @param  string  $name Theme code
     * @return boolean
     */
    public function isInstalled($name)
    {
        return array_key_exists($name, Parameter::get('system::theme.history', []));
    }

    /**
     * Flags a theme as being installed, so it is not downloaded twice.
     * @param string $code Theme code
     * @param string|null $dirName
     */
    public function setInstalled($code, $dirName = null)
    {
        if (!$dirName) {
            $dirName = strtolower(str_replace('.', '-', $code));
        }

        $history = Parameter::get('system::theme.history', []);
        $history[$code] = $dirName;
        Parameter::set('system::theme.history', $history);
    }

    /**
     * Flags a theme as being uninstalled.
     * @param string $code Theme code
     */
    public function setUninstalled($code)
    {
        $history = Parameter::get('system::theme.history', []);
        if (array_key_exists($code, $history)) {
            unset($history[$code]);
        }

        Parameter::set('system::theme.history', $history);
    }

    /**
     * Returns an installed theme's code from it's dirname.
     * @return string
     */
    public function findByDirName($dirName)
    {
        $installed = $this->getInstalled();
        foreach ($installed as $code => $name) {
            if ($dirName == $name) {
                return $code;
            }
        }

        return null;
    }

    //
    // Management
    //

    /**
     * Completely delete a theme from the system.
     * @param string $theme Theme code/namespace
     * @return void
     */
    public function deleteTheme($theme)
    {
        if (!$theme) {
            return false;
        }

        if (is_string($theme)) {
            $theme = CmsTheme::load($theme);
        }

        if ($theme->isActiveTheme()) {
            throw new ApplicationException(trans('cms::lang.theme.delete_active_theme_failed'));
        }

        /*
         * Delete from file system
         */
        $themePath = $theme->getPath();
        if (File::isDirectory($themePath)) {
            File::deleteDirectory($themePath);
        }

        /*
         * Set uninstalled
         */
        if ($themeCode = $this->findByDirName($theme->getDirName())) {
            $this->setUninstalled($themeCode);
        }
    }
}
