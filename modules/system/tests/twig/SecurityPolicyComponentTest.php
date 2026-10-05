<?php

use Cms\Classes\Controller;
use Cms\Classes\ComponentBase;
use System\Twig\SecurityPolicy;
use Twig\Environment;
use Twig\Extension\SandboxExtension;
use Twig\Loader\ArrayLoader;
use Twig\Sandbox\SecurityNotAllowedMethodError;

/**
 * SecurityPolicyComponentTest covers controller methods forwarded through ComponentBase::__call in the sandbox.
 */
class SecurityPolicyComponentTest extends TestCase
{
    /**
     * testInComponentContextIsBlockedOnComponent ensures a template cannot pass a callable to the controller through a component.
     */
    public function testInComponentContextIsBlockedOnComponent()
    {
        $this->expectException(SecurityNotAllowedMethodError::class);
        $this->expectExceptionMessage('inComponentContext');

        $this->renderSandboxed("{{ component.inComponentContext(null, 'phpversion') }}");
    }

    /**
     * testInComponentContextIsBlockedCaseInsensitively ensures the block applies to any casing of the method name.
     */
    public function testInComponentContextIsBlockedCaseInsensitively()
    {
        $this->expectException(SecurityNotAllowedMethodError::class);

        (new SecurityPolicy)->checkMethodAllowed($this->makeComponent(), 'INCOMPONENTCONTEXT');
    }

    /**
     * testOrdinaryComponentMethodsStillAllowed ensures regular component calls keep working in the sandbox.
     */
    public function testOrdinaryComponentMethodsStillAllowed()
    {
        $this->assertSame('fallback', $this->renderSandboxed("{{ component.property('title', 'fallback') }}"));
    }

    /**
     * renderSandboxed renders a template with the safe mode policy and a component variable.
     */
    protected function renderSandboxed(string $template): string
    {
        $env = new Environment(new ArrayLoader(['test' => $template]));
        $env->addExtension(new SandboxExtension(new SecurityPolicy, true));

        return $env->render('test', ['component' => $this->makeComponent()]);
    }

    /**
     * makeComponent returns a component bound to a CMS controller so __call forwarding is active.
     */
    protected function makeComponent(): ComponentBase
    {
        $component = new SecurityPolicyComponentTestComponent;

        $controller = (new ReflectionClass(Controller::class))->newInstanceWithoutConstructor();
        self::setProtectedProperty($component, 'controller', $controller);

        return $component;
    }
}

class SecurityPolicyComponentTestComponent extends ComponentBase
{
}
