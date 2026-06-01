<?php

use Illuminate\Filesystem\FilesystemAdapter;
use Media\Classes\MediaLibrary;

/**
 * MediaLibraryTest
 */
class MediaLibraryTest extends TestCase
{
    /**
     * testInvalidPathsOnValidatePath
     * @dataProvider invalidPathsProvider
     */
    public function testInvalidPathsOnValidatePath($path)
    {
        $this->expectException('ApplicationException');
        MediaLibrary::validatePath($path);
    }

    /**
     * invalidPathsProvider
     */
    public function invalidPathsProvider()
    {
        return [
            ['./file'],
            ['../secret'],
            ['.../secret'],
            ['/../secret'],
            ['/.../secret'],
            ['/secret/..'],
            ['file/../secret'],
            ['file/..'],
            ['......./secret'],
            ['./file'],
        ];
    }

    /**
     * testValidPathsOnValidatePath
     * @dataProvider validPathsProvider
     */
    public function testValidPathsOnValidatePath($path)
    {
        $result = MediaLibrary::validatePath($path);
        $this->assertIsString($result);
    }

    /**
     * validPathsProvider
     */
    public function validPathsProvider()
    {
        return [
            ['file'],
            ['folder/file'],
            ['/file'],
            ['/folder/file'],
            ['/.file'],
            ['/..file'],
            ['/...file'],
            ['file.ext'],
            ['file..ext'],
            ['file...ext'],
            ['one,two.ext'],
            ['one(two)[].ext'],
            ['one=(two)[].ext'],
            ['one_(two)[].ext'],
            ['BG中国通讯期刊(Blend\'r)创刊号.pdf'],
        ];
    }

    /**
     * testListAllDirectories
     */
    public function testListAllDirectories()
    {
        $disk = $this->createConfiguredMock(FilesystemAdapter::class, [
            'allDirectories' => [
                '/.ignore1',
                '/.ignore2',
                '/dir',
                '/dir/sub',
                '/exclude',
                '/hidden',
                '/hidden/sub1',
                '/hidden/sub1/deep1',
                '/hidden/sub2',
                '/hidden but not really',
                '/name'
            ]
        ]);

        $this->app['config']->set('media.ignore_files', ['hidden']);
        $this->app['config']->set('media.ignore_patterns', ['^\..*']);
        $instance = MediaLibrary::instance();
        $this->setProtectedProperty($instance, 'storageDisk', $disk);

        $expect = ['/', '/dir', '/dir/sub', '/hidden but not really', '/name'];
        $actual = $instance->listAllDirectories(['/exclude']);
        $this->assertEquals($expect, $actual);
    }

    /**
     * testScanFolderContents checks the assumption that all resulting paths are normalized
     * to include a leading slash.
     */
    public function testScanFolderContents()
    {
        $this->app['config']->set('filesystems.disks.media.root', base_path('modules/media/tests/fixtures/media'));

        $instance = MediaLibrary::instance();
        $result = self::callProtectedMethod($instance, 'scanFolderContents', ['']);

        foreach ($result['files'] as $item) {
            $this->assertTrue(
                str_starts_with($item->path, '/'),
                "Path [$item->path] should start with a forward slash"
            );
        }
    }
}
