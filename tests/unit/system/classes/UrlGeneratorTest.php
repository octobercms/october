<?php
use System\Classes\PluginManager;

class UrlGeneratorTest extends TestCase
{
    public function testStrippedSlashes() 
    {
        $this->assertEquals('http://example.com', url('http://example.com'));
        $this->assertEquals('http://example.com/foo/bar', url('http://example.com//foo/bar'));
        $this->assertEquals('http://example.com/foo/bar', url('http://example.com//foo//bar'));
        $this->assertEquals('http://example.com/foo/bar', url('http://example.com//foo///bar'));
        $this->assertEquals('http://example.com/foo/bar/', url('http://example.com/foo/bar/'));
        $this->assertEquals('http://example.com/foo/bar/', url('http://example.com/foo/bar//'));
        
        // last slashes should be removed in this scenario
        $this->assertEquals(preg_replace('/([^:])(\/{2,})/', '$1/', config('app.url') . '/foo/bar'), url('/foo/bar//'));
    }
}