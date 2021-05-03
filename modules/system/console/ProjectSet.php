<?php namespace System\Console;

use Lang;
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
            // Enter a valid License Key to proceed.
            $this->comment(Lang::get('system::lang.installer.license_key_comment'));

            // License Key
            $licenceKey = trim($this->ask(Lang::get('system::lang.installer.license_key_label')));
        }

        try {
            $this->setupSetProject($licenceKey);

            // Thanks for being a customer of October CMS!
            $this->output->success(Lang::get('system::lang.installer.license_thanks_comment'));
        }
        catch (Exception $e) {
            $this->output->error($e->getMessage());
            return 1;
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
