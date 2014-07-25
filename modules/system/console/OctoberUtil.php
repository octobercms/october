<?php namespace System\Console;

use File;
use Config;
use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

/**
 * Utility command
 *
 * Supported commands:
 *
 *   - purge thumbs: Deletes all thumbnail files in the uploads directory.
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
        $command = implode(' ', (array) $this->argument('name'));
        $method = 'util'.studly_case($command);

        if (!method_exists($this, $method)) {
            $this->error(sprintf('<error>Utility command "%s" does not exist!</error>', $command));
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
            ['name', InputArgument::IS_ARRAY, 'A utility command to perform.'],
        ];
    }

    /**
     * Get the console command options.
     */
    protected function getOptions()
    {
        return [
            ['force', null, InputOption::VALUE_NONE, 'Force the operation to run when in production.'],
        ];
    }

    //
    // Utilties
    //

    protected function utilPurgeThumbs()
    {
        if (!$uploadsDir = Config::get('cms.uploadsDir'))
            return $this->error('No uploads directory defined in config (cms.uploadsDir)');

        if (!$this->confirmToProceed('This will PERMANENTLY DELETE all thumbs in the uploads directory.'))
            return;

        $uploadsDir = base_path() . $uploadsDir;
        $totalCount = 0;

        /*
         * Recursive function to scan the directory for files beginning
         * with "thumb_" and repeat itself on directories.
         */
        $purgeFunc = function($targetDir) use (&$purgeFunc, &$totalCount) {
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

        $purgeFunc($uploadsDir);

        if ($totalCount > 0)
            $this->comment(sprintf('Successfully deleted %s thumbs', $totalCount));
        else
            $this->comment('No thumbs found to delete');
    }

}