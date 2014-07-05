<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Router;
use Cms\Classes\Layout;
use Cms\Classes\Controller;
use Cms\Classes\CmsException;
use Cms\Classes\CodeParser;
use System\Classes\SystemException;

class CmsExceptionTest extends TestCase
{
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

    public function testProcessCompoundObject()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testProcessIni()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testProcessPhp()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testProcessTwig()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testApplyMask()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testExceptionMask()
    {
        $foreignException = new \Exception('This is a general error');
        $exceptionMask = new SystemException('This is a system exception');
        $exceptionMask->setMask($foreignException);

        $this->assertEquals('This is a general error', $exceptionMask->getMessage());
    }

    public function testCmsExceptionPhp()
    {
        $theme = new Theme();
        $theme->load('test');
        $router = new Router($theme);
        $page = $router->findByUrl('/throw-php');

        $foreignException = new \Symfony\Component\Debug\Exception\FatalErrorException('This is a general error', 100, 1, 'test.php', 20);
        $this->setProtectedProperty($foreignException, 'file', "/modules/cms/classes/CodeParser.php(165) : eval()'d code line 7");

        $exception = new CmsException($page, 300);
        $exception->setMask($foreignException);

        $this->assertEquals($page->getFullPath(), $exception->getFile());
        $this->assertEquals('PHP Content', $exception->getErrorType());
        $this->assertEquals('This is a general error', $exception->getMessage());
    }

}