<?php namespace System\Traits;

use App;
use Url;
use Html;
use File;
use Event;
use Request;
use Backend;
use System\Classes\CombineAssets;

/**
 * AssetMaker Trait
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
    protected $assets = ['js' => [], 'css' => [], 'rss' => []];

    /**
     * @var array Collection of combined and prioritized assets.
     */
    protected $assetBundles = ['js' => [], 'css' => []];

    /**
     * @var string assetPath specifies the relative path to the asset directory.
     */
    public $assetPath;

    /**
     * @var string assetUrlPath specifies the public path to the asset directory.
     */
    public $assetUrlPath;

    /**
     * @var string assetDefaults is the default attributes for assets.
     */
    protected $assetDefaults = ['build' => 'core'];

    /**
     * flushAssets disables the use, and subsequent broadcast, of assets. This is useful
     * to call during an AJAX request to speed things up. This method works
     * by specifically targeting the hasAssetsDefined method.
     *
     * @todo in terms of speeding up AJAX, assets should be requested instead of sent
     * by default all the time, widgets can specify if they will need a asset refresh
     *
     * @return void
     */
    public function flushAssets()
    {
        $this->assets = ['js' => [], 'css' => [], 'rss' => []];
        $this->assetBundles = ['js' => [], 'css' => []];
    }

    /**
     * makeAssets outputs `<link>` and `<script>` tags to load assets previously added with addJs and addCss method calls
     * @param string $type Return an asset collection of a given type (css, rss, js) or null for all.
     * @return string
     */
    public function makeAssets($type = null)
    {
        if ($type != null) {
            $type = strtolower($type);
        }

        // Prevent duplicates
        $this->removeDuplicateAssets();

        $result = null;

        // StyleSheet
        if ($type == null || $type == 'css') {
            foreach ($this->assets['css'] as $asset) {
                if ($attributes = $this->renderAssetAttributes('css', $asset)) {
                    $result .= "<link {$attributes} />" . PHP_EOL;
                }
            }

            foreach ($this->combineBundledAssets('css') as $asset) {
                if ($attributes = $this->renderAssetAttributes('css', $asset)) {
                    $result .= "<link {$attributes} />" . PHP_EOL;
                }
            }
        }

        // RSS Feed
        if ($type == null || $type == 'rss') {
            foreach ($this->assets['rss'] as $asset) {
                if ($attributes = $this->renderAssetAttributes('rss', $asset)) {
                    $result .= "<link {$attributes} />" . PHP_EOL;
                }
            }
        }

        // JavaScript
        if ($type == null || $type == 'js') {
            foreach ($this->assets['js'] as $asset) {
                if ($attributes = $this->renderAssetAttributes('js', $asset)) {
                    $result .= "<script {$attributes}></script>" . PHP_EOL;
                }
            }

            foreach ($this->combineBundledAssets('js') as $asset) {
                if ($attributes = $this->renderAssetAttributes('js', $asset)) {
                    $result .= "<script {$attributes}></script>" . PHP_EOL;
                }
            }
        }

        return $result;
    }

    /**
     * addJs includes a JavaScript asset to the asset list
     */
    public function addJs($name, $attributes = [])
    {
        if (is_array($name)) {
            $name = $this->combineAssets($name, $this->getLocalPath($this->assetPath));
        }

        $jsPath = $this->getAssetPath($name);
        $attributes = $this->processAssetAttributes($attributes);

        if (isset($this->controller)) {
            $this->controller->addJs($jsPath, $attributes);
        }

        $jsPath = $this->getAssetScheme($jsPath);

        $this->assets['js'][] = ['path' => $jsPath, 'attributes' => $attributes];
    }

    /**
     * addJsBundle includes a JS asset to the bundled combiner pipeline
     */
    public function addJsBundle(string $name, $attributes = [])
    {
        /**
         * @event system.assets.beforeBundleAsset
         * Provides an opportunity to modify adding an js bundle.
         *
         * The parameters provided are:
         * object `$this`: The current asset maker object
         * string `$type`: The type of the asset being bundled
         * string `$name`: The name to the asset being bundled
         * mixed `$attributes`: The array of attributes for the asset being bundled.
         *
         * The name and attributes parameters are provided by reference for modification.
         * This event is also a halting event, so returning false will prevent the
         * current asset from being bundled.
         *
         * Example usage:
         *
         *     Event::listen('system.assets.beforeBundleAsset', function (AssetMaker $assetMaker, string $type, string $name, array $attributes) {
         *         $assetMaker->addJs($name, $attributes);
         *         return false;
         *     });
         *
         * Or
         *
         *     $this->bindEvent('assets.beforeBundleAsset', function (AssetMaker $assetMaker, string $type, string $name, array $attributes) {
         *         $assetMaker->addJs($name, $attributes);
         *         return false;
         *     });
         *
         */
        if (
            (method_exists($this, 'fireEvent') && ($this->fireEvent('assets.beforeBundleAsset', [$this, 'js', &$name, &$attributes], true) === false)) ||
            (Event::fire('system.assets.beforeBundleAsset', [$this, 'js', &$name, &$attributes], true) === false)
        ) {
            return;
        }

        $jsPath = $this->getAssetPath($name);
        $attributes = $this->processAssetAttributes($attributes);

        if (isset($this->controller)) {
            $this->controller->addJsBundle($jsPath, $attributes);
        }

        $this->assetBundles['js'][] = ['path' => $jsPath, 'attributes' => $attributes];
    }

    /**
     * addCss includes a StyleSheet asset to the asset list
     */
    public function addCss($name, $attributes = [])
    {
        if (is_array($name)) {
            $name = $this->combineAssets($name, $this->getLocalPath($this->assetPath));
        }

        $cssPath = $this->getAssetPath($name);
        $attributes = $this->processAssetAttributes($attributes);

        if (isset($this->controller)) {
            $this->controller->addCss($cssPath, $attributes);
        }

        $cssPath = $this->getAssetScheme($cssPath);

        $this->assets['css'][] = ['path' => $cssPath, 'attributes' => $attributes];
    }

    /**
     * addCssBundle includes a CSS asset to the bundled combiner pipeline
     */
    public function addCssBundle(string $name, $attributes = [])
    {
        /**
         * @event system.assets.beforeBundleAsset
         * Provides an opportunity to modify adding an css bundle.
         *
         * The parameters provided are:
         * object `$this`: The current asset maker object
         * string `$type`: The type of the asset being bundled
         * string `$name`: The name to the asset being bundled
         * mixed `$attributes`: The array of attributes for the asset being bundled.
         *
         * The name and attributes parameters are provided by reference for modification.
         * This event is also a halting event, so returning false will prevent the
         * current asset from being bundled.
         *
         * Example usage:
         *
         *     Event::listen('system.assets.beforeBundleAsset', function (AssetMaker $assetMaker, string $type, string $name, array $attributes) {
         *         $assetMaker->addCss($name, $attributes);
         *         return false;
         *     });
         *
         * Or
         *
         *     $this->bindEvent('assets.beforeBundleAsset', function (AssetMaker $assetMaker, string $type, string $name, array $attributes) {
         *         $assetMaker->addCss($name, $attributes);
         *         return false;
         *     });
         *
         */
        if (
            (method_exists($this, 'fireEvent') && ($this->fireEvent('assets.beforeBundleAsset', [$this, 'css', &$name, &$attributes], true) === false)) ||
            (Event::fire('system.assets.beforeBundleAsset', [$this, 'css', &$name, &$attributes], true) === false)
        ) {
            return;
        }

        $cssPath = $this->getAssetPath($name);
        $attributes = $this->processAssetAttributes($attributes);

        if (isset($this->controller)) {
            $this->controller->addCssBundle($cssPath, $attributes);
        }

        $this->assetBundles['css'][] = ['path' => $cssPath, 'attributes' => $attributes];
    }

    /**
     * addRss adds an RSS link asset to the asset list. Call $this->makeAssets()
     * in a view to output corresponding markup.
     */
    public function addRss($name, $attributes = [])
    {
        $rssPath = $this->getAssetPath($name);
        $attributes = $this->processAssetAttributes($attributes);

        if (isset($this->controller)) {
            $this->controller->addRss($rssPath, $attributes);
        }

        $rssPath = $this->getAssetScheme($rssPath);

        $this->assets['rss'][] = ['path' => $rssPath, 'attributes' => $attributes];
    }

    /**
     * combineAssets runs asset paths through the Asset Combiner
     */
    public function combineAssets(array $assets, $localPath = ''): string
    {
        if (empty($assets)) {
            return '';
        }

        $assetPath = $localPath ?: base_path($this->assetPath);

        return CombineAssets::combine($assets, $assetPath);
    }

    /**
     * getAssetPaths returns an array of all registered asset paths.
     * @return array
     */
    public function getAssetPaths()
    {
        $this->removeDuplicateAssets();

        $assets = [];

        foreach ($this->assets as $type => $collection) {
            $assets[$type] = [];
            foreach ($collection as $asset) {
                $assets[$type][] = $this->getAssetEntryBuildPath($asset);
            }
        }

        foreach (['js', 'css'] as $bundleType) {
            foreach ($this->combineBundledAssets($bundleType) as $asset) {
                $assets[$bundleType][] = $this->getAssetEntryBuildPath($asset);
            }
        }

        return $assets;
    }

    /**
     * getAssetPathsWithAttributes returns an array of all registered asset paths
     * with their attributes, suitable for use with ajax()->asset().
     *
     * Returns format: ['js' => [path => attributes, ...], 'css' => [...], ...]
     *
     * @return array
     */
    public function getAssetPathsWithAttributes()
    {
        $this->removeDuplicateAssets();

        // Internal attributes to be excluded from output
        $reserved = ['build'];

        $assets = [];

        foreach ($this->assets as $type => $collection) {
            $assets[$type] = [];
            foreach ($collection as $asset) {
                $path = $this->getAssetEntryBuildPath($asset);
                $attributes = array_except(array_get($asset, 'attributes', []), $reserved);
                $assets[$type][$path] = $attributes;
            }
        }

        foreach (['js', 'css'] as $bundleType) {
            foreach ($this->combineBundledAssets($bundleType) as $asset) {
                $path = $this->getAssetEntryBuildPath($asset);
                $attributes = array_except(array_get($asset, 'attributes', []), $reserved);
                $assets[$bundleType][$path] = $attributes;
            }
        }

        return $assets;
    }

    /**
     * getAssetPath locates a file based on it's definition. If the file starts with
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

        if ($assetPath === null || substr($fileName, 0, 1) == '/') {
            return $fileName;
        }

        return $assetPath . '/' . $fileName;
    }

    /**
     * hasAssetsDefined returns true if assets any have been added
     */
    public function hasAssetsDefined(): bool
    {
        return count($this->assets, COUNT_RECURSIVE) > 3 ||
            count($this->assetBundles, COUNT_RECURSIVE) > 2;
    }

    /**
     * processAssetAttributes
     */
    protected function processAssetAttributes($attributes)
    {
        // Attributes can be a scalar when used as a build reference
        if (is_scalar($attributes)) {
            $attributes = ['build' => $attributes];
        }

        // Type check
        if (!is_array($attributes)) {
            $attributes = [];
        }

        // Merge in defaults
        $attributes = array_merge((array) $this->assetDefaults, $attributes);

        return $attributes;
    }

    /**
     * Internal helper, attaches a build code to an asset path
     * @param  array $asset Stored asset array
     * @return string
     */
    protected function getAssetEntryBuildPath($asset)
    {
        $path = $asset['path'];

        // Has build and query string not already included
        $useBuild = !empty($asset['attributes']['build']) &&
            strpos($path, '?') === false;

        if ($useBuild) {
            $build = $asset['attributes']['build'];

            if (!App::runningInBackend()) {
                $build = '';
            }
            else {
                $build = 'v' . Backend::assetVersion();
            }

            if (strlen($build)) {
                $path .= '?' . $build;
            }
        }

        return $path;
    }

    /**
     * getAssetScheme is an internal helper to get the asset scheme.
     */
    protected function getAssetScheme(string $asset): string
    {
        if (starts_with($asset, ['//', 'http://', 'https://'])) {
            return $asset;
        }

        if (substr($asset, 0, 1) === '/') {
            $asset = Url::asset($asset);
        }

        return $asset;
    }

    /**
     * removeDuplicateAssets removes duplicate and global assets from the entire collection
     */
    protected function removeDuplicateAssets()
    {
        $removeFunc = function($group, $removeGlobal) {
            foreach ($group as &$collection) {
                $pathCache = [];
                foreach ($collection as $key => $asset) {
                    if (!$path = array_get($asset, 'path')) {
                        continue;
                    }

                    // Asset is global
                    if ($removeGlobal && array_get($asset, 'attributes.build') === 'global') {
                        array_forget($collection, $key);
                        continue;
                    }

                    // Already seen asset
                    if (isset($pathCache[$path])) {
                        array_forget($collection, $key);
                        continue;
                    }

                    $pathCache[$path] = true;
                }
            }

            return $group;
        };

        $isAjax = Request::ajax();
        $this->assets = $removeFunc($this->assets, $isAjax);
        $this->assetBundles = $removeFunc($this->assetBundles, $isAjax);
    }

    /**
     * renderAssetAttributes takes an asset definition and returns the necessary HTML output
     */
    protected function renderAssetAttributes(string $type, array $asset): string
    {
        if (!$path = $this->getAssetEntryBuildPath($asset)) {
            return '';
        }

        // Internal attributes to be purged
        // - build: the unique build code for cache busting
        $reserved = ['build'];
        $userAttrs = array_except(array_get($asset, 'attributes', []), $reserved);

        /**
         * @event system.assets.beforeAddAsset
         * Provides an opportunity to inspect or modify an asset.
         *
         * The parameters provided are:
         * string `$type`: The type of the asset being added
         * string `$path`: The path to the asset being added
         * array `$attributes`: The array of attributes for the asset being added.
         *
         * All the parameters are provided by reference for modification.
         * This event is also a halting event, so returning false will prevent the
         * current asset from being added. Note that duplicates are filtered out
         * before the event is fired.
         *
         * Example usage:
         *
         *     Event::listen('system.assets.beforeAddAsset', function (string $type, string $path, array $attributes) {
         *         if (in_array($path, $blockedAssets)) {
         *             return false;
         *         }
         *     });
         *
         * Or
         *
         *     $this->bindEvent('assets.beforeAddAsset', function (string $type, string $path, array $attributes) {
         *         $attributes['special_cdn_flag'] = false;
         *     });
         *
         */
        if (
            (method_exists($this, 'fireEvent') && ($this->fireEvent('assets.beforeAddAsset', [&$type, &$path, &$userAttrs], true) === false)) ||
            (Event::fire('system.assets.beforeAddAsset', [&$type, &$path, &$userAttrs], true) === false)
        ) {
            return '';
        }

        // Determine final attributes
        $attrs = [];
        if ($type === 'css') {
            $attrs['rel'] = 'stylesheet';
            $attrs['href'] = $path;
        }
        elseif ($type === 'js') {
            $attrs['src'] = $path;
        }
        elseif ($type === 'rss') {
            $attrs['rel'] = 'alternate';
            $attrs['href'] = $path;
            $attrs['title'] = 'RSS';
            $attrs['type'] = 'application/rss+xml';
        }

        // Generate HTML attribute string
        return trim(Html::attributes(array_merge($attrs, $userAttrs)));
    }

    /**
     * combineBundledAssets spins over every bundle definition and combines them to an asset
     */
    protected function combineBundledAssets($type): array
    {
        $assets = [];
        $bundles = [];

        // Split bundles in to builds
        foreach ($this->assetBundles[$type] as $asset) {
            $build = $asset['attributes']['build'] ?? 'core';
            $bundles[$build][] = $asset;
        }

        // Combine all asset paths and defined attributes
        foreach ($bundles as $build => $bundle) {
            $paths = [];
            $attributes = [];
            foreach ($bundle as $asset) {
                $paths[] = $this->getLocalPath($asset['path'] ?? '');
                $attributes += $asset['attributes'] ?? [];
            }

            $assets[] = ['path' => $this->combineAssets($paths), 'attributes' => $attributes];
        }

        return $assets;
    }

    /**
     * getLocalPath converts a relative path to a local path
     */
    protected function getLocalPath(string $relativePath): string
    {
        $relativePath = File::symbolizePath($relativePath);

        if (!str_starts_with($relativePath, base_path())) {
            $relativePath = base_path($relativePath);
        }

        return $relativePath;
    }
}
