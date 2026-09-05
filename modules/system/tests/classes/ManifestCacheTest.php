<?php

use System\Classes\ManifestCache;

class ManifestCacheTest extends TestCase
{
    protected string $path;

    public function setUp(): void
    {
        parent::setUp();

        $this->path = storage_path('framework/testing/manifest-' . uniqid() . '.php');
        @mkdir(dirname($this->path), 0755, true);
    }

    public function tearDown(): void
    {
        foreach (glob($this->path . '*') ?: [] as $file) {
            @unlink($file);
        }

        parent::tearDown();
    }

    protected function makeManifest(): ManifestCache
    {
        $manifest = new ManifestCache;
        self::setProtectedProperty($manifest, 'useManifest', true);
        self::setProtectedProperty($manifest, 'manifestPath', $this->path);

        return $manifest;
    }

    public function testForgetWithoutPriorReadPreservesOtherKeys()
    {
        $writer = $this->makeManifest();
        $writer->put('keep', 'me');
        $writer->put('drop', 'me');
        $writer->build();
        $this->assertSame(['keep' => 'me', 'drop' => 'me'], require $this->path);

        $fresh = $this->makeManifest();
        $fresh->forget('drop');
        $fresh->build();

        $this->assertSame(['keep' => 'me'], require $this->path);
    }

    public function testPutWithoutPriorReadPreservesOtherKeys()
    {
        $writer = $this->makeManifest();
        $writer->put('keep', 'me');
        $writer->build();

        $fresh = $this->makeManifest();
        $fresh->put('add', 'me');
        $fresh->build();

        $this->assertSame(['keep' => 'me', 'add' => 'me'], require $this->path);
    }

    public function testBuildLeavesNoTemporaryFiles()
    {
        $manifest = $this->makeManifest();
        $manifest->put('key', 'value');
        $manifest->build();

        $this->assertSame([$this->path], glob($this->path . '*'));
    }

    public function testBuildWithoutChangesDoesNotWrite()
    {
        $manifest = $this->makeManifest();
        $manifest->put('key', 'value');
        $manifest->build();

        touch($this->path, time() - 3600);
        clearstatcache(true, $this->path);
        $before = filemtime($this->path);

        $fresh = $this->makeManifest();
        $fresh->get('key');
        $fresh->build();
        clearstatcache(true, $this->path);

        $this->assertSame($before, filemtime($this->path));
    }
}
