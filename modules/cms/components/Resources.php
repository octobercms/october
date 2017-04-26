<?php namespace Cms\Components;

use File;
use Config;
use Cms\Classes\ComponentBase;
use System\Classes\CombineAssets;

/**
 * Resources component
 */
class Resources extends ComponentBase
{
    /**
     * @var string The default JavaScript directory
     */
    public $jsDir = 'js';

    /**
     * @var string The default CSS directory
     */
    public $cssDir = 'css';

    /**
     * @var string The default LESS directory
     */
    public $lessDir = 'less';

    /**
     * @return array
     */
    public function componentDetails()
    {
        return [
            'name'           => 'Resources',
            'description'    => 'Easily reference theme assets for inclusion on a page.',
        ];
    }

    /**
     * @return array
     */
    public function defineProperties()
    {
        return [
            'js' => [
                'title'             => 'JavaScript',
                'description'       => 'JavaScript file(s) in the assets/js folder',
                'type'              => 'stringList',
                'showExternalParam' => false
            ],
            'less' => [
                'title'             => 'LESS',
                'description'       => 'LESS file(s) in the assets/less folder',
                'type'              => 'stringList',
                'showExternalParam' => false
            ],
            'css' => [
                'title'             => 'CSS',
                'description'       => 'Stylesheet file(s) in the assets/css folder',
                'type'              => 'stringList',
                'showExternalParam' => false
            ],
            'vars' => [
                'title'             => 'Variables',
                'description'       => 'Page variables name(s) and value(s)',
                'type'              => 'dictionary',
                'showExternalParam' => false
            ]
        ];
    }

    public function init()
    {
        $this->assetPath = $this->guessAssetPath();
        $this->jsDir = $this->guessAssetDirectory(['js', 'javascript'], $this->jsDir);
    }

    public function onRun()
    {
        /*
         * JavaScript
         */
        $js = [];
        if ($assets = $this->property('js')) {
            $js += array_map([$this, 'prefixJs'], (array) $assets);
        }

        /*
         * LESS
         */
        $less = [];
        if ($assets = $this->property('less')) {
            $less += array_map([$this, 'prefixLess'], (array) $assets);
        }

        /*
         * CSS
         */
        $css = [];
        if ($assets = $this->property('css')) {
            $css += array_map([$this, 'prefixCss'], (array) $assets);
        }

        if (count($js)) {
            $this->addJs(CombineAssets::combine($js, $this->assetPath));
        }

        if (count($less)) {
            $this->addCss(CombineAssets::combine($less, $this->assetPath));
        }

        if (count($css)) {
            $this->addCss(CombineAssets::combine($css, $this->assetPath));
        }

        /*
         * Variables
         */
        if ($vars = $this->property('vars')) {
            foreach ((array) $vars as $key => $value) {
                $this->page[$key] = $value;
            }
        }
    }

    protected function prefixJs($value)
    {
        return $this->jsDir.'/'.trim($value);
    }

    protected function prefixCss($value)
    {
        return $this->cssDir.'/'.trim($value);
    }

    protected function prefixLess($value)
    {
        return $this->lessDir.'/'.trim($value);
    }

    protected function guessAssetDirectory(array $possible, $default = null)
    {
        foreach ($possible as $option) {
            if (File::isDirectory($this->assetPath.'/'.$option)) {
                return $option;
            }
        }

        return $default;
    }

    protected function guessAssetPath()
    {
        $baseTheme = themes_path().'/'.$this->getTheme()->getDirName();

        if (File::isDirectory($baseTheme.'/assets')) {
            return $baseTheme.'/assets';
        }
        else {
            return $baseTheme.'/resources';
        }
    }
}
