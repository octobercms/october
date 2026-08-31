<?php

use Cms\Classes\Page;
use Cms\Classes\Theme;
use Cms\Classes\Router;
use Cms\Console\ThemeCache;
use System\Classes\SiteCollection;
use System\Models\SiteDefinition;

class RouterTranslatableTest extends TestCase
{
    protected static $theme = null;

    public function setUp(): void
    {
        parent::setUp();

        self::$theme = Theme::load('translatabletest');

        $this->clearThemeManifest();
    }

    public function tearDown(): void
    {
        $this->clearThemeManifest();

        parent::tearDown();
    }

    /**
     * clearThemeManifest removes the cached theme manifest file.
     */
    protected function clearThemeManifest(): void
    {
        $manifestPath = self::$theme->getCachedThemePath();

        for ($attempt = 0; $attempt < 10; $attempt++) {
            try {
                if (!File::exists($manifestPath)) {
                    return;
                }

                // Windows can hold a lock on the file, neutralize the contents instead
                if (!File::delete($manifestPath) && File::exists($manifestPath)) {
                    File::put($manifestPath, '<?php return [];');
                    if (function_exists('opcache_invalidate')) {
                        opcache_invalidate($manifestPath, true);
                    }
                }

                return;
            }
            catch (Throwable $ex) {
                usleep(100000);
            }
        }
    }

    public function testTranslatedUrlResolvesForSite()
    {
        $this->applyActiveSite('fr');

        $router = $this->makeRouter();

        $page = $router->findByUrl('/contactez');
        $this->assertNotEmpty($page);
        $this->assertEquals('contact.htm', $page->getFileName());

        // The default URL no longer resolves in this site
        $this->assertEmpty($router->findByUrl('/contact'));

        // Untranslated pages keep their default URL
        $page = $router->findByUrl('/');
        $this->assertNotEmpty($page);
        $this->assertEquals('index.htm', $page->getFileName());
    }

    public function testDefaultUrlResolvesWithoutTranslation()
    {
        $this->applyActiveSite('en');

        $router = $this->makeRouter();

        $page = $router->findByUrl('/contact');
        $this->assertNotEmpty($page);
        $this->assertEquals('contact.htm', $page->getFileName());

        $this->assertEmpty($router->findByUrl('/contactez'));
        $this->assertNull($router->findAliasRedirect('/contactez'));
    }

    public function testAliasRedirectToTranslatedUrl()
    {
        $this->applyActiveSite('fr');

        $router = $this->makeRouter();

        $this->assertEquals('/contactez', $router->findAliasRedirect('/contact'));
        $this->assertNull($router->findAliasRedirect('/never-existed'));
    }

    public function testAliasRedirectPreservesParameters()
    {
        $this->applyActiveSite('fr');

        $router = $this->makeRouter();

        $page = $router->findByUrl('/blogue/my-post');
        $this->assertNotEmpty($page);
        $this->assertEquals('blog-post.htm', $page->getFileName());
        $this->assertEquals('my-post', $router->getParameters()['slug']);

        $this->assertEquals('/blogue/my-post', $router->findAliasRedirect('/blog/my-post'));
    }

    public function testViewBagLocaleUrlFallback()
    {
        $this->applyActiveSite('fr');

        $router = $this->makeRouter();

        $page = $router->findByUrl('/patrimoine');
        $this->assertNotEmpty($page);
        $this->assertEquals('legacy.htm', $page->getFileName());

        $this->assertEquals('/patrimoine', $router->findAliasRedirect('/legacy'));
    }

    public function testLanguageFallbackFromRegionalLocale()
    {
        $this->applyActiveSite('fr-CA');

        $router = $this->makeRouter();

        $page = $router->findByUrl('/contactez');
        $this->assertNotEmpty($page);
        $this->assertEquals('contact.htm', $page->getFileName());
    }

    public function testReverseRoutingUsesTranslatedUrl()
    {
        $this->applyActiveSite('fr');

        $router = $this->makeRouter();
        $this->assertEquals('/contactez', $router->findByFile('contact.htm'));

        $this->applyActiveSite('en');

        $router = $this->makeRouter();
        $this->assertEquals('/contact', $router->findByFile('contact.htm'));
    }

    public function testManifestCachedRouting()
    {
        $sites = [$this->makeSite('en'), $this->makeSite('fr')];

        $this->applyActiveSite('fr', $sites);

        // Build and store the theme manifest
        $command = new ThemeCache;
        $method = new ReflectionMethod($command, 'buildThemeCacheFile');
        $method->setAccessible(true);

        $manifestPath = self::$theme->getCachedThemePath();
        File::makeDirectory(dirname($manifestPath), 0777, true, true);
        File::put($manifestPath, $method->invoke($command, self::$theme));
        if (function_exists('opcache_invalidate')) {
            opcache_invalidate($manifestPath, true);
        }

        $this->assertTrue(self::$theme->themeIsCached());

        // Routes resolve from the manifest for the translated site
        $router = new Router(self::$theme);
        $page = $router->findByUrl('/contactez');
        $this->assertNotEmpty($page);
        $this->assertEquals('contact.htm', $page->getFileName());
        $this->assertEmpty($router->findByUrl('/contact'));
        $this->assertEquals('/contactez', $router->findAliasRedirect('/contact'));

        // The default site uses the default route map
        $this->applyActiveSite('en', $sites);
        $router = new Router(self::$theme);
        $page = $router->findByUrl('/contact');
        $this->assertNotEmpty($page);
        $this->assertEquals('contact.htm', $page->getFileName());
        $this->assertNull($router->findAliasRedirect('/contactez'));
    }

    public function testAppliesTranslatableContext()
    {
        $this->applyActiveSite('fr');

        $page = Page::load(self::$theme, 'contact.htm');
        $page->applyTranslatableContext();

        $this->assertEquals('Contactez', $page->title);
        $this->assertEquals('Page de contact', $page->description);
        $this->assertEquals('/contact', $page->url);
    }

    public function testTranslatableContextCannotOverrideTemplateSections()
    {
        $this->applyActiveSite('fr');

        $page = Page::load(self::$theme, 'reserved.htm');
        $page->applyTranslatableContext();

        // Translated properties apply as normal
        $this->assertEquals('Réservé', $page->title);

        // Structural keys and template sections keep their original values
        $this->assertStringContainsString('onStart', $page->code);
        $this->assertStringContainsString('<p>Reserved</p>', $page->markup);
    }

    public function testAliasRedirectResponse()
    {
        $this->applyActiveSite('fr');

        $controller = new Cms\Classes\Controller(self::$theme);
        $response = $controller->run('/contact');
        $this->assertInstanceOf(\Illuminate\Http\RedirectResponse::class, $response);
        $this->assertEquals(301, $response->getStatusCode());
        $this->assertStringEndsWith('/contactez', $response->getTargetUrl());
    }

    public function testSiteUrlUsesTranslatedPattern()
    {
        $this->applyActiveSite('en');

        $page = Page::loadCached(self::$theme, 'contact.htm');
        $this->assertNotEmpty($page);

        $this->assertStringEndsWith('/contactez', Cms::siteUrl($page, $this->makeSite('fr')));
        $this->assertStringEndsWith('/contact', Cms::siteUrl($page, $this->makeSite('en')));
    }

    /**
     * makeRouter returns a fresh router with a cleared cache.
     */
    protected function makeRouter(): Router
    {
        $router = new Router(self::$theme);
        $router->clearCache();

        return $router;
    }

    /**
     * makeSite builds an unsaved site definition for a locale.
     */
    protected function makeSite(string $locale): SiteDefinition
    {
        $site = new SiteDefinition;
        $site->attributes = [
            'code' => 'test-'.strtolower($locale),
            'name' => 'Test Site',
            'locale' => $locale
        ];
        $site->syncOriginal();

        return $site;
    }

    /**
     * applyActiveSite swaps the site manager with a stub returning a site for the locale.
     */
    protected function applyActiveSite(string $locale, array $sites = []): void
    {
        $site = $this->makeSite($locale);
        $sites = $sites ?: [$site];

        Site::swap(new class(App::make('system.sites'), $site, new SiteCollection($sites)) {
            public function __construct(public $manager, public $site, public $sites)
            {
            }

            public function getActiveSite()
            {
                return $this->site;
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
