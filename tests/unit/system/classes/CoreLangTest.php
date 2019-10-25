<?php

use System\Classes\PluginManager;

class CoreLangTest extends TestCase
{
    public function testValidationTranslator()
    {
        $translator = $this->app['translator'];
        $translator->setLocale('en');

        $validator = Validator::make(
            ['name' => 'me'],
            ['name' => 'required|min:5']
        );

        $this->assertTrue($validator->fails());

        $messages = $validator->messages();
        $this->assertCount(1, $messages);
        $this->assertEquals('The name must be at least 5 characters.', $messages->all()[0]);
    }

    public function testValidCoreLanguageFiles()
    {
        $translator = $this->app['translator'];
        $locales = $translator->get('system::lang.locale');
        $this->assertNotEmpty($locales);

        $locales = array_keys($locales);
        $modules = ['system', 'backend', 'cms'];
        $files = ['lang.php', 'validation.php', 'client.php'];

        foreach ($modules as $module) {
            foreach ($locales as $locale) {
                foreach ($files as $file) {
                    $srcPath = base_path() . '/modules/'.$module.'/lang/'.$locale.'/'.$file;
                    if (!file_exists($srcPath)) {
                        continue;
                    }
                    $messages = require $srcPath;
                    $this->assertNotEmpty($messages);
                    $this->assertNotCount(0, $messages);
                }
            }
        }
    }
}
