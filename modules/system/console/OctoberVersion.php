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
        $this->comment('*** Thanks for using October CMS!');
    }
}
