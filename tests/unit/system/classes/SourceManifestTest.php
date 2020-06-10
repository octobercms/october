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
            '                "test": "5f4a1c6efe88be58274591fe067a45c3",' . "\n" .
            '                "test2": "d41d8cd98f00b204e9800998ecf8427e"' . "\n" .
            '            },' . "\n" .
            '            "files": {' . "\n" .
            '                "added": {' . "\n" .
            '                    "\/modules\/test\/file1.php": "02d1a1b4085289e12e9b025e125ae9f8"' . "\n" .
            '                }' . "\n" .
            '            }' . "\n" .
            '        },' . "\n" .
            '        {' . "\n" .
            '            "build": 2,' . "\n" .
            '            "modules": {' . "\n" .
            '                "test": "a59012c67109b32fc9d188b388dc4293",' . "\n" .
            '                "test2": "f6c6421627c68e60fb8e7a47f753b239"' . "\n" .
            '            },' . "\n" .
            '            "files": {' . "\n" .
            '                "added": {' . "\n" .
            '                    "\/modules\/test\/file2.php": "a654089f3abf710809c34e2a82ced582",' . "\n" .
            '                    "\/modules\/test2\/file1.php": "cd3d6fd5152d3e1cc02d3c2a971f12b3"' . "\n" .
            '                }' . "\n" .
            '            }' . "\n" .
            '        },' . "\n" .
            '        {' . "\n" .
            '            "build": 3,' . "\n" .
            '            "modules": {' . "\n" .
            '                "test": "23dc31cb72204b34662edbb1d446af13",' . "\n" .
            '                "test2": "f6c6421627c68e60fb8e7a47f753b239"' . "\n" .
            '            },' . "\n" .
            '            "files": {' . "\n" .
            '                "added": {' . "\n" .
            '                    "\/modules\/test\/file3.php": "8eaf78ab370eb0e9531bcc92ee29449c"' . "\n" .
            '                },' . "\n" .
            '                "modified": {' . "\n" .
            '                    "\/modules\/test\/file2.php": "5a753a54244e00662437fad52ee66ffb"' . "\n" .
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
            '/modules/test/file1.php' => '02d1a1b4085289e12e9b025e125ae9f8',
        ], $this->sourceManifest->getState(1));

        $this->assertEquals([
            '/modules/test/file1.php' => '02d1a1b4085289e12e9b025e125ae9f8',
            '/modules/test/file2.php' => 'a654089f3abf710809c34e2a82ced582',
            '/modules/test2/file1.php' => 'cd3d6fd5152d3e1cc02d3c2a971f12b3',
        ], $this->sourceManifest->getState(2));

        $this->assertEquals([
            '/modules/test/file2.php' => '5a753a54244e00662437fad52ee66ffb',
            '/modules/test/file3.php' => '8eaf78ab370eb0e9531bcc92ee29449c',
            '/modules/test2/file1.php' => 'cd3d6fd5152d3e1cc02d3c2a971f12b3',
        ], $this->sourceManifest->getState(3));
    }

    public function testCompare()
    {
        $this->createManifest();

        $this->assertEquals([
            'build' => 1,
            'modified' => false,
        ], $this->sourceManifest->compare($this->builds[1]));

        $this->assertEquals([
            'build' => 2,
            'modified' => false,
        ], $this->sourceManifest->compare($this->builds[2]));

        $this->assertEquals([
            'build' => 3,
            'modified' => false,
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
