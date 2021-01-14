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
            '/modules/test/file1.php' => '6f9b0b94528a85b2a6bb67b5621e074aef1b4c9fc9ee3ea1bd69100ea14cb3db',
            '/modules/test/file2.php' => '96ae9f6b6377ad29226ea169f952de49fc29ae895f18a2caed76aeabdf050f1b',
            '/modules/test2/file1.php' => '94bd47b1ac7b2837b31883ebcd38c8101687321f497c3c4b9744f68ae846721d',
        ], $this->fileManifest->getFiles());
    }

    public function testGetModuleChecksums()
    {
        $this->assertEquals([
            'test' => 'c0b794ff210862a4ce16223802efe6e28969f5a4fb42480ec8c2fef2da23d181',
            'test2' => '32c9f2fb6e0a22dde288a0fe1e4834798360b25e5a91d2597409d9302221381d',
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
            '/modules/test/file1.php' => '6f9b0b94528a85b2a6bb67b5621e074aef1b4c9fc9ee3ea1bd69100ea14cb3db',
            '/modules/test/file2.php' => '96ae9f6b6377ad29226ea169f952de49fc29ae895f18a2caed76aeabdf050f1b',
        ], $this->fileManifest->getFiles());

        $this->assertEquals([
            'test' => 'c0b794ff210862a4ce16223802efe6e28969f5a4fb42480ec8c2fef2da23d181',
        ], $this->fileManifest->getModuleChecksums());
    }
}
