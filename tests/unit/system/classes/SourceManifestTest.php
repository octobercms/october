<?php

use October\Rain\Exception\ApplicationException;
use System\Classes\SourceManifest;
use System\Classes\FileManifest;

class SourceManifestTest extends TestCase
{
    /** @var SourceManifest instance */
    protected $sourceManifest;

    /** @var array Emulated builds from the manifest fixture */
    protected $builds;

    public function setUp(): void
    {
        parent::setUp();

        $this->builds = [
            1 => new FileManifest(base_path('tests/fixtures/manifest/1'), ['test', 'test2']),
            2 => new FileManifest(base_path('tests/fixtures/manifest/2'), ['test', 'test2']),
            3 => new FileManifest(base_path('tests/fixtures/manifest/3'), ['test', 'test2']),
        ];

        $this->sourceManifest = new SourceManifest($this->manifestPath(), false);
    }

    public function tearDown(): void
    {
        $this->deleteManifest();
    }

    public function testCreateManifest()
    {
        $this->createManifest(true);

        $this->assertEquals(
            '{' . "\n" .
            '    "manifest": [' . "\n" .
            '        {' . "\n" .
            '            "build": 1,' . "\n" .
            '            "modules": {' . "\n" .
            '                "test": "e1d6c6e4c482688e231ee37d89668268426512013695de47bfcb424f9a645c7b",' . "\n" .
            '                "test2": "a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a"' . "\n" .
            '            },' . "\n" .
            '            "files": {' . "\n" .
            '                "added": {' . "\n" .
            '                    "\/modules\/test\/file1.php": "6f9b0b94528a85b2a6bb67b5621e074aef1b4c9fc9ee3ea1bd69100ea14cb3db"' . "\n" .
            '                }' . "\n" .
            '            }' . "\n" .
            '        },' . "\n" .
            '        {' . "\n" .
            '            "build": 2,' . "\n" .
            '            "modules": {' . "\n" .
            '                "test": "c0b794ff210862a4ce16223802efe6e28969f5a4fb42480ec8c2fef2da23d181",' . "\n" .
            '                "test2": "32c9f2fb6e0a22dde288a0fe1e4834798360b25e5a91d2597409d9302221381d"' . "\n" .
            '            },' . "\n" .
            '            "files": {' . "\n" .
            '                "added": {' . "\n" .
            '                    "\/modules\/test\/file2.php": "96ae9f6b6377ad29226ea169f952de49fc29ae895f18a2caed76aeabdf050f1b",' . "\n" .
            '                    "\/modules\/test2\/file1.php": "94bd47b1ac7b2837b31883ebcd38c8101687321f497c3c4b9744f68ae846721d"' . "\n" .
            '                }' . "\n" .
            '            }' . "\n" .
            '        },' . "\n" .
            '        {' . "\n" .
            '            "build": 3,' . "\n" .
            '            "modules": {' . "\n" .
            '                "test": "419a3c073a4296213cdc9319cfc488383753e2e81cefa1c73db38749b82a3c51",' . "\n" .
            '                "test2": "32c9f2fb6e0a22dde288a0fe1e4834798360b25e5a91d2597409d9302221381d"' . "\n" .
            '            },' . "\n" .
            '            "files": {' . "\n" .
            '                "added": {' . "\n" .
            '                    "\/modules\/test\/file3.php": "7f4132b05911a6b0df4d41bf5dc3d007786b63a5a22daf3060ed222816d57b54"' . "\n" .
            '                },' . "\n" .
            '                "modified": {' . "\n" .
            '                    "\/modules\/test\/file2.php": "2c61b2f5688275574251a19a57e06a4eb9e537b3916ebf6f71768e184a4ae538"' . "\n" .
            '                },' . "\n" .
            '                "removed": [' . "\n" .
            '                    "\/modules\/test\/file1.php"' . "\n" .
            '                ]' . "\n" .
            '            }' . "\n" .
            '        }' . "\n" .
            '    ]' . "\n" .
            '}',
            file_get_contents($this->manifestPath())
        );
    }

    public function testGetBuilds()
    {
        $this->createManifest();

        $buildKeys = array_keys($this->sourceManifest->getBuilds());

        $this->assertCount(3, $buildKeys);
        $this->assertEquals([1, 2, 3], $buildKeys);
    }

    public function testGetMaxBuild()
    {
        $this->createManifest();

        $this->assertEquals(3, $this->sourceManifest->getMaxBuild());
    }

    public function testGetState()
    {
        $this->createManifest();

        $this->assertEquals([
            '/modules/test/file1.php' => '6f9b0b94528a85b2a6bb67b5621e074aef1b4c9fc9ee3ea1bd69100ea14cb3db',
        ], $this->sourceManifest->getState(1));

        $this->assertEquals([
            '/modules/test/file1.php' => '6f9b0b94528a85b2a6bb67b5621e074aef1b4c9fc9ee3ea1bd69100ea14cb3db',
            '/modules/test/file2.php' => '96ae9f6b6377ad29226ea169f952de49fc29ae895f18a2caed76aeabdf050f1b',
            '/modules/test2/file1.php' => '94bd47b1ac7b2837b31883ebcd38c8101687321f497c3c4b9744f68ae846721d',
        ], $this->sourceManifest->getState(2));

        $this->assertEquals([
            '/modules/test/file2.php' => '2c61b2f5688275574251a19a57e06a4eb9e537b3916ebf6f71768e184a4ae538',
            '/modules/test/file3.php' => '7f4132b05911a6b0df4d41bf5dc3d007786b63a5a22daf3060ed222816d57b54',
            '/modules/test2/file1.php' => '94bd47b1ac7b2837b31883ebcd38c8101687321f497c3c4b9744f68ae846721d',
        ], $this->sourceManifest->getState(3));
    }

    public function testCompare()
    {
        $this->createManifest();

        $this->assertEquals([
            'build' => 1,
            'modified' => false,
            'confident' => true
        ], $this->sourceManifest->compare($this->builds[1]));

        $this->assertEquals([
            'build' => 2,
            'modified' => false,
            'confident' => true
        ], $this->sourceManifest->compare($this->builds[2]));

        $this->assertEquals([
            'build' => 3,
            'modified' => false,
            'confident' => true
        ], $this->sourceManifest->compare($this->builds[3]));
    }

    public function testCompareModified()
    {
        $this->createManifest();

        // Hot-swap "tests/fixtures/manifest/3/modules/test/file3.php"
        $old = file_get_contents(base_path('tests/fixtures/manifest/3/modules/test/file3.php'));
        file_put_contents(base_path('tests/fixtures/manifest/3/modules/test/file3.php'), '<?php // Changed');

        $modifiedManifest = new FileManifest(base_path('tests/fixtures/manifest/3'), ['test', 'test2']);
        $modifiedManifest->getFiles();

        file_put_contents(base_path('tests/fixtures/manifest/3/modules/test/file3.php'), $old);

        $this->assertEquals([
            'build' => 3,
            'modified' => true,
            'confident' => true,
        ], $this->sourceManifest->compare($modifiedManifest));
    }

    protected function createManifest(bool $write = false)
    {
        $this->deleteManifest();

        $last = null;

        foreach ($this->builds as $build => $fileManifest) {
            $this->sourceManifest->addBuild($build, $fileManifest, $last);

            $last = $build;
        }

        if ($write) {
            file_put_contents($this->manifestPath(), $this->sourceManifest->generate());
        }
    }

    protected function deleteManifest()
    {
        if (file_exists($this->manifestPath())) {
            unlink($this->manifestPath());
        }
    }

    protected function manifestPath()
    {
        return base_path('tests/fixtures/manifest/builds.json');
    }
}
