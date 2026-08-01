<?php namespace System\Console;

use File;
use Event;
use System;
use Config;
use Storage;
use stdClass;
use Illuminate\Console\Command;
use Exception;

/**
 * OctoberMirror command to implement a "public" folder.
 *
 * This command will create symbolic links to files and directories
 * that are commonly required to be publicly available. When the --disk
 * option is given, asset directories are uploaded to that filesystem disk
 * instead, additively, for serving assets from a shared origin.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberMirror extends Command
{
    /**
     * @var string signature for the console command
     */
    protected $signature = 'october:mirror
        {destination? : The destination path relative to the current directory. Eg: public}
        {--composer : Command triggered from composer.}
        {--relative : Create symlinks relative to the public directory.}
        {--disk= : Upload asset directories to this filesystem disk instead of symlinking.}
        {--force : Disk mode: upload every file, even when unchanged.}
        {--checksum : Disk mode: compare content hashes instead of file sizes.}
        {--dry-run : Disk mode: list what would be uploaded without uploading.}';

    /**
     * @var string description of the console command
     */
    protected $description = 'Generates a mirrored public folder using symbolic links.';

    /**
     * @var array files to symlink
     */
    protected $files = [
        '.htaccess',
        'web.config',
        'index.php',
        'favicon.ico',
        'robots.txt',
        'humans.txt',
        'sitemap.xml',
    ];

    /**
     * @var array directories to symlink
     */
    protected $directories = [
        'app/assets',
        'app/resources',
        'storage/app/uploads/public',
        'storage/app/public',
        'storage/app/media',
        'storage/app/resources',
        'storage/temp/public',
    ];

    /**
     * @var array wildcards to symlink
     */
    protected $wildcards = [
        'modules/*/assets',
        'modules/*/resources',
        'modules/*/behaviors/*/assets',
        'modules/*/behaviors/*/resources',
        'modules/*/widgets/*/assets',
        'modules/*/widgets/*/resources',
        'modules/*/formwidgets/*/assets',
        'modules/*/formwidgets/*/resources',
        'modules/*/filterwidgets/*/assets',
        'modules/*/filterwidgets/*/resources',
        'modules/*/reportwidgets/*/assets',
        'modules/*/reportwidgets/*/resources',
        'modules/*/vuecomponents/*/assets',
        'modules/*/vuecomponents/*/resources',

        'plugins/*/*/assets',
        'plugins/*/*/resources',
        'plugins/*/*/behaviors/*/assets',
        'plugins/*/*/behaviors/*/resources',
        'plugins/*/*/reportwidgets/*/assets',
        'plugins/*/*/reportwidgets/*/resources',
        'plugins/*/*/formwidgets/*/assets',
        'plugins/*/*/formwidgets/*/resources',
        'plugins/*/*/filterwidgets/*/assets',
        'plugins/*/*/filterwidgets/*/resources',
        'plugins/*/*/widgets/*/assets',
        'plugins/*/*/widgets/*/resources',
        'plugins/*/*/vuecomponents/*/assets',
        'plugins/*/*/vuecomponents/*/resources',

        'themes/*/assets',
        'themes/*/resources',
    ];

    /**
     * @var string destinationPath for the symlink
     */
    protected $destinationPath;

    /**
     * handle executes the console command
     */
    public function handle()
    {
        // Called internally via composer
        if ($this->option('composer') && !$this->useAutoMirror()) {
            return;
        }

        if ($diskName = $this->option('disk')) {
            if ($this->option('relative')) {
                $this->output->error('The --relative option only applies to symlink mode.');
                return 1;
            }

            return $this->handleDiskMode($diskName);
        }

        $this->getDestinationPath();

        $this->line(sprintf('<info>Mirror Path:</info> [%s]', $this->destinationPath));

        $paths = new stdClass;
        $paths->files = $this->files;
        $paths->directories = $this->directories;
        $paths->wildcards = $this->wildcards;

        /**
         * @event system.console.mirror.extendPaths
         * Enables extending the `php artisan october:mirror` command
         *
         * You will have access to a $paths stdClass with `files`, `directories`, `wildcards` properties available for modifying.
         *
         * Example usage:
         *
         *     Event::listen('system.console.mirror.extendPaths', function ($paths) {
         *          $paths->directories = array_merge($paths->directories, ['plugins/myauthor/myplugin/public']);
         *     });
         *
         */
        Event::fire('system.console.mirror.extendPaths', [$paths]);

        foreach ($paths->directories as $directory) {
            $this->mirrorDirectory($directory);
        }

        foreach ($paths->wildcards as $wildcard) {
            $this->mirrorWildcard($wildcard);
        }

        foreach ($paths->files as $file) {
            $this->mirrorFile($file);
        }
    }

    /**
     * handleDiskMode uploads asset directories to a filesystem disk. Uploads
     * are additive only: files are created or overwritten, never deleted, so
     * a mirror run can never take down a live asset.
     */
    protected function handleDiskMode(string $diskName)
    {
        if (!Config::get("filesystems.disks.{$diskName}")) {
            $this->output->error("Disk [{$diskName}] is not configured in config/filesystems.php");
            return 1;
        }

        $this->line(sprintf('<info>Mirror Disk:</info> [%s]', $diskName));

        $paths = new stdClass;
        $paths->files = $this->files;
        $paths->directories = $this->directories;
        $paths->wildcards = $this->wildcards;

        // See the symlink-mode handler for event documentation
        Event::fire('system.console.mirror.extendPaths', [$paths]);

        // Disk mode publishes code-shipped asset directories only, never
        // storage paths or root files
        $directories = [];
        foreach ($this->expandWildcards(array_merge($paths->directories, $paths->wildcards)) as $directory) {
            if (strpos($directory, 'storage/') === 0) {
                continue;
            }

            $directories[] = $directory;
        }

        $disk = Storage::disk($diskName);
        $useChecksum = (bool) $this->option('checksum');
        $isDryRun = (bool) $this->option('dry-run');

        // Build a remote index once so unchanged files can be skipped without
        // a request per file
        $remoteSizes = null;
        if (!$this->option('force')) {
            $remoteSizes = $this->buildRemoteSizeIndex($disk);
        }

        $uploaded = $skipped = 0;
        $seenKeys = [];

        foreach (array_unique($directories) as $directory) {
            $fullDir = base_path($directory);
            if (!File::isDirectory($fullDir)) {
                continue;
            }

            foreach (File::allFiles($fullDir) as $fileInfo) {
                if (in_array($fileInfo->getFilename(), ['Thumbs.db', 'desktop.ini'])) {
                    continue;
                }

                $key = $directory.'/'.str_replace('\\', '/', $fileInfo->getRelativePathname());
                if (isset($seenKeys[$key])) {
                    continue;
                }
                $seenKeys[$key] = true;

                if ($remoteSizes !== null && $this->isRemoteUnchanged($disk, $key, $fileInfo->getPathname(), $remoteSizes, $useChecksum)) {
                    $skipped++;
                    continue;
                }

                if ($isDryRun) {
                    $this->info(" - Would upload: {$key}");
                    $uploaded++;
                    continue;
                }

                $stream = fopen($fileInfo->getPathname(), 'r');
                $result = $disk->put($key, $stream);
                if (is_resource($stream)) {
                    fclose($stream);
                }

                if ($result === false) {
                    $this->output->error("Could not upload file to {$key}");
                    return 1;
                }

                $this->info(" - Uploaded: {$key}");
                $uploaded++;
            }
        }

        $verb = $isDryRun ? 'would upload' : 'uploaded';
        $this->line(sprintf('<info>Mirror complete:</info> %d %s, %d unchanged', $uploaded, $verb, $skipped));
    }

    /**
     * expandWildcards resolves wildcard path patterns into concrete
     * directories relative to the base path.
     */
    protected function expandWildcards(array $wildcards): array
    {
        $result = [];

        foreach ($wildcards as $wildcard) {
            if (strpos($wildcard, '*') === false) {
                $result[] = $wildcard;
                continue;
            }

            [$start, $end] = explode('*', $wildcard, 2);

            $startDir = base_path().'/'.$start;

            if (!File::isDirectory($startDir)) {
                continue;
            }

            foreach (File::directories($startDir) as $directory) {
                $result = array_merge($result, $this->expandWildcards([$start.basename($directory).$end]));
            }
        }

        return $result;
    }

    /**
     * buildRemoteSizeIndex lists the disk once and returns file sizes keyed
     * by path. A null size means the adapter's listing is lazy and the size
     * must be fetched per file.
     */
    protected function buildRemoteSizeIndex($disk): array
    {
        $index = [];

        try {
            foreach ($disk->getDriver()->listContents('', true) as $attributes) {
                if ($attributes->isFile()) {
                    $index[$attributes->path()] = $attributes->fileSize();
                }
            }
        }
        catch (Exception $ex) {
            $this->warn('Could not list disk contents, all files will be uploaded: '.$ex->getMessage());
        }

        return $index;
    }

    /**
     * isRemoteUnchanged compares a local file against the remote index by
     * size, or by content hash when checksum mode is enabled.
     */
    protected function isRemoteUnchanged($disk, string $key, string $localPath, array $remoteSizes, bool $useChecksum): bool
    {
        if (!array_key_exists($key, $remoteSizes)) {
            return false;
        }

        if ($useChecksum) {
            try {
                return $disk->checksum($key) === md5_file($localPath);
            }
            catch (Exception $ex) {
                return false;
            }
        }

        $remoteSize = $remoteSizes[$key];
        if ($remoteSize === null) {
            try {
                $remoteSize = $disk->size($key);
            }
            catch (Exception $ex) {
                return false;
            }
        }

        return (int) $remoteSize === (int) filesize($localPath);
    }

    /**
     * mirrorFile mirrors a single file
     */
    protected function mirrorFile(string $src)
    {
        $dest = $this->getDestinationPath().'/'.$src;

        if (!File::isFile($src) || File::isFile($dest)) {
            return false;
        }

        // Disabled until junctions can be resolved
        // if ($this->isWindows()) {
        //     File::copy($src, $dest);
        // }
        // else {
        //     $this->makeSymlink($src, $dest);
        // }

        $this->makeSymlink($src, $dest);

        $this->info(" - Mirrored: {$src}");
    }

    /**
     * mirrorDirectory mirrors a directory
     */
    protected function mirrorDirectory(string $src)
    {
        $dest = $this->getDestinationPath().'/'.$src;

        if (!File::isDirectory($src) || File::isDirectory($dest)) {
            return false;
        }

        if (!File::isDirectory(dirname($dest))) {
            File::makeDirectory(dirname($dest), 0755, true);
        }

        // Disabled until junctions can be resolved
        // if ($this->isWindows()) {
        //     $this->makeJunction($src, $dest);
        // }
        // else {
        //     $this->makeSymlink($src, $dest);
        // }

        $this->makeSymlink($src, $dest);

        $this->info(" - Mirrored: {$src}");
    }

    /**
     * mirrorWildcard matches a wild card and mirrors it
     */
    protected function mirrorWildcard(string $wildcard)
    {
        if (strpos($wildcard, '*') === false) {
            return $this->mirrorDirectory($wildcard);
        }

        [$start, $end] = explode('*', $wildcard, 2);

        $startDir = base_path().'/'.$start;

        if (!File::isDirectory($startDir)) {
            return false;
        }

        foreach (File::directories($startDir) as $directory) {
            $this->mirrorWildcard($start.basename($directory).$end);
        }
    }

    /**
     * mirror performs the symlink operation
     */
    protected function makeSymlink(string $src, string $dest)
    {
        if ($this->option('relative')) {
            $finalSrc = $this->makeRelativePath($dest, $src);
        }
        else {
            $finalSrc = base_path($src);
        }

        try {
            symlink($finalSrc, $dest);
        }
        catch (Exception $ex) {
            $msg = $ex->getMessage();
            $this->output->error("Could not mirror directory at {$dest}: {$msg}");
            exit(1);
        }
    }

    /**
     * makeJunction performs a junction in windows
     */
    protected function makeJunction(string $src, string $dest)
    {
        $cmd = sprintf(
            'mklink /J %s %s',
            str_replace('/', DIRECTORY_SEPARATOR, $src),
            str_replace('/', DIRECTORY_SEPARATOR, $dest)
        );

        $result = $code = null;
        exec($cmd . ' 2>&1', $result, $code);

        if ($code !== 0) {
            $msg = $result[0];
            $this->output->error("Could not mirror directory at {$dest}: {$msg}");
            exit(1);
        }
    }

    /**
     * makeRelativePath will count the number of to reach the base using a relative path.
     * For example: from:public/index.php, to:index.php = ../index.php
     */
    protected function makeRelativePath($from, $to)
    {
        $from = str_replace(DIRECTORY_SEPARATOR, '/', $from);
        $to = str_replace(DIRECTORY_SEPARATOR, '/', $to);

        $dir = explode('/', is_file($from) ? dirname($from) : rtrim($from, '/'));
        $file = explode('/', $to);

        while ($dir && $file && ($dir[0] === $file[0])) {
            array_shift($dir);
            array_shift($file);
        }

        $out = str_repeat('../', count($dir)) . implode('/', $file);

        if (strpos($out, '../') === 0) {
            $out = rtrim(substr($out, 3), '/');
        }

        return $out;
    }

    /**
     * getDestinationPath will look at the destination argument of default to the public path
     */
    protected function getDestinationPath()
    {
        if ($this->destinationPath !== null) {
            return $this->destinationPath;
        }

        $destPath = $this->argument('destination');

        // Default to public folder
        if (!$destPath) {
            if (!File::exists(base_path('public'))) {
                File::makeDirectory(base_path('public'));
            }

            return $this->destinationPath = 'public';
        }

        if (!File::isDirectory($destPath)) {
            $this->output->error("Directory does not exist [{$destPath}]. Please create it first and try again");
            exit(1);
        }

        return $this->destinationPath = $destPath;
    }

    /**
     * useAutoMirror setting
     */
    protected function useAutoMirror(): bool
    {
        $setting = Config::get('system.auto_mirror_public', false);
        if ($setting === null) {
            return !System::checkDebugMode();
        }

        return (bool) $setting;
    }

    /**
     * isWindows determines if host machine is running a Windows OS
     */
    protected function isWindows(): bool
    {
        return '\\' === DIRECTORY_SEPARATOR;
    }
}
