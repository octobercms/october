<?php namespace Tailor\Console;

use Log;
use Illuminate\Console\Command;
use Tailor\Classes\BlueprintIndexer;
use Exception;

/**
 * TailorMigrate migrates tailor specific content.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class TailorMigrate extends Command
{
    /**
     * @var string signature of console command
     */
    protected $signature = 'tailor:migrate';

    /**
     * @var string description of the console command
     */
    protected $description = 'Migrate tailor tables.';

    /**
     * handle executes the console command
     */
    public function handle()
    {
        try {
            BlueprintIndexer::instance()->setNotesCommand($this)->migrate();
        }
        catch (Exception $ex) {
            Log::error($ex);
            throw $ex;
        }
    }
}
