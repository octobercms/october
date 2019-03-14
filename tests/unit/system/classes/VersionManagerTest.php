<?php

use System\Classes\VersionManager;

class VersionManagerTest extends TestCase
{

    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/october/tester/Plugin.php';
        include_once base_path().'/tests/fixtures/plugins/october/sample/Plugin.php';
        include_once base_path().'/tests/fixtures/plugins/october/noupdates/Plugin.php';
    }

    //
    // Tests
    //

    public function testGetLatestFileVersion()
    {
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getLatestFileVersion', ['\October\\Tester']);

        $this->assertNotNull($result);
        $this->assertEquals('1.0.5', $result);
    }

    public function testGetFileVersions()
    {
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getFileVersions', ['\October\\Tester']);

        $this->assertCount(5, $result);
        $this->assertArrayHasKey('1.0.1', $result);
        $this->assertArrayHasKey('1.0.2', $result);
        $this->assertArrayHasKey('1.0.3', $result);
        $this->assertArrayHasKey('1.0.4', $result);
        $this->assertArrayHasKey('1.0.5', $result);

        $sample = $result['1.0.1'];
        $comment = array_shift($sample);
        $this->assertEquals("Added some upgrade file and some seeding", $comment);

        /*
         * Test junk file
         */
        $result = self::callProtectedMethod($manager, 'getFileVersions', ['\October\\Sample']);
        $this->assertCount(5, $result);
        $this->assertArrayHasKey('junk', $result);
        $this->assertArrayHasKey('1', $result);
        $this->assertArrayHasKey('1.0.*', $result);
        $this->assertArrayHasKey('1.0.x', $result);
        $this->assertArrayHasKey('10.3', $result);

        $sample = array_shift($result);
        $comment = array_shift($sample);
        $this->assertEquals("JUNK JUNK JUNK", $comment);

        /*
         * Test empty file
         */
        $result = self::callProtectedMethod($manager, 'getFileVersions', ['\October\\NoUpdates']);
        $this->assertEmpty($result);
    }

    public function testGetNewFileVersions()
    {
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getNewFileVersions', ['\October\\Tester', '1.0.3']);

        $this->assertCount(2, $result);
        $this->assertArrayHasKey('1.0.4', $result);
        $this->assertArrayHasKey('1.0.5', $result);

        /*
         * When at version 0, should return everything
         */
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getNewFileVersions', ['\October\\Tester']);

        $this->assertCount(5, $result);
        $this->assertArrayHasKey('1.0.1', $result);
        $this->assertArrayHasKey('1.0.2', $result);
        $this->assertArrayHasKey('1.0.3', $result);
        $this->assertArrayHasKey('1.0.4', $result);
        $this->assertArrayHasKey('1.0.5', $result);
    }

    /**
     * @dataProvider versionInfoProvider
     *
     * @param $versionInfo
     * @param $expectedComments
     * @param $expectedScripts
     */
    public function testExtractScriptsAndComments($versionInfo, $expectedComments, $expectedScripts)
    {
        $manager = VersionManager::instance();
        list($comments, $scripts) = self::callProtectedMethod($manager, 'extractScriptsAndComments', [$versionInfo]);

        $this->assertInternalType('array', $comments);
        $this->assertInternalType('array', $scripts);

        $this->assertEquals($expectedComments, $comments);
        $this->assertEquals($expectedScripts, $scripts);
    }

    public function versionInfoProvider()
    {
        return [
            [
                'A single update comment string',
                [
                    'A single update comment string'
                ],
                []
            ],
            [
                [
                    'A classic update comment string followed by script',
                    'update_script.php'
                ],
                [
                    'A classic update comment string followed by script'
                ],
                [
                    'update_script.php'
                ]
            ],
            [
                [
                    'scripts_can_go_first.php',
                    'An update comment string after the script',
                ],
                [
                    'An update comment string after the script'
                ],
                [
                    'scripts_can_go_first.php'
                ]
            ],
            [
                [
                    'scripts_can_go_first.php',
                    'An update comment string after the script',
                    'scripts_can_go_anywhere.php',
                ],
                [
                    'An update comment string after the script'
                ],
                [
                    'scripts_can_go_first.php',
                    'scripts_can_go_anywhere.php'
                ]
            ],
            [
                [
                    'scripts_can_go_first.php',
                    'The first update comment',
                    'scripts_can_go_anywhere.php',
                    'The second update comment',
                ],
                [
                    'The first update comment',
                    'The second update comment'
                ],
                [
                    'scripts_can_go_first.php',
                    'scripts_can_go_anywhere.php'
                ]
            ]
        ];
    }
}
