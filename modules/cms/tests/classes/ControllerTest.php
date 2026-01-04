<?php

use Cms\Classes\Theme;
use Cms\Classes\Controller;
use October\Rain\Halcyon\Model;

class ControllerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Model::clearBootedModels();
        Model::flushEventListeners();

        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/Archive.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/Post.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/MainMenu.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/ContentBlock.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/Comments.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/classes/Users.php';
    }

    /**
     * normalizeLineEndings for cross-platform test compatibility
     */
    protected function normalizeLineEndings($string)
    {
        return str_replace("\r\n", "\n", $string);
    }

    public function testThemeUrl()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);

        $url = $controller->themeUrl();
        $this->assertEquals(url('/themes/test'), $url);

        $url = $controller->themeUrl('foo/bar.css');
        $this->assertEquals(url('/themes/test/foo/bar.css'), $url);

        //
        // These tests seem to bear different results
        //

        // $url = $controller->themeUrl(['assets/css/style1.css', 'assets/css/style2.css']);
        // $url = substr($url, 0, strpos($url, '-'));
        // $this->assertEquals('/combine/88634b8fa6f4f6442ce830d38296640a', $url);

        // $url = $controller->themeUrl(['assets/js/script1.js', 'assets/js/script2.js']);
        // $url = substr($url, 0, strpos($url, '-'));
        // $this->assertEquals('/combine/860afc990164a60a8e90682d04da27ee', $url);
    }

    public function test404()
    {
        /*
         * Test the built-in 404 page
         */
        $theme = Theme::load('apitest');
        $controller = new Controller($theme);
        $response = $controller->run('/some-page-that-doesnt-exist');
        $this->assertNotEmpty($response);
        $this->assertInstanceOf('\Illuminate\Http\Response', $response);
        ob_start();
        include base_path().'/modules/cms/views/404.php';
        $page404Content = ob_get_contents();
        ob_end_clean();
        $this->assertEquals($page404Content, $response->getContent());

        /*
         * Test the theme 404 page
         */
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/some-page-that-doesnt-exist');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);
        $content = $response->getContent();
        $this->assertIsString($content);
        $this->assertEquals('<p>Page not found</p>', $content);
    }

    public function testRoot()
    {
        /*
         * Test the / route and the fallback layout
         */
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);
        $content = $response->getContent();
        $this->assertIsString($content);
        $this->assertEquals('<h1>My Webpage</h1>', trim($content));
    }

    public function testLayoutNotFound()
    {
        $this->expectException(\Cms\Classes\CmsException::class);
        $this->expectExceptionMessageMatches('/is\snot\sfound/');

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/no-layout');
    }

    public function testExistingLayout()
    {
        /*
         * Test existing layout
         */
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-layout');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);
        $content = $response->getContent();
        $this->assertEquals('<div><p>Hey</p></div>', $content);
    }

    public function testPartials()
    {
        /*
         * Test partials referred in the layout and page
         */
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-partials')->getContent();
        $this->assertEquals('<div>LAYOUT PARTIAL<p>Hey PAGE PARTIAL Homer Simpson The body value is "foobar" A partial</p></div>', $response);
    }

    public function testContent()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-content')->getContent();
        $this->assertEquals('<div>LAYOUT CONTENT<p>Hey PAGE CONTENT A content</p></div>', $response);
    }

    public function testBlocks()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-placeholder')->getContent();
        $this->assertEquals("<div>LAYOUT CONTENT <span>BLOCK\n  DEFAULT</span> <p>Hey PAGE CONTENT</p></div><p>SECOND BLOCK</p>THIRD VARIABLE", $response);
    }

    public function testLayoutInSubdirectory()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/apage')->getContent();
        $this->assertEquals("<div>LAYOUT CONTENT <h1>This page is a subdirectory</h1></div>", $response);
    }

    public function testPartialNotFound()
    {
        $this->expectException(\Twig\Error\RuntimeError::class);
        $this->expectExceptionMessageMatches('/is\snot\sfound/');

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/no-partial')->getContent();
    }

    public function testPageLifeCycle()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/cycle-test')->getContent();
        $this->assertEquals('12345', $response);
    }

    protected function configAjaxRequestMock($handler, $partials = false)
    {
        // Create a partial mock that initializes properly for PHP 8.5+ typed properties
        $requestMock = $this->getMockBuilder(\Illuminate\Http\Request::class)
            ->setConstructorArgs([[], [], [], [], [], ['REQUEST_METHOD' => 'POST']])
            ->onlyMethods(['ajax', 'header'])
            ->getMock();

        $requestMock->expects($this->any())
            ->method('ajax')
            ->willReturn(true);

        $requestMock->expects($this->any())
            ->method('header')
            ->willReturnCallback(function ($key, $default = null) use ($handler, $partials) {
                return match ($key) {
                    'X-AJAX-HANDLER' => $handler,
                    'X-AJAX-PARTIALS' => $partials ?: '',
                    'X-AJAX-FLASH' => null,
                    'X-AJAX-PARTIAL' => null,
                    default => $default,
                };
            });

        return $requestMock;
    }

    public function testAjaxHandlerNotFound()
    {
        Request::swap($this->configAjaxRequestMock('onNoHandler', ''));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');

        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);
        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertFalse($content['__ajax']['ok']);
        $this->assertStringContainsString('onNoHandler', $content['__ajax']['message']);
    }

    public function testAjaxInvalidHandlerName()
    {
        Request::swap($this->configAjaxRequestMock('delete'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');

        // Invalid handler name is not an AJAX request, returns normal page
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);
    }

    public function testAjaxInvalidPartial()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'p:artial'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');

        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);
        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertFalse($content['__ajax']['ok']);
        $this->assertStringContainsString('p:artial', $content['__ajax']['message']);
    }

    public function testAjaxPartialNotFound()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'partial'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');

        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);
        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertFalse($content['__ajax']['ok']);
        $this->assertStringContainsString('partial', $content['__ajax']['message']);
    }

    public function testPageAjax()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'ajax-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);

        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertIsArray($content);
        $this->assertEquals(200, $httpResponse->getStatusCode());
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertTrue($content['__ajax']['ok']);

        // Check partials in ops array
        $partials = array_filter($content['__ajax']['ops'], fn($op) => $op['op'] === 'partial');
        $partial = array_values($partials)[0] ?? null;
        $this->assertNotNull($partial);
        $this->assertEquals('ajax-result', $partial['name']);
        $this->assertEquals('page', $partial['html']);
    }

    public function testLayoutAjax()
    {
        Request::swap($this->configAjaxRequestMock('onTestLayout', 'ajax-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);

        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertIsArray($content);
        $this->assertEquals(200, $httpResponse->getStatusCode());
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertTrue($content['__ajax']['ok']);

        // Check partials in ops array
        $partials = array_filter($content['__ajax']['ops'], fn($op) => $op['op'] === 'partial');
        $partial = array_values($partials)[0] ?? null;
        $this->assertNotNull($partial);
        $this->assertEquals('ajax-result', $partial['name']);
        $this->assertEquals('layout-test', $partial['html']);
    }

    public function testAjaxMultiplePartials()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'ajax-result&ajax-second-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);

        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertIsArray($content);
        $this->assertEquals(200, $httpResponse->getStatusCode());
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertTrue($content['__ajax']['ok']);

        // Check partials in ops array
        $partials = array_filter($content['__ajax']['ops'], fn($op) => $op['op'] === 'partial');
        $partialsByName = array_column($partials, 'html', 'name');
        $this->assertArrayHasKey('ajax-result', $partialsByName);
        $this->assertArrayHasKey('ajax-second-result', $partialsByName);
        $this->assertEquals('page', $partialsByName['ajax-result']);
        $this->assertEquals('second', $partialsByName['ajax-second-result']);
    }

    public function testBasicComponents()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-component')->getContent();
        $page = self::getProtectedProperty($controller, 'page');
        $this->assertArrayHasKey('testArchive', $page->components);

        $component = $page->components['testArchive'];
        $details = $component->componentDetails();

        $content = <<<ESC
<div>LAYOUT CONTENT<p>This page uses components.</p>
    <h3>Lorum ipsum</h3>
    <p>Post Content #1</p>
    <h3>La Playa Nudista</h3>
    <p>Second Post Content</p>
</div>
ESC;

        $this->assertEquals($this->normalizeLineEndings($content), $this->normalizeLineEndings($response));
        $this->assertEquals(69, $component->property('posts-per-page'));
        $this->assertEquals('Blog Archive Dummy Component', $details['name']);
        $this->assertEquals('Displays an archive of blog posts.', $details['description']);
    }

    public function testComponentAliases()
    {
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/Archive.php';

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-components')->getContent();
        $page = self::getProtectedProperty($controller, 'page');

        $this->assertArrayHasKey('firstAlias', $page->components);
        $this->assertArrayHasKey('secondAlias', $page->components);

        $component = $page->components['firstAlias'];
        $component2 = $page->components['secondAlias'];

        $content = <<<ESC
<div>LAYOUT CONTENT<p>This page uses components.</p>
    <h3>Lorum ipsum</h3>
    <p>Post Content #1</p>
    <h3>La Playa Nudista</h3>
    <p>Second Post Content</p>
</div>
ESC;

        $this->assertEquals($this->normalizeLineEndings($content), $this->normalizeLineEndings($response));
        $this->assertEquals(6, $component->property('posts-per-page'));
        $this->assertEquals(9, $component2->property('posts-per-page'));
    }

    public function testComponentAjax()
    {
        Request::swap($this->configAjaxRequestMock('testArchive::onTestAjax', 'ajax-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-component');
        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);

        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertIsArray($content);
        $this->assertEquals(200, $httpResponse->getStatusCode());
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertTrue($content['__ajax']['ok']);

        // Check partials in ops array
        $partials = array_filter($content['__ajax']['ops'], fn($op) => $op['op'] === 'partial');
        $partial = array_values($partials)[0] ?? null;
        $this->assertNotNull($partial);
        $this->assertEquals('ajax-result', $partial['name']);
        $this->assertEquals('page', $partial['html']);
    }

    public function testComponentAjaxDependencyInjection()
    {
        Request::swap($this->configAjaxRequestMock('testArchive::onTestDependencyInjection'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-component');

        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);
        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertArrayHasKey('result', $content);
        $this->assertEquals('POST', $content['result']);
    }

    public function testComponentClassNotFound()
    {
        Config::set('cms.strict_components', true);

        $this->expectException(\October\Rain\Exception\SystemException::class);
        $this->expectExceptionMessageMatches('/is\snot\sregistered\sfor\sthe\scomponent/');

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/no-component-class')->getContent();
    }

    public function testComponentNotFound()
    {
        //
        // This test should probably be throwing an exception... -sg
        //
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/no-component')->getContent();

        $this->assertEquals('<p>Hey</p>', $response);
    }

    public function testComponentPartial()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/component-partial')->getContent();

        $this->assertEquals('<p>DEFAULT MARKUP: I am a post yay</p>', $response);
    }

    public function testComponentPartialAliasOverride()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/component-partial-alias-override')->getContent();

        //
        // Testing case sensitivity
        //
        // Component alias: overRide1
        // Target path: partials\override1\default.htm
        //
        $this->assertEquals('<p>I am an override alias partial! Yay</p>', $response);
    }

    public function testComponentPartialOverride()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/component-partial-override')->getContent();

        //
        // Testing case sensitivity
        //
        // Component code: testPost
        // Target path: partials\testpost\default.htm
        //
        $this->assertEquals('<p>I am an override partial! Yay</p>', $response);
    }

    public function testComponentPartialNesting()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/component-partial-nesting')->getContent();

        $content = <<<ESC
<h1>Level 1</h1>
<ul>
    <strong>Home</strong>
    <strong>Blog</strong>
    <strong>About</strong>
    <strong>Contact</strong>
    <strong>Home</strong>
    <strong>Blog</strong>
    <strong>About</strong>
    <strong>Contact</strong>
    <strong>Home</strong>
    <strong>Blog</strong>
    <strong>About</strong>
    <strong>Contact</strong>
</ul>

<h1>Level 2</h1>
<p>DEFAULT MARKUP: I am a post yay</p><p>I am another post, deep down</p>

<h1>Level 3</h1>
<h4>DEFAULT MARKUP: Menu</h4>
<ul>
    <li>DEFAULT: Home</li>
    <li>DEFAULT: Blog</li>
    <li>DEFAULT: About</li>
    <li>DEFAULT: Contact</li>
</ul>
<p>Insert post here</p>
ESC;

        $this->assertEquals($this->normalizeLineEndings($content), $this->normalizeLineEndings($response));
    }

    public function testComponentWithOnRender()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/component-custom-render')->getContent();

        $content = <<<ESC
Pass
Custom output: Would you look over Picasso's shoulder
Custom output: And tell him about his brush strokes?
ESC;
        $this->assertEquals($this->normalizeLineEndings($content), $this->normalizeLineEndings($response));
    }
}
