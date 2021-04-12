<?php namespace System\Console;

class OctoberVersion extends \Illuminate\Console\Command
{
    /**
     * @var string The console command description.
     */
    protected $description = 'Displays the build number (version) of this October CMS instance.';

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
        passthru('composer show october/system');

        $this->comment('*** Thanks for using October CMS!');
    }
}
