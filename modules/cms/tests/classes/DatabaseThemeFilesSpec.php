<?php

use Cms\Classes\Asset;
use Cms\Classes\Theme;
use Cms\Classes\ThemeFiles;
use Cms\Classes\Halcyon\DiskStorageFileDatasource;
use October\Rain\Halcyon\Datasource\AutoDatasource;
use October\Rain\Halcyon\Datasource\StorageFileDatasource;
use October\Rain\Halcyon\Datasource\SoftDeleteDatasourceInterface;
use October\Tests\Concerns\PerformsMigrations;

/**
 * @group cms-database-files
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

        Config::set('cms.database_files', true);

        $diskName = Config::get('filesystems.default', 'local');
        if ($diskName !== 's3') {
            Storage::fake($diskName);
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

        $disk = ThemeFiles::disk();
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

    /** @test */
    public function asset_listing_includes_database_stored_files_without_disk_bytes(): void
    {
        $theme = Theme::load($this->themeDir);
        $asset = new Asset($theme);
        $asset->fileName = 'images/nested.png';
        $asset->content = 'nested-bytes';
        $asset->save();

        $this->deleteStorageObject($theme, 'assets/images/nested.png');

        $assets = Asset::listInTheme($theme, [
            'recursive' => false,
            'filterPath' => '',
        ]);

        $this->assertArrayHasKey('images', $assets);
        $this->assertSame(1, $assets['images']['isFolder']);

        $nestedAssets = Asset::listInTheme($theme, [
            'recursive' => false,
            'filterPath' => 'images',
        ]);

        $this->assertArrayHasKey('nested.png', $nestedAssets);
    }

    /** @test */
    public function combiner_path_resolves_for_stored_files(): void
    {
        $theme = Theme::load($this->themeDir);
        $this->writeStorageFile($theme, 'assets/logo.png', 'combiner-bytes');

        $combinerPath = ThemeFiles::getCombinerPath($theme, 'assets/logo.png');

        $this->assertNotNull($combinerPath);
        $this->assertTrue(File::isFile($combinerPath));
        $this->assertSame('combiner-bytes', File::get($combinerPath));
    }

    /**
     * @test
     * @group s3
     */
    public function s3_upload_and_delete_round_trip(): void
    {
        if (config('filesystems.default') !== 's3') {
            $this->markTestSkipped('Set FILESYSTEM_DISK=s3');
        }

        $theme = Theme::load($this->themeDir);
        $asset = new Asset($theme);
        $asset->fileName = 'cloud.png';
        $asset->content = 'cloud-bytes';
        $asset->save();

        $disk = ThemeFiles::disk();
        $this->assertTrue($disk->exists($this->themeDir . '/assets/cloud.png'));
        $localRoot = config('filesystems.disks.local.root');
        $this->assertFalse(File::exists($localRoot . '/' . $this->themeDir . '/assets/cloud.png'));

        $asset->delete();
        $this->assertFalse($disk->exists($this->themeDir . '/assets/cloud.png'));
    }

    /** @test */
    public function child_theme_resolves_parent_storage_only_assets(): void
    {
        $parentDir = 'dbfiles-parent';
        $childDir = 'dbfiles-child';

        $this->createTheme($parentDir, "name: Parent\n");
        $this->createTheme($childDir, "name: Child\nparent: {$parentDir}\n");

        Theme::resetCache();

        $parent = Theme::load($parentDir);
        $child = Theme::load($childDir);

        $this->writeStorageFile($parent, 'assets/logo.png', 'parent-bytes');

        $this->assertTrue(ThemeFiles::has($child, 'assets/logo.png'));
        $this->assertTrue(ThemeFiles::isStoredFile($child, 'assets/logo.png'));
        $this->assertSame($parentDir, ThemeFiles::resolveStorageTheme($child, 'assets/logo.png')->getDirName());

        $asset = Asset::inTheme($child)->find('logo.png');
        $this->assertNotNull($asset);
        $this->assertSame('parent-bytes', $asset->content);

        $url = ThemeFiles::getPublicUrl($child, 'assets/logo.png');
        $this->assertStringContainsString('assets/logo.png', $url);

        $combinerPath = ThemeFiles::getCombinerPath($child, 'assets/logo.png');
        $this->assertNotNull($combinerPath);
        $this->assertSame('parent-bytes', File::get($combinerPath));
    }

    /** @test */
    public function virtual_folder_delete_removes_stored_files(): void
    {
        $theme = Theme::load($this->themeDir);
        $this->writeStorageFile($theme, 'assets/images/a.png', 'a');
        $this->writeStorageFile($theme, 'assets/images/b.png', 'b');

        $this->assertTrue(ThemeFiles::hasAssetDirectory($theme, 'images'));

        ThemeFiles::deleteAssetsUnderPrefix($theme, 'images');

        $this->assertFalse(ThemeFiles::hasAssetDirectory($theme, 'images'));
        $this->assertFalse(ThemeFiles::has($theme, 'assets/images/a.png'));
        $this->assertFalse(ThemeFiles::has($theme, 'assets/images/b.png'));
    }

    /** @test */
    public function virtual_folder_rename_moves_stored_files(): void
    {
        $theme = Theme::load($this->themeDir);
        $this->writeStorageFile($theme, 'assets/images/a.png', 'a');

        ThemeFiles::renamePathPrefix($theme, 'assets/images', 'assets/photos');

        $this->assertFalse(ThemeFiles::has($theme, 'assets/images/a.png'));
        $this->assertTrue(ThemeFiles::has($theme, 'assets/photos/a.png'));
        $this->assertTrue(ThemeFiles::hasAssetDirectory($theme, 'photos'));
    }

    /** @test */
    public function child_can_delete_parent_virtual_folder(): void
    {
        $parentDir = 'dbfiles-parent';
        $childDir = 'dbfiles-child';

        $this->createTheme($parentDir, "name: Parent\n");
        $this->createTheme($childDir, "name: Child\nparent: {$parentDir}\n");

        Theme::resetCache();

        $parent = Theme::load($parentDir);
        $child = Theme::load($childDir);

        $this->writeStorageFile($parent, 'assets/images/a.png', 'a');
        $this->writeStorageFile($parent, 'assets/images/b.png', 'b');

        $this->assertTrue(ThemeFiles::hasAssetDirectory($child, 'images'));
        $this->assertSame($parentDir, ThemeFiles::resolveAssetDirectoryOwner($child, 'images')->getDirName());

        ThemeFiles::deleteAssetsUnderPrefix($child, 'images');

        $this->assertFalse(ThemeFiles::hasAssetDirectory($child, 'images'));
        $this->assertFalse(ThemeFiles::has($child, 'assets/images/a.png'));
        $this->assertTrue(ThemeFiles::isTrashed($child, 'assets/images/a.png'));
        $this->assertTrue($this->storageExists($parent, 'assets/images/a.png'));
    }

    /** @test */
    public function orphan_metadata_can_be_purged_without_disk_bytes(): void
    {
        $theme = Theme::load($this->themeDir);
        $asset = new Asset($theme);
        $asset->fileName = 'orphan.png';
        $asset->content = 'orphan-bytes';
        $asset->save();

        $this->deleteStorageObject($theme, 'assets/orphan.png');

        $this->assertNull(Asset::inTheme($theme)->find('orphan.png'));

        ThemeFiles::delete($theme, 'assets/orphan.png');

        $this->assertSame(0, Db::table('cms_theme_files')
            ->where('source', $this->themeDir)
            ->where('path', 'assets/orphan.png')
            ->whereNull('content')
            ->count());
    }

    protected function createTheme(string $dirName, string $yaml): void
    {
        $path = themes_path($dirName);
        File::makeDirectory($path . '/assets', 0755, true, true);
        File::put($path . '/theme.yaml', $yaml);

        Db::table('cms_theme_files')->where('source', $dirName)->delete();
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
        return ThemeFiles::disk()->exists($theme->getDirName() . '/' . $path);
    }

    protected function deleteStorageObject(Theme $theme, string $path): void
    {
        ThemeFiles::disk()->delete($theme->getDirName() . '/' . $path);
    }

    protected function clearStorageFileDatasourceCache(): void
    {
        StorageFileDatasource::flushAllStorageCaches();
    }
}
