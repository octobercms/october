<?php

use Cms\Classes\MediaLibrary;

class MediaLibraryTest extends TestCase // @codingStandardsIgnoreLine
{
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
        ];
    }

    /**
     * @dataProvider invalidPathsProvider
     */
    public function testInvalidPathsOnValidatePath($path)
    {
        $this->setExpectedException('ApplicationException');
        MediaLibrary::validatePath($path);
    }

    /**
     * @dataProvider validPathsProvider
     */
    public function testValidPathsOnValidatePath($path)
    {
        MediaLibrary::validatePath($path);
    }
}
