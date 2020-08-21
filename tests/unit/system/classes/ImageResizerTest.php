<?php

use Cms\Classes\Theme;
use System\Classes\ImageResizer;
use System\Classes\MediaLibrary;
use System\Models\File as FileModel;
use Cms\Classes\Controller as CmsController;
use DMS\PHPUnitExtensions\ArraySubset\ArraySubsetAsserts;
use October\Rain\Exception\SystemException;

class ImageResizerTest extends PluginTestCase
{
    use ArraySubsetAsserts;

    public function setUp(): void
    {
        parent::setUp();

        Config::set('cms.activeTheme', 'test');
        Event::flush('cms.theme.getActiveTheme');
        Theme::resetCache();
    }

    public function tearDown(): void
    {
        $this->removeMedia();
        ImageResizer::flushAvailableSources();
        parent::tearDown();
    }

    /**
     * Tests configuration through the constructor as well as events.
     *
     * @return void
     */
    public function testConfiguration()
    {
        // Resize with default options
        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            100,
            100
        );
        self::assertArraySubset([
            'width' => 100,
            'height' => 100,
            'options' => [
                'mode' => 'auto',
                'offset' => [0, 0],
                'sharpen' => 0,
                'interlace' => false,
                'quality' => 90,
                'extension' => 'png',
            ],
        ], $imageResizer->getConfig());

        // Resize with customised options
        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            150,
            120,
            [
                'mode' => 'fit',
                'offset' => [2, 2],
                'sharpen' => 23,
                'interlace' => true,
                'quality' => 73,
                'extension' => 'jpg'
            ]
        );
        self::assertArraySubset([
            'width' => 150,
            'height' => 120,
            'options' => [
                'mode' => 'fit',
                'offset' => [2, 2],
                'sharpen' => 23,
                'interlace' => true,
                'quality' => 73,
                'extension' => 'jpg'
            ],
        ], $imageResizer->getConfig());

        // Resize with an customised defaults
        Event::listen('system.resizer.getDefaultOptions', function (&$options) {
            $options = array_merge($options, [
                'mode' => 'fit',
                'offset' => [2, 2],
                'sharpen' => 23,
                'interlace' => true,
                'quality' => 73,
            ]);
        });

        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            100,
            100,
            []
        );
        self::assertArraySubset([
            'width' => 100,
            'height' => 100,
            'options' => [
                'mode' => 'fit',
                'offset' => [2, 2],
                'sharpen' => 23,
                'interlace' => true,
                'quality' => 73,
                'extension' => 'png',
            ],
        ], $imageResizer->getConfig());

        Event::forget('system.resizer.getDefaultOptions');

        // Resize with a falsey height specified
        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            100,
            false
        );
        self::assertArraySubset([
            'width' => 100,
            'height' => 0,
        ], $imageResizer->getConfig());

        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            100,
            null
        );
        self::assertArraySubset([
            'width' => 100,
            'height' => 0,
        ], $imageResizer->getConfig());

        // Resize with a falsey width specified
        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            '',
            100
        );
        self::assertArraySubset([
            'width' => 0,
            'height' => 100,
        ], $imageResizer->getConfig());

        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            "0",
            100
        );
        self::assertArraySubset([
            'width' => 0,
            'height' => 100,
        ], $imageResizer->getConfig());
    }

    /**
     * Tests URLs for sources that can be accessed via URL.
     *
     * @return void
     */
    public function testURLSources()
    {
        // Theme URL (absolute URL)
        $this->setUpStorage();
        $this->copyMedia();

        $imageResizer = new ImageResizer(
            (new CmsController())->themeUrl('assets/images/october.png'),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Theme URL (relative URL)
        $this->setUpStorage();
        $this->copyMedia();

        $imageResizer = new ImageResizer(
            '/themes/test/assets/images/october.png',
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Media URL (absolute URL)
        $this->setUpStorage();
        $this->copyMedia();

        $imageResizer = new ImageResizer(
            URL::to(MediaLibrary::url('october.png')),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Media URL (relative URL)
        $this->setUpStorage();
        $this->copyMedia();

        $imageResizer = new ImageResizer(
            MediaLibrary::url('october.png'),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Media URL (absolute URL)
        $this->setUpStorage();
        $this->copyMedia();

        $imageResizer = new ImageResizer(
            URL::to(MediaLibrary::url('october.png')),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Plugin URL (relative URL)
        $imageResizer = new ImageResizer(
            '/plugins/database/tester/assets/images/avatar.png',
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Plugin URL (absolute URL)
        $imageResizer = new ImageResizer(
            URL::to('plugins/database/tester/assets/images/avatar.png'),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Module URL (relative URL)
        $imageResizer = new ImageResizer(
            '/modules/backend/assets/images/favicon.png',
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Module URL (absolute URL)
        $imageResizer = new ImageResizer(
            Backend::skinAsset('assets/images/favicon.png'),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // URL for a FileModel instance (absolute URL)
        $fileModel = new FileModel();
        $fileModel->fromFile(base_path('tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $fileModel->save();

        $imageResizer = new ImageResizer(
            FileModel::first()->getPath(),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Remove FileModel instance
        $fileModel->delete();

        // URL of a FileModel instance (relative URL)
        $fileModel = new FileModel();
        $fileModel->fromFile(base_path('tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $fileModel->save();

        $imageResizer = new ImageResizer(
            str_replace(url('') . '/', '/', FileModel::first()->getPath()),
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);
    }

    public function testDirectSources()
    {
        // FileModel instance itself
        $fileModel = new FileModel();
        $fileModel->fromFile(base_path('tests/fixtures/plugins/database/tester/assets/images/avatar.png'));
        $fileModel->save();

        $imageResizer = new ImageResizer(
            $fileModel,
            100,
            100
        );
        $this->assertEquals('png', $imageResizer->getConfig()['options']['extension']);

        // Remove FileModel instance
        $fileModel->delete();
    }

    public function testInvalidInputPath()
    {
        $this->expectException(SystemException::class);
        $this->expectExceptionMessageMatches('/^Unable to process the provided image/');

        $imageResizer = new ImageResizer(
            '/plugins/database/tester/assets/images/MISSING.png',
            100,
            100
        );
    }

    public function testInvalidInputFileModel()
    {
        $this->expectException(SystemException::class);
        $this->expectExceptionMessageMatches('/^Unable to process the provided image/');

        $imageResizer = new ImageResizer(
            FileModel::first(),
            100,
            100
        );
    }

    protected function setUpStorage()
    {
        $this->app->useStoragePath(base_path('storage/temp'));

        Config::set('filesystems.disks.test_local', [
            'driver' => 'local',
            'root'   => storage_path('app'),
        ]);

        Config::set('cms.storage.media', [
            'disk'   => 'test_local',
            'folder' => 'media',
            'path'   => '/storage/temp/app/media',
        ]);
    }

    protected function copyMedia()
    {
        $mediaPath = storage_path('app/media');

        if (!is_dir($mediaPath)) {
            mkdir($mediaPath, 0777, true);
        }

        foreach (glob(base_path('tests/fixtures/media/*')) as $file) {
            $path = pathinfo($file);
            copy($file, $mediaPath . DIRECTORY_SEPARATOR . $path['basename']);
        }
    }

    protected function removeMedia()
    {
        if ($this->app->storagePath() !== base_path('storage/temp')) {
            return;
        }

        foreach (glob(storage_path('app/media/*')) as $file) {
            unlink($file);
        }

        rmdir(storage_path('app/media'));
        rmdir(storage_path('app'));
    }
}
