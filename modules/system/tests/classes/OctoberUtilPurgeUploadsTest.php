<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

class OctoberUtilPurgeUploadsTest extends PluginTestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Storage::fake('uploads');
    }

    public function testDeletesUnreferencedFiles()
    {
        $this->createFileRecord('abc123def456ghi789.png');
        $this->putOldFile('public/abc/123/def/abc123def456ghi789.png');
        $this->putOldFile('public/zzz/999/yyy/zzz999yyy888xxx777.png');
        $this->putOldFile('protected/qqq/111/www/qqq111www222eee333.pdf');

        $exitCode = Artisan::call('october:util', ['name' => ['purge', 'uploads'], '--force' => true]);

        $this->assertEquals(0, $exitCode);
        Storage::disk('uploads')->assertExists('public/abc/123/def/abc123def456ghi789.png');
        Storage::disk('uploads')->assertMissing('public/zzz/999/yyy/zzz999yyy888xxx777.png');
        Storage::disk('uploads')->assertMissing('protected/qqq/111/www/qqq111www222eee333.pdf');
    }

    public function testKeepsRecentlyChangedFiles()
    {
        Storage::disk('uploads')->put('public/zzz/999/yyy/zzz999yyy888xxx777.png', 'contents');

        Artisan::call('october:util', ['name' => ['purge', 'uploads'], '--force' => true]);

        Storage::disk('uploads')->assertExists('public/zzz/999/yyy/zzz999yyy888xxx777.png');
    }

    public function testKeepsThumbsOfExistingFiles()
    {
        $fileId = $this->createFileRecord('abc123def456ghi789.png');
        $this->putOldFile('public/abc/123/def/abc123def456ghi789.png');
        $this->putOldFile("public/abc/123/def/thumb_{$fileId}_100_100_0_0_auto.png");
        $this->putOldFile('public/zzz/999/yyy/thumb_99999_100_100_0_0_auto.png');

        Artisan::call('october:util', ['name' => ['purge', 'uploads'], '--force' => true]);

        Storage::disk('uploads')->assertExists("public/abc/123/def/thumb_{$fileId}_100_100_0_0_auto.png");
        Storage::disk('uploads')->assertMissing('public/zzz/999/yyy/thumb_99999_100_100_0_0_auto.png');
    }

    public function testKeepsDotFiles()
    {
        $this->putOldFile('public/.gitignore');

        Artisan::call('october:util', ['name' => ['purge', 'uploads'], '--force' => true]);

        Storage::disk('uploads')->assertExists('public/.gitignore');
    }

    public function testReportsCountAndSize()
    {
        $this->putOldFile('public/zzz/999/yyy/zzz999yyy888xxx777.png');
        $this->putOldFile('public/zzz/999/yyy/zzz999yyy888xxx666.png');

        Artisan::call('october:util', ['name' => ['purge', 'uploads'], '--force' => true]);

        $this->assertStringContainsString('Found 2 file(s) to delete (16 bytes).', Artisan::output());
    }

    /**
     * createFileRecord inserts a file record for the disk name and returns its id
     */
    protected function createFileRecord(string $diskName): int
    {
        return Db::table('system_files')->insertGetId([
            'disk_name' => $diskName,
            'file_name' => 'avatar.png',
            'file_size' => 8,
            'content_type' => 'image/png',
            'is_public' => true,
        ]);
    }

    /**
     * putOldFile writes a file to the uploads disk and backdates it past the purge cutoff
     */
    protected function putOldFile(string $path): void
    {
        Storage::disk('uploads')->put($path, 'contents');

        touch(Storage::disk('uploads')->path($path), time() - 7200);
    }
}
