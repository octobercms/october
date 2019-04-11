<?php

use System\Classes\MarkupManager;

class MarkupManagerTest extends TestCase
{

    public function setUp()
    {
        parent::setUp();

        include_once base_path().'/tests/fixtures/plugins/october/tester/Plugin.php';
    }

    //
    // Tests
    //

    public function testIsWildCallable()
    {
        $manager = MarkupManager::instance();

        /*
         * Negatives
         */
        $callable = 'something';
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertFalse($result);

        $callable = ['Form', 'open'];
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertFalse($result);

        $callable = function () { return 'O, Hai!'; };
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertFalse($result);

        /*
         * String
         */
        $callable = 'something_*';
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertTrue($result);

        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable, 'delicious']);
        $this->assertEquals('something_delicious', $result);

        /*
         * Array
         */
        $callable = ['Class', 'foo_*'];
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertTrue($result);

        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable, 'bar']);
        $this->assertArrayHasKey(0, $result);
        $this->assertArrayHasKey(1, $result);
        $this->assertEquals('Class', $result[0]);
        $this->assertEquals('foo_bar', $result[1]);

        $callable = ['My*', 'method'];
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertTrue($result);

        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable, 'Class']);
        $this->assertArrayHasKey(0, $result);
        $this->assertArrayHasKey(1, $result);
        $this->assertEquals('MyClass', $result[0]);
        $this->assertEquals('method', $result[1]);

        $callable = ['My*', 'my*'];
        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable]);
        $this->assertTrue($result);

        $result = self::callProtectedMethod($manager, 'isWildCallable', [$callable, 'Food']);
        $this->assertArrayHasKey(0, $result);
        $this->assertArrayHasKey(1, $result);
        $this->assertEquals('MyFood', $result[0]);
        $this->assertEquals('myFood', $result[1]);
    }

}
