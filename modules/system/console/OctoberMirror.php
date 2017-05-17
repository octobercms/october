<?php namespace System\Console;

use File;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Filesystem\Filesystem;

/**
 * Console command to implement a "public" folder.
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
     * The console command name.
     */
    protected $name = 'october:mirror';

    /**
     * The console command description.
     */
    protected $description = 'Generates a mirrored public folder using symbolic links.';

    protected $files = [
        '.htaccess',
        'index.php',
        'favicon.ico',
        'robots.txt',
        'sitemap.xml',
    ];

    protected $directories = [
        'storage/app/uploads/public',
        'storage/app/media',
        'storage/temp/public',
    ];

    protected $destinationPath;

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
        $this->getDestinationPath();

        foreach ($this->files as $file) {
            $this->mirrorFile($file);
        }

        foreach ($this->directories as $directory) {
            $this->mirrorDirectory($directory);
        }

        $this->output->writeln('<info>Mirror complete!</info>');
    }

    protected function mirrorFile($file)
    {
        $this->output->writeln(sprintf('<info> - Mirroring: %s</info>', $file));

        $src = base_path().'/'.$file;

        $dest = $this->getDestinationPath().'/'.$file;

        if (!File::isFile($src) || File::isFile($dest)) {
            return false;
        }

        $this->mirror($src, $dest);
    }

    protected function mirrorDirectory($directory)
    {
        $this->output->writeln(sprintf('<info> - Mirroring: %s</info>', $directory));

        $src = base_path().'/'.$directory;

        $dest = $this->getDestinationPath().'/'.$directory;

        if (!File::isDirectory($src) || File::isDirectory($dest)) {
            return false;
        }

        if (!File::isDirectory(dirname($dest))) {
            File::makeDirectory(dirname($dest), 0755, true);
        }

        $this->mirror($src, $dest);
    }

    protected function mirror($src, $dest)
    {
        if ($this->option('relative')) {
            $src = $this->getRelativePath($dest, $src);

            if (strpos($src, '../') === 0) {
                $src = rtrim(substr($src, 3), '/');
            }
        }

        symlink($src, $dest);
    }

    protected function getDestinationPath()
    {
        if ($this->destinationPath !== null) {
            return $this->destinationPath;
        }

        $destPath = $this->argument('destination');
        if (realpath($destPath) === false) {
            $destPath = base_path() . '/' . $destPath;
        }

        if (!File::isDirectory($destPath)) {
            File::makeDirectory($destPath, 0755, true);
        }

        $destPath = realpath($destPath);

        $this->output->writeln(sprintf('<info>Destination: %s</info>', $destPath));

        return $this->destinationPath = $destPath;
    }

    protected function getRelativePath($from, $to)
    {
        $from = str_replace('\\', '/', $from);
        $to = str_replace('\\', '/', $to);

        $dir = explode('/', is_file($from) ? dirname($from) : rtrim($from, '/'));
        $file = explode('/', $to);

        while ($dir && $file && ($dir[0] == $file[0])) {
            array_shift($dir);
            array_shift($file);
        }

        return str_repeat('../', count($dir)) . implode('/', $file);
    }

    /**
     * Get the console command arguments.
     */
    protected function getArguments()
    {
        return [
            ['destination', InputArgument::REQUIRED, 'The destination path relative to the current directory. Eg: public/'],
        ];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [
            ['relative', null, InputOption::VALUE_NONE, 'Create symlinks relative to the public directory.'],
        ];
    }
}
