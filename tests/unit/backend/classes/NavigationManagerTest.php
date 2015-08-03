<?php

use Backend\Classes\Controller;
use Backend\Classes\NavigationManager;

class NavigationManagerTest extends TestCase
{
    public function testRegisterMenuItems()
    {
        $manager = NavigationManager::instance();
        $items = $manager->listMainMenuItems();
        $this->assertArrayNotHasKey('OCTOBER.TEST.DASHBOARD', $items);

        $manager->registerMenuItems('October.Test', [
            'dashboard' => [
                'label'       => 'Dashboard',
                'icon'        => 'icon-dashboard',
                'url'         => 'http://dashboard.tld',
                'order'       => 100
            ]
        ]);

        $items = $manager->listMainMenuItems();
        $this->assertArrayHasKey('OCTOBER.TEST.DASHBOARD', $items);

        $item = $items['OCTOBER.TEST.DASHBOARD'];
        $this->assertObjectHasAttribute('code', $item);
        $this->assertObjectHasAttribute('label', $item);
        $this->assertObjectHasAttribute('icon', $item);
        $this->assertObjectHasAttribute('url', $item);
        $this->assertObjectHasAttribute('owner', $item);
        $this->assertObjectHasAttribute('order', $item);
        $this->assertObjectHasAttribute('permissions', $item);
        $this->assertObjectHasAttribute('sideMenu', $item);

        $this->assertEquals('dashboard', $item->code);
        $this->assertEquals('Dashboard', $item->label);
        $this->assertEquals('icon-dashboard', $item->icon);
        $this->assertEquals('http://dashboard.tld', $item->url);
        $this->assertEquals(100, $item->order);
        $this->assertEquals('October.Test', $item->owner);
    }

    public function testListMainMenuItems()
    {
        $manager = NavigationManager::instance();
        $items = $manager->listMainMenuItems();

        $this->assertArrayHasKey('OCTOBER.TESTER.BLOG', $items);
    }

    public function testListSideMenuItems()
    {
        $manager = NavigationManager::instance();

        $items = $manager->listSideMenuItems();
        $this->assertEmpty($items);

        $manager->setContext('October.Tester', 'blog');

        $items = $manager->listSideMenuItems();
        $this->assertArrayHasKey('posts', $items);
        $this->assertArrayHasKey('categories', $items);
    }
}