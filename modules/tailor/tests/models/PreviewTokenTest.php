<?php

use Tailor\Models\PreviewToken;
use Illuminate\Http\Request;

class PreviewTokenTest extends PluginTestCase
{
    public function tearDown(): void
    {
        (new ReflectionProperty(PreviewToken::class, 'enabledToken'))->setValue(null, null);

        parent::tearDown();
    }

    /**
     * testTokenIgnoresQueryString covers multisite previews, where the preview URL
     * carries the backend's _site_id query parameter but the current URL does not.
     */
    public function testTokenIgnoresQueryString()
    {
        $token = PreviewToken::createTokenForUrl('http://localhost/blog/my-post?_site_id=2');

        $this->assertEquals('/blog/my-post', $token->getRouteParam('uri'));

        Url::setRequest(Request::create('http://localhost/blog/other-post'));
        PreviewToken::checkTokenForCurrentUrl($token->token);
        $this->assertFalse(PreviewToken::isTokenEnabled());

        Url::setRequest(Request::create('http://localhost/blog/my-post?_preview_token='.$token->token));
        PreviewToken::checkTokenForCurrentUrl($token->token);
        $this->assertTrue(PreviewToken::isTokenEnabled());
    }
}
