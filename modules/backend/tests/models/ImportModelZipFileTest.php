<?php

use Backend\Models\ImportModel;
use October\Rain\Database\Model;
use System\Models\File as FileModel;

/**
 * ImportZipFileImportModel is a minimal import model exposing the ZIP file decoder.
 */
class ImportZipFileImportModel extends ImportModel
{
    public $rules = [];

    public function importData($results, $sessionKey = null)
    {
        return [];
    }
}

/**
 * ImportZipFileTargetModel is a plain model with file attachment relations.
 */
class ImportZipFileTargetModel extends Model
{
    public $attachOne = [
        'banner' => FileModel::class,
    ];

    public $attachMany = [
        'gallery' => FileModel::class,
    ];
}

/**
 * ImportZipFileTypedTargetModel declares field file types through a fieldset definition.
 */
class ImportZipFileTypedTargetModel extends ImportZipFileTargetModel
{
    public function getFieldsetDefinition()
    {
        return new class {
            public function getField($name)
            {
                return ['banner' => (object) ['fileTypes' => 'pdf'], 'gallery' => (object) ['fileTypes' => '*']][$name] ?? null;
            }
        };
    }
}

/**
 * ImportModelZipFileTest ensures files attached from a ZIP import follow the same type and vector rules as uploads.
 */
class ImportModelZipFileTest extends PluginTestCase
{
    /**
     * @var string importDir holds the extracted archive fixture.
     */
    protected $importDir;

    /**
     * setUp creates an extracted archive directory for each test.
     */
    public function setUp(): void
    {
        parent::setUp();

        $this->importDir = temp_path('import-test/' . uniqid('oc'));
        File::makeDirectory($this->importDir . '/files', 0755, true, true);
    }

    /**
     * tearDown removes the archive fixture and any attachments created on disk.
     */
    public function tearDown(): void
    {
        FileModel::all()->each(fn ($file) => $file->delete());
        File::deleteDirectory($this->importDir);

        parent::tearDown();
    }

    /**
     * testDisallowedFileTypesAreRejected ensures script-capable files cannot be attached through an import.
     */
    public function testDisallowedFileTypesAreRejected()
    {
        foreach (['x.html', 'x.phtml', 'x.php'] as $name) {
            $this->writeImportFile($name, '<script>alert(1)</script>');

            try {
                $this->decodeFile(new ImportZipFileTargetModel, 'banner', "files/{$name}");
                $this->fail("Expected {$name} to be rejected");
            }
            catch (ApplicationException $ex) {
                $this->assertStringContainsString($name, $ex->getMessage());
            }

            $this->assertNull(FileModel::where('file_name', $name)->first());
        }
    }

    /**
     * testAllowedFileIsAttached ensures files in the default type list still import.
     */
    public function testAllowedFileIsAttached()
    {
        $this->writeImportFile('notes.txt', 'Hello');

        $this->decodeFile(new ImportZipFileTargetModel, 'gallery', ['files/notes.txt']);

        $this->assertSame('Hello', FileModel::where('file_name', 'notes.txt')->first()->getContents());
    }

    /**
     * testSvgIsCleanedWithoutChangingSource ensures vector scripts are stripped from the attachment but not the source file.
     */
    public function testSvgIsCleanedWithoutChangingSource()
    {
        $svg = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="1" height="1"/></svg>';
        $this->writeImportFile('logo.svg', $svg);

        $this->decodeFile(new ImportZipFileTargetModel, 'banner', 'files/logo.svg');

        $contents = FileModel::where('file_name', 'logo.svg')->first()->getContents();
        $this->assertStringNotContainsString('<script', $contents);
        $this->assertStringContainsString('<rect', $contents);
        $this->assertSame($svg, File::get($this->importDir . '/files/logo.svg'));
    }

    /**
     * testFieldFileTypesAreRespected ensures a field's own file types take precedence over the default list.
     */
    public function testFieldFileTypesAreRespected()
    {
        $this->writeImportFile('notes.txt', 'Hello');
        $this->writeImportFile('guide.pdf', '%PDF-1.4');
        $this->writeImportFile('page.html', '<p>Page</p>');

        try {
            $this->decodeFile(new ImportZipFileTypedTargetModel, 'banner', 'files/notes.txt');
            $this->fail('Expected notes.txt to be rejected');
        }
        catch (ApplicationException $ex) {
            $this->assertNull(FileModel::where('file_name', 'notes.txt')->first());
        }

        $this->decodeFile(new ImportZipFileTypedTargetModel, 'banner', 'files/guide.pdf');
        $this->assertNotNull(FileModel::where('file_name', 'guide.pdf')->first());

        $this->decodeFile(new ImportZipFileTypedTargetModel, 'gallery', ['files/page.html']);
        $this->assertNotNull(FileModel::where('file_name', 'page.html')->first());
    }

    /**
     * writeImportFile places a file inside the extracted archive fixture.
     */
    protected function writeImportFile(string $name, string $contents): void
    {
        File::put($this->importDir . '/files/' . $name, $contents);
    }

    /**
     * decodeFile runs the ZIP file decoder for one attribute against the archive fixture.
     */
    protected function decodeFile(Model $model, string $attr, $value): void
    {
        $import = new ImportZipFileImportModel;
        self::setProtectedProperty($import, 'importFilesPath', $this->importDir);
        self::callProtectedMethod($import, 'decodeFileRelation', [$model, $attr, $value, 'import-test-session']);
    }
}
