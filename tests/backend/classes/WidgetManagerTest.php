<?php

use Backend\Classes\WidgetManager;

class WidgetManagerTest extends TestCase
{
    public function testMakeWidget()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testListFormWidgets()
    {
        $manager = WidgetManager::instance();
        $widgets = $manager->listFormWidgets();

        $this->assertArrayHasKey('Backend\FormWidgets\CodeEditor', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\RichEditor', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\FileUpload', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\Relation', $widgets);
        $this->assertArrayHasKey('Backend\FormWidgets\Datepicker', $widgets);
        $this->assertArrayHasKey('Cms\FormWidgets\Components', $widgets);
    }

    public function testRegisterFormWidget()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testRegisterFormWidgets()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testResolveFormWidget()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testListReportWidgets()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testRegisterReportWidget()
    {
        $this->markTestIncomplete('TODO');
    }

    public function testRegisterReportWidgets()
    {
        $this->markTestIncomplete('TODO');
    }
}