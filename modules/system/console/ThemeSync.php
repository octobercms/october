<?php namespace System\Console;

use App;
use Event;
use Exception;
use Cms\Classes\Theme;

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
 * - --target defaults to "filesystem", the source will whichever of filesystem vs database is not the target
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
            return $this->error("cms.databaseTemplates is not enabled, enable it first and try again.");
        }

        // Check to see if the provided theme exists
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
        $target = $this->option('target') ?: 'filesystem';
        $source = ($target === 'filesystem') ? 'database' : 'filesystem';

        if (!in_array($target, $availableSources)) {
            return $this->error(sprintf("Provided --target of %s is invalid. Allowed: filesystem, database", $target));
        }

        $this->source = $source;
        $this->target = $target;

        // Get the theme paths, taking into account if the user has specified paths
        $userPaths = $this->option('paths') ?: null;
        $themePaths = array_keys($theme->getDatasource()->getSourcePaths($source));

        if (!isset($userPaths)) {
            $paths = $themePaths;
        } else {
            $paths = [];
            $userPaths = array_map('trim', explode(',', $userPaths));

            foreach ($userPaths as $userPath) {
                foreach ($themePaths as $themePath) {
                    $pregMatch = '/^' . str_replace('/', '\/', $userPath) . '/i';

                    if ($userPath === $themePath || preg_match($pregMatch, $themePath)) {
                        $paths[] = $themePath;
                    }
                }
            }
        }

        // Determine valid paths based on the models made available for syncing
        $validPaths = [];

        /**
         * @event system.console.theme.sync.getAvailableModelClasses
         * Defines the Halcyon models to be made available to the `theme:sync` tool.
         *
         * Example usage:
         *
         *     Event::listen('system.console.theme.sync.getAvailableModelClasses', function () {
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
        $eventResults = Event::fire('system.console.theme.sync.getAvailableModelClasses');
        $validModels = [];

        foreach ($eventResults as $result) {
            if (!is_array($result)) {
                continue;
            }

            foreach ($result as $modelClass) {
                $modelObj = new $modelClass;

                if ($modelObj instanceof \October\Rain\Halcyon\Model) {
                    $validModels[] = $modelObj;
                }
            }
        }

        // Check each path and map it to a corresponding model
        foreach ($paths as $path) {
            foreach ($validModels as $model) {
                if (
                    starts_with($path, $model->getObjectTypeDirName() . '/')
                    && in_array(pathinfo($path, PATHINFO_EXTENSION), $model->getAllowedExtensions())
                ) {
                    $validPaths[$path] = get_class($model);

                    // Skip to the next path
                    continue 2;
                }
            }
        }

        if (count($validPaths) === 0) {
            return $this->error(sprintf('No applicable paths found for %s.', $source));
        }

        // Confirm with the user
        if (!$this->confirmToProceed(sprintf('This will OVERWRITE the %s provided paths in "themes/%s" on the %s with content from the %s', count($validPaths), $themeName, $target, $source), true)) {
            return;
        }

        try {
            $this->info('Syncing files, please wait...');
            $progress = $this->output->createProgressBar(count($validPaths));

            $this->datasource = $theme->getDatasource();

            foreach ($validPaths as $path => $model) {
                $entity = $this->getModelForPath($path, $model, $theme);
                if (!isset($entity)) {
                    continue;
                }

                $this->datasource->pushToSource($entity, $target);
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
     * Get the correct Halcyon model for the provided path from the source datasource and load the requested path data.
     *
     * @param string $path
     * @param string $model
     * @param \Cms\Classes\Theme $theme
     * @return \October\Rain\Halcyon\Model
     */
    protected function getModelForPath($path, $modelClass, $theme)
    {
        return $this->datasource->usingSource($this->source, function () use ($path, $modelClass, $theme) {
            $modelObj = new $modelClass;

            $entity = $modelClass::load(
                $theme,
                str_replace($modelObj->getObjectTypeDirName() . '/', '', $path)
            );

            if (!isset($entity)) {
                return null;
            }

            return $entity;
        });

        return $entity;
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
            ['paths', null, InputOption::VALUE_REQUIRED, 'Comma-separated specific paths (relative to provided theme directory) to specificaly sync. Default is all paths. You may use regular expressions.'],
            ['target', null, InputOption::VALUE_REQUIRED, 'The target of the sync, the other will be used as the source. Defaults to "filesystem", can be "database"'],
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run.'],
        ];
    }
}
