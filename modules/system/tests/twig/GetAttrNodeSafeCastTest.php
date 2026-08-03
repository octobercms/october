<?php

use Illuminate\Http\Request;
use System\Twig\Node\GetAttrNode;
use System\Twig\SecurityPolicy;
use Twig\Environment;
use Twig\Extension\SandboxExtension;
use Twig\Loader\ArrayLoader;
use Twig\Sandbox\SecurityNotAllowedMethodError;
use Twig\Source;
use Twig\Template;

/**
 * GetAttrNodeSafeCastTest covers the sandbox safe-object cast in
 * customGetAttribute. The cast must apply to any access type, not
 * only method calls, so that property access (Twig's ANY_CALL) does
 * not expose the raw underlying object's public bags.
 */
class GetAttrNodeSafeCastTest extends TestCase
{
    protected function makeEnvironment(): Environment
    {
        $env = new Environment(new ArrayLoader([]));
        $env->addExtension(new SandboxExtension(new SecurityPolicy, true));

        return $env;
    }

    protected function makeRequest(): Request
    {
        return Request::create('http://example.test/', 'GET');
    }

    protected function customGetAttrAnyCall(Environment $env, $object, string $item)
    {
        return GetAttrNode::customGetAttribute(
            $env,
            new Source('', 'test'),
            $object,
            $item,
            [],
            Template::ANY_CALL,
            false,
            true,
            true
        );
    }

    public function testAnyCallOnRawRequestBlocksServerBag()
    {
        $env = $this->makeEnvironment();

        // Twig compiles {{ this.request.server }} with type ANY_CALL.
        // Prior to the fix, this returned the raw Symfony ParameterBag
        // holding every $_SERVER value, bypassing SafeRequest entirely.
        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('server');

        $this->customGetAttrAnyCall($env, $this->makeRequest(), 'server');
    }

    public function testAnyCallOnRawRequestBlocksCookiesBag()
    {
        $env = $this->makeEnvironment();

        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('cookies');

        $this->customGetAttrAnyCall($env, $this->makeRequest(), 'cookies');
    }

    public function testAnyCallOnRawRequestBlocksHeadersBag()
    {
        $env = $this->makeEnvironment();

        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('headers');

        $this->customGetAttrAnyCall($env, $this->makeRequest(), 'headers');
    }

    public function testAnyCallOnRawRequestBlocksAttributesBag()
    {
        $env = $this->makeEnvironment();

        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('attributes');

        $this->customGetAttrAnyCall($env, $this->makeRequest(), 'attributes');
    }

    public function testAnyCallOnRawRequestStillResolvesAllowedProperties()
    {
        $env = $this->makeEnvironment();

        // Allowed methods are exposed by SafeRequest's __get so
        // {{ this.request.url }} still works after the fix.
        $this->assertSame(
            'http://example.test',
            $this->customGetAttrAnyCall($env, $this->makeRequest(), 'url')
        );
    }
}
