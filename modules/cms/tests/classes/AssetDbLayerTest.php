<?php

use Cms\Classes\Asset;
use Cms\Classes\Theme;
use Cms\Models\SourceFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use October\Rain\Database\Schema\Blueprint;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AssetDbLayerTest extends TestCase
{
    /**
     * @var string source identifier used by all assertions, must match the
     * format produced by Asset::getSourceIdentifier() for the 'test' theme.
     */
    protected $source = 'theme.test.asset';

    /**
     * @var string diskPrefix for assets disk keys of the 'test' theme
     */
    protected $diskPrefix = 'themes/test/assets/';

    /**
     * @var string filesystem path to a fixture asset file
     */
    protected $fixtureFile;

    /**
     * @var array capturedInvalidations recorded from cms.asset.invalidate
     */
    protected $capturedInvalidations = [];

    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.active_theme', 'test');
        Event::forget('cms.theme.getActiveTheme');
        Theme::resetCache();

        $this->fixtureFile = base_path('modules/cms/tests/fixtures/themes/test/assets/css/style1.css');

        $this->createSourceFilesTable();

        Storage::fake('assets');

        $this->capturedInvalidations = [];
        Event::listen('cms.asset.invalidate', function ($theme, $diskPaths) {
            $this->capturedInvalidations[] = $diskPaths;
        });

        // Always start with the DB layer off; individual tests opt in.
        Config::set('cms.database_assets', false);
    }

    public function tearDown(): void
    {
        Schema::dropIfExists('cms_source_files');
        Event::forget('cms.asset.invalidate');

        parent::tearDown();
    }

    //
    // find
    //

    public function testFsReadWhenDbLayerOff()
    {
        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');

        $this->assertNotNull($asset);
        $this->assertEquals(file_get_contents($this->fixtureFile), $asset->content);
    }

    public function testFsFallbackWhenLayerOnAndNoRow()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');

        $this->assertNotNull($asset);
        $this->assertEquals(file_get_contents($this->fixtureFile), $asset->content);
    }

    public function testReadFromDbWhenLayerEnabled()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/style1.css',
            'assets',
            $this->diskPrefix.'css/style1.css',
            'body { color: blue; }'
        );

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');

        $this->assertNotNull($asset);
        $this->assertEquals('body { color: blue; }', $asset->content);
    }

    public function testTombstoneSuppressesFsCopy()
    {
        Config::set('cms.database_assets', true);

        SourceFile::tombstoneAt($this->source, 'css/style1.css');

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');

        $this->assertNull($asset, 'Tombstoned asset should report as missing even with a filesystem copy');
    }

    //
    // save
    //

    public function testSaveWritesToDiskAndRowNotFs()
    {
        Config::set('cms.database_assets', true);

        $originalFsContent = file_get_contents($this->fixtureFile);

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');
        $asset->content = 'body { color: red; }';
        $asset->save();

        $row = SourceFile::findByPath($this->source, 'css/style1.css');
        $this->assertNotNull($row);
        $this->assertTrue($row->isDiskBacked());
        $this->assertNull($row->content, 'Disk-backed row must not hold bytes inline');
        $this->assertEquals($this->diskPrefix.'css/style1.css', $row->disk_path);

        Storage::disk('assets')->assertExists($this->diskPrefix.'css/style1.css');
        $this->assertEquals(
            'body { color: red; }',
            Storage::disk('assets')->get($this->diskPrefix.'css/style1.css')
        );

        $this->assertEquals(
            $originalFsContent,
            file_get_contents($this->fixtureFile),
            'Filesystem copy must not be modified when DB layer is enabled'
        );
    }

    public function testSaveFiresInvalidationEvent()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');
        $asset->content = 'body {}';
        $asset->save();

        $this->assertCount(1, $this->capturedInvalidations);
        $this->assertEquals([$this->diskPrefix.'css/style1.css'], $this->capturedInvalidations[0]);
    }

    public function testSaveResurrectsTombstone()
    {
        Config::set('cms.database_assets', true);

        SourceFile::tombstoneAt($this->source, 'css/style1.css');

        $theme = Theme::load('test');
        $asset = Asset::inTheme($theme);
        $asset->fileName = 'css/style1.css';
        $asset->content = 'body { reborn: true; }';
        $asset->save();

        $row = SourceFile::findByPath($this->source, 'css/style1.css');
        $this->assertNotNull($row, 'Save should resurrect a tombstoned row, not produce a duplicate');
        $this->assertEquals('body { reborn: true; }', $row->getContents());

        $rowCount = SourceFile::withTrashed()
            ->bySource($this->source)
            ->byPath('css/style1.css')
            ->count();
        $this->assertEquals(1, $rowCount);
    }

    public function testSaveRenameTombstonesOldAndDeletesOldKey()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');
        $asset->content = 'body { moved: true; }';
        $asset->fileName = 'css/renamed.css';
        $asset->save();

        $newRow = SourceFile::findByPath($this->source, 'css/renamed.css');
        $this->assertNotNull($newRow);
        Storage::disk('assets')->assertExists($this->diskPrefix.'css/renamed.css');

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/style1.css')->exists(),
            'Old path must be tombstoned so the filesystem copy stays suppressed'
        );
        Storage::disk('assets')->assertMissing($this->diskPrefix.'css/style1.css');

        $this->assertCount(1, $this->capturedInvalidations);
        $this->assertEqualsCanonicalizing(
            [$this->diskPrefix.'css/renamed.css', $this->diskPrefix.'css/style1.css'],
            $this->capturedInvalidations[0]
        );
    }

    public function testSaveRenameCollisionWithFsFileRejected()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');
        $asset->fileName = 'css/style2.css';

        $this->expectException(ApplicationException::class);
        $asset->save();
    }

    public function testSaveRenameCollisionWithDbRowRejected()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/target.css',
            'assets',
            $this->diskPrefix.'css/target.css',
            'body {}'
        );

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');
        $asset->fileName = 'css/target.css';

        $this->expectException(ApplicationException::class);
        $asset->save();
    }

    public function testSaveRenameOntoTombstonedFsPathAllowed()
    {
        Config::set('cms.database_assets', true);

        SourceFile::tombstoneAt($this->source, 'css/style2.css');

        $theme = Theme::load('test');
        $asset = Asset::load($theme, 'css/style1.css');
        $asset->content = 'body {}';
        $asset->fileName = 'css/style2.css';
        $asset->save();

        $row = SourceFile::findByPath($this->source, 'css/style2.css');
        $this->assertNotNull($row, 'A tombstoned target path is free for reuse');
    }

    //
    // delete
    //

    public function testDeleteTombstonesAndRemovesDiskObject()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/style1.css',
            'assets',
            $this->diskPrefix.'css/style1.css',
            'body {}'
        );

        request()->merge(['fileName' => 'css/style1.css']);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->delete();

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/style1.css')->exists()
        );
        Storage::disk('assets')->assertMissing($this->diskPrefix.'css/style1.css');

        $this->assertFileExists($this->fixtureFile, 'Filesystem copy must not be deleted when DB layer is enabled');

        $this->assertCount(1, $this->capturedInvalidations);
        $this->assertEquals([$this->diskPrefix.'css/style1.css'], $this->capturedInvalidations[0]);
    }

    public function testDeleteOfFsOnlyAssetWritesTombstone()
    {
        Config::set('cms.database_assets', true);

        request()->merge(['fileName' => 'css/style1.css']);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->delete();

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/style1.css')->exists()
        );

        $this->assertNull(
            Asset::load($theme, 'css/style1.css'),
            'Deleted asset should report as missing across instances'
        );
    }

    //
    // Listing
    //

    public function testListingUnchangedWhenDbLayerOff()
    {
        $theme = Theme::load('test');
        $assets = Asset::listInTheme($theme, ['flatten' => true, 'filterFiles' => true]);

        $this->assertArrayHasKey('css/style1.css', $assets);
        $this->assertArrayHasKey('css/style2.css', $assets);
        $this->assertArrayHasKey('js/script1.js', $assets);
        $this->assertArrayHasKey('js/script2.js', $assets);
    }

    public function testListingIncludesDbOnlyFile()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/uploaded.css',
            'assets',
            $this->diskPrefix.'css/uploaded.css',
            'body {}'
        );

        $theme = Theme::load('test');
        $assets = Asset::listInTheme($theme, ['flatten' => true, 'filterFiles' => true]);

        $this->assertArrayHasKey('css/uploaded.css', $assets);
        $this->assertEquals(0, $assets['css/uploaded.css']['isFolder']);
        $this->assertTrue($assets['css/uploaded.css']['isEditable']);

        // Filesystem entries remain
        $this->assertArrayHasKey('css/style1.css', $assets);
    }

    public function testListingSuppressesTombstonedFsFile()
    {
        Config::set('cms.database_assets', true);

        SourceFile::tombstoneAt($this->source, 'css/style1.css');

        $theme = Theme::load('test');
        $assets = Asset::listInTheme($theme, ['flatten' => true, 'filterFiles' => true]);

        $this->assertArrayNotHasKey('css/style1.css', $assets);
        $this->assertArrayHasKey('css/style2.css', $assets);
    }

    public function testListingSynthesizesFoldersFromDbPaths()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'newdir/deep/file.css',
            'assets',
            $this->diskPrefix.'newdir/deep/file.css',
            'body {}'
        );

        $theme = Theme::load('test');
        $assets = Asset::listInTheme($theme, ['flatten' => true]);

        $this->assertArrayHasKey('newdir', $assets);
        $this->assertEquals(1, $assets['newdir']['isFolder']);
        $this->assertArrayHasKey('newdir/deep', $assets);
        $this->assertEquals(1, $assets['newdir/deep']['isFolder']);
        $this->assertArrayHasKey('newdir/deep/file.css', $assets);
        $this->assertEquals(0, $assets['newdir/deep/file.css']['isFolder']);
    }

    public function testListingHidesDbDotfiles()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertAt($this->source, 'newdir/.gitkeep', '');

        $theme = Theme::load('test');
        $assets = Asset::listInTheme($theme, ['flatten' => true]);

        $this->assertArrayHasKey('newdir', $assets, 'Placeholder row should synthesize its folder');
        $this->assertArrayNotHasKey('newdir/.gitkeep', $assets, 'Dotfile rows stay hidden from the listing');
    }

    //
    // Editor operations
    //

    public function testUploadWritesToDiskAndRow()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->upload($this->makeUploadedFile('upload.css', 'body { uploaded: true; }'), 'css');

        $row = SourceFile::findByPath($this->source, 'css/upload.css');
        $this->assertNotNull($row);
        $this->assertTrue($row->isDiskBacked());

        Storage::disk('assets')->assertExists($this->diskPrefix.'css/upload.css');
        $this->assertEquals(
            'body { uploaded: true; }',
            Storage::disk('assets')->get($this->diskPrefix.'css/upload.css')
        );

        $this->assertFileDoesNotExist(
            base_path('modules/cms/tests/fixtures/themes/test/assets/css/upload.css'),
            'Upload must not touch the local filesystem when DB layer is enabled'
        );

        $this->assertCount(1, $this->capturedInvalidations);
    }

    public function testUploadSanitisesSvg()
    {
        Config::set('cms.database_assets', true);

        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect/></svg>';

        $theme = Theme::load('test');
        Asset::inTheme($theme)->upload($this->makeUploadedFile('image.svg', $svg), 'css');

        $stored = Storage::disk('assets')->get($this->diskPrefix.'css/image.svg');
        $this->assertStringNotContainsString('<script>', $stored);
        $this->assertStringContainsString('<rect', $stored);
    }

    public function testRenameFsOnlyFileCreatesRowAndTombstone()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->rename('renamed.css', 'css/style1.css');

        $row = SourceFile::findByPath($this->source, 'css/renamed.css');
        $this->assertNotNull($row);
        $this->assertEquals(file_get_contents($this->fixtureFile), $row->getContents());
        Storage::disk('assets')->assertExists($this->diskPrefix.'css/renamed.css');

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/style1.css')->exists()
        );

        $this->assertFileExists($this->fixtureFile, 'Rename must not touch the local filesystem');
    }

    public function testRenameRowBackedFileMovesDiskObject()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/db-file.css',
            'assets',
            $this->diskPrefix.'css/db-file.css',
            'body { db: true; }'
        );

        $theme = Theme::load('test');
        Asset::inTheme($theme)->rename('db-renamed.css', 'css/db-file.css');

        Storage::disk('assets')->assertExists($this->diskPrefix.'css/db-renamed.css');
        Storage::disk('assets')->assertMissing($this->diskPrefix.'css/db-file.css');
        $this->assertEquals(
            'body { db: true; }',
            Storage::disk('assets')->get($this->diskPrefix.'css/db-renamed.css')
        );
    }

    public function testRenameOntoOccupiedTargetRejected()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');

        $this->expectException(ApplicationException::class);
        Asset::inTheme($theme)->rename('style2.css', 'css/style1.css');
    }

    public function testRenameDirectoryReKeysAllContents()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->rename('styles', 'css');

        foreach (['style1.css', 'style2.css'] as $file) {
            $row = SourceFile::findByPath($this->source, 'styles/'.$file);
            $this->assertNotNull($row, "Row for styles/{$file} should exist after directory rename");
            Storage::disk('assets')->assertExists($this->diskPrefix.'styles/'.$file);

            $this->assertTrue(
                SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/'.$file)->exists(),
                "Old path css/{$file} must be tombstoned"
            );
        }

        // Local filesystem stays untouched
        $this->assertFileExists($this->fixtureFile);

        // Listing shows only the new directory
        $assets = Asset::listInTheme($theme, ['flatten' => true]);
        $this->assertArrayHasKey('styles/style1.css', $assets);
        $this->assertArrayNotHasKey('css/style1.css', $assets);
    }

    public function testMoveFileIntoDirectory()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->move(['css/style1.css'], 'js');

        $this->assertNotNull(SourceFile::findByPath($this->source, 'js/style1.css'));
        Storage::disk('assets')->assertExists($this->diskPrefix.'js/style1.css');
        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/style1.css')->exists()
        );
    }

    public function testMoveDirectoryReKeysContents()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->createDirectory('nested', '/');
        Asset::inTheme($theme)->move(['js'], 'nested');

        $this->assertNotNull(SourceFile::findByPath($this->source, 'nested/js/script1.js'));
        $this->assertNotNull(SourceFile::findByPath($this->source, 'nested/js/script2.js'));
        Storage::disk('assets')->assertExists($this->diskPrefix.'nested/js/script1.js');

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('js/script1.js')->exists()
        );
    }

    public function testCreateDirectoryWritesPlaceholderRow()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->createDirectory('newdir', '/');

        $row = SourceFile::findByPath($this->source, 'newdir/.gitkeep');
        $this->assertNotNull($row);
        $this->assertFalse($row->isDiskBacked(), 'Placeholder rows stay inline with no disk object');

        $this->assertFileDoesNotExist(
            base_path('modules/cms/tests/fixtures/themes/test/assets/newdir'),
            'Directory creation must not touch the local filesystem'
        );

        $assets = Asset::listInTheme($theme, ['flatten' => true]);
        $this->assertArrayHasKey('newdir', $assets);
    }

    public function testCreateDirectoryCollisionWithFsDirRejected()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');

        $this->expectException(ApplicationException::class);
        Asset::inTheme($theme)->createDirectory('css', '/');
    }

    public function testDeletePathsTombstonesAndRemovesDiskObjects()
    {
        Config::set('cms.database_assets', true);

        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/db-file.css',
            'assets',
            $this->diskPrefix.'css/db-file.css',
            'body {}'
        );

        $theme = Theme::load('test');
        Asset::inTheme($theme)->deletePaths(['css/db-file.css', 'css/style1.css']);

        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/db-file.css')->exists()
        );
        $this->assertTrue(
            SourceFile::onlyTrashed()->bySource($this->source)->byPath('css/style1.css')->exists()
        );
        Storage::disk('assets')->assertMissing($this->diskPrefix.'css/db-file.css');

        $this->assertFileExists($this->fixtureFile, 'Delete must not touch the local filesystem');
    }

    public function testDeleteNonEmptyDirectoryRejected()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');

        $this->expectException(ApplicationException::class);
        Asset::inTheme($theme)->deletePaths(['css']);
    }

    public function testDeleteDbOnlyDirectoryRemovesPlaceholder()
    {
        Config::set('cms.database_assets', true);

        $theme = Theme::load('test');
        Asset::inTheme($theme)->createDirectory('newdir', '/');
        Asset::inTheme($theme)->deletePaths(['newdir']);

        $assets = Asset::listInTheme($theme, ['flatten' => true]);
        $this->assertArrayNotHasKey('newdir', $assets, 'Deleted db-only directory should leave the listing');
    }

    //
    // Round-trip via theme:copy
    //

    public function testThemeManagerImportWritesActiveRows()
    {
        $tempDir = $this->makeTempFixtureTheme();
        $tempSource = 'theme.'.basename($tempDir).'.asset';

        SourceFile::upsertOnDiskAt(
            $tempSource,
            'css/imported.css',
            'assets',
            'themes/'.basename($tempDir).'/assets/css/imported.css',
            'body { imported: true; }'
        );

        \Cms\Classes\ThemeManager::instance()->importDatabaseAssets(basename($tempDir));

        $importedFile = $tempDir.'/assets/css/imported.css';
        $this->assertFileExists($importedFile);
        $this->assertEquals('body { imported: true; }', file_get_contents($importedFile));

        $this->cleanupTempFixtureTheme($tempDir);
    }

    public function testThemeManagerImportDeletesForTombstones()
    {
        $tempDir = $this->makeTempFixtureTheme();
        $tempSource = 'theme.'.basename($tempDir).'.asset';

        file_put_contents($tempDir.'/assets/old.css', 'body {}');

        SourceFile::tombstoneAt($tempSource, 'old.css');

        \Cms\Classes\ThemeManager::instance()->importDatabaseAssets(basename($tempDir));

        $this->assertFileNotExists($tempDir.'/assets/old.css', 'Tombstoned rows must trigger filesystem deletion');

        $this->cleanupTempFixtureTheme($tempDir);
    }

    public function testThemeManagerImportWritesDirectoryPlaceholders()
    {
        $tempDir = $this->makeTempFixtureTheme();
        $tempSource = 'theme.'.basename($tempDir).'.asset';

        SourceFile::upsertAt($tempSource, 'newdir/.gitkeep', '');

        \Cms\Classes\ThemeManager::instance()->importDatabaseAssets(basename($tempDir));

        $this->assertFileExists($tempDir.'/assets/newdir/.gitkeep', 'Placeholder rows round-trip as keep files');

        $this->cleanupTempFixtureTheme($tempDir);
    }

    public function testThemeManagerPurgeRemovesAllRowsButKeepsDiskObjects()
    {
        SourceFile::upsertOnDiskAt(
            $this->source,
            'css/kept.css',
            'assets',
            $this->diskPrefix.'css/kept.css',
            'body {}'
        );
        SourceFile::tombstoneAt($this->source, 'css/gone.css');

        \Cms\Classes\ThemeManager::instance()->purgeDatabaseAssets('test');

        $remaining = SourceFile::withTrashed()->bySource($this->source)->count();
        $this->assertEquals(0, $remaining, 'Purge must hard-delete every row including tombstones');

        Storage::disk('assets')->assertExists(
            $this->diskPrefix.'css/kept.css',
            'body {}'
        );
    }

    //
    // Helpers
    //

    /**
     * makeTempFixtureTheme creates a writable theme directory under the
     * fixtures path so import/purge tests can verify filesystem effects
     * without mutating the shared 'test' theme.
     */
    protected function makeTempFixtureTheme(): string
    {
        $name = 'tmp-asset-'.bin2hex(random_bytes(4));
        $path = base_path('modules/cms/tests/fixtures/themes/'.$name);

        mkdir($path.'/assets', 0755, true);
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

    /**
     * makeUploadedFile builds a test-mode UploadedFile with the given name
     * and content.
     */
    protected function makeUploadedFile(string $fileName, string $content): UploadedFile
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'octest');
        file_put_contents($tempPath, $content);

        return new UploadedFile($tempPath, $fileName, null, null, true);
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
}
