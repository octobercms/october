<?php

use Cms\Classes\Theme;
use Cms\Classes\Controller;
use October\Rain\Halcyon\Model;

class ControllerVueTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Model::clearBootedModels();
        Model::flushEventListeners();

        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/components/VueBlock.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/vuecomponents/TestWidget.php';
        include_once base_path() . '/modules/system/tests/fixtures/plugins/october/tester/vuecomponents/TestButton.php';
    }

    /**
     * configAjaxRequestMock builds a request mock for AJAX handler tests
     */
    protected function configAjaxRequestMock($handler, $partials = false)
    {
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

    /**
     * getAjaxOpsJson runs a page as an AJAX request and returns the response ops as JSON
     */
    protected function getAjaxOpsJson($handler, $url)
    {
        Request::swap($this->configAjaxRequestMock($handler));

        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $response = $controller->run($url);

        $this->assertInstanceOf(\Larajax\Classes\AjaxResponse::class, $response);
        $httpResponse = $response->toResponse(request());
        $content = $httpResponse->getOriginalContent();
        $this->assertArrayHasKey('__ajax', $content);
        $this->assertTrue($content['__ajax']['ok']);

        return json_encode($content['__ajax']['ops']);
    }

    public function testFrameworkVueOption()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $content = $controller->run('/vue-test')->getContent();

        $this->assertStringContainsString('/modules/system/assets/vendor/vue/vue.esm', $content);
        $this->assertStringContainsString('window.Vue = Vue;', $content);
    }

    public function testVueComponentsTagOutput()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $content = $controller->run('/vue-test')->getContent();

        // Vue client factory
        $this->assertStringContainsString('/modules/system/assets/js/vue.factory.js', $content);

        // Template blocks
        $this->assertStringContainsString('<script type="text/template"', $content);
        $this->assertStringContainsString('<div class="test-widget">', $content);

        // ESM registration module
        $this->assertStringContainsString('/vuecomponents/testwidget/assets/js/testwidget.js', $content);
        $this->assertStringContainsString("window.oc.vueComponents['october-tester-testwidget']", $content);
    }

    public function testVueComponentDependencyRegistration()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $content = $controller->run('/vue-test')->getContent();

        // TestButton is registered through the TestWidget require property
        $this->assertStringContainsString('/vuecomponents/testbutton/assets/js/testbutton.js', $content);
        $this->assertStringContainsString("window.oc.vueComponents['october-tester-testbutton']", $content);
        $this->assertStringContainsString('class="test-button"', $content);
    }

    public function testVueComponentCssAsset()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $content = $controller->run('/vue-test')->getContent();

        // Component CSS forwards to the controller asset list rendered by the styles tag
        $this->assertStringContainsString('/vuecomponents/testwidget/assets/css/testwidget.css', $content);
    }

    public function testVueComponentsTagEmptyRegistry()
    {
        $theme = Theme::load('test');
        $controller = new Controller($theme);
        $content = $controller->run('/vue-empty')->getContent();

        // The client always ships so late AJAX registrations have the factory available
        $this->assertStringContainsString('/modules/system/assets/js/vue.factory.js', $content);

        // No component output without registrations
        $this->assertStringNotContainsString('text/template', $content);
        $this->assertStringNotContainsString('window.oc.vueComponents', $content);
    }

    public function testAjaxIncludesPageComponents()
    {
        // Components registered by the page cycle are delivered through the asset pipeline
        $opsJson = $this->getAjaxOpsJson('onAjax', '/vue-test');

        $this->assertStringContainsString('testwidget.js', $opsJson);
        $this->assertStringContainsString('october-tester-testwidget', $opsJson);
        $this->assertStringContainsString('october-tester-testbutton', $opsJson);
    }

    public function testAjaxLateRegistration()
    {
        // A component registered only inside the AJAX handler still lands in the response
        $opsJson = $this->getAjaxOpsJson('onVueRegister', '/vue-ajax-test');

        $this->assertStringContainsString('testbutton.js', $opsJson);
        $this->assertStringContainsString('october-tester-testbutton', $opsJson);
        $this->assertStringNotContainsString('october-tester-testwidget', $opsJson);
    }

    public function testDeprecatedBackendShims()
    {
        $this->assertTrue(is_subclass_of(\Backend\Classes\VueComponentBase::class, \System\Classes\VueComponentBase::class));

        $maker = new class {
            use \Backend\Traits\VueMaker;
        };
        $this->assertTrue(method_exists($maker, 'registerVueComponent'));
        $this->assertTrue(method_exists($maker, 'outputVueComponentTemplates'));
        $this->assertTrue(method_exists($maker, 'outputVueComponentsForAjax'));
    }
}
