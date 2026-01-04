<?php namespace Cms\Classes;

use Db;
use App;
use Lang;
use Yaml;
use File;
use System;
use Cms\Classes\Theme as CmsTheme;
use October\Rain\Composer\ComposerManager;
use ApplicationException;
use Exception;

/**
 * ThemeManager
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeManager
{
    /**
     * @var array themes is for storing themes cache
     */
    protected $themes;

    /**
     * @var array installedThemes is for storing installed themes cache
     */
    protected $installedThemes;

    /**
     * @var array installedThemeDirs is for storing installed themes cache
     */
    protected $installedThemeDirs;

    /**
     * @var array bootedThemes is for storing themes that have been booted
     */
    protected $bootedThemes = [];

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        try {
            return App::make('cms.themes');
        }
        catch (Exception $ex) {
            return new static;
        }
    }

    /**
     * bootAll will boot language messages for the active theme as `theme.acme::lang.*`
     * if it is in the backend
     */
    public function bootAll()
    {
        $theme = $this->getActiveTheme();
        $this->bootTheme($theme, App::runningInBackend());

        if ($parent = $theme->getParentTheme()) {
            $this->bootTheme($parent, App::runningInBackend());
        }
    }

    /**
     * bootTheme boots a theme if it hasn't been booted already
     */
    protected function bootTheme(CmsTheme $theme, bool $isBackend = false): void
    {
        $themeId = $theme->getId();

        if (in_array($themeId, $this->bootedThemes)) {
            return;
        }

        $langPath = $theme->getPath() . '/lang';
        if (is_dir($langPath)) {
            Lang::addJsonPath($langPath);

            if ($isBackend) {
                Lang::addNamespace("theme.{$themeId}", $langPath);
            }
        }

        $this->bootedThemes[] = $themeId;
    }

    /**
     * getActiveTheme return the active theme without affecting the internal cache
     * since it may fire before the session driver has loaded.
     */
    public function getActiveTheme(): CmsTheme
    {
        return CmsTheme::load(CmsTheme::getActiveThemeCode());
    }

    /**
     * getThemes returns all themes in the filesystem
     */
    public function getThemes(): array
    {
        if ($this->themes !== null) {
            return $this->themes;
        }

        $result = [];
        foreach (CmsTheme::all() as $theme) {
            $dirName = $theme->getDirName();
            $result[$dirName] = $theme;
        }

        return $this->themes = $result;
    }

    /**
     * getInstalled returns a collection of themes installed
     *
     * ['RainLab.Vanilla' => '1.0.0', ...]
     */
    public function getInstalled(): array
    {
        if ($this->installedThemes !== null) {
            return $this->installedThemes;
        }

        $result = [];

        foreach ($this->getThemes() as $dirName => $theme) {
            // Check composer file
            if (!$octoberCode = $this->getProductCode($dirName)) {
                continue;
            }

            // Check composer matches theme.yaml
            $publishedCode = $theme->getConfigValue('authorCode') . '.' . $theme->getConfigValue('code');
            if (strtolower($publishedCode) !== $octoberCode) {
                continue;
            }

            // Check version.yaml
            $result[$publishedCode] = $this->getLatestVersion($dirName);
        }

        return $this->installedThemes = $result;
    }

    /**
     * getInstalled returns a collection of themes installed and their directories
     *
     * ['rainlab.vanilla' => 'vanilla', ...]
     */
    protected function getInstalledDirectories(): array
    {
        if ($this->installedThemeDirs !== null) {
            return $this->installedThemeDirs;
        }

        $result = [];

        foreach ($this->getThemes() as $dirName => $theme) {
            // Check composer file
            if (!$octoberCode = $this->getProductCode($dirName)) {
                continue;
            }

            $result[$octoberCode] = $dirName;
        }

        return $this->installedThemeDirs = $result;
    }

    /**
     * isInstalled checks if a theme has ever been installed
     */
    public function isInstalled(string $name): bool
    {
        return array_key_exists(strtolower($name), $this->getInstalledDirectories());
    }

    /**
     * findDirectoryName from a code
     */
    public function findDirectoryName($code): ?string
    {
        return $this->getInstalledDirectories()[strtolower($code)] ?? null;
    }

    /**
     * findInstalledCode returns an installed theme's code from it's dirname
     */
    public function findInstalledCode($dirName): ?string
    {
        foreach ($this->getInstalled() as $code => $name) {
            if ($dirName === $name) {
                return $code;
            }
        }

        return null;
    }

    /**
     * findByIdentifier returns a theme object from a directory name
     */
    public function findByIdentifier(string $dirName): ?CmsTheme
    {
        if (!CmsTheme::exists($dirName)) {
            return null;
        }

        return CmsTheme::load($dirName);
    }

    /**
     * getThemePaths returns an array of themes and their paths.
     */
    public function getThemePaths(): array
    {
        $result = [];

        foreach ($this->getThemes() as $dirName => $theme) {
            $result[$dirName] = $theme->getPath();
        }

        return $result;
    }

    /**
     * getThemePath returns the disk path for the theme
     */
    public function getThemePath(string $dirName): string
    {
        if (!$theme = $this->findByIdentifier($dirName)) {
            return '';
        }

        return $theme->getPath();
    }

    /**
     * getProductCode finds the product code for a theme, it relies
     * on the composer file as the source of truth
     * author.sometheme
     */
    public function getProductCode(string $dirName): string
    {
        $name = $this->getComposerCode($dirName);

        $name = System::composerToOctoberCode($name);

        return $name;
    }

    /**
     * getComposerCode finds the composer code for a theme
     * author/sometheme-theme
     */
    public function getComposerCode(string $dirName): string
    {
        $path = $this->getThemePath($dirName);
        $file = $path . '/composer.json';

        if (!$path || !File::exists($file)) {
            return '';
        }

        $info = json_decode(File::get($file), true);

        return $info['name'] ?? '';
    }

    /**
     * getLatestVersion finds the latest version for a theme
     */
    public function getLatestVersion(string $dirName): string
    {
        $versionHistory = $this->getVersionHistory($dirName);

        $latestVersion = array_key_first($versionHistory);

        if ($latestVersion === null) {
            return '0.0.0';
        }

        return (string) $latestVersion;
    }

    /**
     * getVersionHistory returns the version history for a theme
     */
    public function getVersionHistory(string $dirName): array
    {
        $path = $this->getThemePath($dirName);

        if (!File::exists($file = $path . '/version.yaml')) {
            return [];
        }

        try {
            $updates = (array) Yaml::parseFile($file);
        }
        catch (Exception $ex) {
            return [];
        }

        uksort($updates, function ($a, $b) {
            return version_compare((string) $b, (string) $a);
        });

        return $updates;
    }

    /**
     * duplicateTheme duplicates a theme
     */
    public function duplicateTheme(string $dirName, ?string $newDirName = null): bool
    {
        if (!$dirName) {
            return false;
        }

        if (!$newDirName) {
            $newDirName = $dirName . '-copy';
        }

        $theme = CmsTheme::load($dirName);

        $sourcePath = $theme->getPath();
        $destinationPath = themes_path().'/'.$newDirName;

        if (is_dir($destinationPath)) {
            return false;
        }

        // Duplicate theme
        File::copyDirectory($sourcePath, $destinationPath);

        // Unlock theme (if required)
        $this->performUnlockOnTheme($newDirName);

        $newTheme = CmsTheme::load($newDirName);
        $newName = $newTheme->getConfigValue('name') . ' - Copy';
        $newTheme->writeConfig(['name' => $newName]);

        return true;
    }

    /**
     * createChildTheme will create a child theme
     */
    public function createChildTheme(string $dirName, ?string $newDirName = null): bool
    {
        if (!$newDirName) {
            $newDirName = $dirName . '-child';
        }

        $themePath = themes_path($dirName);
        $childPath = themes_path($newDirName);
        $childYaml = $childPath . '/theme.yaml';

        // Child already exists
        if (file_exists($childPath)) {
            return false;
        }

        // Create child
        File::makeDirectory($childPath);
        File::copy($themePath . '/theme.yaml', $childYaml);

        $yaml = Yaml::parseFile($childYaml);
        $yaml['parent'] = $dirName;
        File::put($childYaml, Yaml::render($yaml));

        return true;
    }

    /**
     * importDatabaseTemplates
     */
    public function importDatabaseTemplates(string $dirName, ?string $srcDirName = null)
    {
        if (!$srcDirName) {
            $srcDirName = $dirName;
        }

        $theme = CmsTheme::load($dirName);
        $themePath = $theme->getPath();
        if (!$themePath) {
            return;
        }

        $templates = Db::table('cms_theme_templates')->where('source', $srcDirName)->get();

        foreach ($templates as $template) {
            $filePath = $themePath . '/' . $template->path;
            if ($template->deleted_at) {
                File::delete($filePath);
            }
            else {
                File::put($filePath, $template->content);
            }
        }
    }

    /**
     * purgeDatabaseTemplates
     */
    public function purgeDatabaseTemplates(string $dirName)
    {
        Db::table('cms_theme_templates')->where('source', $dirName)->delete();
    }

    /**
     * deleteTheme completely delete a theme from the system
     */
    public function deleteTheme(string $theme)
    {
        if (!$theme) {
            return false;
        }

        $theme = CmsTheme::load($theme);
        if ($theme->isActiveTheme()) {
            throw new ApplicationException(__('Cannot delete the active theme, try making another theme active first.'));
        }

        $theme->removeCustomData();

        // Delete from file system
        $themePath = $theme->getPath();
        if (is_dir($themePath)) {
            File::deleteDirectory($themePath);
        }
    }

    /**
     * findMissingDependencies scans the system plugins to locate any dependencies that
     * are not currently installed. Returns an array of plugin codes that are needed.
     *
     *     ThemeManager::instance()->findMissingDependencies();
     *
     * @return array
     */
    public function findMissingDependencies(): array
    {
        $manager = \System\Classes\PluginManager::instance();

        $missing = [];

        foreach ($this->getThemes() as $theme) {
            $required = $theme->getConfigValue('require', false);
            if (!$required || !is_array($required)) {
                continue;
            }

            foreach ($required as $require) {
                if (!$require || $manager->hasPlugin($require)) {
                    continue;
                }

                if (!in_array($require, $missing)) {
                    $missing[] = $require;
                }
            }
        }

        return $missing;
    }

    /**
     * findLockableThemes returns themes that are installed via composer
     */
    public function findLockableThemes(): array
    {
        $packages = ComposerManager::instance()->listAllPackages();

        $themes = [];

        $crossCheckPackage = function(string $composerCode, array $packages): bool {
            foreach ($packages as $package) {
                $name = $package['name'] ?? null;
                if ($name === $composerCode) {
                    return true;
                }
            }

            return false;
        };

        foreach ($this->getThemes() as $dirName => $theme) {
            $composerCode = $this->getComposerCode($dirName);
            if (!$composerCode || !$crossCheckPackage($composerCode, $packages)) {
                continue;
            }

            $themes[$composerCode] = $dirName;
        }

        return $themes;
    }

    /**
     * performLockOnTheme will add a lock file on a theme
     * Returns true if the process was successful
     */
    public function performLockOnTheme(string $dirName): bool
    {
        $themePath = themes_path($dirName);

        $lockFile = $themePath . '/.themelock';
        $noLockFile = $themePath . '/.themenolock';
        if (file_exists($lockFile) || file_exists($noLockFile)) {
            return false;
        }

        // Lock theme
        try {
            File::put($lockFile, 1);
        }
        catch (Exception $ex) {
            return false;
        }

        return true;
    }

    /**
     * performUnlockOnTheme will remove the lock file on a theme
     * Returns true if the process was successful
     */
    public function performUnlockOnTheme(string $dirName): bool
    {
        $themePath = themes_path($dirName);

        $lockFile = $themePath . '/.themelock';
        if (!file_exists($lockFile)) {
            return false;
        }

        // Unlock theme
        try {
            File::delete($lockFile);
        }
        catch (Exception $ex) {
            return false;
        }

        return true;
    }
}
