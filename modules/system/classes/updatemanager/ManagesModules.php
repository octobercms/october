<?php namespace System\Classes\UpdateManager;

use App;
use File;
use Lang;
use Http;
use Event;
use System as SystemHelper;
use System\Models\Parameter;
use October\Rain\Composer\ComposerManager;
use ApplicationException;
use SystemException;
use Exception;

/**
 * ManagesModules
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
trait ManagesModules
{
    /**
     * migrateModules migrates all modules
     */
    public function migrateModules()
    {
        foreach (SystemHelper::listModules() as $module) {
            $this->migrateModule($module);
        }
    }

    /**
     * migrateModule runs migrations on a single module
     */
    public function migrateModule(string $module)
    {
        $migrator = $this->getMigrator();

        // Suppress the "Nothing to migrate" message
        if (isset($this->notesOutput)) {
            $migrator->setOutput(new \Symfony\Component\Console\Output\NullOutput);

            Event::listen(\Illuminate\Database\Events\MigrationsStarted::class, function() use ($migrator) {
                $migrator->setOutput($this->notesOutput);
            });
        }

        if ($migrator->run(base_path('modules/'.strtolower($module).'/database/migrations'))) {
            $this->migrateCount++;
        }
    }

    /**
     * seedModules seeds all modules
     */
    public function seedModules()
    {
        foreach (SystemHelper::listModules() as $module) {
            $this->seedModule($module);
        }
    }

    /**
     * seedModule runs seeds on a module
     */
    public function seedModule(string $module)
    {
        $className = $module.'\Database\Seeds\DatabaseSeeder';
        if (!class_exists($className)) {
            return;
        }

        $this->note(sprintf('<info>Seeding Module</info>: %s', $module));

        $seeder = App::make($className);

        if ($cmd = $this->getNotesCommand()) {
            $seeder->setCommand($cmd);
        }

        $seeder->run();
    }

    /**
     * getCurrentVersion returns the current version, with or without build
     */
    public function getCurrentVersion(): string
    {
        $version = SystemHelper::VERSION;

        $build = $this->getCurrentBuildNumber();
        if ($build !== null) {
            $version .= '.' . $build;
        }

        return $version;
    }

    /**
     * getCurrentBuildNumber return the current build number
     */
    public function getCurrentBuildNumber(): ?string
    {
        return Parameter::get('system::core.build');
    }

    /**
     * setBuild sets the build number and hash
     */
    public function setBuild(string $build): void
    {
        Parameter::set('system::core.build', $build);
        Parameter::set('system::update.retry', null);
    }

    /**
     * setBuildNumberManually asks the gateway for the latest build number and stores it.
     */
    public function setBuildNumberManually()
    {
        $version = null;

        try {
            // Locate version from october/system package
            $versions = ComposerManager::instance()->getPackageVersions(['october/system']);
            $version = $versions['october/system'] ?? null;
        }
        catch (Exception $ex) {
        }

        try {
            // Locate version from seed file
            if ($version === null) {
                if (
                    File::exists($seedFile = storage_path('cms/version.json')) &&
                    ($contents = json_decode(File::get($seedFile), true)) &&
                    isset($contents['version'])
                ) {
                    $version = $contents['version'] ?? null;
                    File::delete($seedFile);
                }
            }
        }
        catch (Exception $ex) {
        }

        try {
            // Locate version from october/rain package
            if ($version === null) {
                $versions = ComposerManager::instance()->getPackageVersions(['october/rain']);
                $version = $versions['october/rain'] ?? null;
            }
        }
        catch (Exception $ex) {
        }

        if ($version === null) {
            return '0';
        }

        $build = $this->getBuildFromVersion($version);

        $this->setBuild((int) $build);

        return $build;
    }

    /**
     * requestChangelog returns the latest changelog information.
     */
    public function requestChangelog()
    {
        $result = Http::get('https://octobercms.com/changelog?json='.SystemHelper::VERSION);
        $contents = $result->body();

        if ($result->status() === 404) {
            throw new ApplicationException(Lang::get('system::lang.server.response_empty'));
        }

        if ($result->status() !== 200) {
            throw new ApplicationException(
                strlen($contents)
                ? $contents
                : Lang::get('system::lang.server.response_empty')
            );
        }

        try {
            $resultData = json_decode($contents, true);
        }
        catch (Exception $ex) {
            throw new ApplicationException(Lang::get('system::lang.server.response_invalid'));
        }

        return $resultData;
    }

    /**
     * getBuildFromVersion will return the patch version of a semver string
     * eg: 1.2.3 -> 3, 1.2.3-dev -> 3
     */
    protected function getBuildFromVersion(string $version): int
    {
        $parts = explode('.', $version);
        if (count($parts) !== 3) {
            return 0;
        }

        $lastPart = $parts[2];
        if (!is_numeric($lastPart)) {
            $lastPart = explode('-', $lastPart)[0];
        }

        if (!is_numeric($lastPart)) {
            return 0;
        }

        return $lastPart;
    }
}
