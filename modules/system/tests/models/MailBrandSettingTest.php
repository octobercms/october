<?php

use System\Models\MailBrandSetting;

class MailBrandSettingTest extends TestCase
{
    public function tearDown(): void
    {
        $this->setProtectedStaticInstances([]);

        parent::tearDown();
    }

    /**
     * @dataProvider validColorProvider
     */
    public function testPlainColorValuesArePreserved(string $value)
    {
        $this->assertSame($value, $this->makeCssColorValue($value, '#000'));
    }

    public static function validColorProvider(): array
    {
        return [
            ['#fff'],
            ['#3498db'],
            ['#3498dbcc'],
            ['red'],
            ['transparent'],
            ['rgb(52, 152, 219)'],
            ['rgba(0,0,0,0.5)'],
            ['hsl(204, 70%, 53%)'],
        ];
    }

    /**
     * @dataProvider unsafeValueProvider
     */
    public function testUnsafeValuesFallBackToDefault(string $value)
    {
        $this->assertSame('#000', $this->makeCssColorValue($value, '#000'));
    }

    public static function unsafeValueProvider(): array
    {
        return [
            ['#fff; @import (inline) "LICENSE.md";'],
            ['#fff; @@import (inline) "LICENSE.md";'],
            ['#fff; @impor (inline) "LICENSE.md";'],
            ['@other-var'],
            ['red; .x { color: blue }'],
            ['url(//example.com/x.png)'],
            ['darken(#fff, 10%)'],
        ];
    }

    public function testCompiledCssDoesNotInlineFiles()
    {
        $markerFile = temp_path('mailbrand-marker.css');
        file_put_contents($markerFile, '.mailbrand-marker{color:red}');

        try {
            $model = MailBrandSetting::instance();
            $model->text_color = '#fff; @@import (inline) "'.$markerFile.'";';
            $model->link_color = '#fff; @impor (inline) "'.$markerFile.'";';

            $css = MailBrandSetting::compileCss();
        }
        finally {
            @unlink($markerFile);
        }

        $this->assertStringNotContainsString('mailbrand-marker', $css);
        $this->assertStringContainsString(MailBrandSetting::TEXT_COLOR, $css);
    }

    protected function makeCssColorValue(string $value, string $default): string
    {
        $method = new ReflectionMethod(MailBrandSetting::class, 'makeLessColorValue');

        return $method->invoke(null, $value, $default);
    }

    protected function setProtectedStaticInstances(array $instances): void
    {
        $property = new ReflectionProperty(MailBrandSetting::class, 'instances');
        $property->setValue(null, $instances);
    }
}
