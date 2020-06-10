<?php

use October\Rain\Exception\ApplicationException;
use System\Classes\FileManifest;

class FileManifestTest extends TestCase
{
    /** @var FileManifest instance */
    protected $fileManifest;

    public function setUp(): void
    {
        parent::setUp();

        $this->fileManifest = new FileManifest(base_path('tests/fixtures/manifest/2'), ['test', 'test2']);
    }

    public function testGetFiles()
    {
        $this->assertEquals([
            '/modules/test/file1.php' => '02d1a1b4085289e12e9b025e125ae9f8',
            '/modules/test/file2.php' => 'a654089f3abf710809c34e2a82ced582',
            '/modules/test2/file1.php' => 'cd3d6fd5152d3e1cc02d3c2a971f12b3',
        ], $this->fileManifest->getFiles());
    }

    public function testGetModuleChecksums()
    {
        $this->assertEquals([
            'test' => 'a59012c67109b32fc9d188b388dc4293',
            'test2' => 'f6c6421627c68e60fb8e7a47f753b239',
        ], $this->fileManifest->getModuleChecksums());
    }

    public function testGetFilesInvalidRoot()
    {
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('Invalid root specified for the file manifest.');

        $this->fileManifest->setRoot(base_path('tests/fixtures/manifest/invalid'));

        $this->fileManifest->getFiles();
    }

    public function testSingleModule()
    {
        $this->fileManifest->setModules(['test']);

        $this->assertEquals([
            '/modules/test/file1.php' => '02d1a1b4085289e12e9b025e125ae9f8',
            '/modules/test/file2.php' => 'a654089f3abf710809c34e2a82ced582',
        ], $this->fileManifest->getFiles());

        $this->assertEquals([
            'test' => 'a59012c67109b32fc9d188b388dc4293',
        ], $this->fileManifest->getModuleChecksums());
    }
}
