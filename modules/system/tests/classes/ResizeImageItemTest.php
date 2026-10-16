<?php

use System\Classes\ResizeImages;
use System\Classes\ResizeImageItem;

/**
 * ResizeImageItemTest covers source modification time tracking for the resizer,
 * ensuring images replaced in-place under the same name are regenerated.
 */
class ResizeImageItemTest extends TestCase
{
    protected ResizeImages $resizer;

    protected string $resourcesRoot;

    protected string $sourcePath;

    public function setUp(): void
    {
        parent::setUp();

        $this->resourcesRoot = temp_path('resize-test-resources');
        Config::set('filesystems.disks.resources', [
            'driver' => 'local',
            'root' => $this->resourcesRoot,
            'url' => '/storage/temp/resources'
        ]);
        Storage::forgetDisk('resources');

        $this->sourcePath = temp_path('resize-test-source.jpg');
        File::put($this->sourcePath, 'image-contents-v1');

        $this->resizer = new ResizeImages();
    }

    public function tearDown(): void
    {
        File::delete($this->sourcePath);
        File::deleteDirectory($this->resourcesRoot);
        Storage::forgetDisk('resources');

        parent::tearDown();
    }

    public function testLocalSourceCapturesModificationTime()
    {
        touch($this->sourcePath, 1700000000);
        clearstatcache(true, $this->sourcePath);

        $this->assertEquals(1700000000, $this->makeItem()->mtime);
    }

    public function testHasFileWhenResizedImageIsFresh()
    {
        $item = $this->makeItem();
        $this->createResizedFile($item, 1700009999);
        $this->touchSource(1700000000);

        $this->assertTrue($this->callHasFile($this->makeItem()));
    }

    public function testHasNoFileWhenSourceIsReplacedInPlace()
    {
        $item = $this->makeItem();
        $this->createResizedFile($item, 1700000000);

        // Simulate replacing the file with new contents under the same name
        File::put($this->sourcePath, 'image-contents-v2');
        $this->touchSource(1700009999);

        $this->assertFalse($this->callHasFile($this->makeItem()));
    }

    public function testHasFileWhenModificationTimeIsUnknown()
    {
        $item = $this->makeItem();
        $this->createResizedFile($item, 1700000000);
        $this->touchSource(1700009999);

        $item = $this->makeItem();
        $item->mtime(null);

        $this->assertTrue($this->callHasFile($item));
    }

    /**
     * testUrlSchemeIsNotCheckedOnDisk ensures a non-http URL never reaches its stream wrapper, so no connection is opened.
     */
    public function testUrlSchemeIsNotCheckedOnDisk()
    {
        $server = stream_socket_server('tcp://127.0.0.1:0');
        $address = stream_socket_get_name($server, false);
        $timeout = ini_set('default_socket_timeout', 1);

        try {
            $item = (new ResizeImageItem)->fromObject("ftp://{$address}/image.jpg");
            $connection = @stream_socket_accept($server, 0);
        }
        finally {
            ini_set('default_socket_timeout', $timeout);
            fclose($server);
        }

        $this->assertFalse($connection);
        $this->assertNull($item->source);
    }

    /**
     * testLocalPathStillResolves ensures plain local paths are still read from disk.
     */
    public function testLocalPathStillResolves()
    {
        $item = (new ResizeImageItem)->fromObject($this->sourcePath);

        $this->assertSame('local', $item->source);
        $this->assertSame($this->sourcePath, $item->path);
    }

    /**
     * makeItem builds a resize item from the local test file
     */
    protected function makeItem(): ResizeImageItem
    {
        $item = (new ResizeImageItem)->fromObject($this->sourcePath);
        $item->toOptions([]);
        $item->toDimensions(100, 100);

        return $item;
    }

    /**
     * createResizedFile writes a fake resized image with the given modification time
     */
    protected function createResizedFile(ResizeImageItem $item, int $mtime): void
    {
        $filePath = $this->resizer->getStoragePath($item);

        Storage::disk('resources')->put($filePath, 'resized-contents');

        touch($this->resourcesRoot . '/' . $filePath, $mtime);
        clearstatcache(true, $this->resourcesRoot . '/' . $filePath);
    }

    /**
     * touchSource sets the modification time on the source file
     */
    protected function touchSource(int $mtime): void
    {
        touch($this->sourcePath, $mtime);
        clearstatcache(true, $this->sourcePath);
    }

    /**
     * callHasFile invokes the protected hasFile method
     */
    protected function callHasFile(ResizeImageItem $item): bool
    {
        return self::callProtectedMethod($this->resizer, 'hasFile', [$item]);
    }
}
