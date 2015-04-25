<?php namespace System\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use System\Classes\UpdateManager;
use Cms\Classes\ThemeManager;
use File;

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
     * Create a new command instance.
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     * @return void
     */
    public function fire()
    {
        $argDirName = $this->argument('dirName');

        if ($argDirName && !preg_match('/^[a-z0-9\_\-]+$/i', $argDirName)) {
            return $this->error('Invalid destination directory name.');
        }

        $themeName = $this->argument('name');
        $updateManager = UpdateManager::instance();

        try {
            $themeDetails = $updateManager->requestThemeDetails($themeName);

            if (ThemeManager::instance()->isInstalled($themeDetails['code'])) {
                $this->error(sprintf('The theme %s is already installed.', $themeDetails['code']));
                return;
            }

            $this->info(sprintf(
                "Name: %s\nDescription: %s\nAuthor: %s\nURL: %s\n",
                $themeDetails['code'],
                $themeDetails['description'],
                $themeDetails['author'],
                $themeDetails['product_url']));

            if (!$this->confirm('Do you wish to continue? [Y|n]', true)) {
                return;
            }

            $this->info('Downloading theme...');
            $updateManager->downloadTheme($themeDetails['code'], $themeDetails['hash']);

            $this->info('Extracting theme...');
            $updateManager->extractTheme($themeDetails['code'], $themeDetails['hash']);

            $dirName = $this->themeCodeToDir($themeDetails['code']);
            if ($argDirName) {
                File::move(themes_path().'/'.$dirName, themes_path().'/'.$argDirName);
                $dirName = $argDirName;
            }

            $this->info(sprintf('The theme %s has been installed. (now %s)', $themeDetails['code'], $dirName));
        }
        catch (\October\Rain\Exception\ApplicationException $e) {
            $this->error($e->getMessage());
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

    /**
     * Get the console command options.
     * @return array
     */
    protected function getOptions()
    {
        return [];
    }
}
