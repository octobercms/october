<?php

use Cms\Classes\PageCode;
use Cms\Classes\LayoutCode;
use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Layout;
use Cms\Classes\CodeParser;
use Cms\Classes\Controller;

class CodeParserTest extends TestCase
{
    public function setUp(): void
    {
        parent::setup();

        /*
         * Clear cache
         */
        foreach (File::directories(storage_path() . '/cms/cache') as $directory) {
            File::deleteDirectory($directory);
        }

        // The request-wide cache outlives a single test, and the cache files it
        // points at have just been deleted
        self::getProperty('cache')->setValue(null, []);
    }

    public static function getProperty($name)
    {
        $class = new ReflectionClass(CodeParser::class);
        $property = $class->getProperty($name);

        return $property;
    }

    public function testParser()
    {
        $theme = Theme::load('test');

        $layout = Layout::load($theme, 'php-parser-test.htm');
        $this->assertNotEmpty($layout);

        $parser = new CodeParser($layout);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);

        $controller = new Controller($theme);
        $obj = $parser->source(null, $layout, $controller);
        $this->assertInstanceOf(LayoutCode::class, $obj);

        /*
         * Test the file contents
         */

        $body = preg_replace('/^\s*function/m', 'public function', $layout->code);
        $expectedContent = '<?php ' . PHP_EOL;

        $expectedContent .= 'class ' . $info['className'] . ' extends ' . LayoutCode::class . PHP_EOL;
        $expectedContent .= '{' . PHP_EOL;
        $expectedContent .= $body . PHP_EOL;
        $expectedContent .= '}' . PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));

        /*
         * Test caching - the first time the file should be parsed
         */

        $this->assertEquals('parser', $info['source']);

        /*
         * Test caching - the second time the file should be loaded from the request-wide cache
         */

        $parser = new CodeParser($layout);
        $info = $parser->parse();
        $this->assertIsArray($info);
        $this->assertEquals('request-cache', $info['source']);
        $this->assertFileExists($info['filePath']);

        /*
         * Test caching - reset the request-wide cache and let the parser to load the file from the cache
         */

        $property = $this->getProperty('cache');
        $property->setValue($parser, []);

        $parser = new CodeParser($layout);
        $info = $parser->parse();
        $this->assertIsArray($info);
        $this->assertEquals('cache', $info['source']);
        $this->assertFileExists($info['filePath']);

        /*
         * Test caching - the cached data should now be stored in the request-wide cache again
         */

        $parser = new CodeParser($layout);
        $info = $parser->parse();
        $this->assertIsArray($info);
        $this->assertEquals('request-cache', $info['source']);
        $this->assertFileExists($info['filePath']);

        /*
         * Test caching - update the file modification time and reset the internal cache. The file should be parsed.
         */

        $this->assertTrue(@touch($layout->getFilePath()));
        $layout = Layout::load($theme, 'php-parser-test.htm');
        $this->assertNotEmpty($layout);
        $parser = new CodeParser($layout);
        $property->setValue($parser, []);

        $info = $parser->parse();
        $this->assertIsArray($info);
        $this->assertEquals('parser', $info['source']);
        $this->assertFileExists($info['filePath']);
    }

    public function testParseNoPhp()
    {
        $theme = Theme::load('test');

        $layout = Layout::load($theme, 'no-php.htm');
        $this->assertNotEmpty($layout);

        $parser = new CodeParser($layout);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);

        $expectedContent = '<?php ' . PHP_EOL;
        $expectedContent .= 'class ' . $info['className'] . ' extends ' . LayoutCode::class . PHP_EOL;
        $expectedContent .= '{' . PHP_EOL;
        $expectedContent .= PHP_EOL;
        $expectedContent .= '}' . PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));
    }

    public function testParsingNeverTouchesTheCacheStore()
    {
        $theme = Theme::load('test');
        $requestCache = self::getProperty('cache');
        $requestCache->setValue(null, []);

        // First pass writes the cache file
        $info = (new CodeParser(Layout::load($theme, 'php-parser-test.htm')))->parse();
        $this->assertEquals('parser', $info['source']);

        // A later request resolves it from the cache file alone
        $requestCache->setValue(null, []);
        Cache::flush();

        $info = (new CodeParser(Layout::load($theme, 'php-parser-test.htm')))->parse();
        $this->assertEquals('cache', $info['source']);
        $this->assertTrue(class_exists($info['className']) || is_file($info['filePath']));
    }

    public function testCacheFileOlderThanTemplateIsRebuilt()
    {
        $theme = Theme::load('test');
        $requestCache = self::getProperty('cache');
        $requestCache->setValue(null, []);

        $layout = Layout::load($theme, 'php-parser-test.htm');
        $info = (new CodeParser($layout))->parse();
        $this->assertFileExists($info['filePath']);

        // Age the cache file behind the template it was built from
        $this->assertTrue(@touch($info['filePath'], $layout->mtime - 10));
        clearstatcache(true, $info['filePath']);
        $requestCache->setValue(null, []);

        $info = (new CodeParser($layout))->parse();
        $this->assertEquals('parser', $info['source']);
    }

    public function testExtractClassFromFileMatchesGeneratedNames()
    {
        $theme = Theme::load('test');
        $requestCache = self::getProperty('cache');
        $requestCache->setValue(null, []);

        $parser = new CodeParser(Layout::load($theme, 'php-parser-test.htm'));
        $info = $parser->parse();

        // The corrupt cache recovery path relies on reading the name back out
        $extracted = self::callProtectedMethod($parser, 'extractClassFromFile', [$info['filePath']]);
        $this->assertEquals($info['className'], $extracted);
    }

    public function testCacheFileDeclaringAnotherClassIsRecovered()
    {
        $theme = Theme::load('test');
        $requestCache = self::getProperty('cache');
        $requestCache->setValue(null, []);

        // A page no other test loads, so nothing has declared its class yet
        $page = Page::load($theme, 'code-parser-recovery.htm');
        $parser = new CodeParser($page);
        $path = self::callProtectedMethod($parser, 'getCacheFilePath', []);

        // rebuild() suffixes the class name when the predicted one is already
        // declared, which happens in a process that parsed the template once
        // before. Write the cache file such a process would leave behind.
        $otherName = 'Cms' . hash('sha256', $path . '0') . 'Class';

        @mkdir(dirname($path), 0755, true);
        file_put_contents(
            $path,
            '<?php ' . PHP_EOL . 'class ' . $otherName . ' extends ' . PageCode::class . PHP_EOL . '{' . PHP_EOL . '}' . PHP_EOL
        );
        $this->assertTrue(@touch($path, $page->mtime));
        clearstatcache(true, $path);

        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);

        $this->assertInstanceOf(PageCode::class, $obj);
        $this->assertEquals($otherName, get_class($obj));

        // Recovered by reading the name back, not by throwing the file away
        $this->assertFileExists($path);
    }

    public function testCorruptCacheFileIsRebuilt()
    {
        $theme = Theme::load('test');
        $requestCache = self::getProperty('cache');
        $requestCache->setValue(null, []);

        $page = Page::load($theme, 'cycle-test.htm');
        $info = (new CodeParser($page))->parse();

        // Another process wrote a truncated file
        file_put_contents($info['filePath'], '<?php ' . PHP_EOL);
        clearstatcache(true, $info['filePath']);
        $requestCache->setValue(null, []);

        $controller = new Controller($theme);
        $obj = (new CodeParser($page))->source($page, null, $controller);
        $this->assertInstanceOf(PageCode::class, $obj);
    }

    public function testParsePage()
    {
        $theme = Theme::load('test');

        $page = Page::load($theme, 'cycle-test.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf(PageCode::class, $obj);

        $body = preg_replace('/^\s*function/m', 'public function', $page->code);
        $expectedContent = '<?php ' . PHP_EOL;
        $expectedContent .= 'class ' . $info['className'] . ' extends ' . PageCode::class . PHP_EOL;
        $expectedContent .= '{' . PHP_EOL;
        $expectedContent .= $body . PHP_EOL;
        $expectedContent .= '}' . PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));
    }

    public function testOptionalPhpTags()
    {
        $theme = Theme::load('test');

        /*
         * Test short PHP tags
         */

        $page = Page::load($theme, 'optional-short-php-tags.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf('\Cms\Classes\PageCode', $obj);

        $body = preg_replace('/^\s*function/m', 'public function', $page->code);
        $expectedContent = '<?php ' . PHP_EOL;
        $expectedContent .= 'class ' . $info['className'] . ' extends ' . PageCode::class . PHP_EOL;
        $expectedContent .= '{' . PHP_EOL;
        $expectedContent .= $body . PHP_EOL;
        $expectedContent .= '}' . PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));

        /*
         * Test full PHP tags
         */

        $page = Page::load($theme, 'optional-full-php-tags.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf(PageCode::class, $obj);

        $body = preg_replace('/^\s*function/m', 'public function', $page->code);
        $expectedContent = '<?php ' . PHP_EOL;
        $expectedContent .= 'class ' . $info['className'] . ' extends ' . PageCode::class . PHP_EOL;
        $expectedContent .= '{' . PHP_EOL;
        $expectedContent .= $body . PHP_EOL;
        $expectedContent .= '}' . PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));
    }

    // public function testSyntaxErrors()
    // {
    //     $this->markTestIncomplete('Test PHP parsing errors here.');
    // }

    public function testNamespaces()
    {
        $theme = Theme::load('test');

        $page = Page::load($theme, 'code-namespaces.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf(PageCode::class, $obj);

        $referenceFilePath = base_path('/modules/cms/tests/fixtures/reference/namespaces.php.stub');
        $this->assertFileExists($referenceFilePath);
        $referenceContents = $this->getContents($referenceFilePath);

        $referenceContents = str_replace('{className}', $info['className'], $referenceContents);

        $this->assertEquals($referenceContents, $this->getContents($info['filePath']));
    }

    public function testNamespacesAliases()
    {
        $theme = Theme::load('test');

        $page = Page::load($theme, 'code-namespaces-aliases.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertIsArray($info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf(PageCode::class, $obj);

        $referenceFilePath = base_path('/modules/cms/tests/fixtures/reference/namespaces-aliases.php.stub');
        $this->assertFileExists($referenceFilePath);
        $referenceContents = $this->getContents($referenceFilePath);

        $referenceContents = str_replace('{className}', $info['className'], $referenceContents);

        $this->assertEquals($referenceContents, $this->getContents($info['filePath']));
    }

    //
    // Helpers
    //

    protected function getContents($path)
    {
        $content = file_get_contents($path);
        $content = preg_replace('~\R~u', PHP_EOL, $content); // Normalize EOL
        return $content;
    }
}
