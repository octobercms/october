<?php

use Cms\Classes\Controller;
use Cms\Classes\Theme;

class ControllerTest extends TestCase
{
    public function tearDown() {
        Mockery::close();
    }

    public function test404()
    {
        /*
         * Test the built-in 404 page
         */

        $theme = new Theme();
        $theme->load('apitest');
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

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/some-page-that-doesnt-exist');
        $this->assertInternalType('string', $response);
        $page404Content = file_get_contents($theme->getPath().'/pages/404.htm');
        $this->assertEquals('<p>Page not found</p>', $response);
    }

    public function testRoot()
    {
        /*
         * Test the / route and the fallback layout
         */
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/');
        $this->assertInternalType('string', $response);
        $content = file_get_contents($theme->getPath().'/pages/index.htm');
        $this->assertEquals('<h1>My Webpage</h1>', trim($response));
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage is not found
     */
    public function testLayoutNotFound()
    {
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/no-layout');
    }

    public function testExistingLayout()
    {
        /*
         * Test existing layout
         */
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-layout');
        $this->assertEquals('<div><p>Hey</p></div>', $response);
    }

    public function testPartials()
    {
        /*
         * Test partials referred in the layout and page
         */
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-partials');
        $this->assertEquals('<div>LAYOUT PARTIAL<p>Hey PAGE PARTIAL Homer Simpson A partial</p></div>', $response);
    }

    public function testContent()
    {
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-content');
        $this->assertEquals('<div>LAYOUT CONTENT<p>Hey PAGE CONTENT A content</p></div>', $response);
    }

    public function testBlocks()
    {
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-placeholder');
        $this->assertEquals("<div>LAYOUT CONTENT <span>BLOCK\n  DEFAULT</span> <p>Hey PAGE CONTENT</p></div>SECOND BLOCK", $response);
    }

    public function testLayoutInSubdirectory()
    {
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/apage');
        $this->assertEquals("<div>LAYOUT CONTENT <h1>This page is a subdirectory</h1></div>", $response);
    }

    /**
     * @expectedException        Cms\Classes\CmsException
     * @expectedExceptionMessage is not found
     */
    public function testPartialNotFound()
    {
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/no-partial');
    }

    public function testPageLifeCycle()
    {
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/cycle-test');
        $this->assertEquals('12345', $response);
    }

    protected function configAjaxRequestMock($handler, $partials = false)
    {
        $requestMock = $this->getMock('Illuminate\Http\Request', array('header'));

        $requestMock->expects($this->at(0))->
            method('header')->
            with($this->stringContains('X_OCTOBER_REQUEST_HANDLER'), $this->anything())->
            will($this->returnValue($handler));

        if ($partials !== false) 
            $requestMock->expects($this->at(1))->
                method('header')->
                with($this->stringContains('X_OCTOBER_REQUEST_PARTIALS'), $this->anything())->
                will($this->returnValue($partials));

        return $requestMock;
    }

    public function testAjaxHandlerNotFound()
    {
        App::instance('request', $this->configAjaxRequestMock('onNoHandler', ''));

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $this->assertInternalType('string', $response->getOriginalContent());
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals("AJAX handler 'onNoHandler' was not found.", $response->getOriginalContent());
    }

    public function testAjaxInvalidHandlerName()
    {
        App::instance('request', $this->configAjaxRequestMock('delete'));

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $this->assertInternalType('string', $response->getOriginalContent());
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals('Invalid AJAX handler name: delete.', $response->getOriginalContent());
    }

    public function testAjaxInvalidPartial()
    {
        App::instance('request', $this->configAjaxRequestMock('onTest', 'p:artial'));

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $this->assertInternalType('string', $response->getOriginalContent());
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals('Invalid partial name: p:artial.', $response->getOriginalContent());
    }

    public function testAjaxPartialNotFound()
    {
        App::instance('request', $this->configAjaxRequestMock('onTest', 'partial'));

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/ajax-test');
        $this->assertInstanceOf('Symfony\Component\HttpFoundation\Response', $response);

        $this->assertInternalType('string', $response->getOriginalContent());
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals("The partial 'partial' is not found.", $response->getOriginalContent());
    }

    public function testPageAjax()
    {
        App::instance('request', $this->configAjaxRequestMock('onTest', 'ajax-result'));

        $theme = new Theme();
        $theme->load('test');
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
        App::instance('request', $this->configAjaxRequestMock('onTestLayout', 'ajax-result'));

        $theme = new Theme();
        $theme->load('test');
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
        App::instance('request', $this->configAjaxRequestMock('onTest', 'ajax-result&ajax-second-result'));

        $theme = new Theme();
        $theme->load('test');
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
        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-component');
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
        include_once dirname(dirname(__DIR__)) . '/fixtures/System/plugins/October/Test/Components/Archive.php';

        $theme = new Theme();
        $theme->load('test');
        $controller = new Controller($theme);
        $response = $controller->run('/with-components');
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
        App::instance('request', $this->configAjaxRequestMock('testArchive::onTestAjax', 'ajax-result'));

        $theme = new Theme();
        $theme->load('test');
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
}