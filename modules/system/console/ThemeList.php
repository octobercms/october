<?php namespace System\Console;

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use System\Classes\UpdateManager;

class ThemeList extends Command
{
    /**
     * The console command name.
     */
    protected $name = 'theme:list';

    /**
     * The console command description.
     */
    protected $description = 'List available themes.';

    /**
     * Create a new command instance.
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function fire()
    {
        $loadedThemes = Theme::all();
        for ($i = 0, $c = count($loadedThemes); $i < $c; $i++) {
            $ln = $loadedThemes[$i]->isActiveTheme() ? '[*] ' : '[-] ';
            $this->info($ln.$loadedThemes[$i]->getId());
        }

        if ($this->option('include-marketplace')) {

            // @todo List everything in the marketplace - not just popular.

            $popularThemes = UpdateManager::instance()->requestPopularProducts('theme');
            $themeManager = ThemeManager::instance();

            for ($i = 0, $c = count($popularThemes); $i < $c; $i++) {
                if (!$themeManager->isInstalled($popularThemes[$i]['code'])) {
                    $this->info('[ ] '.$popularThemes[$i]['code']);
                }
            }
        }

        $this->info("\n[*] Active    [-] Installed    [ ] Not installed");
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments()
    {
        return [];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [
            ['include-marketplace', 'm', InputOption::VALUE_NONE, 'Whether or not to include downloadable themes from the October marketplace.']
        ];
    }
}
