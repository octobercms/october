<?php

use Cms\Classes\Lang;
use Cms\Classes\Theme;
use Cms\Classes\ThemeManager;
use Cms\Models\SourceFile;
use Illuminate\Support\Facades\Schema;
use October\Rain\Database\Schema\Blueprint;

class LangTest extends TestCase
{
    /**
     * @var string source identifier used by all assertions, must match the
     * format produced by Lang::getSourceIdentifier() for the 'test' theme.
     */
    protected $source = 'theme.test.lang';

    /**
     * @var string filesystem path to the fixture lang file
     */
    protected $fixtureFile;

    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.active_theme', 'test');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();

        $this->fixtureFile = base_path('modules/cms/tests/fixtures/themes/test/lang/en.json');

        $this->createSourceFilesTable();

        // Always start with the DB layer off; individual tests opt in.
        Config::set('cms.database_templates', false);
    }

    public function tearDown(): void
    {
        Schema::dropIfExists('cms_source_files');

        parent::tearDown();
    }

    public function testFsReadWhenDbLayerOff()
    {
        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'en.json');

        $this->assertNotNull($lang);
        $this->assertStringContainsString('"hello": "Hello"', $lang->content);
    }

    public function testReadFromDbWhenLayerEnabled()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'en.json', '{"hello":"Hola"}');

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'en.json');

        $this->assertNotNull($lang);
        $this->assertEquals('{"hello":"Hola"}', $lang->content);
    }

    public function testTombstoneSuppressesFsCopy()
    {
        Config::set('cms.database_templates', true);

        SourceFile::tombstoneAt($this->source, 'en.json');

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'en.json');

        $this->assertNull($lang, 'Tombstoned lang file should report as missing even with a filesystem copy');
    }

    public function testSaveWritesToDbNotFs()
    {
        Config::set('cms.database_templates', true);

        $originalFsContent = file_get_contents($this->fixtureFile);

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'en.json');
        $lang->content = '{"changed":"yes"}';
        $lang->save();

        $row = SourceFile::findByPath($this->source, 'en.json');
        $this->assertNotNull($row);
        $this->assertEquals('{"changed":"yes"}', $row->content);

        $this->assertEquals(
            $originalFsContent,
            file_get_contents($this->fixtureFile),
            'Filesystem copy must not be modified when DB layer is enabled'
        );
    }

    public function testSaveResurrectsTombstone()
    {
        Config::set('cms.database_templates', true);

        SourceFile::tombstoneAt($this->source, 'en.json');

        $theme = Theme::load('test');
        $lang = Lang::inTheme($theme);
        $lang->fileName = 'en.json';
        $lang->content = '{"reborn":"true"}';
        $lang->save();

        $row = SourceFile::findByPath($this->source, 'en.json');
        $this->assertNotNull($row, 'Save should resurrect a tombstoned row, not produce a duplicate');
        $this->assertEquals('{"reborn":"true"}', $row->content);

        $rowCount = SourceFile::withTrashed()
            ->bySource($this->source)
            ->byPath('en.json')
            ->count();
        $this->assertEquals(1, $rowCount, 'No duplicate rows should exist for the same (source, path)');
    }

    public function testRenameRejectsOccupiedDbTarget()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'en.json', '{"hello":"Hola"}');
        SourceFile::upsertAt($this->source, 'fr.json', '{"hello":"Bonjour"}');

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'en.json');
        $lang->fileName = 'fr.json';

        $this->expectException(ApplicationException::class);

        $lang->save();
    }

    public function testRenameRejectsOccupiedFsTarget()
    {
        Config::set('cms.database_templates', true);

        // fr.json exists only as a DB row; en.json exists on the filesystem
        // with no row and no tombstone, so it must count as occupied.
        SourceFile::upsertAt($this->source, 'fr.json', '{"hello":"Bonjour"}');

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'fr.json');
        $lang->fileName = 'en.json';

        $this->expectException(ApplicationException::class);

        $lang->save();
    }

    public function testRenameOntoTombstonedTargetSucceeds()
    {
        Config::set('cms.database_templates', true);

        // en.json has a filesystem copy but is tombstoned, so the target is
        // vacant and the rename must resurrect it.
        SourceFile::tombstoneAt($this->source, 'en.json');
        SourceFile::upsertAt($this->source, 'fr.json', '{"hello":"Bonjour"}');

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'fr.json');
        $lang->fileName = 'en.json';
        $lang->save();

        $row = SourceFile::findByPath($this->source, 'en.json');
        $this->assertNotNull($row, 'Rename onto a tombstoned target must resurrect the row');
        $this->assertEquals('{"hello":"Bonjour"}', $row->content);

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('fr.json')->exists(),
            'The original path must be tombstoned after the rename'
        );
    }

    public function testFindConsultsParentThemeDatabaseLayer()
    {
        Config::set('cms.database_templates', true);

        $childPath = $this->makeTempFixtureTheme();
        file_put_contents($childPath.'/theme.yaml', "name: Tmp\nparent: test\n");

        try {
            // The parent (test) theme has a DB row; the child has nothing
            SourceFile::upsertAt($this->source, 'en.json', '{"hello":"From parent DB"}');

            $child = Theme::load(basename($childPath));
            $lang = Lang::load($child, 'en.json');

            $this->assertNotNull($lang, 'Find must consult the parent theme database layer');
            $this->assertEquals('{"hello":"From parent DB"}', $lang->content);
        }
        finally {
            $this->cleanupTempFixtureTheme($childPath);
        }
    }

    public function testFindRespectsParentThemeTombstone()
    {
        Config::set('cms.database_templates', true);

        $childPath = $this->makeTempFixtureTheme();
        file_put_contents($childPath.'/theme.yaml', "name: Tmp\nparent: test\n");

        try {
            // The parent's filesystem copy is tombstoned in the parent source
            SourceFile::tombstoneAt($this->source, 'en.json');

            $child = Theme::load(basename($childPath));

            $this->assertNull(
                Lang::load($child, 'en.json'),
                'A parent theme tombstone must suppress the parent filesystem copy'
            );
        }
        finally {
            $this->cleanupTempFixtureTheme($childPath);
        }
    }

    public function testChildThemeTombstoneRevealsParentCopy()
    {
        Config::set('cms.database_templates', true);

        $childPath = $this->makeTempFixtureTheme();
        file_put_contents($childPath.'/theme.yaml', "name: Tmp\nparent: test\n");
        $childName = basename($childPath);

        try {
            // The child override is tombstoned; the parent filesystem copy
            // must be revealed, mirroring deletion of a child file on disk
            SourceFile::tombstoneAt('theme.'.$childName.'.lang', 'en.json');

            $child = Theme::load($childName);
            $lang = Lang::load($child, 'en.json');

            $this->assertNotNull($lang, 'A child tombstone must reveal the parent copy');
            $this->assertStringContainsString('"hello": "Hello"', $lang->content);
        }
        finally {
            $this->cleanupTempFixtureTheme($childPath);
        }
    }

    public function testDeleteTombstonesWithoutTouchingFs()
    {
        Config::set('cms.database_templates', true);

        $originalFsContent = file_get_contents($this->fixtureFile);

        $theme = Theme::load('test');
        $lang = Lang::load($theme, 'en.json');
        $lang->delete();

        $row = SourceFile::onlyTrashed()
            ->bySource($this->source)
            ->byPath('en.json')
            ->first();
        $this->assertNotNull($row, 'Delete in DB mode must write a tombstone');

        $this->assertEquals(
            $originalFsContent,
            file_get_contents($this->fixtureFile),
            'Delete must not touch the filesystem when DB layer is enabled'
        );

        $reloaded = Lang::load($theme, 'en.json');
        $this->assertNull($reloaded, 'After tombstone, find should report file as missing');
    }

    public function testListingMergesDbAndFs()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'fr.json', '{"bonjour":"oui"}');

        $theme = Theme::load('test');
        $list = Lang::listInTheme($theme);

        $paths = collect($list)->pluck('path')->all();
        $this->assertContains('en.json', $paths, 'Filesystem-backed lang file should appear in listing');
        $this->assertContains('fr.json', $paths, 'DB-only lang file should appear in listing');
    }

    public function testListingExcludesTombstones()
    {
        Config::set('cms.database_templates', true);

        SourceFile::tombstoneAt($this->source, 'en.json');

        $theme = Theme::load('test');
        $list = Lang::listInTheme($theme);

        $paths = collect($list)->pluck('path')->all();
        $this->assertNotContains('en.json', $paths, 'Tombstoned lang file must be excluded from listing');
    }

    public function testThemeManagerImportWritesActiveRows()
    {
        $tempDir = $this->makeTempFixtureTheme();

        SourceFile::upsertAt('theme.'.basename($tempDir).'.lang', 'es.json', '{"hola":"si"}');

        ThemeManager::instance()->importDatabaseLangs(basename($tempDir));

        $importedFile = $tempDir.'/lang/es.json';
        $this->assertFileExists($importedFile);
        $this->assertEquals('{"hola":"si"}', file_get_contents($importedFile));

        $this->cleanupTempFixtureTheme($tempDir);
    }

    public function testThemeManagerImportDeletesForTombstones()
    {
        $tempDir = $this->makeTempFixtureTheme();
        file_put_contents($tempDir.'/lang/en.json', '{"hello":"Hello"}');

        SourceFile::tombstoneAt('theme.'.basename($tempDir).'.lang', 'en.json');

        ThemeManager::instance()->importDatabaseLangs(basename($tempDir));

        $this->assertFileNotExists($tempDir.'/lang/en.json', 'Tombstoned rows must trigger filesystem deletion');

        $this->cleanupTempFixtureTheme($tempDir);
    }

    public function testThemeManagerPurgeRemovesAllRows()
    {
        SourceFile::upsertAt($this->source, 'en.json', '{"x":1}');
        SourceFile::tombstoneAt($this->source, 'fr.json');

        ThemeManager::instance()->purgeDatabaseLangs('test');

        $remaining = SourceFile::withTrashed()->bySource($this->source)->count();
        $this->assertEquals(0, $remaining, 'Purge must hard-delete every row including tombstones');
    }

    public function testRuntimeTranslationReflectsDatabaseContent()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'en.json', '{"hello":"Hola desde DB"}');

        $this->bootTestTheme();

        $this->assertEquals('Hola desde DB', trans('hello'));
    }

    public function testRuntimeTranslationFallsBackToFilesystemWhenNoRow()
    {
        Config::set('cms.database_templates', true);

        // No DB row — runtime should still find the filesystem value because
        // the locale was never claimed via addJsonLines.
        \Lang::addJsonPath(base_path('modules/cms/tests/fixtures/themes/test/lang'));
        $this->bootTestTheme();

        $this->assertEquals('Hello', trans('hello'));
    }

    public function testRuntimeTranslationRespectsTombstone()
    {
        Config::set('cms.database_templates', true);

        SourceFile::tombstoneAt($this->source, 'en.json');

        $this->bootTestTheme();

        // Tombstoned: ThemeManager calls addJsonLines(en, []) which makes the
        // DB authoritative for that locale and suppresses the filesystem
        // file. Translator returns the key itself as the standard
        // "no translation found" sentinel.
        $this->assertEquals('hello', trans('hello'));
    }

    public function testRuntimeTranslationIgnoresDatabaseWhenFlagOff()
    {
        // Flag stays off: DB row should not influence runtime translation.
        SourceFile::upsertAt($this->source, 'en.json', '{"hello":"Should not appear"}');

        \Lang::addJsonPath(base_path('modules/cms/tests/fixtures/themes/test/lang'));
        $this->bootTestTheme();

        $this->assertEquals('Hello', trans('hello'));
    }

    //
    // Helpers
    //

    /**
     * bootTestTheme exercises ThemeManager::bootTheme so the runtime
     * translation path is set up the same way a real request would. Resets
     * any prior boot state, the translator's loaded cache, and the
     * loader's accumulated JSON lines so each test starts clean.
     */
    protected function bootTestTheme(): void
    {
        $loader = App::make('translation.loader');
        $this->setProtectedProperty($loader, 'jsonLines', []);

        $translator = App::make('translator');
        $this->setProtectedProperty($translator, 'loaded', []);

        $manager = ThemeManager::instance();
        $this->setProtectedProperty($manager, 'bootedThemes', []);

        $this->callProtectedMethod($manager, 'bootTheme', [Theme::load('test')]);
    }

    protected function createSourceFilesTable(): void
    {
        if (Schema::hasTable('cms_source_files')) {
            Schema::drop('cms_source_files');
        }

        Schema::create('cms_source_files', function (Blueprint $table) {
            $table->increments('id');
            $table->string('source')->index();
            $table->string('path')->index();
            $table->longText('content')->nullable();
            $table->string('disk')->nullable();
            $table->string('disk_path')->nullable();
            $table->integer('file_size')->unsigned()->default(0);
            $table->string('mime_type')->nullable();
            $table->timestamps();
            $table->dateTime('deleted_at')->nullable();
        });
    }

    /**
     * makeTempFixtureTheme creates a writable theme directory under the
     * fixtures path so import/purge tests can verify filesystem effects
     * without mutating the shared 'test' theme.
     */
    protected function makeTempFixtureTheme(): string
    {
        $name = 'tmp-lang-'.bin2hex(random_bytes(4));
        $path = base_path('modules/cms/tests/fixtures/themes/'.$name);

        mkdir($path.'/lang', 0755, true);
        file_put_contents($path.'/theme.yaml', "name: Tmp\n");

        return $path;
    }

    protected function cleanupTempFixtureTheme(string $path): void
    {
        if (!is_dir($path)) {
            return;
        }

        File::deleteDirectory($path);
    }
}
