<?php

use Backend\Classes\Controller;

class ExampleTraitClass
{
    use \Backend\Traits\WidgetMaker;

    public function __construct()
    {
        $this->controller = new Controller;
    }
}

class WidgetMakerTest extends TestCase
{
    /**
     * The object under test.
     *
     * @var object
     */
    private $traitObject;

    /**
     * Sets up the fixture.
     *
     * This method is called before a test is executed.
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();

        $traitName = 'Backend\Traits\WidgetMaker';
        $this->traitObject = $this->getObjectForTrait($traitName);
    }

    public function testTraitObject()
    {
        $maker = $this->traitObject;

        $widget = $maker->makeWidget('Backend\Widgets\Search');
        $this->assertTrue($widget instanceof \Backend\Widgets\Search);
    }

    public function testMakeWidget()
    {
        $manager = new ExampleTraitClass;

        $controller = new Controller;
        $widget = $manager->makeWidget('Backend\Widgets\Search');
        $this->assertInstanceOf('Backend\Widgets\Search', $widget);
        $this->assertInstanceOf('Backend\Classes\Controller', $widget->getController());

        $config = ['test' => 'config'];
        $widget = $manager->makeWidget('Backend\Widgets\Search', $config);
        $this->assertInstanceOf('Backend\Widgets\Search', $widget);
        $this->assertEquals('config', $widget->getConfig('test'));
    }

}
