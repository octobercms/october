<?php namespace System\Console;

use System\Classes\UpdateManager;
use October\Rain\Process\Composer as ComposerProcess;
use Symfony\Component\Console\Input\InputArgument;
use Illuminate\Console\Command;
use Exception;

/**
 * Console command to set the project license key.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ProjectSet extends Command
{
    use \System\Traits\SetupHelper;
    use \System\Traits\SetupBuilder;

    /**
     * The console command name.
     */
    protected $name = 'project:set';

    /**
     * The console command description.
     */
    protected $description = 'Sets the project license key.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (!$this->checkEnvWritable()) {
            $this->output->error('Cannot write to .env file. Check file permissions and try again.');
            return 1;
        }

        $licenceKey = (string) $this->argument('key');

        if (!$licenceKey) {
            $this->comment('Enter a valid License Key to proceed.');
            $licenceKey = trim($this->ask('License Key'));
        }

        try {
            $this->setupSetProject($licenceKey);

            $this->output->success('Thank you for being a customer of October CMS!');
        }
        catch (Exception $e) {
            $this->output->error($e->getMessage());
        }
    }

    /**
     * getArguments get the console command arguments
     */
    protected function getArguments()
    {
        return [
            ['key', InputArgument::OPTIONAL, 'The License Key'],
        ];
    }
}
