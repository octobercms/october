<?php

use System\Classes\MediaLibrary;

class MediaLibraryTest extends \October\Core\Tests\TestCase // @codingStandardsIgnoreLine
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
            ['one,two.ext'],
            ['one(two)[].ext'],
            ['one=(two)[].ext'],
            ['one_(two)[].ext'],
            /*
            Example of a unicode-based filename with a single quote
            @see: https://github.com/octobercms/october/pull/4564
            */
            ['BG中国通讯期刊(Blend\'r)创刊号.pdf'],
        ];
    }

    /**
     * @dataProvider invalidPathsProvider
     */
    public function testInvalidPathsOnValidatePath($path)
    {
        $this->expectException('ApplicationException');
        MediaLibrary::validatePath($path);
    }

    /**
     * @dataProvider validPathsProvider
     */
    public function testValidPathsOnValidatePath($path)
    {
        $result = MediaLibrary::validatePath($path);
        $this->assertIsString($result);
    }
}
