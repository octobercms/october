<?php

class AliasesTest extends PluginTestCase
{
    public function testInputFacadeAlias()
    {
        $this->assertTrue(class_exists('Illuminate\Support\Facades\Input'));
        $this->assertInstanceOf(
            \October\Rain\Support\Facades\Input::class,
            new \Illuminate\Support\Facades\Input()
        );
    }
}
