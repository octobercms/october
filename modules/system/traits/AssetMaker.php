<?php namespace System\Traits;

use File;
use Request;
use System\Classes\SystemException;

/**
 * Asset Maker Trait
 * Adds asset based methods to a class
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */

trait AssetMaker
{

    /**
     * @var array Collection of assets to display in the layout.
     */
    protected $assets = ['js'=>[], 'css'=>[], 'rss'=>[]];

    /**
     * @var string Specifies a path to the asset directory.
     */
    public $assetPath;

    /**
     * Outputs <link> and <script> tags to load assets previously added with addJs and addCss method calls
     * @param string $type Return an asset collection of a given type (css, rss, js) or null for all.
     * @return string
     */
    public function makeAssets($type = null)
    {
        if ($type != null) $type = strtolower($type);
        $result = null;

        if ($type == null || $type == 'css'){
            foreach ($this->assets['css'] as $file)
                $result .= '<link rel="stylesheet" href="'.$file.'">' . PHP_EOL;
        }

        if ($type == null || $type == 'rss'){
            foreach ($this->assets['rss'] as $file)
                $result .= '<link title="RSS" rel="alternate" href="'.$file.'" type="application/rss+xml"/>' . PHP_EOL;
        }

        if ($type == null || $type == 'js') {
            foreach ($this->assets['js'] as $file)
                $result .= '<script src="'.$file.'"></script>' . PHP_EOL;
        }

        return $result;
    }

    /**
     * Adds JavaScript asset to the asset list. Call $this->makeAssets() in a view 
     * to output corresponding markup.
     * @param string $name Specifies a path (URL) to the script.
     * @return void
     */
    public function addJs($name)
    {
        $jsPath = $this->getAssetPath($name);

        if (isset($this->controller))
            $this->controller->addJs($jsPath);

        if (substr($jsPath, 0, 1) == '/')
            $jsPath = Request::getBaseUrl() . $jsPath;

        if (!in_array($jsPath, $this->assets['js']))
            $this->assets['js'][] = $jsPath;
    }

    /**
     * Adds StyleSheet asset to the asset list. Call $this->makeAssets() in a view
     * to output corresponding markup.
     * @param string $name Specifies a path (URL) to the script.
     * @return void
     */
    public function addCss($name)
    {
        $cssPath = $this->getAssetPath($name);

        if (isset($this->controller))
            $this->controller->addCss($cssPath);

        if (substr($cssPath, 0, 1) == '/')
            $cssPath = Request::getBaseUrl() . $cssPath;

        if (!in_array($cssPath, $this->assets['css']))
            $this->assets['css'][] = $cssPath;
    }

    /**
     * Adds an RSS link asset to the asset list. Call $this->makeAssets() in a view
     * to output corresponding markup.
     * @param string $name Specifies a path (URL) to the RSS channel
     * @return void
     */
    public function addRss($name)
    {
        $rssPath = $this->getAssetPath($name);

        if (isset($this->controller))
            $this->controller->addRss($rssPath);

        if (substr($rssPath, 0, 1) == '/')
            $rssPath = Request::getBaseUrl() . $rssPath;

        if (!in_array($rssPath, $this->assets['rss']))
            $this->assets['rss'][] = $rssPath;
    }

    /**
     * Locates a file based on it's definition. If the file starts with
     * a forward slash, it will be returned in context of the application public path,
     * otherwise it will be returned in context of the asset path.
     * @param string $fileName File to load.
     * @param mixed $assetPath Explicitly define an asset path.
     * @return string Relative path to the asset file.
     */
    public function getAssetPath($fileName, $assetPath = null)
    {
        if (!$assetPath)
            $assetPath = $this->assetPath;

        if (substr($fileName, 0, 1) == '/' || $assetPath === null)
            return $fileName;

        if (!is_array($assetPath))
            $assetPath = [$assetPath];

        foreach ($assetPath as $path) {
            $_fileName = $path . '/' . $fileName;
            if (File::isFile(PATH_BASE . '/' . $_fileName))
                break;
        }

        return $_fileName;
    }

    /**
     * Returns true if assets any have been added.
     * @return bool
     */
    public function hasAssetsDefined()
    {
        return count($this->assets, COUNT_RECURSIVE) > 3;
    }

}