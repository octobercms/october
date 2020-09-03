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
    protected $signature = 'october:version
                            {--changes : Include the list of changes between this install and the expected files for the detected build.}';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->comment('*** Detecting October CMS build...');

        if (!App::hasDatabase()) {
            $build = UpdateManager::instance()->getBuildNumberManually($this->option('changes'));

            // Skip setting the build number if no database is detected to set it within
            $this->comment('*** No database detected - skipping setting the build number.');
        } else {
            $build = UpdateManager::instance()->setBuildNumberManually($this->option('changes'));
        }

        if (!$build['confident']) {
            $this->warn('*** We could not accurately determine your October CMS build due to the number of modifications. The closest detected build is October CMS build ' . $build['build'] . '.');
        } else if ($build['modified']) {
            $this->info('*** Detected a modified version of October CMS build ' . $build['build'] . '.');
        } else {
            $this->info('*** Detected October CMS build ' . $build['build'] . '.');
        }

        if ($this->option('changes')) {
            $this->line('');
            $this->comment('We have detected the following modifications:');

            if (count($build['changes']['added'] ?? [])) {
                $this->line('');
                $this->info('Files added:');

                foreach (array_keys($build['changes']['added']) as $file) {
                    $this->line(' - ' . $file);
                }
            }

            if (count($build['changes']['modified'] ?? [])) {
                $this->line('');
                $this->info('Files modified:');

                foreach (array_keys($build['changes']['modified']) as $file) {
                    $this->line(' - ' . $file);
                }
            }

            if (count($build['changes']['removed'] ?? [])) {
                $this->line('');
                $this->info('Files removed:');

                foreach (array_keys($build['changes']['removed']) as $file) {
                    $this->line(' - ' . $file);
                }
            }
        }
    }
}
