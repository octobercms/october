<?php

use System\Helpers\System;

class SystemTest extends TestCase
{
    public function testComposerToOctoberCode()
    {
        $helper = new System;

        $code = $helper->composerToOctoberCode('acme.blog');
        $this->assertEquals('acme.blog', $code);

        $code = $helper->composerToOctoberCode('rainlab/mailchimp-plugin');
        $this->assertEquals('rainlab.mailchimp', $code);

        $code = $helper->composerToOctoberCode('rainlab/mailchimp-plugin-9999999');
        $this->assertEquals('rainlab.mailchimp', $code);
    }

    public function testListModulesMemoizesManifestHit()
    {
        Manifest::put(System::MANIFEST_MODULES, ['System', 'Cms']);

        $helper = new System;

        $this->assertSame(['System', 'Cms'], $helper->listModules());
        $this->assertSame(['System', 'Cms'], self::getProtectedProperty($helper, 'listModulesCache'));

        // Later calls no longer consult the manifest
        Manifest::forget(System::MANIFEST_MODULES);
        $this->assertSame(['System', 'Cms'], $helper->listModules());
    }
}
