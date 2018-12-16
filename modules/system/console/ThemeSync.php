<?php namespace System\Console;

use App;
use Event;
use Exception;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;

use Cms\Classes\Meta;
use Cms\Classes\Page;
use Cms\Classes\Layout;
use Cms\Classes\Content;
use Cms\Classes\Partial;

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
     * @var \October\Rain\Datasource\DatasourceInterface The theme's AutoDatasource instance
     */
    protected $datasource;

    /**
     * @var string The datasource key that the sync is targeting
     */
    protected $target;

    /**
     * @var string The datasource key that the sync is sourcing from
     */
    protected $source;

    /**
     * @var array Models
     */
    protected $halyconModels = [];

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
        if (!Theme::databaseLayerEnabled()) {
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
        $theme = Theme::load($themeName);

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
        $this->source = $source;
        $this->target = $target;

        // Get the paths
        // @TODO: Use the model classes to call listInTheme instead to get all handled paths instead of the other way round
        // @TODO: Will probably have to interact directly with the datasources to do the syncing, not sure how much AutoDatasource will be useful here
        $paths = $this->option('paths') ?: null;
        if ($paths) {
            $paths = array_map('trim', explode(',', $paths));
        } else {
            $paths = $theme->getDatasource()->getSourcePaths($source);

            // Get the Halcyon model classes to use when filtering the paths to be synced
            $validModels = [];
            $modelClasses = [
                Meta::class,
                Page::class,
                Layout::class,
                Content::class,
                Partial::class,
            ];
            /**
             * @event system.console.theme.sync.getModelClasses
             * Get the Halcyon model classes to use when filtering the paths to be synced
             *
             * Example usage:
             *
             *     Event::listen('system.console.theme.sync.getModelClasses', function () {
             *         return [
             *             Meta::class,
             *             Page::class,
             *             Layout::class,
             *             Content::class,
             *             Partial::class,
             *         ];
             *     });
             *
             */
            $results = Event::fire('system.console.theme.sync.getAvailableModelClasses');
            foreach ($results as $result) {
                $modelClasses += $result;
            }
            foreach ($modelClasses as $class) {
                $validModels[] = new $class;
            }

            foreach ($paths as $path => $exists) {
                foreach ($validModels as $model) {
                    if (starts_with($path, $model->getObjectTypeDirName() . '/') &&
                        in_array(pathinfo($path, PATHINFO_EXTENSION), $model->getAllowedExtensions())
                    ) {
                        // Skip to the next path
                        continue 2;
                    }
                }

                // If we've made it here, this path doesn't get to proceed
                unset($paths[$path]);
            }
            unset($validModels);
        }

        // Confirm with the user
        if (!$this->confirmToProceed(sprintf('This will OVERWRITE the %s provided paths in "themes/%s" on the %s with content from the %s', count($paths), $themeName, $target, $source), function () { return true; })) {
            return;
        }

        try {
            $this->info('Syncing files, please wait...');
            $progress = $this->output->createProgressBar(count($paths));

            $this->datasource = $theme->getDatasource();


            foreach ($paths as $path) {
                // $this->datasource->pushToSource($this->getModelForPath($path), $target);
                $progress->advance();
            }

            $progress->finish();
            $this->info('');
            $this->info(sprintf('The theme %s has been successfully synced from the %s to the %s.', $themeName, $source, $target));
        }
        catch (Exception $ex) {
            $this->error($ex->getMessage());
        }
    }


    /**
     * Get the correct Halcyon model for the provided path from the source datasource
     *
     * @param string $path
     * @return void
     */
    protected function getModelForPath(string $path)
    {
        $originalSource = $this->datasource->activeDatasourceKey;
        $this->datasource->activeDatasourceKey = $this->source;

        // $model::load($this->theme, $fileName);

        $this->datasource->activeDatasourceKey = $originalSource;

        // return $model;
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
