<?php

use System\Classes\PluginManager;

class TranslatorTest extends TestCase
{
    public function testValidationTranslator()
    {
        $translator = $this->app['translator'];
        $translator->setLocale('en');

        $validator = Validator::make(
            array('name' => 'me'),
            array('name' => 'required|min:5')
        );

        $this->assertTrue($validator->fails());

        $messages = $validator->messages();
        $this->assertCount(1, $messages);
        $this->assertEquals('The name must be at least 5 characters.', $messages->all()[0]);
    }
}