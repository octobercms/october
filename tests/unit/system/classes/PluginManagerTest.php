<?php

use System\Classes\PluginManager;

class PluginManagerTest extends TestCase
{

    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/october/tester/Plugin.php';
    }

    //
    // Helpers
    //

    protected static function callProtectedMethod($object, $name, $params = [])
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $method = $class->getMethod($name);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $params);
    }

    public static function getProtectedProperty($object, $name)
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property->getValue($object);
    }

    public static function setProtectedProperty($object, $name, $value)
    {
        $className = get_class($object);
        $class = new ReflectionClass($className);
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property->setValue($object, $value);
    }

    //
    // Tests
    //

    public function testLoadPlugins()
    {
        $manager = PluginManager::instance();
        $result = self::callProtectedMethod($manager, 'loadPlugins');

        $this->assertCount(5, $result);
        $this->assertArrayHasKey('October.NoUpdates', $result);
        $this->assertArrayHasKey('October.Sample', $result);
        $this->assertArrayHasKey('October.Tester', $result);
        $this->assertArrayHasKey('Database.Tester', $result);
        $this->assertArrayHasKey('TestVendor.Test', $result);

        $this->assertInstanceOf('October\NoUpdates\Plugin', $result['October.NoUpdates']);
        $this->assertInstanceOf('October\Sample\Plugin', $result['October.Sample']);
        $this->assertInstanceOf('October\Tester\Plugin', $result['October.Tester']);
        $this->assertInstanceOf('Database\Tester\Plugin', $result['Database.Tester']);
        $this->assertInstanceOf('TestVendor\Test\Plugin', $result['TestVendor.Test']);
    }

    public function testGetPluginPath()
    {
        $manager = PluginManager::instance();
        $result = $manager->getPluginPath('October\Tester');
        $basePath = str_replace('\\', '/', base_path());
        $this->assertEquals($basePath . '/tests/fixtures/plugins/october/tester', $result);
    }

    public function testGetPlugins()
    {
        $manager = PluginManager::instance();
        $result = $manager->getPlugins();

        $this->assertCount(5, $result);
        $this->assertArrayHasKey('October.NoUpdates', $result);
        $this->assertArrayHasKey('October.Sample', $result);
        $this->assertArrayHasKey('October.Tester', $result);
        $this->assertArrayHasKey('Database.Tester', $result);
        $this->assertArrayHasKey('TestVendor.Test', $result);

        $this->assertInstanceOf('October\NoUpdates\Plugin', $result['October.NoUpdates']);
        $this->assertInstanceOf('October\Sample\Plugin', $result['October.Sample']);
        $this->assertInstanceOf('October\Tester\Plugin', $result['October.Tester']);
        $this->assertInstanceOf('Database\Tester\Plugin', $result['Database.Tester']);
        $this->assertInstanceOf('TestVendor\Test\Plugin', $result['TestVendor.Test']);
    }

    public function testFindByNamespace()
    {
        $manager = PluginManager::instance();
        $result = $manager->findByNamespace('October\Tester');
        $this->assertInstanceOf('October\Tester\Plugin', $result);
    }

    public function testHasPlugin()
    {
        $manager = PluginManager::instance();
        $result = $manager->hasPlugin('October\Tester');
        $this->assertTrue($result);

        $result = $manager->hasPlugin('October\XXXXX');
        $this->assertFalse($result);
    }

    public function testGetPluginNamespaces()
    {
        $manager = PluginManager::instance();
        $result = $manager->getPluginNamespaces();

        $this->assertCount(5, $result);
        $this->assertArrayHasKey('\october\noupdates', $result);
        $this->assertArrayHasKey('\october\sample', $result);
        $this->assertArrayHasKey('\october\tester', $result);
        $this->assertArrayHasKey('\database\tester', $result);
        $this->assertArrayHasKey('\testvendor\test', $result);
    }
    
    public function testGetVendorAndPluginNames()
    {
        $manager = PluginManager::instance();
        $vendors = $manager->getVendorAndPluginNames();

        $this->assertArrayHasKey('october', $vendors);
        $this->assertArrayHasKey('database', $vendors);
        $this->assertArrayHasKey('testvendor', $vendors);
        $this->assertCount(3, $vendors);
    }

    public function testPluginDetails()
    {
        $manager = PluginManager::instance();
        $testPlugin = $manager->findByNamespace('October\XXXXX');
        $this->assertNull($testPlugin);

        $testPlugin = $manager->findByNamespace('October\Tester');
        $this->assertNotNull($testPlugin);
        $pluginDetails = $testPlugin->pluginDetails();

        $this->assertEquals('October Test Plugin', $pluginDetails['name']);
        $this->assertEquals('Test plugin used by unit tests.', $pluginDetails['description']);
        $this->assertEquals('Alexey Bobkov, Samuel Georges', $pluginDetails['author']);
    }

}