<?php namespace Tests\Unit\Support;

use TestCase;
use Config;

class HelperTest extends TestCase
{
    protected function themesUrlTesting() 
    {
        $generated = themes_url('');
        $base = url(implode('/', [config('app.url'), config('cms.themesPath')]));
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
        Config::set('cms.themesPath', '/themes/');
        $this->themesUrlTesting();
        Config::set('cms.themesPath', 'themes/');
        $this->themesUrlTesting();        

        
        Config::set('app.url', 'http://localhost/');
        Config::set('cms.themesPath', 'themes');
        $this->themesUrlTesting();
        Config::set('cms.themesPath', '/themes');
        $this->themesUrlTesting();
        Config::set('cms.themesPath', '/themes/');
        $this->themesUrlTesting();
        Config::set('cms.themesPath', 'themes/');
        $this->themesUrlTesting();
    }
    
    protected function themeUrlTesting() 
    {
        $generated = theme_url('');
        $base = url(implode('/', [config('app.url'), config('cms.themesPath'), config('cms.activeTheme')]));
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
        Config::set('cms.themesPath', '/themes/');
        $this->themeUrlTesting();
        Config::set('cms.themesPath', 'themes/');
        $this->themeUrlTesting();        

        
        Config::set('app.url', 'http://localhost/');
        Config::set('cms.themesPath', 'themes');
        $this->themeUrlTesting();
        Config::set('cms.themesPath', '/themes');
        $this->themeUrlTesting();
        Config::set('cms.themesPath', '/themes/');
        $this->themeUrlTesting();
        Config::set('cms.themesPath', 'themes/');
        $this->themeUrlTesting();
        
    }
    
    public function testPluginUrl()
    {
        $base = url(implode('/', [config('app.url'), config('cms.pluginsPath')]));
        
        
        $url =  plugins_url(''); 
        $this->assertEquals($url, $base);
        
        $url =  plugins_url();
        $this->assertEquals($url, $base);
        
        $testfile = '/author/plugin/assets/scripts/script.js';
        $base = url($base . $testfile);
        
        $url =  plugins_url($testfile);
        $this->assertEquals($url, $base);
    }
}
