<?php namespace System\Console;

use App;
use System\Classes\UpdateManager;

class OctoberVersion extends \Illuminate\Console\Command
{
    /**
     * @var string The console command description.
     */
    protected $description = 'Detects the build number (version) of this October CMS instance.';

    /**
     * @var string The name and signature of the console command.
     */
    protected $signature = 'october:version';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->comment('*** Detecting October CMS build...');

        if (!App::hasDatabase()) {
            $build = UpdateManager::instance()->getBuildNumberManually();

            // Skip setting the build number if no database is detected to set it within
            $this->comment('*** No database detected - skipping setting the build number.');
        } else {
            $build = UpdateManager::instance()->setBuildNumberManually();
        }

        if (is_null($build)) {
            $this->error('Unable to detect your build of October CMS.');
            return;
        }

        if ($build['modified']) {
            $this->info('*** Detected a modified version of October CMS build ' . $build['build'] . '.');
        } else {
            $this->info('*** Detected October CMS build ' . $build['build'] . '.');
        }
    }
}
