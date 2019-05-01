<?php namespace System\Traits;

use Url;
use Html;
use File;
use System\Models\Parameter;
use System\Models\PluginVersion;
use System\Classes\CombineAssets;

/**
 * Asset Maker Trait
 * Adds asset based methods to a class
 *
 * @package october\system
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
     * Disables the use, and subequent broadcast, of assets. This is useful
     * to call during an AJAX request to speed things up. This method works
     * by specifically targeting the hasAssetsDefined method.
     * @return void
     */
    public function flushAssets()
    {
        $this->assets = ['js'=>[], 'css'=>[], 'rss'=>[]];
    }

    /**
     * Outputs `<link>` and `<script>` tags to load assets previously added with addJs and addCss method calls
     * @param string $type Return an asset collection of a given type (css, rss, js) or null for all.
     * @return string
     */
    public function makeAssets($type = null)
    {
        if ($type != null) {
            $type = strtolower($type);
        }
        $result = null;
        $reserved = ['build'];

        $this->removeDuplicates();

        if ($type == null || $type == 'css') {
            foreach ($this->assets['css'] as $asset) {

                /*
                 * Prevent duplicates
                 */
                $attributes = Html::attributes(array_merge(
                    [
                        'rel'  => 'stylesheet',
                        'href' => $this->getAssetEntryBuildPath($asset)
                    ],
                    array_except($asset['attributes'], $reserved)
                ));

                $result .= '<link' . $attributes . '>' . PHP_EOL;
            }
        }

        if ($type == null || $type == 'rss') {
            foreach ($this->assets['rss'] as $asset) {
                $attributes = Html::attributes(array_merge(
                    [
                        'rel'   => 'alternate',
                        'href'  => $this->getAssetEntryBuildPath($asset),
                        'title' => 'RSS',
                        'type'  => 'application/rss+xml'
                    ],
                    array_except($asset['attributes'], $reserved)
                ));

                $result .= '<link' . $attributes . '>' . PHP_EOL;
            }
        }

        if ($type == null || $type == 'js') {
            foreach ($this->assets['js'] as $asset) {
                $attributes = Html::attributes(array_merge(
                    [
                        'src' => $this->getAssetEntryBuildPath($asset)
                    ],
                    array_except($asset['attributes'], $reserved)
                ));

                $result .= '<script' . $attributes . '></script>' . PHP_EOL;
            }
        }

        return $result;
    }

    /**
     * Adds JavaScript asset to the asset list. Call $this->makeAssets() in a view
     * to output corresponding markup.
     * @param string $name Specifies a path (URL) to the script.
     * @param array $attributes Adds extra HTML attributes to the asset link.
     * @return void
     */
    public function addJs($name, $attributes = [])
    {
        if (is_array($name)) {
            $name = $this->combineAssets($name, $this->getLocalPath($this->assetPath));
        }

        $jsPath = $this->getAssetPath($name);

        if (isset($this->controller)) {
            $this->controller->addJs($jsPath, $attributes);
        }

        if (is_string($attributes)) {
            $attributes = ['build' => $attributes];
        }

        $jsPath = $this->getAssetScheme($jsPath);

        // Prevent CloudFlare's Rocket Loader from breaking stuff
        // @see octobercms/october#4092, octobercms/october#3841, octobercms/october#3839
        if (isset($attributes['cache']) && $attributes['cache'] == 'false') {
            $attributes['data-cfasync'] = 'false';
            unset($attributes['cache']);
        }

        if (!in_array($jsPath, $this->assets['js'])) {
            $this->assets['js'][] = ['path' => $jsPath, 'attributes' => $attributes];
        }
    }

    /**
     * Adds StyleSheet asset to the asset list. Call $this->makeAssets() in a view
     * to output corresponding markup.
     * @param string $name Specifies a path (URL) to the script.
     * @param array $attributes Adds extra HTML attributes to the asset link.
     * @return void
     */
    public function addCss($name, $attributes = [])
    {
        if (is_array($name)) {
            $name = $this->combineAssets($name, $this->getLocalPath($this->assetPath));
        }

        $cssPath = $this->getAssetPath($name);

        if (isset($this->controller)) {
            $this->controller->addCss($cssPath, $attributes);
        }

        if (is_string($attributes)) {
            $attributes = ['build' => $attributes];
        }

        $cssPath = $this->getAssetScheme($cssPath);

        if (!in_array($cssPath, $this->assets['css'])) {
            $this->assets['css'][] = ['path' => $cssPath, 'attributes' => $attributes];
        }
    }

    /**
     * Adds an RSS link asset to the asset list. Call $this->makeAssets() in a view
     * to output corresponding markup.
     * @param string $name Specifies a path (URL) to the RSS channel
     * @param array $attributes Adds extra HTML attributes to the asset link.
     * @return void
     */
    public function addRss($name, $attributes = [])
    {
        $rssPath = $this->getAssetPath($name);

        if (isset($this->controller)) {
            $this->controller->addRss($rssPath, $attributes);
        }

        if (is_string($attributes)) {
            $attributes = ['build' => $attributes];
        }

        $rssPath = $this->getAssetScheme($rssPath);

        if (!in_array($rssPath, $this->assets['rss'])) {
            $this->assets['rss'][] = ['path' => $rssPath, 'attributes' => $attributes];
        }
    }

    /**
     * Run the provided assets through the Asset Combiner
     * @param array $assets Collection of assets
     * @param string $localPath Prefix all assets with this path (optional)
     * @return string
     */
    public function combineAssets(array $assets, $localPath = '')
    {
        // Short circuit if no assets actually provided
        if (empty($assets)) {
            return '';
        }
        $assetPath = !empty($localPath) ? $localPath : $this->assetPath;
        return Url::to(CombineAssets::combine($assets, $assetPath));
    }

    /**
     * Returns an array of all registered asset paths.
     * @return array
     */
    public function getAssetPaths()
    {
        $this->removeDuplicates();

        $assets = [];
        foreach ($this->assets as $type => $collection) {
            $assets[$type] = [];
            foreach ($collection as $asset) {
                $assets[$type][] = $this->getAssetEntryBuildPath($asset);
            }
        }

        return $assets;
    }

    /**
     * Locates a file based on it's definition. If the file starts with
     * a forward slash, it will be returned in context of the application public path,
     * otherwise it will be returned in context of the asset path.
     * @param string $fileName File to load.
     * @param string $assetPath Explicitly define an asset path.
     * @return string Relative path to the asset file.
     */
    public function getAssetPath($fileName, $assetPath = null)
    {
        if (starts_with($fileName, ['//', 'http://', 'https://'])) {
            return $fileName;
        }

        if (!$assetPath) {
            $assetPath = $this->assetPath;
        }

        if (substr($fileName, 0, 1) == '/' || $assetPath === null) {
            return $fileName;
        }

        return $assetPath . '/' . $fileName;
    }

    /**
     * Returns true if assets any have been added.
     * @return bool
     */
    public function hasAssetsDefined()
    {
        return count($this->assets, COUNT_RECURSIVE) > 3;
    }

    /**
     * Internal helper, attaches a build code to an asset path
     * @param  array $asset Stored asset array
     * @return string
     */
    protected function getAssetEntryBuildPath($asset)
    {
        $path = $asset['path'];
        if (isset($asset['attributes']['build'])) {
            $build = $asset['attributes']['build'];

            if ($build == 'core') {
                $build = 'v' . Parameter::get('system::core.build', 1);
            }
            elseif ($pluginVersion = PluginVersion::getVersion($build)) {
                $build = 'v' . $pluginVersion;
            }

            $path .= '?' . $build;
        }

        return $path;
    }

    /**
     * Internal helper, get asset scheme
     * @param string $asset Specifies a path (URL) to the asset.
     * @return string
     */
    protected function getAssetScheme($asset)
    {
        if (starts_with($asset, ['//', 'http://', 'https://'])) {
            return $asset;
        }

        if (substr($asset, 0, 1) == '/') {
            $asset = Url::asset($asset);
        }

        return $asset;
    }

    /**
     * Removes duplicate assets from the entire collection.
     * @return void
     */
    protected function removeDuplicates()
    {
        foreach ($this->assets as $type => &$collection) {

            $pathCache = [];
            foreach ($collection as $key => $asset) {

                if (!$path = array_get($asset, 'path')) {
                    continue;
                }

                if (isset($pathCache[$path])) {
                    array_forget($collection, $key);
                    continue;
                }

                $pathCache[$path] = true;
            }

        }
    }

    protected function getLocalPath(string $relativePath)
    {
        $relativePath = File::symbolizePath($relativePath);
        if (!starts_with($relativePath, [base_path()])) {
            $relativePath = base_path($relativePath);
        }
        return $relativePath;
    }
}
