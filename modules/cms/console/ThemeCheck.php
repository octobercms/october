<?php namespace Cms\Console;

use Cms\Classes\ThemeManager;
use Illuminate\Console\Command;

/**
 * ThemeCheck checks for themes installed with composer and locks them
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeCheck extends Command
{
    /**
     * @var string signature for the console command
     */
    protected $signature = 'theme:check';

    /**
     * @var string description of the console command
     */
    protected $description = 'Checks for themes installed with composer and locks them.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $this->line('Checking Themes...');

        $this->lockReadonlyThemes();
    }

    /**
     * lockReadonlyThemes
     */
    protected function lockReadonlyThemes()
    {
        $manager = ThemeManager::instance();
        $lockable = $manager->findLockableThemes();

        foreach ($lockable as $dirName) {
            if ($manager->createChildTheme($dirName)) {
                $this->output->success("Created '{$dirName}' child theme");
            }

            if ($manager->performLockOnTheme($dirName)) {
                $this->output->success("Theme '{$dirName}' locked");
            }
        }

        $this->info('All themes checked');
    }
}
