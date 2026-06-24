<?php

use Cms\Classes\Asset;
use Cms\Classes\Theme;
use Cms\Classes\ThemeFiles;
use October\Tests\Concerns\PerformsMigrations;

/**
 * @group cms-database-files
 */
class DatabaseThemeStorageTest extends TestCase
{
    use PerformsMigrations;

    protected string $themeDir = 'dbstorage-test';

    protected function setUp(): void
    {
        parent::setUp();

        $this->migrateModules();

        Config::set('cms.database_files', true);
        Storage::fake('local');
        Config::set('cms.editable_asset_types', ['css', 'js', 'png']);

        $path = themes_path($this->themeDir);
        File::makeDirectory($path.'/assets', 0755, true, true);
        File::put($path.'/theme.yaml', "name: DB Storage Test\n");

        Theme::resetCache();
        Theme::load($this->themeDir);

        Db::table('cms_theme_storage')->where('source', $this->themeDir)->delete();
    }

    /** @test */
    public function asset_upload_writes_metadata_and_disk_bytes(): void
    {
        $theme = Theme::load($this->themeDir);
        $asset = new Asset($theme);
        $asset->fileName = 'logo.png';
        $asset->content = 'binary-image-data';
        $asset->save();

        $this->assertTrue(ThemeFiles::isStored($theme, 'assets/logo.png'));
        $this->assertTrue(ThemeFiles::disk()->exists($this->themeDir.'/assets/logo.png'));

        $row = Db::table('cms_theme_storage')
            ->where('source', $this->themeDir)
            ->where('path', 'assets/logo.png')
            ->first();

        $this->assertNotNull($row);
        $this->assertSame(strlen('binary-image-data'), (int) $row->file_size);
    }

    /** @test */
    public function stored_assets_appear_in_theme_listing(): void
    {
        $theme = Theme::load($this->themeDir);
        ThemeFiles::put($theme, 'assets/images/nested.png', 'nested-bytes');

        $assets = Asset::listInTheme($theme, [
            'recursive' => false,
            'filterPath' => '',
        ]);

        $this->assertArrayHasKey('images', $assets);
        $this->assertSame(1, $assets['images']['isFolder']);
    }

    /** @test */
    public function asset_find_loads_from_storage(): void
    {
        $theme = Theme::load($this->themeDir);
        ThemeFiles::put($theme, 'assets/app.css', 'body {}');

        $asset = Asset::inTheme($theme)->find('app.css');

        $this->assertNotNull($asset);
        $this->assertSame('body {}', $asset->content);
    }

    /** @test */
    public function filesystem_assets_still_work_when_storage_is_enabled(): void
    {
        File::put(themes_path($this->themeDir.'/assets/theme.css'), 'theme {}');

        $theme = Theme::load($this->themeDir);
        $asset = Asset::inTheme($theme)->find('theme.css');

        $this->assertNotNull($asset);
        $this->assertSame('theme {}', $asset->content);
    }

    /** @test */
    public function delete_removes_metadata_and_disk_bytes(): void
    {
        $theme = Theme::load($this->themeDir);
        ThemeFiles::put($theme, 'assets/remove.png', 'bytes');

        ThemeFiles::delete($theme, 'assets/remove.png');

        $this->assertFalse(ThemeFiles::isStored($theme, 'assets/remove.png'));
        $this->assertFalse(ThemeFiles::disk()->exists($this->themeDir.'/assets/remove.png'));
        $this->assertSame(0, Db::table('cms_theme_storage')->where('source', $this->themeDir)->count());
    }

    /** @test */
    public function public_url_is_generated_for_stored_file(): void
    {
        $theme = Theme::load($this->themeDir);
        ThemeFiles::put($theme, 'assets/logo.png', 'bytes');

        $url = ThemeFiles::getPublicUrl($theme, 'assets/logo.png');

        $this->assertStringContainsString('assets/logo.png', $url);
    }
}
