<?php namespace Cms\Console;

use Cms\Classes\Theme;
use Illuminate\Console\Command;

/**
 * ThemeUse switches the active theme to another one, saved to the database.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeUse extends Command
{
    use \Illuminate\Console\ConfirmableTrait;

    /**
     * @var string signature of console command
     */
    protected $signature = 'theme:use
        {name : The directory name of the theme.}
        {--F|force : Force the operation to run.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Switch the active theme.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        if (!$this->confirmToProceed('Change the active theme?')) {
            return;
        }

        $newThemeName = $this->argument('name');
        $newTheme = Theme::load($newThemeName);

        if (!$newTheme->isValid()) {
            return $this->error(sprintf('The theme %s does not exist.', $newThemeName));
        }

        if ($newTheme->isActiveTheme()) {
            return $this->error(sprintf('%s is already the active theme.', $newTheme->getId()));
        }

        $from = Theme::getActiveThemeCode() ?: 'nothing';
        $this->info(sprintf('Switching theme from %s to %s', $from, $newTheme->getId()));

        Theme::setActiveTheme($newThemeName);
    }
}
