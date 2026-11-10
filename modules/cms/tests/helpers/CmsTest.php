<?php

use Cms\Helpers\Cms as CmsHelper;
use Cms\Classes\CmsController;

class CmsTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.url_exceptions', [
            '/api/*' => 'maintenance',
            '/sitemap.xml' => 'site|maintenance',
            '/landing-page' => 'site',
        ]);
    }

    public function testMatchUrlException()
    {
        $helper = new CmsHelper;
        $this->assertFalse($helper->urlHasException('/api/ping', 'site'));
        $this->assertTrue($helper->urlHasException('/api/ping', 'maintenance'));
        $this->assertFalse($helper->urlHasException('api/users', 'site'));
        $this->assertTrue($helper->urlHasException('api/users', 'maintenance'));
        $this->assertTrue($helper->urlHasException('api/users/', 'maintenance'));
        $this->assertFalse($helper->urlHasException('/api', 'maintenance'));
        $this->assertFalse($helper->urlHasException('api', 'maintenance'));
        $this->assertFalse($helper->urlHasException('/landing-page', 'maintenance'));
        $this->assertTrue($helper->urlHasException('/landing-page', 'site'));
        $this->assertFalse($helper->urlHasException('/landing-page/foobar', 'site'));
        $this->assertTrue($helper->urlHasException('/sitemap.xml', 'site'));
        $this->assertTrue($helper->urlHasException('/sitemap.xml', 'maintenance'));
        $this->assertFalse($helper->urlHasException('/sitemap.xml', 'foobar'));
    }

    public function tearDown(): void
    {
        CmsHelper::clearCache();

        parent::tearDown();
    }

    public function testUrl()
    {
        // The CMS route is added before each request
        Route::any('{slug?}', [CmsController::class, 'run'])->where('slug', '(.*)?');
        CmsHelper::clearCache();

        $helper = new CmsHelper;
        $this->assertEquals(Url::to('blog/post/hello-world'), $helper->url('/blog/post/hello-world'));
        $this->assertEquals(Url::to('blog/post/hello-world'), $helper->url('blog/post/hello-world'));

        // Braces from a visitor's URL are not route parameters
        $this->assertEquals(
            Url::to('blog/post/%7B%7B%20fields.link%20%7D%7D'),
            $helper->url('/blog/post/{{ fields.link }}')
        );
    }
}
