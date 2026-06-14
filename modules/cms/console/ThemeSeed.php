<?php namespace Cms\Console;

use Cms\Classes\Theme;
use Illuminate\Console\Command;
use Cms\Models\ThemeSeed as ThemeSeedModel;

/**
 * ThemeSeed imports blueprints and seed files from a theme
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeSeed extends Command
{
     /**
     * @var string signature of console command
     */
    protected $signature = 'theme:seed
        {name : The directory name of the theme.}
        {--root : Copy blueprints to root directory.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Seed the specified theme with blueprints, translations and data.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        $this->info('Seeding Theme...');

        $themeName = $this->argument('name');
        $theme = Theme::load($themeName);

        if (!$theme->isValid()) {
            return $this->error(sprintf('The theme %s does not exist.', $themeName));
        }

        $themeSeed = new ThemeSeedModel;
        $themeSeed->setNotesCommand($this);
        $themeSeed->seed($theme, [
            'useRoot' => $this->option('root', false)
        ]);
    }
}
