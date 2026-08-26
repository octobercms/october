<?php

use Cms\Classes\Router;
use Cms\Classes\Theme;

class RouterTest extends TestCase
{
    protected static $theme = null;

    public function setUp(): void
    {
        parent::setUp();

        self::$theme = Theme::load('test');
    }

    protected static function getMethod($name)
    {
        $class = new ReflectionClass('\Cms\Classes\Router');
        $method = $class->getMethod($name);
        return $method;
    }

    public static function getProperty($name)
    {
        $class = new ReflectionClass('\Cms\Classes\Router');
        $property = $class->getProperty($name);
        return $property;
    }

    public function testRouteMapCaching()
    {
        $router = new Router(self::$theme);
        $method = self::getMethod('getMapRouteCache');

        /*
         * The first time the map should be built from the disk.
         */
        $router->clearCache();
        $this->assertNull($method->invoke($router));

        /*
         * Resolve a page to initialize the cache
         */
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());

        /*
         * The route map is cached, visited URLs are not cached individually
         */
        $this->assertIsArray($method->invoke($router));

        /*
         * A fresh router resolves from the cached map
         */
        $router = new Router(self::$theme);
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());

        /*
         * Clearing the cache still resolves pages
         */
        $router->clearCache();
        $this->assertNull($method->invoke($router));
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());
    }

    public function testStaleSharedCacheRetriesFromDisk()
    {
        $router = new Router(self::$theme);
        $router->clearCache();

        /*
         * Another server instance cached a route map that points to a page
         * no longer present on the disk
         */
        $staleSource = new October\Rain\Router\Router;
        $staleSource->route('deleted-page.htm', '/');
        self::getMethod('putMapRouteCache')->invokeArgs($router, [$staleSource->toArray()]);
        $this->assertIsArray(self::getMethod('getMapRouteCache')->invoke($router));

        /*
         * The stale entry resolves to a missing page, the router must clear
         * the shared cache and rebuild from the disk on the second pass
         */
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());

        /*
         * The rebuilt map is cached for the other instances, without the
         * stale rule
         */
        $cached = self::getMethod('getMapRouteCache')->invoke($router);
        $rules = $cached['rules'] ?? $cached;
        $ruleNames = array_column($rules, 'ruleName');
        $this->assertNotContains('deleted-page.htm', $ruleNames);
        $this->assertContains('index.htm', $ruleNames);
    }

    public function testCorruptedSharedCacheRebuilds()
    {
        $router = new Router(self::$theme);
        $router->clearCache();

        /*
         * A torn or corrupted cache write from another instance must never
         * break routing
         */
        $cacheKey = self::getMethod('getMapRouteCacheKey')->invoke($router);
        Cache::put($cacheKey, 'corrupted-by-torn-write', now()->addMinutes(5));

        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());
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
