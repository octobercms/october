<?php

use Backend\Classes\Controller;
use Backend\Classes\WidgetManager;

class WidgetManagerTest extends TestCase
{
    public function testListFormWidgets()
    {
        $manager = WidgetManager::instance();
        $widgets = $manager->listFormWidgets();

        $this->assertArrayHasKey('TestVendor\Test\FormWidgets\Sample', $widgets);
        $this->assertArrayHasKey('October\Tester\FormWidgets\Preview', $widgets);
    }
}
