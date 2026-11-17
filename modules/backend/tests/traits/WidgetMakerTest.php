<?php

use Backend\Classes\Controller;

/**
 * WidgetMakerTest
 */
class WidgetMakerTest extends TestCase
{
    /**
     * testMakeWidget
     */
    public function testMakeWidget()
    {
        $manager = new ExampleTraitClass;

        $widget = $manager->makeWidget(\Backend\Widgets\Search::class);
        $this->assertInstanceOf(\Backend\Widgets\Search::class, $widget);
        $this->assertInstanceOf(\Backend\Classes\Controller::class, $widget->getController());

        $config = ['test' => 'config'];
        $widget = $manager->makeWidget(\Backend\Widgets\Search::class, $config);
        $this->assertInstanceOf(\Backend\Widgets\Search::class, $widget);
        $this->assertEquals('config', $widget->getConfig('test'));
    }
}

/**
 * ExampleTraitClass
 */
class ExampleTraitClass
{
    use \Backend\Traits\WidgetMaker;

    public $controller;

    public function __construct()
    {
        $this->controller = new Controller;
    }
}
