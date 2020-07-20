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

    public function testHtmlDumperAlias()
    {
        $this->assertTrue(class_exists('Illuminate\Support\Debug\HtmlDumper'));
        $this->assertInstanceOf(
            \Symfony\Component\VarDumper\Dumper\HtmlDumper::class,
            new \Illuminate\Support\Debug\HtmlDumper()
        );
    }
}
