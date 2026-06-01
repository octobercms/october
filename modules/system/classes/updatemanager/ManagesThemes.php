<?php namespace System\Classes\UpdateManager;

use Lang;
use System;
use System as SystemHelper;
use Cms\Models\ThemeSeed;
use Cms\Classes\Theme as CmsTheme;
use October\Rain\Composer\ComposerManager;
use October\Rain\Filesystem\Zip;
use ApplicationException;

/**
 * ManagesThemes
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ManagesThemes
{
    /**
     * installTheme using composer
     */
    public function installTheme($name)
    {
        [$package, $version] = $this->findThemeComposerCode($name);
        if (!$package) {
            throw new ApplicationException("Package [$name] not found");
        }

        $composer = ComposerManager::instance();
        $composer->require([$package => $this->getComposerVersionConstraint($version)]);

        // Lock theme
        $themeFolder = strtolower(str_replace('.', '-', System::composerToOctoberCode($package)));
        $this->themeManager->createChildTheme($themeFolder);
        $this->themeManager->performLockOnTheme($themeFolder);
    }

    /**
     * findThemeComposerCode locates a composer code for a plugin
     */
    protected function findThemeComposerCode(string $code): array
    {
        // Local
        if ($this->themeManager->findByIdentifier($code)) {
            $composerCode = $this->themeManager->getComposerCode($code);
            $composerVersion = $this->themeManager->getLatestVersion($code);
        }
        // Remote
        else {
            $details = $this->requestThemeDetails($code);
            $composerCode = $details['composer_code'] ?? '';
            $composerVersion = $details['composer_version'] ?? '';
        }

        return [$composerCode, $composerVersion];
    }

    /**
     * uninstallTheme attempts to remove the theme using composer before
     * deleting from the filesystem
     */
    public function uninstallTheme($name)
    {
        $themeExists = CmsTheme::exists($name);
        if (!$themeExists) {
            $name = (string) $this->themeManager->findDirectoryName($name);
        }

        if (!CmsTheme::exists($name)) {
            throw new ApplicationException("Theme [$name] not found");
        }

        // Remove via composer
        $composer = ComposerManager::instance();
        $composerCode = $this->themeManager->getComposerCode($name);

        if ($composerCode && $composer->hasPackage($composerCode)) {
            $composer->remove([$composerCode]);
        }

        $this->themeManager->deleteTheme($name);
    }

    /**
     * requestThemeDetails looks up a theme from the update server
     */
    public function requestThemeDetails(string $name): array
    {
        return $this->requestServerData('package/detail', ['name' => $name, 'type' => 'theme']);
    }

    /**
     * requestThemeContent looks up content for a theme from the update server
     */
    public function requestThemeContent(string $name): array
    {
        return $this->requestServerData('package/content', ['name' => $name, 'type' => 'theme']);
    }

    /**
     * downloadTheme downloads a theme from the update server.
     * @param string $name
     * @param string $hash
     */
    public function downloadTheme($name)
    {
        $fileCode = $name . md5($name);

        $this->requestServerFile('package/download', $fileCode, [
            'type' => 'theme',
            'name' => $name,
            'version' => SystemHelper::VERSION
        ]);
    }

    /**
     * extractTheme extracts a theme after it has been downloaded.
     */
    public function extractTheme($name)
    {
        $fileCode = $name . md5($name);
        $filePath = $this->getFilePath($fileCode);
        $innerPath = str_replace('.', '-', strtolower($name));

        if (!Zip::extract($filePath, themes_path($innerPath))) {
            throw new ApplicationException(Lang::get('system::lang.zip.extract_failed', ['file' => $filePath]));
        }

        @unlink($filePath);
    }

    /**
     * seedTheme seeds a theme blueprints, data and language files
     */
    public function seedTheme(string $name)
    {
        $themeName = str_replace('.', '-', strtolower($name));
        if (!CmsTheme::exists($themeName)) {
            throw new ApplicationException("Theme [$name] not found");
        }

        $theme = CmsTheme::load($themeName);
        $model = new ThemeSeed;

        $model->seed($theme);
    }
}
