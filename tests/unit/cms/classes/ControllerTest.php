<?php

use Cms\Classes\Theme;
use Cms\Classes\Controller;

class ControllerTest extends TestCase
{
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
        $this->assertInternalType('string', $content);
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
        $this->assertInternalType('string', $content);
        $this->assertEquals('<h1>My Webpage</h1>', trim($content));
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage is not found
     */
    public function testLayoutNotFound()
    {
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
        $this->assertEquals('<div>LAYOUT PARTIAL<p>Hey PAGE PARTIAL Homer Simpson A partial</p></div>', $response);
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
        $this->assertEquals("<div>LAYOUT CONTENT <span>BLOCK\n  DEFAULT</span> <p>Hey PAGE CONTENT</p></div>SECOND BLOCK", $response);
    }

    public function testLayoutInSubdirectory()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/apage')->getContent();
        $this->assertEquals("<div>LAYOUT CONTENT <h1>This page is a subdirectory</h1></div>", $response);
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage is not found
     */
    public function testPartialNotFound()
    {
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
        $requestMock = $this->getMock('Illuminate\Http\Request', array('header'));

        $requestMock->expects($this->at(0))
            ->method('header')
            ->with($this->stringContains('X_OCTOBER_REQUEST_HANDLER'), $this->anything())
            ->will($this->returnValue($handler));

        if ($partials !== false) {
            $requestMock->expects($this->at(1))
                ->method('header')
                ->with($this->stringContains('X_OCTOBER_REQUEST_PARTIALS'), $this->anything())
                ->will($this->returnValue($partials));
        }

        return $requestMock;
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage AJAX handler 'onNoHandler' was not found.
     */
    public function testAjaxHandlerNotFound()
    {
        Request::swap($this->configAjaxRequestMock('onNoHandler', ''));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $controller->run('/ajax-test');

        //
        // This was the old approach, can remove this comment block if year >= 2017
        //

        // $response = $controller->run('/ajax-test');
        // $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        // $this->assertInternalType('string', $response->getOriginalContent());
        // $this->assertEquals(500, $response->getStatusCode());
        // $this->assertEquals("AJAX handler 'onNoHandler' was not found.", $response->getOriginalContent());
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage Invalid AJAX handler name: delete.
     */
    public function testAjaxInvalidHandlerName()
    {
        Request::swap($this->configAjaxRequestMock('delete'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $controller->run('/ajax-test');
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage Invalid partial name: p:artial.
     */
    public function testAjaxInvalidPartial()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'p:artial'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $controller->run('/ajax-test');
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage The partial 'partial' is not found.
     */
    public function testAjaxPartialNotFound()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'partial'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $controller->run('/ajax-test');
    }

    public function testPageAjax()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'ajax-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $content = $response->getOriginalContent();
        $this->assertInternalType('array', $content);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, $content);
        $this->assertArrayHasKey('ajax-result', $content);
        $this->assertEquals('page', $content['ajax-result']);
    }

    public function testLayoutAjax()
    {
        Request::swap($this->configAjaxRequestMock('onTestLayout', 'ajax-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $content = $response->getOriginalContent();
        $this->assertInternalType('array', $content);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, $content);
        $this->assertArrayHasKey('ajax-result', $content);
        $this->assertEquals('layout-test', $content['ajax-result']);
    }

    public function testAjaxMultiplePartials()
    {
        Request::swap($this->configAjaxRequestMock('onTest', 'ajax-result&ajax-second-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $content = $response->getOriginalContent();
        $this->assertInternalType('array', $content);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(2, $content);
        $this->assertArrayHasKey('ajax-result', $content);
        $this->assertArrayHasKey('ajax-second-result', $content);
        $this->assertEquals('page', $content['ajax-result']);
        $this->assertEquals('second', $content['ajax-second-result']);
    }

    public function testBasicComponents()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-component')->getContent();
        $page = PHPUnit_Framework_Assert::readAttribute($controller, 'page');
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

        $this->assertEquals($content, $response);
        $this->assertEquals(69, $component->property('posts-per-page'));
        $this->assertEquals('Blog Archive Dummy Component', $details['name']);
        $this->assertEquals('Displays an archive of blog posts.', $details['description']);
    }

    public function testComponentAliases()
    {
        include_once base_path() . '/tests/fixtures/plugins/october/tester/components/Archive.php';

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-components')->getContent();
        $page = PHPUnit_Framework_Assert::readAttribute($controller, 'page');

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

        $this->assertEquals($content, $response);
        $this->assertEquals(6, $component->property('posts-per-page'));
        $this->assertEquals(9, $component2->property('posts-per-page'));
    }

    public function testComponentAjax()
    {
        Request::swap($this->configAjaxRequestMock('testArchive::onTestAjax', 'ajax-result'));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-component');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $content = $response->getOriginalContent();
        $this->assertInternalType('array', $content);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertCount(1, $content);
        $this->assertArrayHasKey('ajax-result', $content);
        $this->assertEquals('page', $content['ajax-result']);
    }

    public function testThemeUrl()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);

        $url = $controller->themeUrl();
        $this->assertEquals('http://localhost/themes/test', $url);

        $url = $controller->themeUrl('foo/bar.css');
        $this->assertEquals('http://localhost/themes/test/foo/bar.css', $url);

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

}
