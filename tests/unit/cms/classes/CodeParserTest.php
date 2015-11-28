<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Layout;
use Cms\Classes\CodeParser;
use Cms\Classes\Controller;

class CodeParserTest extends TestCase
{
    public static function getProperty($name)
    {
        $class = new ReflectionClass('\Cms\Classes\CodeParser');
        $property = $class->getProperty($name);
        $property->setAccessible(true);

        return $property;
    }

    public function testParser()
    {
        $theme = Theme::load('test');

        $layout = Layout::load($theme, 'php-parser-test.htm');
        $this->assertNotEmpty($layout);

        $parser = new CodeParser($layout);
        $info = $parser->parse();

        $this->assertInternalType('array', $info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);

        $controller = new Controller($theme);
        $obj = $parser->source(null, $layout, $controller);
        $this->assertInstanceOf('\Cms\Classes\LayoutCode', $obj);

        /*
         * Test the file contents
         */

        $body = preg_replace('/^\s*function/m', 'public function', $layout->code);
        $expectedContent = '<?php '.PHP_EOL;

        $expectedContent .= 'class '.$info['className'].' extends \Cms\Classes\LayoutCode'.PHP_EOL;
        $expectedContent .= '{'.PHP_EOL;
        $expectedContent .= $body.PHP_EOL;
        $expectedContent .= '}'.PHP_EOL;

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
        $this->assertInternalType('array', $info);
        $this->assertEquals('request-cache', $info['source']);
        $this->assertFileExists($info['filePath']);

        /*
         * Test caching - reset the request-wide cache and let the parser to load the file from the cache
         */

        $property = $this->getProperty('cache');
        $property->setValue($parser, []);

        $parser = new CodeParser($layout);
        $info = $parser->parse();
        $this->assertInternalType('array', $info);
        $this->assertEquals('cache', $info['source']);
        $this->assertFileExists($info['filePath']);

        /*
         * Test caching - the cached data should now be stored in the request-wide cache again
         */

        $parser = new CodeParser($layout);
        $info = $parser->parse();
        $this->assertInternalType('array', $info);
        $this->assertEquals('request-cache', $info['source']);
        $this->assertFileExists($info['filePath']);

        /*
         * Test caching - update the file modification time and reset the internal cache. The file should be parsed.
         */

        $this->assertTrue(@touch($layout->getFullPath()));
        $layout = Layout::load($theme, 'php-parser-test.htm');
        $this->assertNotEmpty($layout);
        $parser = new CodeParser($layout);
        $property->setValue($parser, []);

        $info = $parser->parse();
        $this->assertInternalType('array', $info);
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

        $this->assertInternalType('array', $info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);

        $expectedContent = '<?php '.PHP_EOL;
        $expectedContent .= 'class '.$info['className'].' extends \Cms\Classes\LayoutCode'.PHP_EOL;
        $expectedContent .= '{'.PHP_EOL;
        $expectedContent .= PHP_EOL;
        $expectedContent .= '}'.PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));
    }

    public function testParsePage()
    {
        $theme = Theme::load('test');

        $page = Page::load($theme, 'cycle-test.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertInternalType('array', $info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf('\Cms\Classes\PageCode', $obj);

        $body = preg_replace('/^\s*function/m', 'public function', $page->code);
        $expectedContent = '<?php '.PHP_EOL;
        $expectedContent .= 'class '.$info['className'].' extends \Cms\Classes\PageCode'.PHP_EOL;
        $expectedContent .= '{'.PHP_EOL;
        $expectedContent .= $body.PHP_EOL;
        $expectedContent .= '}'.PHP_EOL;

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

        $this->assertInternalType('array', $info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf('\Cms\Classes\PageCode', $obj);

        $body = preg_replace('/^\s*function/m', 'public function', $page->code);
        $expectedContent = '<?php '.PHP_EOL;
        $expectedContent .= 'class '.$info['className'].' extends \Cms\Classes\PageCode'.PHP_EOL;
        $expectedContent .= '{'.PHP_EOL;
        $expectedContent .= $body.PHP_EOL;
        $expectedContent .= '}'.PHP_EOL;

        $this->assertEquals($expectedContent, file_get_contents($info['filePath']));

        /*
         * Test full PHP tags
         */

        $page = Page::load($theme, 'optional-full-php-tags.htm');
        $this->assertNotEmpty($page);

        $parser = new CodeParser($page);
        $info = $parser->parse();

        $this->assertInternalType('array', $info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf('\Cms\Classes\PageCode', $obj);

        $body = preg_replace('/^\s*function/m', 'public function', $page->code);
        $expectedContent = '<?php '.PHP_EOL;
        $expectedContent .= 'class '.$info['className'].' extends \Cms\Classes\PageCode'.PHP_EOL;
        $expectedContent .= '{'.PHP_EOL;
        $expectedContent .= $body.PHP_EOL;
        $expectedContent .= '}'.PHP_EOL;

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

        $this->assertInternalType('array', $info);
        $this->assertArrayHasKey('filePath', $info);
        $this->assertArrayHasKey('className', $info);
        $this->assertArrayHasKey('source', $info);

        $this->assertFileExists($info['filePath']);
        $controller = new Controller($theme);
        $obj = $parser->source($page, null, $controller);
        $this->assertInstanceOf('\Cms\Classes\PageCode', $obj);

        $referenceFilePath = base_path().'/tests/fixtures/cms/reference/namespaces.php.stub';
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
