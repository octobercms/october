<?php

use Cms\Classes\Theme;
use Cms\Classes\Asset;

class AssetTest extends TestCase
{
    public function testLoad()
    {
        $theme = Theme::load('test');

        // Valid direct path
        $this->assertStringContainsString(
            'console.log(\'script1.js\');',
            Asset::load($theme, 'js/script1.js')->content
        );

        // Valid direct subdirectory path
        $this->assertStringContainsString(
            'console.log(\'subdir/script1.js\');',
            Asset::load($theme, 'js/subdir/script1.js')->content
        );

        // Valid relative path
        $this->assertStringContainsString(
            'console.log(\'script2.js\');',
            Asset::load($theme, 'js/subdir/../script2.js')->content
        );

        // Invalid theme path
        $this->assertNull(
            Asset::load($theme, 'js/invalid.js')
        );

        // Check that we cannot break out of assets directory
        $this->assertNull(
            Asset::load($theme, '../../../../js/helpers/fakeDom.js')
        );
        $this->assertNull(
            Asset::load($theme, '../content/html-content.htm')
        );

        // Check that we cannot load directories directly
        $this->assertNull(
            Asset::load($theme, 'js/subdir')
        );

        // Check that we definitely cannot load external PHP files
        $this->assertNull(
            Asset::load($theme, '../../../../../config/database.php')
        );
    }

    public function testGetPath()
    {
        // Test some pathing fringe cases

        $theme = Theme::load('test');
        $assetClass = new Asset($theme);
        $themeDir = $theme->getPath();

        // Direct paths
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/script1.js'),
            $assetClass->getFilePath('js/script1.js')
        );
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/script1.js'),
            $assetClass->getFilePath('/js/script1.js')
        );

        // Direct path to a directory
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/subdir'),
            $assetClass->getFilePath('/js/subdir')
        );
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/subdir'),
            $assetClass->getFilePath('/js/subdir/')
        );

        // Relative paths
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/script2.js'),
            $assetClass->getFilePath('./js/script2.js')
        );
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/script2.js'),
            $assetClass->getFilePath('/js/subdir/../script2.js')
        );

        // Missing file, but valid directory (allows for new files)
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/missing.js'),
            $assetClass->getFilePath('/js/missing.js')
        );
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/missing.js'),
            $assetClass->getFilePath('js/missing.js')
        );

        // Missing file and missing directory (new directories are created as needed)
        $this->assertEquals(
            str_replace('/', DIRECTORY_SEPARATOR, $themeDir . '/assets/js/missing/missing.js'),
            $assetClass->getFilePath('/js/missing/missing.js')
        );

        // Ensure we cannot get paths outside of the assets directory
        $this->assertFalse(
            $assetClass->getFilePath('../../../../js/helpers/fakeDom.js')
        );
        $this->assertFalse(
            $assetClass->getFilePath('../content/html-content.htm')
        );
        $this->assertFalse(
            $assetClass->getFilePath('../../../../../config/database.php')
        );
    }
}
