<?php namespace System\Console;

use Illuminate\Console\Command;

/**
 * OctoberMigrate is a dummy command that simply fails.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class OctoberMigrate extends Command
{
    /**
     * The console command name.
     */
    protected $name = 'october:migrate';

    /**
     * The console command description.
     */
    protected $description = 'Dummy command that fails.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        exit(1);
    }
}
