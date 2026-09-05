<?php

use System\Classes\SettingsManager;

class SettingsManagerTest extends TestCase
{
    public function testSettingItemUrlForPluginOwner()
    {
        $manager = SettingsManager::instance();
        $manager->registerSettingItems('Acme.Blog', [
            'general' => ['label' => 'General', 'class' => 'Acme\Blog\Models\Settings', 'category' => 'x'],
        ]);

        $item = self::getProtectedProperty($manager, 'items')['ACME.BLOG.GENERAL'];

        $this->assertStringEndsWith('system/settings/update/acme/blog/general', $item->url);
    }

    public function testSettingItemUrlForOwnerWithoutVendor()
    {
        $manager = SettingsManager::instance();
        $manager->registerSettingItems('Standalone', [
            'general' => ['label' => 'General', 'class' => 'Standalone\Settings', 'category' => 'x'],
        ]);

        $item = self::getProtectedProperty($manager, 'items')['STANDALONE.GENERAL'];

        $this->assertStringEndsWith('system/settings/update/standalone/general', $item->url);
    }
}
