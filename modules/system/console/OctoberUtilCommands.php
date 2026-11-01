<?php namespace System\Console;

use App;
use Lang;
use File;
use Config;
use System;
use Storage;
use Cms\Models\MaintenanceSetting;
use System\Classes\CombineAssets;
use System\Models\File as FileModel;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\LazyCollection;

/**
 * OctoberUtilCommands is a dedicated class for utility commands
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait OctoberUtilCommands
{
    /**
     * utilSetBuild
     */
    protected function utilSetBuild()
    {
        // Cannot set without a database.
        if (!System::hasDatabase()) {
            return;
        }

        $seeder = App::make(\System\Database\Seeds\SeedSetBuildNumber::class);

        $seeder->setCommand($this);

        $seeder->run($this->option('value'));
    }

    /**
     * utilCompileJs
     */
    protected function utilCompileJs()
    {
        $this->utilCompileAssets('js');
    }

    /**
     * utilCompileLess
     */
    protected function utilCompileLess()
    {
        $this->utilCompileAssets('less');
    }

    /**
     * utilCompileScss
     */
    protected function utilCompileScss()
    {
        $this->utilCompileAssets('scss');
    }

    /**
     * utilCompileAssets
     */
    protected function utilCompileAssets($type = null)
    {
        $this->comment('Compiling registered asset bundles...');

        Config::set('cms.enable_asset_minify', !$this->option('debug'));
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

    /**
     * utilCompileLang
     */
    protected function utilCompileLang()
    {
        if (!$locales = Lang::get('system::lang.locale')) {
            return;
        }

        $this->comment('Compiling client-side language files...');

        $locales = array_keys($locales);
        $stub = base_path('modules/system/assets/js/lang/lang.stub');

        foreach ($locales as $locale) {
            // Reset messages so translations do not leak between locales
            $messages = [];

            // Generate messages
            foreach (System::listModules() as $module) {
                $module = strtolower($module);

                // Process code-based client translations (client.php)
                $fallbackPath = base_path("modules/{$module}/lang/en/client.php");
                $srcPath = base_path("modules/{$module}/lang/{$locale}/client.php");
                if (file_exists($fallbackPath)) {
                    $messages = array_replace_recursive($messages, require $fallbackPath);
                    if (file_exists($srcPath) && $fallbackPath != $srcPath) {
                        $messages = array_replace_recursive($messages, require $srcPath);
                    }
                }

                // Process English-based client exports (client-export.php)
                $exportPath = base_path("modules/{$module}/lang/en/client-export.php");
                if (file_exists($exportPath)) {
                    $exportStrings = require $exportPath;
                    $jsonPath = base_path("modules/{$module}/lang/{$locale}.json");
                    $jsonTranslations = [];
                    if (file_exists($jsonPath)) {
                        $jsonTranslations = json_decode(file_get_contents($jsonPath), true) ?: [];
                    }

                    foreach ($exportStrings as $englishString) {
                        $messages[$englishString] = $jsonTranslations[$englishString] ?? $englishString;
                    }
                }
            }

            // Compile from stub and save file
            $destPath = base_path('modules/system/assets/js/lang/lang.'.$locale.'.js');

            $contents = str_replace(
                ['{{locale}}', '{{messages}}'],
                [$locale, json_encode($messages, JSON_UNESCAPED_SLASHES|JSON_PRETTY_PRINT)],
                File::get($stub)
            ).PHP_EOL;

            // Include the moment localization data
            $momentPath = base_path('modules/system/assets/vendor/moment/locale/'.$locale.'.js');
            if (file_exists($momentPath)) {
                $contents .= PHP_EOL.File::get($momentPath).PHP_EOL;
            }

            // Include the select localization data
            $selectPath = base_path('modules/system/assets/vendor/select2/js/i18n/'.$locale.'.js');
            if (file_exists($selectPath)) {
                $contents .= PHP_EOL.File::get($selectPath).PHP_EOL;
            }

            // Include the froala localization data
            $froalaPath = base_path('modules/system/assets/vendor/froala/languages/'.str_replace('-', '_', strtolower($locale)).'.js');
            if (file_exists($froalaPath)) {
                $contents .= PHP_EOL.File::get($froalaPath).PHP_EOL;
            }

            File::put($destPath, $contents);

            // Output notes
            $publicDest = File::localToPublic(realpath(dirname($destPath))) . '/' . basename($destPath);

            $this->comment($locale.'/'.basename($destPath));
            $this->comment(sprintf(' -> %s', $publicDest));
        }
    }

    /**
     * utilPurgeResizer deletes all resizer files in the resources directory
     */
    protected function utilPurgeResizer()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE all thumbs in the resizer directory.')) {
            return;
        }

        $path = base_path('storage/app/resources/resize');

        if (File::isDirectory($path)) {
            File::cleanDirectory($path);
        }
    }

    /**
     * utilPurgeThumbs deletes all thumbnail files in the uploads directory
     */
    protected function utilPurgeThumbs()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE all thumbs in the uploads directory.')) {
            return;
        }

        $uploadsDisk = Config::get('filesystems.disks.uploads.driver', 'local');
        if ($uploadsDisk !== 'local') {
            $this->error('Purging uploads is only supported on the local disk');
            return;
        }

        $totalCount = 0;
        $uploadsPath = Config::get('filesystems.disks.uploads.root', storage_path('app/uploads'));

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

    /**
     * utilPurgeUploads deletes files on the uploads disk that do not exist in the "system_files" table
     */
    protected function utilPurgeUploads()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE files on the uploads disk that do not exist in the "system_files" table.')) {
            return;
        }

        $disk = Storage::disk('uploads');

        foreach (['protected', 'public'] as $directory) {
            $this->comment('Scanning directory: '.$directory);
            $filesToDelete = $this->findUnreferencedUploads($disk, $directory);

            if (!$filesToDelete) {
                $this->comment('No files found to purge.');
                continue;
            }

            $this->comment(sprintf('Found %d file(s) to delete (%s).', count($filesToDelete), File::sizeToString(array_sum($filesToDelete))));

            if ($this->output->isVerbose()) {
                $this->line(implode(PHP_EOL, array_keys($filesToDelete)));
            }

            if ($this->confirmToProceed('Please confirm file destruction.')) {
                foreach (array_chunk(array_keys($filesToDelete), 500) as $paths) {
                    $disk->delete($paths);
                }
            }
        }
    }

    /**
     * findUnreferencedUploads returns the path and size of each unused file in a directory, skipping files changed in the last hour.
     */
    protected function findUnreferencedUploads(FilesystemAdapter $disk, string $directory): array
    {
        $cutoff = time() - 3600;
        $filesToDelete = [];

        $listing = LazyCollection::make(function () use ($disk, $directory) {
            yield from $disk->listContents($directory, true);
        });

        $listing
            ->filter(function ($item) use ($cutoff) {
                return $item->isFile()
                    && !str_starts_with(basename($item->path()), '.')
                    && $item->lastModified() < $cutoff;
            })
            ->chunk(500)
            ->each(function ($chunk) use (&$filesToDelete) {
                $diskNames = [];
                $thumbIds = [];
                $sizes = [];

                foreach ($chunk as $item) {
                    $path = $item->path();
                    $sizes[$path] = (int) $item->fileSize();

                    if (preg_match('/^thumb_(\d+)_/', basename($path), $match)) {
                        $thumbIds[$path] = (int) $match[1];
                    }
                    else {
                        $diskNames[$path] = basename($path);
                    }
                }

                $foundNames = FileModel::whereIn('disk_name', $diskNames)->pluck('disk_name')->all();
                $foundIds = FileModel::whereIn('id', $thumbIds)->pluck('id')->all();
                $unreferenced = array_diff($diskNames, $foundNames) + array_diff($thumbIds, $foundIds);

                foreach (array_keys($unreferenced) as $path) {
                    $filesToDelete[$path] = $sizes[$path];
                }
            });

        return $filesToDelete;
    }

    /**
     * utilPurgeOrphans deletes files in "system_files" that do not belong to any other model
     */
    protected function utilPurgeOrphans()
    {
        if (!$this->confirmToProceed('This will PERMANENTLY DELETE files in "system_files" that do not belong to any other model.')) {
            return;
        }

        $orphanedFiles = 0;

        // Locate orphans
        $files = FileModel::whereNull('attachment_id')->get();

        foreach ($files as $file) {
            $file->delete();
            $orphanedFiles += 1;
        }

        if ($orphanedFiles > 0) {
            $this->comment(sprintf('Successfully deleted %d orphaned record(s).', $orphanedFiles));
        }
        else {
            $this->comment('No records to purge.');
        }
    }

    /**
     * utilPurgeDeferred cleans up all records that have deferred bindings
     */
    protected function utilPurgeDeferred()
    {
        \October\Rain\Database\Models\DeferredBinding::cleanUp(-1);

        $this->comment('Cleared all deferred bindings.');
    }

    /**
     * utilMaintenanceOn turns on CMS maintenance mode, backend users with the
     * "general.view_offline" permission continue to see the site normally.
     */
    protected function utilMaintenanceOn()
    {
        if (!System::hasDatabase()) {
            $this->error('A database connection is required to toggle maintenance mode.');
            return;
        }

        MaintenanceSetting::set('is_enabled', true);

        $this->comment('Maintenance mode enabled.');
    }

    /**
     * utilMaintenanceOff turns off CMS maintenance mode.
     */
    protected function utilMaintenanceOff()
    {
        if (!System::hasDatabase()) {
            $this->error('A database connection is required to toggle maintenance mode.');
            return;
        }

        MaintenanceSetting::set('is_enabled', false);

        $this->comment('Maintenance mode disabled.');
    }

    /**
     * utilGitPull requires the git binary to be installed
     */
    protected function utilGitPull()
    {
        foreach (File::directories(plugins_path()) as $authorDir) {
            foreach (File::directories($authorDir) as $pluginDir) {
                if (!File::isDirectory($pluginDir.'/.git')) {
                    continue;
                }

                $exec = 'cd ' . $pluginDir . ' && ';
                $exec .= 'git pull 2>&1';
                echo 'Updating plugin: '. basename(dirname($pluginDir)) .'.'. basename($pluginDir) . PHP_EOL;
                echo shell_exec($exec);
            }
        }

        foreach (File::directories(themes_path()) as $themeDir) {
            if (!File::isDirectory($themeDir.'/.git')) {
                continue;
            }

            $exec = 'cd ' . $themeDir . ' && ';
            $exec .= 'git pull 2>&1';
            echo 'Updating theme: '. basename($themeDir) . PHP_EOL;
            echo shell_exec($exec);
        }
    }
}
