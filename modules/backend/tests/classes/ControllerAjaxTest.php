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
