<?php

use Backend\Classes\Controller;
use October\Rain\Exception\ApplicationException;

/**
 * ControllerAjaxPartialTest
 */
class ControllerAjaxPartialTest extends TestCase
{
    public function testRendersPartialsInViewPaths()
    {
        $controller = new ControllerAjaxPartialTestController;

        $this->assertSame('inside', trim($controller->renderAjaxPartial('inside')));
    }

    public function testRejectsPartialsOutsideViewPaths()
    {
        $controller = new ControllerAjaxPartialTestController;

        $this->expectException(ApplicationException::class);
        $controller->renderAjaxPartial('modules/backend/tests/fixtures/ajaxpartials/outside/outside');
    }
}

class ControllerAjaxPartialTestController extends Controller
{
    public function __construct()
    {
        parent::__construct();

        $this->viewPath = base_path('modules/backend/tests/fixtures/ajaxpartials/views');
    }

    public function renderAjaxPartial($partial)
    {
        return $this->makePartialForAjax($partial);
    }
}
