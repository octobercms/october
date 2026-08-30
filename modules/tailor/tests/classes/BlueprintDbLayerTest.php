<?php

use Cms\Models\SourceFile;
use Tailor\Classes\Blueprint;
use Illuminate\Support\Facades\Schema;
use October\Rain\Database\Schema\Blueprint as SchemaBlueprint;

/**
 * BlueprintDbLayerTest covers the cms.database_templates pathway for
 * Tailor blueprints: SourceFile-backed reads, writes, tombstones and
 * listing, scoped to the app blueprint datasource.
 */
class BlueprintDbLayerTest extends TestCase
{
    /**
     * @var string source identifier matching Blueprint::getSourceIdentifier()
     * for the default app blueprint datasource.
     */
    protected $source = 'app.blueprint';

    /**
     * @var string isolated blueprint directory created per test
     */
    protected $blueprintsDir;

    public function setUp(): void
    {
        parent::setUp();

        $this->createSourceFilesTable();

        $this->blueprintsDir = base_path('modules/tailor/tests/fixtures/db-layer-'.bin2hex(random_bytes(4)));
        mkdir($this->blueprintsDir, 0755, true);

        Blueprint::setDefaultDatasource($this->blueprintsDir);

        Config::set('cms.database_templates', false);
    }

    public function tearDown(): void
    {
        if (is_dir($this->blueprintsDir)) {
            File::deleteDirectory($this->blueprintsDir);
        }

        Schema::dropIfExists('cms_source_files');

        parent::tearDown();
    }

    public function testFsReadWhenDbLayerOff()
    {
        $this->writeFsBlueprint('entry.yaml', "uuid: 11111111-1111-1111-1111-111111111111\ntype: entry\nhandle: Test\nname: Test\n");

        $blueprint = Blueprint::load('entry.yaml');

        $this->assertNotNull($blueprint);
        $this->assertEquals('Test', $blueprint->handle);
    }

    public function testReadFromDbWhenLayerEnabled()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt(
            $this->source,
            'entry.yaml',
            "uuid: 22222222-2222-2222-2222-222222222222\ntype: entry\nhandle: FromDb\nname: From DB\n"
        );

        $blueprint = Blueprint::load('entry.yaml');

        $this->assertNotNull($blueprint);
        $this->assertEquals('FromDb', $blueprint->handle);
        $this->assertEquals('22222222-2222-2222-2222-222222222222', $blueprint->uuid);
    }

    public function testDbRowOverridesFs()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('entry.yaml', "uuid: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa\ntype: entry\nhandle: FromFs\nname: From FS\n");

        SourceFile::upsertAt(
            $this->source,
            'entry.yaml',
            "uuid: bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb\ntype: entry\nhandle: FromDb\nname: From DB\n"
        );

        $blueprint = Blueprint::load('entry.yaml');

        $this->assertNotNull($blueprint);
        $this->assertEquals('FromDb', $blueprint->handle, 'DB row must override filesystem copy when layer enabled');
    }

    public function testTombstoneSuppressesFsCopy()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('entry.yaml', "uuid: cccccccc-cccc-cccc-cccc-cccccccccccc\ntype: entry\nhandle: Stays\nname: Stays\n");

        SourceFile::tombstoneAt($this->source, 'entry.yaml');

        $blueprint = Blueprint::load('entry.yaml');

        $this->assertNull($blueprint, 'Tombstoned blueprint must report as missing even with FS copy present');
    }

    public function testSaveWritesToDbNotFs()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('entry.yaml', "uuid: dddddddd-dddd-dddd-dddd-dddddddddddd\ntype: entry\nhandle: Initial\nname: Initial\n");

        $originalFsContent = file_get_contents($this->blueprintsDir.'/entry.yaml');

        $blueprint = Blueprint::load('entry.yaml');
        $blueprint->content = "uuid: dddddddd-dddd-dddd-dddd-dddddddddddd\ntype: entry\nhandle: Changed\nname: Changed\n";
        $blueprint->save();

        $row = SourceFile::findByPath($this->source, 'entry.yaml');
        $this->assertNotNull($row);
        $this->assertStringContainsString('handle: Changed', $row->content);

        $this->assertEquals(
            $originalFsContent,
            file_get_contents($this->blueprintsDir.'/entry.yaml'),
            'Filesystem copy must not be touched when DB layer is enabled'
        );
    }

    public function testSaveInjectsUuidInDbMode()
    {
        Config::set('cms.database_templates', true);

        // Author writes content with no uuid; save() must generate one
        // regardless of storage layer.
        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $blueprint->fileName = 'entry.yaml';
        $blueprint->content = "type: entry\nhandle: NoUuid\nname: No Uuid\n";
        $blueprint->forceSave();

        $row = SourceFile::findByPath($this->source, 'entry.yaml');
        $this->assertNotNull($row);
        $this->assertStringStartsWith('uuid: ', $row->content, 'save() must inject UUID even when writing to DB');
    }

    public function testSaveResurrectsTombstone()
    {
        Config::set('cms.database_templates', true);

        SourceFile::tombstoneAt($this->source, 'entry.yaml');

        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $blueprint->fileName = 'entry.yaml';
        $blueprint->content = "uuid: eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee\ntype: entry\nhandle: Reborn\nname: Reborn\n";
        $blueprint->forceSave();

        $row = SourceFile::findByPath($this->source, 'entry.yaml');
        $this->assertNotNull($row);
        $this->assertStringContainsString('handle: Reborn', $row->content);

        $rowCount = SourceFile::withTrashed()
            ->bySource($this->source)
            ->byPath('entry.yaml')
            ->count();
        $this->assertEquals(1, $rowCount, 'Save must resurrect the tombstone instead of creating a duplicate row');
    }

    public function testDeleteTombstonesWithoutTouchingFs()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('entry.yaml', "uuid: ffffffff-ffff-ffff-ffff-ffffffffffff\ntype: entry\nhandle: ToDelete\nname: To Delete\n");
        $originalFsContent = file_get_contents($this->blueprintsDir.'/entry.yaml');

        $blueprint = Blueprint::load('entry.yaml');
        $blueprint->delete();

        $row = SourceFile::onlyTrashed()
            ->bySource($this->source)
            ->byPath('entry.yaml')
            ->first();
        $this->assertNotNull($row, 'Delete in DB mode must write a tombstone');

        $this->assertEquals(
            $originalFsContent,
            file_get_contents($this->blueprintsDir.'/entry.yaml'),
            'Delete in DB mode must not touch the filesystem'
        );

        $reloaded = Blueprint::load('entry.yaml');
        $this->assertNull($reloaded, 'After tombstone, find should report blueprint as missing');
    }

    public function testListingMergesDbAndFs()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('a.yaml', "uuid: 99999999-9999-9999-9999-999999999999\ntype: entry\nhandle: A\nname: A\n");

        SourceFile::upsertAt(
            $this->source,
            'b.yaml',
            "uuid: 88888888-8888-8888-8888-888888888888\ntype: entry\nhandle: B\nname: B\n"
        );

        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $paths = collect($blueprint->get(['flatten' => true, 'filterEditable' => false]))->pluck('path')->all();

        $this->assertContains('a.yaml', $paths, 'FS blueprint should appear in listing');
        $this->assertContains('b.yaml', $paths, 'DB-only blueprint should appear in listing');
    }

    public function testListingExcludesTombstones()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('a.yaml', "uuid: 77777777-7777-7777-7777-777777777777\ntype: entry\nhandle: A\nname: A\n");

        SourceFile::tombstoneAt($this->source, 'a.yaml');

        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $paths = collect($blueprint->get(['flatten' => true, 'filterEditable' => false]))->pluck('path')->all();

        $this->assertNotContains('a.yaml', $paths, 'Tombstoned blueprint must be excluded from listing');
    }

    public function testThemeManagerImportWritesActiveRows()
    {
        SourceFile::upsertAt(
            $this->source,
            'imported.yaml',
            "uuid: 66666666-6666-6666-6666-666666666666\ntype: entry\nhandle: Imported\nname: Imported\n"
        );

        \Cms\Classes\ThemeManager::instance()->importDatabaseBlueprints('test');

        $importedFile = app_path('blueprints/imported.yaml');
        $this->assertFileExists($importedFile);
        $this->assertStringContainsString('handle: Imported', file_get_contents($importedFile));

        @unlink($importedFile);
    }

    public function testThemeManagerPurgeRemovesAllRows()
    {
        SourceFile::upsertAt($this->source, 'a.yaml', '{}');
        SourceFile::tombstoneAt($this->source, 'b.yaml');

        \Cms\Classes\ThemeManager::instance()->purgeDatabaseBlueprints('test');

        $remaining = SourceFile::withTrashed()->bySource($this->source)->count();
        $this->assertEquals(0, $remaining, 'Purge must hard-delete every row including tombstones');
    }

    public function testListingScopesDbRowsToTheirDirectory()
    {
        Config::set('cms.database_templates', true);

        // Root-level DB row plus two empty filesystem directories
        mkdir($this->blueprintsDir.'/hello');
        mkdir($this->blueprintsDir.'/world');

        SourceFile::upsertAt($this->source, 'new-single.yaml', "type: single\nhandle: NewSingle\nname: New Single\n");

        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $entries = collect($blueprint->get(['flatten' => true, 'filterEditable' => false]));

        $occurrences = $entries->where('path', 'new-single.yaml')->count();
        $this->assertEquals(1, $occurrences, 'Root-level DB row must appear exactly once, not inside every directory');

        $this->assertEquals(0, $entries->where('path', 'hello/new-single.yaml')->count());
        $this->assertEquals(0, $entries->where('path', 'world/new-single.yaml')->count());
    }

    public function testListingShowsNestedDbRowOnceUnderItsFolder()
    {
        Config::set('cms.database_templates', true);

        mkdir($this->blueprintsDir.'/categories');

        SourceFile::upsertAt($this->source, 'categories/wiki.yaml', "type: entry\nhandle: Wiki\nname: Wiki\n");

        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $entries = collect($blueprint->get(['flatten' => true, 'filterEditable' => false]));

        $occurrences = $entries->where('path', 'categories/wiki.yaml')->count();
        $this->assertEquals(1, $occurrences, 'Nested DB row must appear exactly once, under its own directory');
    }

    public function testListingSurfacesVirtualFolderForDbOnlySubdirectory()
    {
        Config::set('cms.database_templates', true);

        // No filesystem directory exists for this path prefix
        SourceFile::upsertAt($this->source, 'virtual/wiki.yaml', "type: entry\nhandle: Wiki\nname: Wiki\n");

        $blueprint = Blueprint::inDatasource($this->blueprintsDir);
        $entries = collect($blueprint->get(['flatten' => true, 'filterEditable' => false]));

        $folder = $entries->first(function ($entry) {
            return $entry['path'] === 'virtual' && $entry['isFolder'];
        });
        $this->assertNotNull($folder, 'A DB-only subdirectory must surface as a folder entry');

        $occurrences = $entries->where('path', 'virtual/wiki.yaml')->count();
        $this->assertEquals(1, $occurrences, 'The nested DB-only row must be reachable through the virtual folder');
    }

    public function testOperationDeleteTombstonesDbOnlyBlueprint()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'entry.yaml', "type: entry\nhandle: DbOnly\nname: Db Only\n");

        (new Blueprint)->deletePaths(['entry.yaml']);

        $this->assertNull(SourceFile::findByPath($this->source, 'entry.yaml'));
        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('entry.yaml')->exists(),
            'Delete of a DB-only blueprint must leave a tombstone'
        );
        $this->assertNull(Blueprint::load('entry.yaml'));
    }

    public function testOperationDeleteTombstonesFsCopyWithoutTouchingIt()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('entry.yaml', "type: entry\nhandle: FsCopy\nname: Fs Copy\n");

        (new Blueprint)->deletePaths(['entry.yaml']);

        $this->assertFileExists($this->blueprintsDir.'/entry.yaml', 'Delete in DB mode must not touch the filesystem');
        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('entry.yaml')->exists(),
            'Delete must tombstone the filesystem copy so it propagates'
        );
        $this->assertNull(Blueprint::load('entry.yaml'));
    }

    public function testOperationDeleteRefusesDirectoryWithActiveRows()
    {
        Config::set('cms.database_templates', true);

        mkdir($this->blueprintsDir.'/categories');
        SourceFile::upsertAt($this->source, 'categories/wiki.yaml', "type: entry\nhandle: Wiki\nname: Wiki\n");

        $this->expectException(ApplicationException::class);

        (new Blueprint)->deletePaths(['categories']);
    }

    public function testOperationRenameMovesDbRow()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'old.yaml', "type: entry\nhandle: Renamed\nname: Renamed\n");

        (new Blueprint)->rename('new.yaml', 'old.yaml');

        $this->assertNull(SourceFile::findByPath($this->source, 'old.yaml'));
        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('old.yaml')->exists(),
            'Rename must tombstone the original path'
        );

        $row = SourceFile::findByPath($this->source, 'new.yaml');
        $this->assertNotNull($row, 'Rename must create an active row at the new path');
        $this->assertStringContainsString('handle: Renamed', $row->content);
    }

    public function testOperationRenameLiftsFsCopyIntoDb()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('old.yaml', "type: entry\nhandle: FromFs\nname: From Fs\n");

        (new Blueprint)->rename('new.yaml', 'old.yaml');

        $this->assertFileExists($this->blueprintsDir.'/old.yaml', 'Rename in DB mode must not touch the filesystem');

        $row = SourceFile::findByPath($this->source, 'new.yaml');
        $this->assertNotNull($row, 'Rename must lift the filesystem content into a row at the new path');
        $this->assertStringContainsString('handle: FromFs', $row->content);

        $this->assertNull(Blueprint::load('old.yaml'), 'Old path must be suppressed by its tombstone');
        $this->assertNotNull(Blueprint::load('new.yaml'));
    }

    public function testSaveRenameRejectsFsOccupiedTarget()
    {
        Config::set('cms.database_templates', true);

        // b.yaml exists only on the filesystem with no row and no tombstone,
        // so it must count as occupied when renaming a.yaml onto it.
        $this->writeFsBlueprint('b.yaml', "uuid: 33333333-3333-3333-3333-333333333333\ntype: entry\nhandle: B\nname: B\n");
        SourceFile::upsertAt($this->source, 'a.yaml', "uuid: 44444444-4444-4444-4444-444444444444\ntype: entry\nhandle: A\nname: A\n");

        $blueprint = Blueprint::load('a.yaml');
        $blueprint->fileName = 'b.yaml';

        $this->expectException(ApplicationException::class);

        $blueprint->forceSave();
    }

    public function testOperationRenameRejectsOccupiedTarget()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'a.yaml', "type: entry\nhandle: A\nname: A\n");
        SourceFile::upsertAt($this->source, 'b.yaml', "type: entry\nhandle: B\nname: B\n");

        $this->expectException(ApplicationException::class);

        (new Blueprint)->rename('b.yaml', 'a.yaml');
    }

    public function testOperationRenameRejectsFsOccupiedTarget()
    {
        Config::set('cms.database_templates', true);

        SourceFile::upsertAt($this->source, 'a.yaml', "type: entry\nhandle: A\nname: A\n");
        $this->writeFsBlueprint('b.yaml', "type: entry\nhandle: B\nname: B\n");

        $this->expectException(ApplicationException::class);

        (new Blueprint)->rename('b.yaml', 'a.yaml');
    }

    public function testOperationRenameDirectoryRewritesRowPaths()
    {
        Config::set('cms.database_templates', true);

        mkdir($this->blueprintsDir.'/olddir');
        SourceFile::upsertAt($this->source, 'olddir/one.yaml', "type: entry\nhandle: One\nname: One\n");
        SourceFile::tombstoneAt($this->source, 'olddir/two.yaml');

        (new Blueprint)->rename('newdir', 'olddir');

        $this->assertDirectoryExists($this->blueprintsDir.'/newdir');
        $this->assertNotNull(SourceFile::findByPath($this->source, 'newdir/one.yaml'));
        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('newdir/two.yaml')->exists(),
            'Directory rename must carry tombstones to the new prefix'
        );
        $this->assertEquals(
            0,
            SourceFile::withTrashed()->bySource($this->source)->byPathPrefix('olddir')->count(),
            'No rows may remain under the old prefix'
        );
    }

    public function testOperationMoveRelocatesDbRow()
    {
        Config::set('cms.database_templates', true);

        mkdir($this->blueprintsDir.'/subdir');
        SourceFile::upsertAt($this->source, 'entry.yaml', "type: entry\nhandle: Moved\nname: Moved\n");

        (new Blueprint)->move(['entry.yaml'], 'subdir');

        $this->assertNull(SourceFile::findByPath($this->source, 'entry.yaml'));

        $row = SourceFile::findByPath($this->source, 'subdir/entry.yaml');
        $this->assertNotNull($row, 'Move must create an active row at the destination path');
        $this->assertStringContainsString('handle: Moved', $row->content);
    }

    public function testOperationUploadWritesDbRow()
    {
        Config::set('cms.database_templates', true);

        $tempFile = tempnam(sys_get_temp_dir(), 'bp');
        file_put_contents($tempFile, "type: entry\nhandle: Uploaded\nname: Uploaded\n");

        $uploadedFile = new \Symfony\Component\HttpFoundation\File\UploadedFile(
            $tempFile,
            'uploaded.yaml',
            'application/yaml',
            null,
            true
        );

        (new Blueprint)->upload($uploadedFile, 'subdir');

        $row = SourceFile::findByPath($this->source, 'subdir/uploaded.yaml');
        $this->assertNotNull($row, 'Upload must create an active row at the destination path');
        $this->assertStringContainsString('handle: Uploaded', $row->content);

        $this->assertFileDoesNotExist(
            $this->blueprintsDir.'/subdir/uploaded.yaml',
            'Upload in DB mode must not write to the filesystem'
        );

        @unlink($tempFile);
    }

    public function testSourceDiscoveryDetectsDbOnlyBlueprints()
    {
        Config::set('cms.database_templates', true);

        $method = new ReflectionMethod(Blueprint::class, 'themeHasDbBlueprints');

        $this->assertFalse(
            $method->invoke(null, 'demo'),
            'Discovery must not report a theme with no rows'
        );

        SourceFile::upsertAt('theme.demo.blueprint', 'entry.yaml', "type: entry\nhandle: E\nname: E\n");

        $this->assertTrue(
            $method->invoke(null, 'demo'),
            'Discovery must report a theme with active rows even without a filesystem directory'
        );

        // The database layer being disabled must gate discovery entirely
        Config::set('cms.database_templates', false);

        $this->assertFalse(
            $method->invoke(null, 'demo'),
            'Discovery must not consult rows when the database layer is disabled'
        );

        // Tombstones alone must not surface a datasource
        Config::set('cms.database_templates', true);
        SourceFile::tombstoneAt('theme.demo.blueprint', 'entry.yaml');

        $this->assertFalse(
            $method->invoke(null, 'demo'),
            'A theme containing only tombstones must not be surfaced'
        );
    }

    public function testIndexerMtimeHonorsPerThemeDatabaseFlag()
    {
        Config::set('cms.database_templates', false);

        SourceFile::upsertAt('theme.demo.blueprint', 'entry.yaml', "type: entry\nhandle: E\nname: E\n");

        $indexer = \Tailor\Classes\BlueprintIndexer::instance();
        $method = new ReflectionMethod(\Tailor\Classes\BlueprintIndexer::class, 'lastBlueprintSourceFileMtime');

        $this->assertEquals(
            0,
            $method->invoke($indexer, null),
            'Rows must not be consulted when no flag enables the database layer'
        );

        // Seed the per-theme flag without requiring a theme.yaml on disk
        $theme = \Cms\Classes\Theme::load('demo');
        (function () {
            $this->configCache = ['database' => true];
        })->call($theme);

        $this->assertGreaterThan(
            0,
            $method->invoke($indexer, $theme),
            'A per-theme database flag must surface row changes when the global flag is off'
        );
    }

    public function testGetMtimeByNameConsultsDatabaseLayer()
    {
        Config::set('cms.database_templates', true);

        $row = SourceFile::upsertAt($this->source, 'entry.yaml', "type: entry\nhandle: E\nname: E\n");

        $this->assertEquals(
            $row->updated_at->timestamp,
            Blueprint::getMtimeByName('entry.yaml'),
            'Mtime must come from the row when the database layer is enabled'
        );

        SourceFile::tombstoneAt($this->source, 'entry.yaml');

        $this->assertNull(
            Blueprint::getMtimeByName('entry.yaml'),
            'A tombstoned blueprint must report no mtime'
        );
    }

    public function testGetMtimeByNameFallsBackToFilesystem()
    {
        Config::set('cms.database_templates', true);

        $this->writeFsBlueprint('entry.yaml', "type: entry\nhandle: E\nname: E\n");

        $this->assertEquals(
            filemtime($this->blueprintsDir.'/entry.yaml'),
            Blueprint::getMtimeByName('entry.yaml'),
            'Mtime must fall back to the filesystem when no row exists'
        );
    }

    public function testChildThemeInheritsParentDbBlueprints()
    {
        Config::set('cms.database_templates', true);
        Config::set('cms.active_theme', 'childtest');
        \Cms\Classes\Theme::resetCache();
        Blueprint::resetDatasourceCache();

        try {
            // Row exists only in the parent theme source, with no matching file on disk
            SourceFile::upsertAt(
                'theme.parenttest.blueprint',
                'course.yaml',
                "uuid: 55555555-5555-5555-5555-555555555555\ntype: entry\nhandle: Course\nname: Course\n"
            );

            $method = new ReflectionMethod(Blueprint::class, 'getDefaultActiveTheme');
            $this->assertArrayHasKey(
                'parenttest',
                $method->invoke(null),
                'Parent theme must surface as an active datasource for the child theme'
            );

            $blueprint = \Tailor\Classes\BlueprintIndexer::instance()->findSectionByHandle('Course');
            $this->assertNotNull($blueprint, 'Parent theme DB blueprint must resolve when the child theme is active');
            $this->assertEquals('55555555-5555-5555-5555-555555555555', $blueprint->uuid);
        }
        finally {
            Config::set('cms.active_theme', 'test');
            \Cms\Classes\Theme::resetCache();
            Blueprint::resetDatasourceCache();
        }
    }

    //
    // Helpers
    //

    protected function createSourceFilesTable(): void
    {
        if (Schema::hasTable('cms_source_files')) {
            Schema::drop('cms_source_files');
        }

        Schema::create('cms_source_files', function (SchemaBlueprint $table) {
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

    protected function writeFsBlueprint(string $relativePath, string $content): void
    {
        $fullPath = $this->blueprintsDir.'/'.$relativePath;
        $dir = dirname($fullPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        file_put_contents($fullPath, $content);
    }
}
