<?php namespace System\Console;

use File;
use Event;
use System;
use Config;
use stdClass;
use Illuminate\Console\Command;
use Exception;

/**
 * OctoberMirror command to implement a "public" folder.
 *
 * This command will create symbolic links to files and directories
 * that are commonly required to be publicly available.
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
        {--relative : Create symlinks relative to the public directory.}';

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
