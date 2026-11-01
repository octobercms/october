<?php

use Backend\Classes\Controller;
use October\Rain\Exception\ValidationException;
use October\Rain\Exception\ApplicationException;

/**
 * ControllerAjaxTest
 */
class ControllerAjaxTest extends TestCase
{
    protected function configAjaxRequestMock($handler)
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
            ->willReturnCallback(function ($key, $default = null) use ($handler) {
                return match ($key) {
                    'X-AJAX-HANDLER' => $handler,
                    'X-AJAX-PARTIALS' => '',
                    'X-AJAX-FLASH' => null,
                    'X-AJAX-PARTIAL' => null,
                    default => $default,
                };
            });

        return $requestMock;
    }

    protected function runAjaxHandlerResponse($handler)
    {
        Request::swap($this->configAjaxRequestMock($handler));

        $controller = new AjaxExceptionTestController;
        self::setProtectedProperty($controller, 'action', '');
        self::setProtectedProperty($controller, 'params', []);
        $response = self::callProtectedMethod($controller, 'execAjaxHandlers');

        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);

        return $response->toResponse(request());
    }

    public function testAjaxHandlerSafeExceptionShowsMessage()
    {
        Config::set('app.debug', false);

        $httpResponse = $this->runAjaxHandlerResponse('onThrowSafe');
        $content = $httpResponse->getOriginalContent();

        $this->assertFalse($content['__ajax']['ok']);
        $this->assertEquals('error', $content['__ajax']['severity']);
        $this->assertEquals(400, $httpResponse->getStatusCode());
        $this->assertEquals('You cannot do that', $content['__ajax']['message']);
    }

    public function testAjaxHandlerGenericExceptionIsMasked()
    {
        Config::set('app.debug', false);

        $httpResponse = $this->runAjaxHandlerResponse('onThrowGeneric');
        $content = $httpResponse->getOriginalContent();

        $this->assertFalse($content['__ajax']['ok']);
        $this->assertEquals('Server Error', $content['__ajax']['message']);
        $this->assertStringNotContainsString('Sensitive internals', json_encode($content));
    }

    public function testAjaxHandlerGenericExceptionShownInDebug()
    {
        Config::set('app.debug', true);

        $httpResponse = $this->runAjaxHandlerResponse('onThrowGeneric');
        $content = $httpResponse->getOriginalContent();

        $this->assertFalse($content['__ajax']['ok']);
        $this->assertEquals('Sensitive internals', $content['__ajax']['message']);
    }

    public function testAjaxHandlerValidationException()
    {
        $httpResponse = $this->runAjaxHandlerResponse('onThrowValidation');
        $content = $httpResponse->getOriginalContent();

        $this->assertFalse($content['__ajax']['ok']);
        $this->assertEquals(422, $httpResponse->getStatusCode());
        $this->assertArrayHasKey('name', $content['__ajax']['invalid']);
        $this->assertEquals('Name is invalid', $content['__ajax']['invalid']['name'][0]);
    }

    public function testAjaxHandlerNotFoundShowsMessage()
    {
        Config::set('app.debug', false);

        $httpResponse = $this->runAjaxHandlerResponse('onMissingHandler');
        $content = $httpResponse->getOriginalContent();

        $this->assertFalse($content['__ajax']['ok']);
        $this->assertStringContainsString('onMissingHandler', $content['__ajax']['message']);
    }

    /**
     * testPageActionRedirectStopsHandler ensures a page action that redirects, such as a guard, prevents the handler from running.
     */
    public function testPageActionRedirectStopsHandler()
    {
        $httpResponse = $this->runGuardedActionHandler('guarded');

        $this->assertFalse(AjaxGuardTestController::$handled);
        $this->assertStringContainsString('guard-target', json_encode($httpResponse->getOriginalContent()));
    }

    /**
     * testPageActionResponseRunsHandler ensures a page action returning a response other than a redirect still runs the handler.
     */
    public function testPageActionResponseRunsHandler()
    {
        $this->runGuardedActionHandler('custom');

        $this->assertTrue(AjaxGuardTestController::$handled);
    }

    /**
     * testPageActionWithoutResponseRunsHandler ensures a page action that renders normally still runs the handler.
     */
    public function testPageActionWithoutResponseRunsHandler()
    {
        $this->runGuardedActionHandler('open');

        $this->assertTrue(AjaxGuardTestController::$handled);
    }

    /**
     * runGuardedActionHandler runs the onTouch handler on the given action of the guard test controller.
     */
    protected function runGuardedActionHandler(string $action)
    {
        Request::swap($this->configAjaxRequestMock('onTouch'));
        AjaxGuardTestController::$handled = false;

        $controller = new AjaxGuardTestController;
        self::setProtectedProperty($controller, 'action', $action);
        self::setProtectedProperty($controller, 'params', []);
        $response = self::callProtectedMethod($controller, 'execAjaxHandlers');

        return $response->toResponse(request());
    }
}

/**
 * AjaxGuardTestController has one action that redirects and one that renders, sharing a handler that records it ran.
 */
class AjaxGuardTestController extends Controller
{
    /**
     * @var bool handled is set when the handler runs.
     */
    public static $handled = false;

    /**
     * @var bool suppressLayout renders actions without the backend layout, which needs a signed in user.
     */
    public $suppressLayout = true;

    /**
     * guarded redirects instead of rendering, like a permission guard.
     */
    public function guarded()
    {
        return Backend::redirect('guard-target');
    }

    /**
     * custom returns its own response instead of a view.
     */
    public function custom()
    {
        return Response::make('Custom content');
    }

    /**
     * open renders normally.
     */
    public function open()
    {
    }

    /**
     * onTouch records that the handler ran.
     */
    public function onTouch()
    {
        static::$handled = true;
    }
}

/**
 * AjaxExceptionTestController
 */
class AjaxExceptionTestController extends Controller
{
    public function onThrowSafe()
    {
        throw new ApplicationException('You cannot do that');
    }

    public function onThrowGeneric()
    {
        throw new RuntimeException('Sensitive internals');
    }

    public function onThrowValidation()
    {
        throw new ValidationException(['name' => 'Name is invalid']);
    }
}
