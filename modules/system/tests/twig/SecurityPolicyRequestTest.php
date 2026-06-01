<?php

use Illuminate\Http\Request;
use System\Twig\SecurityPolicy\SafeRequest;
use System\Twig\SecurityPolicy;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SecurityPolicyRequestTest covers SecurityPolicy's handling of
 * Illuminate\Http\Request. Raw requests must no longer be directly
 * allowlisted, and castMethodObjectToSafeObject must wrap them in
 * SafeRequest for safe Twig exposure.
 */
class SecurityPolicyRequestTest extends TestCase
{
    protected SecurityPolicy $policy;

    public function setUp(): void
    {
        parent::setUp();
        $this->policy = new SecurityPolicy();
    }

    protected function makeRequest(): Request
    {
        return Request::create('http://example.test/', 'GET');
    }

    public function testRawRequestIsNotDirectlyAllowlisted()
    {
        $request = $this->makeRequest();

        $this->expectException(SecurityNotAllowedMethodError::class);

        $this->policy->checkMethodAllowed($request, 'server');
    }

    public function testCastWrapsRequestInSafeProxy()
    {
        $request = $this->makeRequest();
        $cast = $this->policy->castMethodObjectToSafeObject($request);

        $this->assertInstanceOf(SafeRequest::class, $cast);
    }

    public function testCastedProxyPassesMethodAllowedCheck()
    {
        $proxy = $this->policy->castMethodObjectToSafeObject($this->makeRequest());

        // SafeRequest implements CallsAnyMethod, so the policy must
        // accept any method name on it without throwing. The proxy's
        // own __call enforces the real restrictions.
        $this->policy->checkMethodAllowed($proxy, 'url');
        $this->policy->checkMethodAllowed($proxy, 'server');
        $this->policy->checkMethodAllowed($proxy, 'bearerToken');

        $this->assertTrue(true);
    }
}
