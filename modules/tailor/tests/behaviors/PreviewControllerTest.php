<?php

use Cms\Classes\Theme;
use System\Classes\SiteCollection;
use System\Models\SiteDefinition;
use Tailor\Behaviors\PreviewController;

class PreviewControllerTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.edit_theme', 'translatabletest');

        Theme::resetCache();
    }

    public function tearDown(): void
    {
        Theme::resetCache();

        parent::tearDown();
    }

    /**
     * testPreviewUrlUsesTranslatedPattern covers a regression where the preview
     * button always opened the default language URL, ignoring translated URL
     * patterns defined for the site under edit.
     */
    public function testPreviewUrlUsesTranslatedPattern()
    {
        $this->applyEditSite('fr');

        $url = $this->makePreviewUrl('blog-post', ['slug' => 'my-post']);
        $this->assertStringEndsWith('/blogue/my-post', $url);

        // Legacy viewBag localeUrl values act as a fallback
        $url = $this->makePreviewUrl('legacy', []);
        $this->assertStringEndsWith('/patrimoine', $url);
    }

    public function testPreviewUrlUsesDefaultPattern()
    {
        $this->applyEditSite('en');

        $url = $this->makePreviewUrl('blog-post', ['slug' => 'my-post']);
        $this->assertStringEndsWith('/blog/my-post', $url);

        $url = $this->makePreviewUrl('legacy', []);
        $this->assertStringEndsWith('/legacy', $url);
    }

    /**
     * testPreviewUrlUsesCustomHostname ensures sites with a custom app URL preview
     * on their own hostname, previously handled by forcing the root URL.
     */
    public function testPreviewUrlUsesCustomHostname()
    {
        $this->applyEditSite('fr', [
            'is_custom_url' => true,
            'app_url' => 'https://fr.example.com'
        ]);

        $url = $this->makePreviewUrl('blog-post', ['slug' => 'my-post']);
        $this->assertEquals('https://fr.example.com/blogue/my-post', $url);
    }

    /**
     * testPreviewUrlUsesRoutePrefix ensures prefixed sites include their route prefix.
     */
    public function testPreviewUrlUsesRoutePrefix()
    {
        $this->applyEditSite('fr', [
            'is_prefixed' => true,
            'route_prefix' => '/fr'
        ]);

        $url = $this->makePreviewUrl('blog-post', ['slug' => 'my-post']);
        $this->assertStringEndsWith('/fr/blogue/my-post', $url);
    }

    /**
     * makePreviewUrl invokes the protected behavior method without booting a backend controller.
     */
    protected function makePreviewUrl(string $pageName, array $urlParams): ?string
    {
        $behavior = (new ReflectionClass(PreviewController::class))->newInstanceWithoutConstructor();

        $method = new ReflectionMethod($behavior, 'makePreviewUrl');
        $method->setAccessible(true);

        return $method->invoke($behavior, $pageName, $urlParams);
    }

    /**
     * makeSite builds an unsaved site definition for a locale.
     */
    protected function makeSite(string $locale, array $attributes = []): SiteDefinition
    {
        $site = new SiteDefinition;
        $site->attributes = array_merge([
            'code' => 'test-'.strtolower($locale),
            'name' => 'Test Site',
            'locale' => $locale
        ], $attributes);
        $site->syncOriginal();

        return $site;
    }

    /**
     * applyEditSite swaps the site manager with a stub where the edit site uses the
     * given locale while the active site remains the default, mirroring a backend request.
     */
    protected function applyEditSite(string $locale, array $attributes = []): void
    {
        $editSite = $this->makeSite($locale, $attributes);
        $activeSite = $locale === 'en' ? $editSite : $this->makeSite('en');
        $sites = new SiteCollection($editSite === $activeSite ? [$editSite] : [$activeSite, $editSite]);

        Site::swap(new class(App::make('system.sites'), $editSite, $activeSite, $sites) {
            public function __construct(public $manager, public $editSite, public $activeSite, public $sites)
            {
            }

            public function getSiteFromContext()
            {
                return $this->editSite;
            }

            public function getActiveSite()
            {
                return $this->activeSite;
            }

            public function listEnabled()
            {
                return $this->sites;
            }

            public function __call($name, $params)
            {
                return $this->manager->$name(...$params);
            }
        });
    }
}
