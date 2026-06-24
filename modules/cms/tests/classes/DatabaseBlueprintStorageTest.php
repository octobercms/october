<?php

use Tailor\Classes\Blueprint;
use Cms\Classes\Theme;
use Cms\Classes\ThemeBlueprints;
use Cms\Classes\ThemeFiles;
use October\Tests\Concerns\PerformsMigrations;

/**
 * @group cms-database-files
 */
class DatabaseBlueprintStorageTest extends TestCase
{
    use PerformsMigrations;

    protected string $themeDir = 'dbstorage-blueprints';

    protected function setUp(): void
    {
        parent::setUp();

        $this->migrateModules();

        Config::set('cms.database_files', true);
        Storage::fake('local');

        $path = themes_path($this->themeDir);
        File::makeDirectory($path.'/blueprints', 0755, true, true);
        File::put($path.'/theme.yaml', "name: DB Blueprint Test\n");

        Theme::resetCache();
        Theme::load($this->themeDir);

        Db::table('cms_theme_storage')->where('source', $this->themeDir)->delete();
        Db::table('cms_theme_storage')->where('source', 'app')->delete();
    }

    /** @test */
    public function app_blueprint_save_writes_to_storage(): void
    {
        $blueprint = new Blueprint();
        $blueprint->fileName = 'blog/posts.yaml';
        $blueprint->content = "uuid: test-uuid\nname: Posts\ntype: entry\n";
        $blueprint->save();

        $this->assertTrue(ThemeBlueprints::has('app', 'blog/posts.yaml'));
        $this->assertTrue(ThemeFiles::disk()->exists('app/blueprints/blog/posts.yaml'));
    }

    /** @test */
    public function app_blueprint_find_loads_from_storage(): void
    {
        ThemeBlueprints::write(
            'app',
            'globals/site.yaml',
            "uuid: site-uuid\nname: Site\ntype: global\n"
        );

        $blueprint = Blueprint::load('globals/site.yaml');

        $this->assertNotNull($blueprint);
        $this->assertSame('Site', $blueprint->name);
    }

    /** @test */
    public function theme_blueprint_save_writes_to_storage(): void
    {
        $theme = Theme::load($this->themeDir);
        $blueprint = Blueprint::inDatasource($theme->getPath().'/blueprints', $theme->getDirName());
        $blueprint->fileName = 'landing/page.yaml';
        $blueprint->content = "uuid: page-uuid\nname: Landing\ntype: single\n";
        $blueprint->save();

        $this->assertTrue(ThemeBlueprints::has($this->themeDir, 'landing/page.yaml'));
        $this->assertTrue(ThemeFiles::disk()->exists($this->themeDir.'/blueprints/landing/page.yaml'));
    }

    /** @test */
    public function theme_blueprint_listing_merges_storage_and_filesystem(): void
    {
        File::put(
            themes_path($this->themeDir.'/blueprints/bundled.yaml'),
            "uuid: bundled\nname: Bundled\ntype: global\n"
        );

        ThemeBlueprints::write(
            $this->themeDir,
            'stored.yaml',
            "uuid: stored\nname: Stored\ntype: global\n"
        );

        $theme = Theme::load($this->themeDir);
        $blueprint = Blueprint::inDatasource($theme->getPath().'/blueprints', $theme->getDirName());
        $entries = $blueprint->get(['filterPath' => '', 'recursive' => false, 'flatten' => true]);

        $paths = array_column($entries, 'path');
        $this->assertContains('bundled.yaml', $paths);
        $this->assertContains('stored.yaml', $paths);
    }

    /** @test */
    public function blueprint_delete_removes_storage(): void
    {
        ThemeBlueprints::write(
            'app',
            'remove.yaml',
            "uuid: remove\nname: Remove\ntype: global\n"
        );

        $blueprint = Blueprint::load('remove.yaml');
        $blueprint->delete();

        $this->assertFalse(ThemeBlueprints::has('app', 'remove.yaml'));
        $this->assertFalse(ThemeFiles::disk()->exists('app/blueprints/remove.yaml'));
    }
}
