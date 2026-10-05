<?php

use Backend\Widgets\Form;
use October\Rain\Database\Model;

/**
 * ColorPickerStyleModel is a plain model holding a color value in memory.
 */
class ColorPickerStyleModel extends Model
{
    public $timestamps = false;
}

/**
 * ColorPickerStyleTest ensures preset color values are escaped when rendered.
 */
class ColorPickerStyleTest extends PluginTestCase
{
    public function testPresetModeEscapesColors()
    {
        $model = new ColorPickerStyleModel;
        $model->color = '#ffffff';

        $form = new Form(new \Backend\Classes\Controller, [
            'model' => $model,
            'arrayName' => 'ColorPickerStyleModel',
            'fields' => [
                'color' => [
                    'type' => 'colorpicker',
                    'availableColors' => ['#ffffff', '"><svg onload="alert(1)">'],
                ],
            ],
        ]);

        $html = $form->render();

        $this->assertStringNotContainsString('<svg', $html);
        $this->assertStringContainsString('data-hex-color="&quot;&gt;&lt;svg', $html);
    }
}
