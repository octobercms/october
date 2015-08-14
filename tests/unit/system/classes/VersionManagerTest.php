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
        $this->assertArrayHasKey('10', $result);

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

}