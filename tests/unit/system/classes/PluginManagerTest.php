<?php
use System\Classes\PluginManager;

class PluginManagerTest extends TestCase
{
    public $manager;

    public $plugins = [
        'October.NoUpdates' => 'October\NoUpdates\Plugin',
        'October.Sample' => 'October\Sample\Plugin',
        'October.Tester' => 'October\Tester\Plugin',
        'Database.Tester' => 'Database\Tester\Plugin',
        'TestVendor.Test' => 'TestVendor\Test\Plugin',
        'DependencyTest.Found' => 'DependencyTest\Found\Plugin',
        'DependencyTest.NotFound' => 'DependencyTest\NotFound\Plugin',
        'DependencyTest.WrongCase' => 'DependencyTest\WrongCase\Plugin',
        'DependencyTest.Dependency' => 'DependencyTest\Dependency\Plugin',
    ];

    public function setUp()
    {
        parent::setUp();

        $manager = PluginManager::instance();
        self::callProtectedMethod($manager, 'loadDisabled');
        $manager->loadPlugins();
        self::callProtectedMethod($manager, 'loadDependencies');

        $this->manager = $manager;
    }

    //
    // Tests
    //

    public function testLoadPlugins()
    {
        $result = $this->manager->loadPlugins();

        $this->assertCount(9, $result);
        foreach ($this->plugins as $code => $class) {
            $this->assertArrayHasKey($code, $result);
            $this->assertInstanceOf($class, $result[$code]);
        }

        $this->assertArrayNotHasKey('TestVendor.Goto', $result);
    }

    public function testUnloadablePlugin()
    {
        $pluginNamespaces = $this->manager->getPluginNamespaces();
        $result = $this->manager->loadPlugin('\\testvendor\\goto', $pluginNamespaces['\\testvendor\\goto']);
        $this->assertNull($result);
    }

    public function testGetPluginPath()
    {
        $result = $this->manager->getPluginPath('October\Tester');
        $basePath = str_replace('\\', '/', base_path());
        $this->assertEquals($basePath . '/tests/fixtures/plugins/october/tester', $result);
    }

    public function testGetPlugins()
    {
        $result = $this->manager->getPlugins();

        $this->assertCount(8, $result);
        foreach ($this->plugins as $code => $class) {
            $this->assertArrayHasKey($code, $result);
            $this->assertInstanceOf($class, $result[$code]);
        }

        $this->assertArrayNotHasKey('DependencyTest.NotFound', $result);
        $this->assertArrayNotHasKey('TestVendor.Goto', $result);
    }

    public function testFindByNamespace()
    {
        $result = $this->manager->findByNamespace('October\Tester');
        $this->assertInstanceOf('October\Tester\Plugin', $result);
    }

    public function testHasPlugin()
    {
        $result = $this->manager->hasPlugin('October\Tester');
        $this->assertTrue($result);

        $result = $this->manager->hasPlugin('DependencyTest.Found');
        $this->assertTrue($result);

        $result = $this->manager->hasPlugin('DependencyTest\WrongCase');
        $this->assertTrue($result);

        $result = $this->manager->hasPlugin('DependencyTest\NotFound');
        $this->assertTrue($result);

        $result = $this->manager->hasPlugin('October\XXXXX');
        $this->assertFalse($result);

        /**
         * Test case for https://github.com/octobercms/october/pull/4337
         */
        $result = $this->manager->hasPlugin('dependencyTest\Wrongcase');
        $this->assertTrue($result);

        $result = $this->manager->hasPlugin('dependencyTest.Wrongcase');
        $this->assertTrue($result);
    }

    public function testGetPluginNamespaces()
    {
        $result = $this->manager->getPluginNamespaces();

        $this->assertCount(10, $result);
        $this->assertArrayHasKey('\october\noupdates', $result);
        $this->assertArrayHasKey('\october\sample', $result);
        $this->assertArrayHasKey('\october\tester', $result);
        $this->assertArrayHasKey('\database\tester', $result);
        $this->assertArrayHasKey('\testvendor\test', $result);
        $this->assertArrayHasKey('\testvendor\goto', $result);
        $this->assertArrayHasKey('\dependencytest\found', $result);
        $this->assertArrayHasKey('\dependencytest\notfound', $result);
        $this->assertArrayHasKey('\dependencytest\wrongcase', $result);
        $this->assertArrayHasKey('\dependencytest\dependency', $result);
    }

    public function testGetVendorAndPluginNames()
    {
        $vendors = $this->manager->getVendorAndPluginNames();

        $this->assertCount(4, $vendors);
        $this->assertArrayHasKey('october', $vendors);
        $this->assertArrayHasKey('noupdates', $vendors['october']);
        $this->assertArrayHasKey('sample', $vendors['october']);
        $this->assertArrayHasKey('tester', $vendors['october']);

        $this->assertArrayHasKey('database', $vendors);
        $this->assertArrayHasKey('tester', $vendors['database']);

        $this->assertArrayHasKey('testvendor', $vendors);
        $this->assertArrayHasKey('test', $vendors['testvendor']);
        $this->assertArrayHasKey('goto', $vendors['testvendor']);

        $this->assertArrayHasKey('dependencytest', $vendors);
        $this->assertArrayHasKey('found', $vendors['dependencytest']);
        $this->assertArrayHasKey('notfound', $vendors['dependencytest']);
        $this->assertArrayHasKey('wrongcase', $vendors['dependencytest']);
        $this->assertArrayHasKey('dependency', $vendors['dependencytest']);
    }

    public function testPluginDetails()
    {
        $testPlugin = $this->manager->findByNamespace('October\XXXXX');
        $this->assertNull($testPlugin);

        $testPlugin = $this->manager->findByNamespace('October\Tester');
        $this->assertNotNull($testPlugin);
        $pluginDetails = $testPlugin->pluginDetails();

        $this->assertEquals('October Test Plugin', $pluginDetails['name']);
        $this->assertEquals('Test plugin used by unit tests.', $pluginDetails['description']);
        $this->assertEquals('Alexey Bobkov, Samuel Georges', $pluginDetails['author']);
    }

    public function testUnregisterall()
    {
        $result = $this->manager->getPlugins();
        $this->assertCount(8, $result);

        $this->manager->unregisterAll();
        $this->assertEmpty($this->manager->getPlugins());
    }

    public function testGetDependencies()
    {
        $result = $this->manager->getDependencies('DependencyTest.Found');
        $this->assertCount(1, $result);
        $this->assertContains('DependencyTest.Dependency', $result);

        $result = $this->manager->getDependencies('DependencyTest.WrongCase');
        $this->assertCount(1, $result);
        $this->assertContains('Dependencytest.dependency', $result);

        $result = $this->manager->getDependencies('DependencyTest.NotFound');
        $this->assertCount(1, $result);
        $this->assertContains('DependencyTest.Missing', $result);
    }

    public function testIsDisabled()
    {
        $result = $this->manager->isDisabled('DependencyTest.Found');
        $this->assertFalse($result);

        $result = $this->manager->isDisabled('DependencyTest.WrongCase');
        $this->assertFalse($result);

        $result = $this->manager->isDisabled('DependencyTest.NotFound');
        $this->assertTrue($result);
    }
}
