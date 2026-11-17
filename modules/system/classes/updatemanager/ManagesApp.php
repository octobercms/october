<?php namespace System\Classes\UpdateManager;

use App;
use Event;

/**
 * ManagesApp
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ManagesApp
{
    /**
     * migrateApp runs migrations on the app directory
     */
    public function migrateApp()
    {
        $migrator = $this->getMigrator();

        // Suppress the "Nothing to migrate" message
        if (isset($this->notesOutput)) {
            $migrator->setOutput(new \Symfony\Component\Console\Output\NullOutput);

            Event::listen(\Illuminate\Database\Events\MigrationsStarted::class, function() use ($migrator) {
                $migrator->setOutput($this->notesOutput);
            });
        }

        if ($migrator->run(app_path('database/migrations'))) {
            $this->migrateCount++;
        }
    }

    /**
     * rollbackApp rolls back application migrations
     */
    public function rollbackApp()
    {
        // This method attempts to roll back everything, as per Laravel monolith logic,
        // so silence the command to ignore "Migration not found" errors.
        $migrator = App::make('migrator');

        // if (isset($this->notesOutput)) {
        //     $migrator->setOutput($this->notesOutput);
        // }

        // @todo Potential issue here since a migration file collision could unintentionally
        // rollback a core module migration. Ideally the migration table needs to be extended
        // to include a module/namespace column to correctly isolate migrations from each other.
        $migrator->reset((array) app_path('database/migrations'));
    }

    /**
     * seedApp runs seeds on the app directory
     */
    public function seedApp()
    {
        $className = 'App\Database\Seeds\DatabaseSeeder';
        if (!class_exists($className)) {
            return;
        }

        $this->note('<info>Seeding App</info>');

        $seeder = App::make($className);

        if ($cmd = $this->getNotesCommand()) {
            $seeder->setCommand($cmd);
        }

        $seeder->run();
    }
}
