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
        $this->assertInternalType('array', $items);
        $this->assertArrayHasKey('posts', $items);
        $this->assertArrayHasKey('categories', $items);

        $this->assertInternalType('object', $items['posts']);
        $this->assertObjectHasAttribute('code', $items['posts']);
        $this->assertObjectHasAttribute('owner', $items['posts']);
        $this->assertEquals('posts', $items['posts']->code);
        $this->assertEquals('October.Tester', $items['posts']->owner);

        $this->assertObjectHasAttribute('permissions', $items['posts']);
        $this->assertInternalType('array', $items['posts']->permissions);
        $this->assertCount(1, $items['posts']->permissions);

        $this->assertObjectHasAttribute('order', $items['posts']);
        $this->assertObjectHasAttribute('order', $items['categories']);
        $this->assertEquals(100, $items['posts']->order);
        $this->assertEquals(200, $items['categories']->order);
    }

    public function testAddMainMenuItems()
    {
        $manager = NavigationManager::instance();
        $manager->addMainMenuItems('October.Tester', [
            'print' => [
                'label' => 'Print',
                'icon' => 'icon-print',
                'url' => 'javascript:window.print()'
            ]
        ]);

        $items = $manager->listMainMenuItems();

        $this->assertInternalType('array', $items);
        $this->assertArrayHasKey('OCTOBER.TESTER.PRINT', $items);

        $item = $items['OCTOBER.TESTER.PRINT'];
        $this->assertEquals('print', $item->code);
        $this->assertEquals('Print', $item->label);
        $this->assertEquals('icon-print', $item->icon);
        $this->assertEquals('javascript:window.print()', $item->url);
        $this->assertEquals(500, $item->order);
        $this->assertEquals('October.Tester', $item->owner);
    }

    public function testRemoveMainMenuItem()
    {
        $manager = NavigationManager::instance();
        $manager->addMainMenuItems('October.Tester', [
            'close' => [
                'label' => 'Close',
                'icon' => 'icon-times',
                'url' => 'javascript:window.close()'
            ]
        ]);

        $items = $manager->listMainMenuItems();
        $this->assertArrayHasKey('OCTOBER.TESTER.CLOSE', $items);

        $manager->removeMainMenuItem('October.Tester', 'close');

        $items = $manager->listMainMenuItems();
        $this->assertArrayNotHasKey('OCTOBER.TESTER.CLOSE', $items);
    }

    public function testAddSideMenuItems()
    {
        $manager = NavigationManager::instance();

        $manager->addSideMenuItems('October.Tester', 'blog', [
            'foo' => [
                'label'       => 'Bar',
                'icon'        => 'icon-derp',
                'url'         => 'http://google.com',
                'permissions' => [
                    'october.tester.access_foo',
                    'october.tester.access_bar'
                ]
            ]
        ]);

        $manager->setContext('October.Tester', 'blog');
        $items = $manager->listSideMenuItems();

        $this->assertInternalType('array', $items);
        $this->assertArrayHasKey('foo', $items);

        $this->assertInternalType('object', $items['foo']);
        $this->assertObjectHasAttribute('code', $items['foo']);
        $this->assertObjectHasAttribute('owner', $items['foo']);
        $this->assertObjectHasAttribute('order', $items['foo']);

        $this->assertEquals(-1, $items['foo']->order);
        $this->assertEquals('foo', $items['foo']->code);
        $this->assertEquals('October.Tester', $items['foo']->owner);

        $this->assertObjectHasAttribute('permissions', $items['foo']);
        $this->assertInternalType('array', $items['foo']->permissions);
        $this->assertCount(2, $items['foo']->permissions);
        $this->assertContains('october.tester.access_foo', $items['foo']->permissions);
        $this->assertContains('october.tester.access_bar', $items['foo']->permissions);
    }

    public function testRemoveSideMenuItem()
    {
        $manager = NavigationManager::instance();
        $manager->addSideMenuItems('October.Tester', 'blog', [
            'bar' => [
                'label' => 'Bar',
                'icon' => 'icon-bars',
                'url' => 'http://yahoo.com'
            ]
        ]);

        $manager->setContext('October.Tester', 'blog');

        $items = $manager->listSideMenuItems();
        $this->assertArrayHasKey('bar', $items);

        $manager->removeSideMenuItem('October.Tester', 'blog', 'bar');

        $items = $manager->listSideMenuItems();
        $this->assertArrayNotHasKey('bar', $items);
    }
}
