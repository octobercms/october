<?php namespace Tests\Unit\Support;

use TestCase;
use Config;

class HelperTest extends TestCase
{
    protected $baseThemesUrl = null;
    protected $baseThemeUrl = null;
    protected $basePluginsUrl = null;
    
    protected function themesUrlTesting() 
    {
        if(is_null($this->baseThemesUrl)) {
            $this->baseThemesUrl = url(implode('/', [config('app.url'), config('cms.themesPath')]));
        }
        $generated = themes_url('');
        $base = $this->baseThemesUrl;
        $this->assertEquals($base, $generated);
        
        $base = url($base . '/test/assets/js/script1.js');
        $this->assertEquals($base, themes_url('test/assets/js/script1.js'));
        $this->assertEquals($base, themes_url('/test/assets/js/script1.js'));
    }
    
    public function testThemesUrl()
    {
        Config::set('app.url', 'http://localhost');
        
        Config::set('cms.themesPath', 'themes');
        $this->themesUrlTesting();
        Config::set('cms.themesPath', '/themes');
        $this->themesUrlTesting();    

        
        Config::set('app.url', 'http://localhost/');
        Config::set('cms.themesPath', 'themes');
        $this->themesUrlTesting();
        Config::set('cms.themesPath', '/themes');
        $this->themesUrlTesting();
    }
    
    protected function themeUrlTesting() 
    {
        if(is_null($this->baseThemeUrl)) {
            $this->baseThemeUrl = url(implode('/', [config('app.url'), config('cms.themesPath'), config('cms.activeTheme')]));
        }
        
        $generated = theme_url('');
        $base = $this->baseThemeUrl;
        $this->assertEquals($base, $generated);
        
        $base = url($base . '/assets/js/script1.js');
        $this->assertEquals($base, theme_url('/assets/js/script1.js'));
        $this->assertEquals($base, theme_url('assets/js/script1.js'));
    }
    
    public function testThemeUrl()
    {
        Config::set('app.url', 'http://localhost');
        
        Config::set('cms.themesPath', 'themes');
        $this->themeUrlTesting();
        Config::set('cms.themesPath', '/themes');
        $this->themeUrlTesting();  

        
        Config::set('app.url', 'http://localhost/');
        
        Config::set('cms.themesPath', 'themes');
        $this->themeUrlTesting();
        Config::set('cms.themesPath', '/themes');
        $this->themeUrlTesting();
        
    }
    
    protected function pluginUrlTest() 
    {
        if(is_null($this->basePluginsUrl)) {
            $this->basePluginsUrl = url(implode('/', [config('app.url'), config('cms.pluginsPath')]));
        }
        $base = $this->basePluginsUrl;
        
        $url =  plugins_url(''); 
        $this->assertEquals($url, $base);
        
        $url =  plugins_url();
        $this->assertEquals($url, $base);
        
        $testfile = '/author/plugin/assets/scripts/script.js';
        $base = url($base . $testfile);
        
        $url =  plugins_url($testfile);
        $this->assertEquals($url, $base); 
    }
    public function testPluginUrl()
    {
        Config::set('app.url', 'http://localhost');
        
        Config::set('cms.pluginsPath', 'plugins');
        $this->pluginUrlTest();
        Config::set('cms.pluginsPath', '/plugins');
        $this->pluginUrlTest();

        
        Config::set('app.url', 'http://localhost/');
        
        Config::set('cms.pluginsPath', 'plugins');
        $this->pluginUrlTest();
        Config::set('cms.pluginsPath', '/plugins');
        $this->pluginUrlTest();
    }
}
