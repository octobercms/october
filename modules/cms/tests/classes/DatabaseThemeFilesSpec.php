<?php

use Cms\Classes\Asset;
use Cms\Classes\Theme;
use Cms\Classes\ThemeFiles;
use Cms\Classes\Contracts\ThemeFilesDiskAdapter;
use Cms\Classes\Halcyon\DiskStorageFileDatasource;
use October\Rain\Halcyon\Datasource\AutoDatasource;
use October\Rain\Halcyon\Datasource\StorageFileDatasource;
use October\Rain\Halcyon\Datasource\SoftDeleteDatasourceInterface;
use October\Tests\Concerns\PerformsMigrations;

/**
 * @group cms-database-files
 * @group s3
 *
 * Integration spec for database-backed theme files + external storage.
 */
class DatabaseThemeFilesSpec extends TestCase
{
    use PerformsMigrations;

    protected string $themeDir = 'dbfiles-test';

    protected function setUp(): void
    {
        parent::setUp();

        $this->migrateModules();
        $this->clearStorageFileDatasourceCache();

        Config::set('cms.database_theme_files', true);
        Config::set('cms.database_files', true);
        Config::set('cms.theme_files_disk', env('CMS_THEME_FILES_DISK', 'theme-files'));

        if (!$this->themeFilesDiskSupportsExternalStorage()) {
            $this->markTestSkipped('External storage adapter not implemented');
        }

        if (Config::get('cms.theme_files_disk') === 'theme-files') {
            Storage::fake('theme-files');
        }

        Config::set('cms.editable_asset_types', ['css', 'js', 'less', 'sass', 'scss', 'png']);

        $path = themes_path($this->themeDir);
        File::makeDirectory($path . '/assets', 0755, true, true);
        File::put($path . '/theme.yaml', "name: DB Files Test\n");

        Theme::resetCache();
        Theme::load($this->themeDir);

        Db::table('cms_theme_files')->where('source', $this->themeDir)->delete();
        $this->clearStorageFileDatasourceCache();
    }

    /** @test */
    public function theme_registers_storage_file_datasource_when_enabled(): void
    {
        $theme = Theme::load($this->themeDir);
        $datasource = $theme->getFileDatasource();

        $this->assertInstanceOf(AutoDatasource::class, $datasource);
        $this->assertInstanceOf(
            DiskStorageFileDatasource::class,
            $this->getPrimaryStorageDatasource($datasource)
        );
    }

    /** @test */
    public function asset_upload_writes_metadata_and_bytes(): void
    {
        $theme = Theme::load($this->themeDir);
        $asset = new Asset($theme);
        $asset->fileName = 'logo.png';
        $asset->content = 'binary-image-data';
        $asset->save();

        $this->assertTrue($this->storageExists($theme, 'assets/logo.png'));

        $row = Db::table('cms_theme_files')
            ->where('source', $this->themeDir)
            ->where('path', 'assets/logo.png')
            ->whereNull('content')
            ->whereNull('deleted_at')
            ->first();

        $this->assertNotNull($row);
        $this->assertSame(strlen('binary-image-data'), (int) $row->file_size);
    }

    /** @test */
    public function auto_datasource_prefers_storage_over_filesystem(): void
    {
        $theme = Theme::load($this->themeDir);
        $datasource = $theme->getFileDatasource();

        File::put(themes_path($this->themeDir . '/assets/logo.png'), 'filesystem');
        $this->writeStorageFile($theme, 'assets/logo.png', 'storage');

        $result = $datasource->selectOne('assets', 'logo', 'png');
        $this->assertSame('storage', $result['content']);
    }

    /** @test */
    public function soft_deleted_filesystem_asset_is_hidden(): void
    {
        File::put(themes_path($this->themeDir . '/assets/logo.png'), 'filesystem');

        $theme = Theme::load($this->themeDir);
        $datasource = $theme->getFileDatasource();

        $this->assertTrue($datasource->hasTemplate('assets', 'logo', 'png'));
        $datasource->delete('assets', 'logo', 'png');
        $this->assertFalse($datasource->hasTemplate('assets', 'logo', 'png'));

        $storage = $this->getPrimaryStorageDatasource($datasource);
        $this->assertInstanceOf(SoftDeleteDatasourceInterface::class, $storage);
        $this->assertTrue($storage->isTemplateTrashed('assets', 'logo', 'png'));
    }

    /** @test */
    public function resolve_public_url_uses_disk_url(): void
    {
        $theme = Theme::load($this->themeDir);
        $this->writeStorageFile($theme, 'assets/logo.png', 'content');

        $disk = Storage::disk(config('cms.theme_files_disk'));
        $url = $theme->getFileDatasource()->resolvePublicUrl(
            'assets',
            'logo',
            'png',
            ['publicUrl' => rtrim($disk->url($theme->getDirName()), '/')]
        );

        $this->assertNotNull($url);
        $this->assertStringContainsString('assets/logo.png', $url);
    }

    /** @test */
    public function orphan_metadata_falls_back_to_filesystem(): void
    {
        $theme = Theme::load($this->themeDir);
        $this->writeStorageFile($theme, 'assets/logo.png', 'storage');
        $this->deleteStorageObject($theme, 'assets/logo.png');
        File::put(themes_path($this->themeDir . '/assets/logo.png'), 'filesystem');

        $result = $theme->getFileDatasource()->selectOne('assets', 'logo', 'png');
        $this->assertNotNull($result);
        $this->assertSame('filesystem', $result['content']);
    }

    /** @test */
    public function directory_listing_excludes_prefix_collisions(): void
    {
        $theme = Theme::load($this->themeDir);
        $storage = $this->getPrimaryStorageDatasource($theme->getFileDatasource());

        $this->writeStorageFile($theme, 'assets/logo.png', 'a');
        ThemeFiles::write($theme, 'assets-backup/secret.png', 'b');

        $results = $storage->select('assets');
        $names = array_column($results, 'fileName');

        $this->assertSame(['logo.png'], $names);
    }

    /**
     * @test
     * @group s3
     */
    public function s3_upload_and_delete_round_trip(): void
    {
        if (config('cms.theme_files_disk') !== 's3') {
            $this->markTestSkipped('Set CMS_THEME_FILES_DISK=s3');
        }

        $theme = Theme::load($this->themeDir);
        $asset = new Asset($theme);
        $asset->fileName = 'cloud.png';
        $asset->content = 'cloud-bytes';
        $asset->save();

        $disk = Storage::disk('s3');
        $this->assertTrue($disk->exists($this->themeDir . '/assets/cloud.png'));
        $this->assertFalse(File::exists(storage_path('app/theme-files/' . $this->themeDir . '/assets/cloud.png')));

        $asset->delete();
        $this->assertFalse($disk->exists($this->themeDir . '/assets/cloud.png'));
    }

    protected function themeFilesDiskSupportsExternalStorage(): bool
    {
        return interface_exists(ThemeFilesDiskAdapter::class);
    }

    protected function getPrimaryStorageDatasource(AutoDatasource $auto): StorageFileDatasource
    {
        return $this->callProtectedMethod($auto, 'getSoftDeleteDatasource');
    }

    protected function writeStorageFile(Theme $theme, string $path, string $content): void
    {
        $asset = new Asset($theme);
        $asset->fileName = substr($path, strlen('assets/'));
        $asset->content = $content;
        $asset->save();
    }

    protected function storageExists(Theme $theme, string $path): bool
    {
        return Storage::disk(config('cms.theme_files_disk'))->exists($theme->getDirName() . '/' . $path);
    }

    protected function deleteStorageObject(Theme $theme, string $path): void
    {
        Storage::disk(config('cms.theme_files_disk'))->delete($theme->getDirName() . '/' . $path);
    }

    protected function clearStorageFileDatasourceCache(): void
    {
        $reflection = new ReflectionClass(StorageFileDatasource::class);

        foreach (['pathCache', 'mtimeCache', 'trashedPathCache'] as $propertyName) {
            $property = $reflection->getProperty($propertyName);
            $property->setValue(null, []);
        }
    }
}
