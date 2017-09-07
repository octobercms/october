<?php namespace System\Console;

use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Illuminate\Console\Command;
use Exception;

/**
 * Console command to remove a theme.
 *
 * This completely deletes an existing theme, including all files and directories.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeRemove extends Command
{

    use \Illuminate\Console\ConfirmableTrait;

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
    public function handle()
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

        if (!$this->confirmToProceed(sprintf('This will DELETE theme "%s" from the filesystem and database.', $themeName))) {
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
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run.'],
        ];
    }
}
