<?php namespace Cms\Classes;

use App;
use Event;
use Cache;
use Config;
use System;
use Cms\Classes\Partial;
use Cms\Classes\Snippet;
use System\Classes\PluginManager;

/**
 * SnippetManager returns information about snippets based on partials and components.
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class SnippetManager
{
    /**
     * @var array|null snippets
     */
    protected $snippets = null;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('cms.snippets');
    }

    /**
     * listSnippets returns a list of available snippets. Returns an unsorted array
     * of snippet objects.
     * @param \Cms\Classes\Theme|null $theme
     * @return array
     */
    public function listSnippets($theme = null)
    {
        if ($this->snippets !== null) {
            return $this->snippets;
        }

        $themeSnippets = $theme ? $this->listThemeSnippets($theme) : [];
        $componentSnippets = $this->listComponentSnippets();

        $this->snippets = array_merge($themeSnippets, $componentSnippets);

        /*
         * @event pages.snippets.listSnippets
         * Gives the ability to manage the snippet list dynamically.
         *
         * Example usage to add a snippet to the list:
         *
         * Event::listen('pages.snippets.listSnippets', function($manager) {
         *     $snippet = new \RainLab\Pages\Classes\Snippet();
         *     $snippet->initFromComponentInfo('\Example\Plugin\Components\ComponentClass', 'snippetCode');
         *     $manager->addSnippet($snippet);
         * });
         *
         * Example usage to remove a snippet from the list:
         *
         * Event::listen('pages.snippets.listSnippets', function($manager) {
         *     $manager->removeSnippet('snippetCode');
         * });
         */
        Event::fire('pages.snippets.listSnippets', [$this]);

        return $this->snippets;
    }

    /**
     * addSnippet to the list of snippets
     * @param Snippet $snippet
     * @return void
     */
    public function addSnippet(Snippet $snippet)
    {
        $this->snippets[] = $snippet;
    }

    /**
     * removeSnippet with the given code from the list of snippets
     * @param string $snippetCode
     * @return void
     */
    public function removeSnippet(string $snippetCode)
    {
        $this->snippets = array_filter($this->snippets, function ($snippet) use ($snippetCode) {
            return $snippet->code !== $snippetCode;
        });
    }

    /**
     * findByCodeOrComponent is used internally by the system.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @param string $code Specifies the snippet code.
     * @param string $$componentClass Specifies the snippet component class, if available.
     * @param boolean $allowCaching Specifies whether caching is allowed for the call.
     * @return object
     */
    public function findByCodeOrComponent($theme, $code, $componentClass, $allowCaching = false)
    {
        if (!$allowCaching) {
            // If caching is not allowed, list all available snippets,
            // find the snippet in the list and return it.
            $snippets = $this->listSnippets($theme);

            foreach ($snippets as $snippet) {
                if ($componentClass && $snippet->getComponentClass() === $componentClass) {
                    return $snippet;
                }

                if ($snippet->code == $code) {
                    return $snippet;
                }
            }

            return null;
        }

        // If caching is allowed, and the requested snippet is a partial snippet,
        // try to load the partial name from the cache and initialize the snippet
        // from the partial.
        if (!strlen($componentClass)) {
            $map = $this->getPartialSnippetMap($theme);

            if (!array_key_exists($code, $map)) {
                return null;
            }

            $partialName = $map[$code];
            $partial = Partial::loadCached($theme, $partialName);

            if (!$partial) {
                return null;
            }

            $snippet = new Snippet;
            $snippet->initFromPartial($partial);

            return $snippet;
        }
        else {
            // If the snippet is a component snippet, initialize it from the component
            if (!class_exists($componentClass)) {
                return null;
            }

            $snippet = new Snippet;
            $snippet->initFromComponentInfo($componentClass, $code);

            return $snippet;
        }
    }

    /**
     * clearCache clears front-end run-time cache.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     */
    public static function clearCache($theme)
    {
        Cache::forget(self::getPartialMapCacheKey($theme));
    }

    /**
     * getPartialMapCacheKey returns a cache key for this record.
     */
    protected static function getPartialMapCacheKey($theme)
    {
        $key = crc32($theme->getPath()).'snippet-partial-map';

        /**
         * @event pages.snippet.getPartialMapCacheKey
         * Enables modifying the key used to reference cached partial maps
         *
         * Example usage:
         *
         *     Event::listen('pages.snippet.getPartialMapCacheKey', function (&$key) {
         *          $key = $key . '-' . App::getLocale();
         *     });
         *
         */
        Event::fire('pages.snippet.getPartialMapCacheKey', [&$key]);

        return $key;
    }

    /**
     * getPartialSnippetMap as a list of partial-based snippets and corresponding partial names.
     * Returns an associative array with the snippet code in keys and partial file names in values.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @return array
     */
    public function getPartialSnippetMap($theme)
    {
        $key = self::getPartialMapCacheKey($theme);

        $result = [];
        $cached = Cache::memo()->get($key, false);

        if ($cached !== false && ($cached = @unserialize($cached, ['allowed_classes' => false])) !== false) {
            return $cached;
        }

        $partials = Partial::listInTheme($theme);

        foreach ($partials as $partial) {
            $viewBag = $partial->getViewBag();

            $snippetCode = $viewBag->property('snippetCode');
            if (!strlen($snippetCode)) {
                continue;
            }

            $result[$snippetCode] = $partial->getFileName();
        }

        $expiresAt = now()->addMinutes(Config::get('cms.template_cache_ttl', 10));
        Cache::put($key, serialize($result), $expiresAt);

        return $result;
    }

    /**
     * listThemeSnippets returns a list of snippets in the specified theme.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     * @return array Returns an array of Snippet objects.
     */
    protected function listThemeSnippets($theme)
    {
        $result = [];
        $partials = Partial::listInTheme($theme, true);

        foreach ($partials as $partial) {
            $viewBag = $partial->getViewBag();

            if (strlen($viewBag->property('snippetCode'))) {
                $snippet = new Snippet;
                $snippet->initFromPartial($partial);
                $result[] = $snippet;
            }
        }

        return $result;
    }

    /**
     * listComponentSnippets returns a list of snippets created from components.
     * @return array Returns an array of Snippet objects.
     */
    protected function listComponentSnippets()
    {
        $result = [];

        // Load module snippets
        foreach (System::listModules() as $module) {
            if ($provider = App::getProvider($module . '\\ServiceProvider')) {
                $result = $this->loadSnippetsFromArray($provider->registerPageSnippets(), $result);
            }
        }

        // Load plugin components
        foreach (PluginManager::instance()->getPlugins() as $plugin) {
            $result = $this->loadSnippetsFromArray($plugin->registerPageSnippets(), $result);
        }

        // Load app items
        if ($app = App::getProvider(\App\Provider::class)) {
            $result = $this->loadSnippetsFromArray($app->registerPageSnippets(), $result);
        }

        return $result;
    }

    /**
     * loadSnippetsFromArray helper
     */
    protected function loadSnippetsFromArray($snippets, array $result): array
    {
        if (!is_array($snippets)) {
            return [];
        }

        foreach ($snippets as $componentClass => $componentCode) {
            $snippet = new Snippet;
            $snippet->initFromComponentInfo($componentClass, $componentCode);
            $result[] = $snippet;
        }

        return $result;
    }
}
