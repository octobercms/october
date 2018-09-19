<?php namespace Tests\Unit\Support;

use TestCase;

class HelperTest extends TestCase
{
    public function testThemesUrl()
    {
        $generated = themes_url('');
        $base = url(implode('/', [config('app.url'), config('cms.themesPath')]));
        $this->assertEquals($base, $generated);
        
        $base .= '/test/assets/js/script1.js';
        $this->assertEquals($base, themes_url('test/assets/js/script1.js'));
        $this->assertEquals($base, themes_url('/test/assets/js/script1.js'));
    }
    
    public function testThemeUrl()
    {
        $generated = theme_url('');
        $base = url(implode('/', [config('app.url'), config('cms.themesPath'), config('cms.activeTheme')]));
        $this->assertEquals($base, $generated);
        
        $base .= '/assets/js/script1.js';
        $this->assertEquals($base, theme_url('/assets/js/script1.js'));
        $this->assertEquals($base, theme_url('assets/js/script1.js'));
        
    }
    
    public function testPluginUrl()
    {
        $base = url(implode('/', [config('app.url'), config('cms.pluginsPath'), 'tests/unit']));
        
        
        $url =  plugin_url('', $this);
        $this->assertEquals($url, $base);
        
        $url =  plugin_url('', 'Tests\\Unit\\Support\\HelperTest');
        $this->assertEquals($url, $base);
        
        $url =  plugin_url('', '\\Tests\\Unit\\Support\\HelperTest');
        $this->assertEquals($url, $base);
        
        $url =  plugin_url();
        $this->assertEquals($url, $base);
        
        $testfile = '/assets/scripts/script.js';
        $base .= $testfile;
        
        $url =  plugin_url($testfile, $this);
        $this->assertEquals($url, $base);
        
        $url =  plugin_url($testfile, 'Tests\\Unit\\Support\\HelperTest');
        $this->assertEquals($url, $base);
        
        $url =  plugin_url($testfile, '\\Tests\\Unit\\Support\\HelperTest');
        $this->assertEquals($url, $base);
        
        $url =  plugin_url($testfile);
        $this->assertEquals($url, $base);
        
        $testfile = 'assets/scripts/script.js';
        
        $url =  plugin_url($testfile, $this);
        $this->assertEquals($url, $base);
        
        $url =  plugin_url($testfile, 'Tests\\Unit\\Support\\HelperTest');
        $this->assertEquals($url, $base);
        
        $url =  plugin_url($testfile, '\\Tests\\Unit\\Support\\HelperTest');
        $this->assertEquals($url, $base);
        
        $url =  plugin_url($testfile);
        $this->assertEquals($url, $base);
    }
    
    public function testPluginUrlWithInvalidClassArgument()
    {
        $this->expectException(\InvalidArgumentException::class);
        
        plugin_url('', new \stdClass());
    }
    
    public function testPluginUrlWithInvalidCallHistory()
    {
        $this->expectException(\InvalidArgumentException::class);
        
        testPluginUrlWithInvalidCallHistory();
    }
}

/**
 * This erases the "object" from position 2 when plugin_url is called
 * and should cause an InvalidArgumentException.
 */
function testPluginUrlWithInvalidCallHistory()
{
    plugin_url();
};
