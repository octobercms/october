<?php namespace System\Console;

use File;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;

/**
 * Console command to remove the installer files.
 *
 * Removes install_files and install.php.
 * By choice also README.md and .gitignore
 */
class OctoberInstalled extends Command
{
    /**
     * The console command name.
     * @var string
     */
    protected $name = 'october:installed';

    /**
     * The console command description.
     * @var string
     */
    protected $description = 'Removes installer files.';

    /**
     * Create a new command instance.
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     * @return void
     */
    public function fire()
    {
        foreach ($this->getDirsToRemove() as $dir) {
            File::deleteDirectory(base_path($dir));
        }
        foreach ($this->getFilesToRemove() as $file){
            File::delete(base_path($file));
        }
    }

    /**
     * Get the console command options.
     * @return array
     */
    protected function getOptions()
    {
        return [
            ['all', null, InputOption::VALUE_NONE, 'Also removes the README.md and .gitignore files.'],
        ];
    }

    /**
     * @return array
     */
    private function getFilesToRemove()
    {
        $files = [
            'install.php'
        ];

        $extra = [
            '.gitignore',
            'README.md'
        ];

        if($this->option('all')){
            $files = array_merge($files, $extra);
        }

        return $files;
    }

    /**
     * @return array
     */
    private function getDirsToRemove()
    {
        return [
            'install_files',
        ];
    }
}
