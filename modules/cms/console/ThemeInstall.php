<?php namespace Cms\Console;

use System;
use Cms\Classes\ThemeManager;
use System\Classes\UpdateManager;
use System\Helpers\Cache as CacheHelper;
use October\Rain\Composer\ComposerManager;
use Illuminate\Console\Command;
use Exception;

/**
 * Console command to install a new theme.
 *
 * This adds a new theme by requesting it from the October marketplace.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeInstall extends Command
{
    /**
     * @var string signature for the console command
     */
    protected $signature = 'theme:install
        {name : The name of the theme. Eg: AuthorName.ThemeName}
        {--oc : Package uses the oc- prefix.}
        {--f|from= : Provide a custom source.}
        {--w|want= : Provide a custom version.}
        {--no-lock : Do not lock the provided theme.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Install a theme from the October marketplace or custom source.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $this->line('Installing Theme...');

        $name = $this->argument('name');

        $this->assertCanInstallTheme();

        if ($src = $this->option('from')) {
            $this->info("Added Repo: {$src}");
            $composerCode = System::octoberToComposerCode(
                $name,
                'theme',
                (bool) $this->option('oc')
            );
            $composerVersion = '*';

            $this->addRepoFromSource($composerCode, $src);
        }
        else {
            $info = UpdateManager::instance()->requestThemeDetails($name);
            $composerCode = array_get($info, 'composer_code');
            $composerVersion = '^'.array_get($info, 'composer_version');
        }

        // Splice in version
        if ($requireVersion = $this->getWantOption()) {
            $composerVersion = $requireVersion;
        }

        // Composer require
        $this->comment("Executing: composer require {$composerCode} {$composerVersion}");
        $this->line('');

        $composer = ComposerManager::instance();
        $composer->setOutputCommand($this, $this->input);
        $composer->require([$composerCode => $composerVersion]);

        // Clear meta cache
        CacheHelper::instance()->clearMeta();

        // Lock theme
        if (!$this->option('no-lock')) {
            $this->performLockOnTheme();
        }

        // Check dependencies
        passthru('"'.PHP_BINARY.'" artisan plugin:check');

        $this->output->success("Theme '{$name}' installed");
    }

    /**
     * assertCanInstallTheme makes sure the theme isn't in use
     */
    protected function assertCanInstallTheme()
    {
        $name = strtolower($this->argument('name'));

        $parts = explode('.', $name);
        $themeFolder = $parts[1] ?? null;
        $themePath = themes_path($themeFolder);

        // Ensure a theme does not already exist
        if ($themeFolder && file_exists($themePath)) {
            throw new Exception("A theme already exists at '{$themeFolder}' please rename this folder and try again.");
        }
    }

    /**
     * performLockOnTheme locks the theme and creates a child theme
     */
    protected function performLockOnTheme()
    {
        $name = strtolower($this->argument('name'));

        // Legacy composer installers
        $parts = explode('.', $name);
        $themeFolder = $parts[1] ?? null;
        $themePath = $themeFolder ? themes_path($themeFolder) : null;

        // New composer installers
        if (!$themePath || !file_exists($themePath)) {
            $themeFolder = strtolower(str_replace('.', '-', $name));
        }

        if (!$themeFolder) {
            return;
        }

        // Lock and create child theme
        $manager = ThemeManager::instance();
        $manager->createChildTheme((string) $themeFolder);
        $manager->performLockOnTheme((string) $themeFolder);
    }

    /**
     * addRepoFromSource adds a plugin to composer's repositories
     */
    protected function addRepoFromSource($composerCode, $src)
    {
        if (file_exists(base_path($src))) {
            if (file_exists(base_path($src . '/.git'))) {
                $srcType = 'git';
            }
            else {
                $srcType = 'path';
            }
        }
        else {
            $srcType = 'git';
        }

        ComposerManager::instance()->addRepository($composerCode, $srcType, $src);
    }

    /**
     * removeRepoFromSource removes a plugin from composer's repo
     */
    protected function removeRepoFromSource($composerCode)
    {
        ComposerManager::instance()->removeRepository($composerCode);
    }

    /**
     * getWantOption adds the ^ character to a standard version number (1.0)
     */
    protected function getWantOption()
    {
        $want = $this->option('want');

        $parts = explode('.', $want);
        if (count($parts) === 2 && is_numeric($parts[0]) && is_numeric($parts[1])) {
            $want = '^'.$want;
        }

        return $want;
    }
}
