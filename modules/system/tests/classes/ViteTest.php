<?php

use System\Classes\Vite;

class ViteTest extends TestCase
{
    protected string $themePath;

    protected string $hotPath;

    public function setUp(): void
    {
        parent::setUp();

        $this->themePath = base_path('modules/cms/tests/fixtures/themes/vitetest');

        $this->hotPath = storage_path('framework/testing/vite-'.uniqid());
        @mkdir($this->hotPath, 0755, true);
    }

    public function tearDown(): void
    {
        @unlink($this->hotPath.'/hot');
        @rmdir($this->hotPath);

        parent::tearDown();
    }

    protected function makeVite(): Vite
    {
        return (new Vite)
            ->useBasePath($this->themePath)
            ->useBuildDirectory('assets/dist')
            ->createAssetPathsUsing(fn ($path) => 'https://cdn.test/themes/vitetest/'.$path);
    }

    public function testReadsManifestFromBasePath()
    {
        $html = $this->makeVite()
            ->withEntryPoints(['assets/css/theme.css', 'assets/js/app.js'])
            ->toHtml();

        $this->assertStringContainsString('<link rel="stylesheet" href="https://cdn.test/themes/vitetest/assets/dist/theme-B2xQ1h3a.css"', $html);
        $this->assertStringContainsString('<script type="module" src="https://cdn.test/themes/vitetest/assets/dist/app-C9kD2fRe.js"', $html);
    }

    public function testReadsContentFromBasePath()
    {
        $this->assertSame(
            "body { color: #333; }\n",
            $this->makeVite()->content('assets/css/theme.css')
        );
    }

    public function testHotFileIsInBasePath()
    {
        $this->assertSame($this->themePath.'/hot', $this->makeVite()->hotFile());
        $this->assertFalse($this->makeVite()->isRunningHot());
    }

    public function testUsesDevServerWhileRunningHot()
    {
        file_put_contents($this->hotPath.'/hot', 'http://localhost:5173');

        $html = (new Vite)
            ->useBasePath($this->hotPath)
            ->withEntryPoints(['assets/js/app.js'])
            ->toHtml();

        $this->assertStringContainsString('src="http://localhost:5173/@vite/client"', $html);
        $this->assertStringContainsString('src="http://localhost:5173/assets/js/app.js"', $html);
    }

    public function testMissingManifestNamesBasePath()
    {
        $this->expectExceptionMessage('Vite manifest not found at: '.$this->hotPath.'/assets/dist/manifest.json');

        (new Vite)
            ->useBasePath($this->hotPath)
            ->useBuildDirectory('assets/dist')
            ->withEntryPoints(['assets/js/app.js'])
            ->toHtml();
    }

    public function testBehavesLikeLaravelWithoutBasePath()
    {
        $vite = new Vite;

        $this->assertSame(public_path('/hot'), $vite->hotFile());
        $this->assertSame(
            public_path('build/manifest.json'),
            self::callProtectedMethod($vite, 'manifestPath', ['build'])
        );
    }
}
