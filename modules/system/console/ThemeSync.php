<?php namespace System\Console;

use App;
use Config;
use Exception;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

/**
 * Console command to sync a theme between the DB and Filesystem layers.
 *
 * theme:sync name --paths=file/to/sync.md,other/file/to/sync.md --target=filesystem --force
 * 
 * - name defaults to the currently active theme
 * - --paths defaults to all paths within the theme, otherwise comma-separated list of paths relative to the theme directory
 * - --target defaults to "database", the source will whichever of filesystem vs database is not the target
 * - --force bypasses the confirmation request
 *
 * @package october\system
 * @author Luke Towers
 */
class ThemeSync extends Command
{
    use \Illuminate\Console\ConfirmableTrait;

    /**
     * The console command name.
     * @var string
     */
    protected $name = 'theme:sync';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Sync an existing theme between the DB and Filesystem layers';

    /**
     * Execute the console command.
     * @return void
     */
    public function handle()
    {
        // Check to see if the application even uses a database
        if (!App::hasDatabase()) {
            return $this->error("The application is not using a database.");
        }

        // Check to see if the DB layer is enabled
        $enableDbLayer = Config::get('cms.enableDatabaseLayer', false);
        if (is_null($enableDbLayer)) {
            $enableDbLayer = !Config::get('app.debug');
        }
        if (!$enableDbLayer) {
            return $this->error("cms.enableDatabaseLayer is not enabled, enable it first and try again.");
        }

        // Check to see if the provided theme exists
        $themeManager = ThemeManager::instance();
        $themeName = $this->argument('name') ?: Theme::getActiveThemeCode();
        $themeExists = Theme::exists($themeName);
        if (!$themeExists) {
            $themeName = strtolower(str_replace('.', '-', $themeName));
            $themeExists = Theme::exists($themeName);
        }
        if (!$themeExists) {
            return $this->error(sprintf('The theme %s does not exist.', $themeName));
        }

        // Get the target and source datasources
        $availableSources = ['filesystem', 'database'];
        $target = $this->option('target') ?: 'database';
        $source = 'filesystem';
        if ($target === 'filesystem') {
            $source = 'database';
        }
        if (!in_array($target, $availableSources)) {
            $this->error(sprintf("Provided --target of %s is invalid. Allowed: database, filesystem"), $target);
        }

        // Get the paths
        $paths = $this->option('paths') ?: null;
        if ($paths) {
            $paths = array_map('trim', explode(',', $paths));
        }

        // Confirm with the user
        if (!$this->confirmToProceed(sprintf('This will REPLACE the provided paths from "themes/%s" on the %s with content from the %s', $themeName, $target, $source), function () { return true; })) {
            return;
        }

        try {
            // TODO: Actually implement the functionality

            $this->info(sprintf('The theme %s has been synced from the %s to the %s.', $themeName, $source, $target));
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
            ['name', InputArgument::OPTIONAL, 'The name of the theme (directory name). Defaults to currently active theme.'],
        ];
    }

    /**
     * Get the console command options.
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['paths', null, InputOption::VALUE_REQUIRED, 'Comma-separated specific paths (relative to provided theme directory) to specificaly sync. Default is all paths'],
            ['target', null, InputOption::VALUE_REQUIRED, 'The target of the sync, the other will be used as the source. Defaults to "database", can be "filesystem"'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run.'],
        ];
    }
}
