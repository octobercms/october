<?php

use System\Classes\VersionManager;
use October\Rain\Database\Updater;
use Symfony\Component\Console\Output\BufferedOutput;

class VersionManagerTest extends PluginTestCase
{
    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    public function setUp(): void
    {
        parent::setUp();

        include_once base_path('/modules/system/tests/fixtures/plugins/october/tester/Plugin.php');
        include_once base_path('/modules/system/tests/fixtures/plugins/october/sample/Plugin.php');
        include_once base_path('/modules/system/tests/fixtures/plugins/october/noupdates/Plugin.php');
    }

    //
    // Tests
    //

    public function testGetLatestFileVersion()
    {
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getLatestFileVersion', ['October.Tester']);

        $this->assertNotNull($result);
        $this->assertEquals('1.0.5', $result);
    }

    public function testGetFileVersions()
    {
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getFileVersions', ['October.Tester']);

        $this->assertCount(5, $result);
        $this->assertArrayHasKey('1.0.1', $result);
        $this->assertArrayHasKey('1.0.2', $result);
        $this->assertArrayHasKey('1.0.3', $result);
        $this->assertArrayHasKey('1.0.4', $result);
        $this->assertArrayHasKey('1.0.5', $result);

        $sample = $result['1.0.1'];
        $comment = array_shift($sample);
        $this->assertEquals("Added some upgrade file and some seeding", $comment);

        // Test junk file
        $result = self::callProtectedMethod($manager, 'getFileVersions', ['October.Sample']);
        $this->assertCount(5, $result);
        $this->assertArrayHasKey('junk', $result);
        $this->assertArrayHasKey('1', $result);
        $this->assertArrayHasKey('1.0.*', $result);
        $this->assertArrayHasKey('1.0.x', $result);
        $this->assertArrayHasKey('10.3.1', $result);

        $sample = array_shift($result);
        $comment = array_shift($sample);
        $this->assertEquals("JUNK JUNK JUNK", $comment);

        // Test empty file
        $result = self::callProtectedMethod($manager, 'getFileVersions', ['October.NoUpdates']);
        $this->assertEmpty($result);
    }

    public function testGetNewFileVersions()
    {
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getNewFileVersions', ['October.Tester', '1.0.3']);

        $this->assertCount(2, $result);
        $this->assertArrayHasKey('1.0.4', $result);
        $this->assertArrayHasKey('1.0.5', $result);

        // When at version 0, should return everything
        $manager = VersionManager::instance();
        $result = self::callProtectedMethod($manager, 'getNewFileVersions', ['October.Tester']);

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
        [$comments, $scripts] = self::callProtectedMethod($manager, 'extractScriptsAndComments', [$versionInfo]);

        $this->assertIsArray($comments);
        $this->assertIsArray($scripts);

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
            ],
            [
                [
                    'file.name.with.dots.php',
                    'The first update comment',
                    '1.0.2.scripts_can_go_anywhere.php',
                    'The second update comment',
                ],
                [
                    'The first update comment',
                    'The second update comment'
                ],
                [
                    'file.name.with.dots.php',
                    '1.0.2.scripts_can_go_anywhere.php'
                ]
            ],
            [
                [
                    'subdirectory/file.name.with.dots.php',
                    'The first update comment',
                    'subdirectory\1.0.2.scripts_can_go_anywhere.php',
                    'The second update comment',
                ],
                [
                    'The first update comment',
                    'The second update comment'
                ],
                [
                    'subdirectory/file.name.with.dots.php',
                    'subdirectory\1.0.2.scripts_can_go_anywhere.php'
                ]
            ]
        ];
    }

    public function testRemovePluginRollsBackRenamedScript()
    {
        $updater = $this->fakeUpdater();
        $this->seedPluginHistory('October.Tester', [
            '1.0.2' => ['old_comments_table.php'],
        ]);

        $manager = new VersionManager;
        $manager->setNotesOutput($output = new BufferedOutput);
        $manager->removePlugin('October.Tester');

        $this->assertEquals(['create_comments_table.php'], array_map('basename', $updater->packedDown));
        $this->assertStringContainsString('"old_comments_table.php" not found, rolling back "create_comments_table.php" instead', $output->fetch());
        $this->assertSame(0, Db::table('system_plugin_history')->where('code', 'October.Tester')->count());
        $this->assertSame(0, Db::table('system_plugin_versions')->where('code', 'October.Tester')->count());
    }

    public function testRemovePluginPairsRenamedScriptsInOrder()
    {
        $updater = $this->fakeUpdater();
        $this->seedPluginHistory('October.Tester', [
            '1.0.1' => ['old_comments_table.php', 'old_blog_settings_table.php'],
        ]);

        $manager = new VersionManager;
        $this->setFileVersions($manager, 'October.Tester', [
            '1.0.1' => ['Renamed scripts', 'create_comments_table.php', 'create_blog_settings_table.php'],
        ]);
        $manager->removePlugin('October.Tester');

        $this->assertEquals(['create_blog_settings_table.php', 'create_comments_table.php'], array_map('basename', $updater->packedDown));
    }

    public function testRemovePluginSkipsAmbiguousRename()
    {
        $updater = $this->fakeUpdater();
        $this->seedPluginHistory('October.Tester', [
            '1.0.2' => ['old_comments_table.php', 'old_comments_seeder.php'],
        ]);

        $manager = new VersionManager;
        $manager->setNotesOutput($output = new BufferedOutput);
        $manager->removePlugin('October.Tester');

        $notes = $output->fetch();
        $this->assertEmpty($updater->packedDown);
        $this->assertStringContainsString('"old_comments_table.php" not found, skipping rollback', $notes);
        $this->assertStringContainsString('"old_comments_seeder.php" not found, skipping rollback', $notes);
        $this->assertSame(0, Db::table('system_plugin_history')->where('code', 'October.Tester')->count());
    }

    public function testRemovePluginSkipsDeletedScript()
    {
        $updater = $this->fakeUpdater();
        $this->seedPluginHistory('October.Tester', [
            '1.0.1' => ['some_upgrade_file.php'],
        ]);

        $manager = new VersionManager;
        $manager->setNotesOutput($output = new BufferedOutput);
        $manager->removePlugin('October.Tester');

        $this->assertEmpty($updater->packedDown);
        $this->assertStringContainsString('"some_upgrade_file.php" not found, skipping rollback', $output->fetch());
        $this->assertSame(0, Db::table('system_plugin_history')->where('code', 'October.Tester')->count());
    }

    public function testRemovePluginNeverPairsWithAppliedScripts()
    {
        $updater = $this->fakeUpdater();
        $this->seedPluginHistory('October.Tester', [
            '1.0.1' => ['create_comments_table.php', 'old_blog_settings_table.php'],
            '1.0.2' => ['old_seeder.php'],
        ]);

        $manager = new VersionManager;
        $this->setFileVersions($manager, 'October.Tester', [
            '1.0.1' => ['create_comments_table.php', 'create_blog_settings_table.php'],
            '1.0.2' => ['create_comments_table.php'],
        ]);
        $manager->removePlugin('October.Tester');

        $this->assertEquals(['create_blog_settings_table.php', 'create_comments_table.php'], array_map('basename', $updater->packedDown));
    }

    /**
     * fakeUpdater replaces the database updater with one that records rolled back files.
     */
    protected function fakeUpdater(): Updater
    {
        $updater = new class extends Updater
        {
            public $packedDown = [];

            public function packDown($file)
            {
                $this->packedDown[] = $file;

                return true;
            }
        };

        $this->app->instance('db.updater', $updater);

        return $updater;
    }

    /**
     * seedPluginHistory records applied scripts for a plugin, keyed by version.
     */
    protected function seedPluginHistory(string $code, array $scriptsByVersion): void
    {
        foreach ($scriptsByVersion as $version => $scripts) {
            foreach ($scripts as $script) {
                Db::table('system_plugin_history')->insert([
                    'code' => $code,
                    'type' => VersionManager::HISTORY_TYPE_SCRIPT,
                    'version' => (string) $version,
                    'detail' => $script,
                    'created_at' => now(),
                ]);
            }
        }

        Db::table('system_plugin_versions')->insert([
            'code' => $code,
            'version' => (string) array_key_last($scriptsByVersion),
            'created_at' => now(),
        ]);
    }

    /**
     * setFileVersions overrides the version file contents a manager reads for a plugin.
     */
    protected function setFileVersions(VersionManager $manager, string $code, array $versions): void
    {
        self::setProtectedProperty($manager, 'fileVersions', [$code => $versions]);
    }
}
