<?php

use Backend\Classes\Controller;
use Backend\Classes\WidgetManager;

class WidgetManagerTest extends TestCase
{
    public function testListFormWidgets()
    {
        $manager = WidgetManager::instance();
        $widgets = $manager->listFormWidgets();

        $this->assertArrayHasKey('Backend\FormWidgets\CodeEditor', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\RichEditor', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\FileUpload', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\Relation', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\DatePicker', $widgets);
        $this->assertArrayHasKey('Cms\FormWidgets\Components', $widgets);
    }
}