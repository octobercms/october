<?php namespace System\Console;

use File;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use System\Classes\UpdateManager;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use Exception;

/**
 * Console command to install a new theme.
 *
 * This adds a new theme by requesting it from the October marketplace.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeInstall extends Command
{
    /**
     * The console command name.
     * @var string
     */
    protected $name = 'theme:install';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Install a theme from the October marketplace.';

    /**
     * Execute the console command.
     * @return void
     */
    public function handle()
    {
        $themeName = $this->argument('name');
        $argDirName = $this->argument('dirName');

        if ($argDirName && $themeName == $argDirName) {
            $argDirName = null;
        }

        if ($argDirName) {
            if (!preg_match('/^[a-z0-9\_\-]+$/i', $argDirName)) {
                return $this->error('Invalid destination directory name.');
            }

            if (Theme::exists($argDirName)) {
                return $this->error(sprintf('A theme named %s already exists.', $argDirName));
            }
        }

        try {
            $themeManager = ThemeManager::instance();
            $updateManager = UpdateManager::instance();

            $themeDetails = $updateManager->requestThemeDetails($themeName);

            if ($themeManager->isInstalled($themeDetails['code'])) {
                return $this->error(sprintf('The theme %s is already installed.', $themeDetails['code']));
            }

            if (Theme::exists($themeDetails['code'])) {
                return $this->error(sprintf('A theme named %s already exists.', $themeDetails['code']));
            }

            $fields = ['Name', 'Description', 'Author', 'URL', ''];

            $this->info(sprintf(
                implode(': %s'.PHP_EOL, $fields),
                $themeDetails['code'],
                $themeDetails['description'],
                $themeDetails['author'],
                $themeDetails['product_url']
            ));

            if (!$this->confirm('Do you wish to continue? [Y|n]', true)) {
                return;
            }

            $this->info('Downloading theme...');
            $updateManager->downloadTheme($themeDetails['code'], $themeDetails['hash']);

            $this->info('Extracting theme...');
            $updateManager->extractTheme($themeDetails['code'], $themeDetails['hash']);

            $dirName = $this->themeCodeToDir($themeDetails['code']);

            if ($argDirName) {
                /*
                 * Move downloaded theme to a new directory.
                 * Basically we're renaming it.
                 */
                File::move(themes_path().'/'.$dirName, themes_path().'/'.$argDirName);

                /*
                 * Let's make sure to unflag the 'old' theme as
                 * installed so it can be re-installed later.
                 */
                $themeManager->setUninstalled($themeDetails['code']);

                $dirName = $argDirName;
            }

            $this->info(sprintf('The theme %s has been installed. (now %s)', $themeDetails['code'], $dirName));
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
        }
    }

    /**
     * Theme code to dir.
     *
     * @param string $themeCode
     * @return string
     */
    protected function themeCodeToDir($themeCode)
    {
        return strtolower(str_replace('.', '-', $themeCode));
    }

    /**
     * Get the console command arguments.
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['name', InputArgument::REQUIRED, 'The name of the theme. Eg: AuthorName.ThemeName'],
            ['dirName', InputArgument::OPTIONAL, 'Destination directory name for the theme installation.'],
        ];
    }
}
