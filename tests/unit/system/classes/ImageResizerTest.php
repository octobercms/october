<?php

use Url;
use Backend;
use System\Classes\ImageResizer;
use System\Classes\MediaLibrary;
use System\Models\File as FileModel;
use Cms\Classes\Controller as CmsController;

class ImageResizerTest extends TestCase
{
    //
    // Tests
    //

    /**
     * Test the various sources that can be provided
     * Need to verify that for each of the sources it's able to
     * - identify that the desired image exists
     * - identify the correct source for the image
     * - and / or identify that the correct resizer URL is generated for the asset
     *
     * @NOTE: COMPLETELY WIP, ABSOLUTELY DOESN'T WORK RIGHT NOW
     *
     * Some examples of input to the Twig filter:
     * {{ 'assets/images/logo.png' | theme | resize(false, false, {quality: 90}) }}
     * {{ record.mediafinder_field | media | resize(200, false) }}
     * {{ record.filemodel_property | resize(false, 200, {mode: 'contain'}) }}
     * {{ record.filemodel_property.getPath() | resize(600, 202) }}
     */
    public function testSources()
    {
        $sources = [
            'themeUrl' => [
                'source' => (new CmsController())->themeUrl('assets/images/october.png'),
                'target' => '',
            ],
            'mediaUrl' => [
                'source' => MediaLibrary::url('unamed.png'),
                'target' => '',
            ],
            'pluginUrl' => [
                'source' => Url::to('plugins/october/demo/assets/logo.png'),
                'target' => '',
            ],
            'absoluteUrl' => [
                'source' => 'https://example.com/themes/demo/assets/images/october.png',
                'target' => '',
            ],
            'relativeUrl' => [
                'source' => '/plugins/october/demo/assets/logo.png',
                'target' => '',
            ],
            'moduleUrl' => [
                'source' => Backend::skinAsset('assets/images/favicon.png'),
                'target' => '',
            ],
            'fileUrl' => [
                'source' => FileModel::first()->getPath(),
                'target' => '',
            ],
            'fileInstance' => [
                'source' => FileModel::first(),
                'target' => '',
            ],
        ];
    }

    public function testInvalidInput()
    {
        $providedPath = '/plugins/october/demo/assets/NOTPRESENT.png';
    }
}
