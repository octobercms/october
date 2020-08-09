<?php

use Cms\Classes\Router;
use Cms\Classes\Theme;

class RouterTest extends TestCase
{
    protected static $theme = null;

    public function setUp() : void
    {
        parent::setUp();

        self::$theme = Theme::load('test');
    }

    protected static function getMethod($name)
    {
        $class = new ReflectionClass('\Cms\Classes\Router');
        $method = $class->getMethod($name);
        $method->setAccessible(true);
        return $method;
    }

    public static function getProperty($name)
    {
        $class = new ReflectionClass('\Cms\Classes\Router');
        $property = $class->getProperty($name);
        $property->setAccessible(true);
        return $property;
    }

    public function testLoadUrlMap()
    {
        $method = self::getMethod('loadUrlMap');
        $property = self::getProperty('urlMap');
        $router = new Router(self::$theme);

        /*
         * The first time the map should be loaded from the disk
         */
        $value = $method->invoke($router);
        $this->assertFalse($value);
        $map = $property->getValue($router);

        $this->assertIsArray($map);
        $this->assertGreaterThanOrEqual(4, count($map));

        /*
         * The second time the map should be loaded from the disk
         */
        $value = $method->invoke($router);
        $this->assertTrue($value);
        $map = $property->getValue($router);
        $this->assertIsArray($map);
        $this->assertGreaterThanOrEqual(4, count($map));
    }

    public function testUrlListCaching()
    {
        $router = new Router(self::$theme);
        $method = self::getMethod('getCachedUrlFileName');
        $urlList = [];

        /*
         * The first time the page should be loaded from the disk.
         */
        $result = $method->invokeArgs($router, ['/', &$urlList]);
        $this->assertNull($result);

        /*
         * Resolve the page to initialize the cache
         */
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());

        /*
         * The second time the page should be loaded from the cache.
         */
        $result = $method->invokeArgs($router, ['/', &$urlList]);
        $this->assertEquals('index.htm', $result);

        /*
         * Clear the cache
         */
        $router->clearCache();
        $result = $method->invokeArgs($router, ['/', &$urlList]);
        $this->assertNull($result);
    }

    public function testFindPageByUrl()
    {
        $router = new Router(self::$theme);
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());

        $page = $router->findByUrl('blog/post');
        $this->assertEmpty($page);

        $page = $router->findByUrl('blog/post/my-post-title');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-post.htm', $page->getFileName());
        $this->assertCount(1, $parameters);
        $this->assertArrayHasKey('url_title', $parameters);
        $this->assertEquals('my-post-title', $parameters['url_title']);

        // Test cached
        $page = $router->findByUrl('blog/post/my-post-title');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-post.htm', $page->getFileName());
        $this->assertCount(1, $parameters);
        $this->assertArrayHasKey('url_title', $parameters);
        $this->assertEquals('my-post-title', $parameters['url_title']);

        $page = $router->findByUrl('AuthOrs');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('authors.htm', $page->getFileName());
        $this->assertCount(1, $parameters);
        $this->assertArrayHasKey('author_id', $parameters);
        $this->assertEquals('no-author', $parameters['author_id']);

        $page = $router->findByUrl('AuthOrs/test');
        $this->assertEmpty($page);

        $page = $router->findByUrl('AuthOrs/test/12');
        $this->assertEmpty($page);

        $page = $router->findByUrl('AuthOrs/44/');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('authors.htm', $page->getFileName());
        $this->assertCount(1, $parameters);
        $this->assertArrayHasKey('author_id', $parameters);
        $this->assertEquals('44', $parameters['author_id']);

        $page = $router->findByUrl('blog/archive-page');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-archive.htm', $page->getFileName());
        $this->assertCount(1, $parameters);

        $page = $router->findByUrl('blog/category-page');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-category.htm', $page->getFileName());
        $this->assertCount(1, $parameters);
        $this->assertEquals(array_keys($parameters)[0], 'category_name');
        $this->assertEmpty($parameters[array_keys($parameters)[0]]);

        $page = $router->findByUrl('blog/category-page/categoryName');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-category.htm', $page->getFileName());
        $this->assertCount(1, $parameters);

        $page = $router->findByUrl('blog/category-page/categoryName/subCategoryName');
        $parameters = $router->getParameters();
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-category.htm', $page->getFileName());
        $this->assertCount(1, $parameters);
    }

    public function testFindPageFromSubdirectory()
    {
        $router = new Router(self::$theme);
        $page = $router->findByUrl('/apage');
        $this->assertNotEmpty($page);
        $this->assertEquals('a/a-page.htm', $page->getFileName());

        $page = $router->findByUrl('/bpage');
        $this->assertNotEmpty($page);
        $this->assertEquals('b/b-page.htm', $page->getFileName());
    }
}
