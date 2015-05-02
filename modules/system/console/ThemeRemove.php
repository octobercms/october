<?php namespace System\Console;

use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputArgument;
use Exception;

class ThemeRemove extends Command
{
    /**
     * The console command name.
     * @var string
     */
    protected $name = 'theme:remove';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Delete an existing theme.';

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
        $themeManager = ThemeManager::instance();
        $themeName = $this->argument('name');
        $themeExists = Theme::exists($themeName);

        if (!$themeExists) {
            $themeName = strtolower(str_replace('.', '-', $themeName));
            $themeExists = Theme::exists($themeName);
        }

        if (!$themeExists) {
            return $this->error(sprintf('The theme %s does not exist.', $themeName));
        }

        if (!$this->confirm(sprintf('Do you really wish to delete the theme %s? YOU CAN NOT UNDO THIS! [y|N]', $themeName), false)) {
            return;
        }

        try {
            $themeManager->deleteTheme($themeName);

            $this->info(sprintf('The theme %s has been deleted.', $themeName));
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
        }
    }

    /**
     * Get the console command arguments.
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['name', InputArgument::REQUIRED, 'The name of the theme. (directory name)'],
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
