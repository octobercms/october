<?php namespace Tailor\Behaviors;

use Cms;
use Url;
use Site;
use Event;
use Cache;
use System;
use Config;
use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Controller;
use Tailor\Classes\Blueprint;
use Backend\Classes\ControllerBehavior;
use Tailor\Models\PreviewToken;
use ApplicationException;
use SystemException;

/**
 * PreviewController adds the ability to preview a record based on a CMS page
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class PreviewController extends ControllerBehavior
{
    use \Backend\Traits\FormModelSaver;

    /**
     * @var Page previewPageName
     */
    protected $previewPageName;

    /**
     * @var Blueprint activeSource
     */
    protected $activeSource;

    /**
     * @var string componentName
     */
    protected $componentName;

    /**
     * setPreviewPageContext
     */
    public function setPreviewPageContext(string $componentName, Blueprint $activeSource)
    {
        $this->componentName = $componentName;
        $this->activeSource = $activeSource;
    }

    /**
     * onPreview previews the record
     */
    public function onPreview($recordId = null)
    {
        if (!System::hasModule('Cms')) {
            throw new ApplicationException('Cannot preview without the CMS module installed!');
        }

        if (!$pageName = $this->getPreviewPageName()) {
            throw new ApplicationException('There is no page that uses the necessary component');
        }

        // Get model from page action
        $model = $this->controller->formGetModel();

        // Update the record for preview
        $this->performSaveOnModel(
            $model,
            $this->controller->formGetWidget()->getSaveData(),
            $this->controller->formGetWidget()->getSessionKey()
        );

        // A preview page is already open
        if ($existingToken = post('preview_token')) {
            return [
                'token' => $existingToken,
            ];
        }

        // Get the URL from the CMS controller
        $controller = new Controller(Theme::getEditTheme());

        // Force the custom app URL from the site
        if (($site = Site::getSiteFromContext()) && $site->is_custom_url) {
            Url::forceRootUrl($site->app_url);
        }

        $url = $controller->pageUrl($pageName, $model->makePageUrlParams());

        // Generate preview token
        $token = PreviewToken::createTokenForUrl($url, [
            'id' => $model->getKey()
        ]);

        // Attach to URL
        $url .= '?' . http_build_query([
            '_preview_token' => $token->token,
        ]);

        return [
            'token' => $token->token,
            'url' => $url
        ];
    }

    /**
     * hasPreviewPage
     */
    public function hasPreviewPage(): bool
    {
        return $this->getPreviewPageName() !== null;
    }

    /**
     * getPreviewPageName
     */
    protected function getPreviewPageName(): ?string
    {
        if ($this->previewPageName !== null) {
            return $this->previewPageName;
        }

        if (!$blueprint = $this->activeSource) {
            throw new SystemException('Missing a blueprint source in the controller.');
        }

        // Find page with component
        $theme = $this->getTheme();
        $cacheKey = self::getPreviewPageCacheKey($theme);
        $lookupKey = "{$this->componentName}.{$blueprint->handle}";
        $result = [];

        // Check cache
        $cached = Cache::memo()->get($cacheKey, false);
        if ($cached !== false && ($cached = @unserialize($cached)) !== false && is_array($cached)) {
            if (array_key_exists($lookupKey, $cached)) {
                return $cached[$lookupKey];
            }
            else {
                $result = $cached;
            }
        }

        $page = $this->lookupPreviewPage($theme, $blueprint->handle);

        $this->previewPageName = $result[$lookupKey] = $page ? $page->getBaseFileName() : null;

        $expiresAt = now()->addMinutes(Config::get('cms.template_cache_ttl', 10));
        Cache::put($cacheKey, serialize($result), $expiresAt);

        return $result[$lookupKey] ?? null;
    }

    /**
     * lookupPreviewPage returns the preview page for a specified handle.
     */
    protected function lookupPreviewPage($theme, $handle)
    {
        $allPages = Page::listInTheme($theme, true);

        // Try the one flagged as default first
        $page = $allPages->whereComponent($this->componentName, [
            'handle' => $handle,
            'isDefault' => true
        ])->first();

        // Then try finding anything
        if (!$page) {
            $page = $allPages->whereComponent($this->componentName, 'handle', $handle)->first();
        }

        return $page;
    }

    /**
     * getTheme returns the theme to source snippets
     */
    protected function getTheme()
    {
        return Theme::getEditTheme() ?: Theme::getActiveTheme();
    }

    /**
     * getPreviewPageCacheKey returns a cache key for this record.
     */
    protected static function getPreviewPageCacheKey($theme)
    {
        $key = crc32($theme?->getPath() ?: 1) . 'preview-page-map';

        /**
         * @event tailor.getPreviewPageCacheKey
         * Enables modifying the key used to reference cached preview pages
         *
         * Example usage:
         *
         *     Event::listen('tailor.getPreviewPageCacheKey', function (&$key) {
         *          $key = $key . '-' . App::getLocale();
         *     });
         *
         */
        Event::fire('tailor.getPreviewPageCacheKey', [&$key]);

        return $key;
    }

    /**
     * clearCache clears front-end run-time cache.
     * @param \Cms\Classes\Theme $theme Specifies a parent theme.
     */
    public static function clearCache($theme)
    {
        Cache::forget(self::getPreviewPageCacheKey($theme));
    }
}
