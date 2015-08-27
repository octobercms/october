<?php namespace System\Console;

use File;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

/**
 * This command will create symbolic links to files and directories
 * that are commonly required to be publicly available.
 *
 * It is experimental and currently undergoing testing,
 * see: https://github.com/octobercms/october/issues/1331
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
    protected $description = '(Experimental) Generates a mirrored public folder using symbolic links.';

    protected $files = [
        'index.php',
        'favicon.ico',
        'robots.txt',
        'sitemap.xml',
    ];

    protected $directories = [
        'storage/app/uploads',
        'storage/app/media',
        'storage/temp/public',
    ];

    protected $wildcards = [
        'modules/*/assets',
        'modules/*/behaviors/*/assets',
        'modules/*/widgets/*/assets',
        'modules/*/formwidgets/*/assets',

        'plugins/*/*/assets',
        'plugins/*/*/behaviors/*/assets',
        'plugins/*/*/formwidgets/*/assets',
        'plugins/*/*/widgets/*/assets',

        'themes/*/assets',
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

        foreach ($this->wildcards as $wildcard) {
            $this->mirrorWildcard($wildcard);
        }

        $this->output->writeln('<info>Mirror complete!</info>');
    }

    protected function mirrorFile($file)
    {
        $this->output->writeln(sprintf('<info> - Mirroring: %s</info>', $file));

        $src = base_path().'/'.$file;
        $dest = $this->getDestinationPath().'/'.$file;
        if (!File::isFile($src) || File::isFile($dest)) return false;
        symlink($src, $dest);
    }

    protected function mirrorDirectory($directory)
    {
        $this->output->writeln(sprintf('<info> - Mirroring: %s</info>', $directory));

        $src = base_path().'/'.$directory;
        $dest = $this->getDestinationPath().'/'.$directory;
        if (!File::isDirectory($src) || File::isDirectory($dest)) return false;
        if (!File::isDirectory(dirname($dest))) File::makeDirectory(dirname($dest), 0755, true);
        symlink($src, $dest);
    }

    protected function mirrorWildcard($wildcard)
    {
        if (strpos($wildcard, '*') === false) {
            return $this->mirrorDirectory($wildcard);
        }

        list($start, $end) = explode('*', $wildcard, 2);
        $startDir = base_path().'/'.$start;
        if (!File::isDirectory($startDir)) return false;

        foreach (File::directories($startDir) as $directory) {
            $this->mirrorWildcard($start.basename($directory).$end);
        }
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

        $this->output->writeln(sprintf('<info>Destination: %s</info>', $destPath));

        return $this->destinationPath = $destPath;
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
        return [];
    }
}
