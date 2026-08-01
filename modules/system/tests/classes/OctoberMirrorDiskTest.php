<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class OctoberMirrorDiskTest extends TestCase
{
    /**
     * @var string fixtureDir holding known asset files, relative to base path
     */
    protected $fixtureDir = 'modules/cms/tests/fixtures/themes/test/assets';

    public function setUp(): void
    {
        parent::setUp();

        Storage::fake('assets');

        // Constrain the mirror inventory to the fixture assets directory
        Event::listen('system.console.mirror.extendPaths', function ($paths) {
            $paths->files = [];
            $paths->directories = [$this->fixtureDir];
            $paths->wildcards = [];
        });
    }

    public function tearDown(): void
    {
        Event::forget('system.console.mirror.extendPaths');

        parent::tearDown();
    }

    public function testDiskModeUploadsAssetFiles()
    {
        $exitCode = Artisan::call('october:mirror', ['--disk' => 'assets']);

        $this->assertEquals(0, $exitCode);
        Storage::disk('assets')->assertExists($this->fixtureDir.'/css/style1.css');
        Storage::disk('assets')->assertExists($this->fixtureDir.'/css/style2.css');
        Storage::disk('assets')->assertExists($this->fixtureDir.'/js/script1.js');
        Storage::disk('assets')->assertExists($this->fixtureDir.'/js/script2.js');

        $this->assertEquals(
            file_get_contents(base_path($this->fixtureDir.'/css/style1.css')),
            Storage::disk('assets')->get($this->fixtureDir.'/css/style1.css')
        );
    }

    public function testDiskModeSkipsUnchangedFiles()
    {
        Artisan::call('october:mirror', ['--disk' => 'assets']);
        Artisan::call('october:mirror', ['--disk' => 'assets']);

        $output = Artisan::output();
        $this->assertStringContainsString('0 uploaded, 4 unchanged', $output);
    }

    public function testDiskModeForceReuploadsEverything()
    {
        Artisan::call('october:mirror', ['--disk' => 'assets']);
        Artisan::call('october:mirror', ['--disk' => 'assets', '--force' => true]);

        $output = Artisan::output();
        $this->assertStringContainsString('4 uploaded, 0 unchanged', $output);
    }

    public function testDiskModeIsAdditiveOnly()
    {
        Storage::disk('assets')->put('orphaned/old-file.css', 'body {}');

        Artisan::call('october:mirror', ['--disk' => 'assets']);

        // Mirror must never delete keys it does not recognise
        Storage::disk('assets')->assertExists('orphaned/old-file.css');
    }

    public function testDiskModeDryRunUploadsNothing()
    {
        Artisan::call('october:mirror', ['--disk' => 'assets', '--dry-run' => true]);

        $output = Artisan::output();
        $this->assertStringContainsString('Would upload', $output);
        Storage::disk('assets')->assertMissing($this->fixtureDir.'/css/style1.css');
    }

    public function testDiskModeExcludesStoragePaths()
    {
        Event::forget('system.console.mirror.extendPaths');
        Event::listen('system.console.mirror.extendPaths', function ($paths) {
            $paths->files = [];
            $paths->directories = [$this->fixtureDir, 'storage/app/media'];
            $paths->wildcards = [];
        });

        Artisan::call('october:mirror', ['--disk' => 'assets']);

        foreach (Storage::disk('assets')->allFiles() as $file) {
            $this->assertStringStartsNotWith('storage/', $file, 'Storage paths must never publish to the assets disk');
        }
    }

    public function testDiskModeRejectsUnknownDisk()
    {
        $exitCode = Artisan::call('october:mirror', ['--disk' => 'nope-not-a-disk']);

        $this->assertEquals(1, $exitCode);
    }
}
