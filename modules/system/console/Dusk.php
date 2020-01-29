<?php namespace System\Console;

use Laravel\Dusk\Console\DuskCommand as BaseDuskCommand;

class Dusk extends BaseDuskCommand
{
    /**
     * Setup the Dusk environment.
     *
     * @return void
     */
    protected function setupDuskEnvironment()
    {
        if (file_exists(base_path($this->duskFile()))) {
            if (!file_exists(base_path('.env'))) {
                $this->stubEnvironment();
            } elseif (file_get_contents(base_path('.env')) !== file_get_contents(base_path($this->duskFile()))) {
                $this->backupEnvironment();
            }
            $this->refreshEnvironment();
        }

        $this->writeConfiguration();

        $this->setupSignalHandler();
    }

    /**
     * Restore the original environment.
     *
     * @return void
     */
    protected function teardownDuskEnviroment()
    {
        $this->removeConfiguration();

        if (
            file_exists(base_path($this->duskFile()))
            && (
                file_exists(base_path('.env.backup'))
                || file_exists(base_path('.env.blank'))
            )
        ) {
            $this->restoreEnvironment();
        }
    }


    /**
     * Stub a current environment file.
     *
     * @return void
     */
    protected function stubEnvironment()
    {
        touch(base_path('.env.blank'));

        copy(base_path($this->duskFile()), base_path('.env'));
    }

    /**
     * Backup the current environment file.
     *
     * @return void
     */
    protected function backupEnvironment()
    {
        copy(base_path('.env'), base_path('.env.backup'));

        copy(base_path($this->duskFile()), base_path('.env'));
    }

    /**
     * Restore the backed-up environment file.
     *
     * @return void
     */
    protected function restoreEnvironment()
    {
        if (file_exists(base_path('.env.blank'))) {
            unlink(base_path('.env'));
            unlink(base_path('.env.blank'));
        } else {
            copy(base_path('.env.backup'), base_path('.env'));

            unlink(base_path('.env.backup'));
        }
    }
}
