<?php namespace System\Console;

use App;
use Lang;
use File;
use Config;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use System\Classes\UpdateManager;
use System\Classes\CombineAssets;
use ApplicationException;
use System\Classes\FileManifest;
use System\Classes\SourceManifest;
use System\Models\Parameter;
use ZipArchive;

/**
 * Console command for other utility commands.
 *
 * This provides functionality that doesn't quite deserve its own dedicated
 * console class. It is used mostly developer tools and maintenance tasks.
 *
 * Currently supported commands:
 *
 * - purge thumbs: Deletes all thumbnail files in the uploads directory.
 * - git pull: Perform "git pull" on all plugins and themes.
 * - compile assets: Compile registered Language, LESS and JS files.
 * - compile js: Compile registered JS files only.
 * - compile less: Compile registered LESS files only.
 * - compile scss: Compile registered SCSS files only.
 * - compile lang: Compile registered Language files only.
 * - set build: Pull the latest stable build number from the update gateway and set it as the current build number.
 * - set project --projectId=<id>: Set the projectId for this october instance.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberUtil extends Command
{

    use \Illuminate\Console\ConfirmableTrait;

    /**
     * The console command name.
     */
    protected $name = 'october:util';

    /**
     * The console command description.
     */
    protected $description = 'Utility commands for October';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $command = implode(' ', (array) $this->argument('name'));
        $method = 'util'.studly_case($command);

        $methods = preg_grep('/^util/', get_class_methods(get_called_class()));
        $list = array_map(function ($item) {
            return "october:".snake_case($item, " ");
        }, $methods);

        if (!$this->argument('name')) {
            $message = 'There are no commands defined in the "util" namespace.';
            if (1 == count($list)) {
                $message .= "\n\nDid you mean this?\n    ";
            } else {
                $message .= "\n\nDid you mean one of these?\n    ";
            }

            $message .= implode("\n    ", $list);
            throw new \InvalidArgumentException($message);
        }

        if (!method_exists($this, $method)) {
            $this->error(sprintf('Utility command "%s" does not exist!', $command));
            return;
        }

        $this->$method();
    }

    /**
     * Get the console command arguments.
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['name', InputArgument::IS_ARRAY, 'The utility command to perform, For more info "http://octobercms.com/docs/console/commands#october-util-command".'],
        ];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production.'],
            ['debug', null, InputOption::VALUE_NONE, 'Run the operation in debug / development mode.'],
            ['projectId', null, InputOption::VALUE_REQUIRED, 'Specify a projectId for set project'],
            ['manifest', null, InputOption::VALUE_REQUIRED, 'Specify a target manifest file for the "build manifest" utility'],
            ['sourceManifest', null, InputOption::VALUE_REQUIRED, 'Specify a source manifest file for the "build manifest" utility'],
            ['minBuild', null, InputOption::VALUE_REQUIRED, 'Specify a minimum build for the "build manifest" utility'],
            ['maxBuild', null, InputOption::VALUE_REQUIRED, 'Specify a maximum build for the "build manifest" utility'],
        ];
    }

    //
    // Utilties
    //

    protected function utilSetBuild()
    {
        /*
         * Skip setting the build number if no database is detected to set it within
         */
        if (!App::hasDatabase()) {
            $this->comment('No database detected - skipping setting the build number.');
            return;
        }

        $this->comment('*** Detecting October CMS build...');

        $build = UpdateManager::instance()->setBuildNumberManually();

        if (is_null($build)) {
            $this->error('Unable to detect your build of October CMS.');
            exit(0);
        }
        if ($build['modified']) {
            $this->info('*** Detected a modified version of October CMS build ' . $build['build']);
        } else {
            $this->info('*** Detected October CMS build ' . $build['build']);
        }
    }

    protected function utilBuildManifest()
    {
        $minBuild = $this->option('minBuild') ?? 420;
        $maxBuild = $this->option('maxBuild') ?? 9999;

        $targetFile = $this->option('manifest');
        if (empty($targetFile)) {
            throw new ApplicationException(
                'A target must be specified for the generated manifest file. Use "--manifest=[file]" to specify target.'
            );
        }

        if ($minBuild > $maxBuild) {
            throw new ApplicationException(
                'Minimum build specified is larger than the maximum build specified.'
            );
        }

        if (!empty($this->option('sourceManifest'))) {
            $manifest = new SourceManifest($this->option('sourceManifest'));
        } else {
            $manifest = new SourceManifest('', null);
        }

        // Create temporary directory to hold builds
        $buildDir = storage_path('temp/builds/');
        if (!is_dir($buildDir)) {
            mkdir($buildDir, 0775, true);
        }

        for ($build = $minBuild; $build <= $maxBuild; ++$build) {
            // Download version from GitHub
            $this->comment('Processing build ' . $build);
            $this->line('  - Downloading...');

            if (file_exists($buildDir . 'build-' . $build . '.zip') || is_dir($buildDir . $build . '/')) {
                $this->info('  - Already downloaded.');
            } else {
                $zipFile = @file_get_contents('https://github.com/octobercms/october/archive/v1.0.' . $build . '.zip');
                if (empty($zipFile)) {
                    $this->error('  - Not found.');
                    break;
                }

                file_put_contents($buildDir . 'build-' . $build . '.zip', $zipFile);

                $this->info('  - Downloaded.');
            }

            // Extract version
            $this->line('  - Extracting...');
            if (is_dir($buildDir . $build . '/')) {
                $this->info('  - Already extracted.');
            } else {
                $zip = new ZipArchive;
                if ($zip->open($buildDir . 'build-' . $build . '.zip')) {
                    $toExtract = [];
                    $paths = [
                        'october-1.0.' . $build . '/modules/backend/',
                        'october-1.0.' . $build . '/modules/cms/',
                        'october-1.0.' . $build . '/modules/system/',
                    ];

                    // Only get necessary files from the modules directory
                    for ($i = 0; $i < $zip->numFiles; ++$i) {
                        $filename = $zip->statIndex($i)['name'];

                        foreach ($paths as $path) {
                            if (strpos($filename, $path) === 0) {
                                $toExtract[] = $filename;
                                break;
                            }
                        }
                    }

                    if (!count($toExtract)) {
                        $this->error('  - Unable to get valid files for extraction. Cancelled.');
                        exit(1);
                    }

                    $zip->extractTo($buildDir . $build . '/', $toExtract);
                    $zip->close();

                    // Remove ZIP file
                    unlink($buildDir . 'build-' . $build . '.zip');
                } else {
                    $this->error('  - Unable to extract zip file. Cancelled.');
                    exit(1);
                }

                $this->info('  - Extracted.');
            }

            // Determine previous build
            $manifestBuilds = $manifest->getBuilds();
            $previous = null;
            if (count($manifestBuilds)) {
                if (isset($manifestBuilds[$build - 1])) {
                    $previous = $build - 1;
                }
            }

            // Add build to manifest
            $this->line('  - Adding to manifest...');
            $buildManifest = new FileManifest($buildDir . $build . '/october-1.0.' . $build);
            $manifest->addBuild($build, $buildManifest, $previous);
            $this->info('  - Added.');
        }

        // Generate manifest
        $this->comment('Generating manifest...');
        file_put_contents($targetFile, $manifest->generate());

        $this->comment('Completed.');
    }

    protected function utilCompileJs()
    {
        $this->utilCompileAssets('js');
    }

    protected function utilCompileLess()
    {
        $this->utilCompileAssets('less');
    }

    protected function utilCompileScss()
    {
        $this->utilCompileAssets('scss');
    }

    protected function utilCompileAssets($type = null)
    {
        $this->comment('Compiling registered asset bundles...');

        Config::set('cms.enableAssetMinify', !$this->option('debug'));
        $combiner = CombineAssets::instance();
        $bundles = $combiner->getBundles($type);

        if (!$bundles) {
            $this->comment('Nothing to compile!');
            return;
        }

        if ($type) {
            $bundles = [$bundles];
        }

        foreach ($bundles as $bundleType) {
            foreach ($bundleType as $destination => $assets) {
                $destination = File::symbolizePath($destination);
                $publicDest = File::localToPublic(realpath(dirname($destination))) . '/' . basename($destination);

                $combiner->combineToFile($assets, $destination);
                $shortAssets = implode(', ', array_map('basename', $assets));
                $this->comment($shortAssets);
                $this->comment(sprintf(' -> %s', $publicDest));
            }
        }

        if ($type === null) {
            $this->utilCompileLang();
        }
    }

    protected function utilCompileLang()
    {
        if (!$locales = Lang::get('system::lang.locale')) {
            return;
        }

        $this->comment('Compiling client-side language files...');

        $locales = array_keys($locales);
        $stub = base_path() . '/modules/system/assets/js/lang/lang.stub';

        foreach ($locales as $locale) {
            /*
             * Generate messages
             */
            $fallbackPath = base_path() . '/modules/system/lang/en/client.php';
            $srcPath = base_path() . '/modules/system/lang/'.$locale.'/client.php';

            $messages = require $fallbackPath;
            if (File::isFile($srcPath) && $fallbackPath != $srcPath) {
                $messages = array_replace_recursive($messages, require $srcPath);
            }

            /*
             * Load possible replacements from /lang
             */
            $overridePath = base_path() . '/lang/'.$locale.'/system/client.php';
            if (File::isFile($overridePath)) {
                $messages = array_replace_recursive($messages, require $overridePath);
            }

            /*
             * Compile from stub and save file
             */
            $destPath = base_path() . '/modules/system/assets/js/lang/lang.'.$locale.'.js';

            $contents = str_replace(
                ['{{locale}}', '{{messages}}'],
                [$locale, json_encode($messages)],
                File::get($stub)
            );

            /*
             * Include the moment localization data
             */
            $momentPath = base_path() . '/modules/system/assets/ui/vendor/moment/locale/'.$locale.'.js';
            if (File::exists($momentPath)) {
                $contents .= PHP_EOL.PHP_EOL.File::get($momentPath).PHP_EOL;
            }

            File::put($destPath, $contents);

            /*
             * Output notes
             */
            $publicDest = File::localToPublic(realpath(dirname($destPath))) . '/' . basename($destPath);

            $this->comment($locale.'/'.basename($srcPath));
            $this->comment(sprintf(' -> %s', $publicDest));
        }
    }

    protected function utilPurgeThumbs()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE all thumbs in the uploads directory.')) {
            return;
        }

        $totalCount = 0;
        $uploadsPath = Config::get('filesystems.disks.local.root', storage_path('app'));
        $uploadsPath .= '/uploads';

        /*
         * Recursive function to scan the directory for files beginning
         * with "thumb_" and repeat itself on directories.
         */
        $purgeFunc = function ($targetDir) use (&$purgeFunc, &$totalCount) {
            if ($files = File::glob($targetDir.'/thumb_*')) {
                foreach ($files as $file) {
                    $this->info('Purged: '. basename($file));
                    $totalCount++;
                    @unlink($file);
                }
            }

            if ($dirs = File::directories($targetDir)) {
                foreach ($dirs as $dir) {
                    $purgeFunc($dir);
                }
            }
        };

        $purgeFunc($uploadsPath);

        if ($totalCount > 0) {
            $this->comment(sprintf('Successfully deleted %s thumbs', $totalCount));
        }
        else {
            $this->comment('No thumbs found to delete');
        }
    }

    protected function utilPurgeUploads()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE files in the uploads directory that do not exist in the "system_files" table.')) {
            return;
        }

        // @todo
    }

    protected function utilPurgeOrphans()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE files in "system_files" that do not belong to any other model.')) {
            return;
        }

        // @todo
    }

    /**
     * This command requires the git binary to be installed.
     */
    protected function utilGitPull()
    {
        foreach (File::directories(plugins_path()) as $authorDir) {
            foreach (File::directories($authorDir) as $pluginDir) {
                if (!File::exists($pluginDir.'/.git')) {
                    continue;
                }

                $exec = 'cd ' . $pluginDir . ' && ';
                $exec .= 'git pull 2>&1';
                echo 'Updating plugin: '. basename(dirname($pluginDir)) .'.'. basename($pluginDir) . PHP_EOL;
                echo shell_exec($exec);
            }
        }

        foreach (File::directories(themes_path()) as $themeDir) {
            if (!File::exists($themeDir.'/.git')) {
                continue;
            }

            $exec = 'cd ' . $themeDir . ' && ';
            $exec .= 'git pull 2>&1';
            echo 'Updating theme: '. basename($themeDir) . PHP_EOL;
            echo shell_exec($exec);
        }
    }

    protected function utilSetProject()
    {
        $projectId = $this->option('projectId');

        if (empty($projectId)) {
            $this->error("No projectId defined, use --projectId=<id> to set a projectId");
            return;
        }

        $manager = UpdateManager::instance();
        $result = $manager->requestProjectDetails($projectId);

        Parameter::set([
            'system::project.id'    => $projectId,
            'system::project.name'  => $result['name'],
            'system::project.owner' => $result['owner'],
        ]);
    }
}
