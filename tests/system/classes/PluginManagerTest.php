<?php

use System\Classes\PluginManager;

class PluginManagerTest extends TestCase
{

    public function setUp()
    {
        include_once base_path().'/tests/fixtures/system/plugins/october/test/Plugin.php';
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

        $this->assertCount(4, $result);
        $this->assertArrayHasKey('October.NoUpdates', $result);
        $this->assertArrayHasKey('October.Sample', $result);
        $this->assertArrayHasKey('October.Test', $result);
        $this->assertArrayHasKey('TestVendor.Test', $result);

        $this->assertInstanceOf('October\NoUpdates\Plugin', $result['October.NoUpdates']);
        $this->assertInstanceOf('October\Sample\Plugin', $result['October.Sample']);
        $this->assertInstanceOf('October\Test\Plugin', $result['October.Test']);
        $this->assertInstanceOf('TestVendor\Test\Plugin', $result['TestVendor.Test']);
    }

    public function testGetPath()
    {
        $manager = PluginManager::instance();
        $this->assertEquals(base_path().'/tests/fixtures/system/plugins', $manager->getPath());
    }

    public function testGetPluginPath()
    {
        $manager = PluginManager::instance();
        $result = $manager->getPluginPath('October\Test');
        $this->assertEquals(base_path() . '/tests/fixtures/system/plugins/october/test', $result);
    }

    public function testGetPlugins()
    {
        $manager = PluginManager::instance();
        $result = $manager->getPlugins();

        $this->assertCount(4, $result);
        $this->assertArrayHasKey('October.NoUpdates', $result);
        $this->assertArrayHasKey('October.Sample', $result);
        $this->assertArrayHasKey('October.Test', $result);
        $this->assertArrayHasKey('TestVendor.Test', $result);

        $this->assertInstanceOf('October\NoUpdates\Plugin', $result['October.NoUpdates']);
        $this->assertInstanceOf('October\Sample\Plugin', $result['October.Sample']);
        $this->assertInstanceOf('October\Test\Plugin', $result['October.Test']);
        $this->assertInstanceOf('TestVendor\Test\Plugin', $result['TestVendor.Test']);
    }

    public function testFindByNamespace()
    {
        $manager = PluginManager::instance();
        $result = $manager->findByNamespace('October\Test');
        $this->assertInstanceOf('October\Test\Plugin', $result);
    }

    public function testHasPlugin()
    {
        $manager = PluginManager::instance();
        $result = $manager->hasPlugin('October\Test');
        $this->assertTrue($result);

        $result = $manager->hasPlugin('October\XXXXX');
        $this->assertFalse($result);
    }

    public function testGetPluginNamespaces()
    {
        $manager = PluginManager::instance();
        $result = $manager->getPluginNamespaces();

        $this->assertCount(4, $result);
        $this->assertArrayHasKey('\october\noupdates', $result);
        $this->assertArrayHasKey('\october\sample', $result);
        $this->assertArrayHasKey('\october\test', $result);
        $this->assertArrayHasKey('\testvendor\test', $result);
    }
    
    public function testGetVendorAndPluginNames()
    {
        $manager = PluginManager::instance();
        $vendors = $manager->getVendorAndPluginNames();

        $this->assertArrayHasKey('october', $vendors);
        $this->assertArrayHasKey('testvendor', $vendors);
        $this->assertCount(2, $vendors);
    }

    public function testPluginDetails()
    {
        $manager = PluginManager::instance();
        $testPlugin = $manager->findByNamespace('October\XXXXX');
        $this->assertNull($testPlugin);

        $testPlugin = $manager->findByNamespace('October\Test');
        $this->assertNotNull($testPlugin);
        $pluginDetails = $testPlugin->pluginDetails();

        $this->assertEquals('October Test Plugin', $pluginDetails['name']);
        $this->assertEquals('Test plugin used by unit tests.', $pluginDetails['description']);
        $this->assertEquals('Alexey Bobkov, Samuel Georges', $pluginDetails['author']);
    }

}