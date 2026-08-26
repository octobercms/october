<?php

use Backend\Classes\RoleManager;
use October\Rain\Exception\SystemException;

/**
 * RoleManagerTest
 */
class RoleManagerTest extends TestCase
{
    protected $instance;

    public function setUp(): void
    {
        parent::setUp();

        $this->instance = RoleManager::instance();
        $this->instance->registerPermissions('October.TestCase', [
            'test.permission_one' => [
                'label' => 'Test Permission 1',
                'tab' => 'Test',
                'order' => 200
            ],
            'test.permission_two' => [
                'label' => 'Test Permission 2',
                'tab' => 'Test',
                'order' => 300
            ]
        ]);
    }

    public function testListPermissions()
    {
        $manager = $this->instance;
        $permissions = $manager->listPermissions();
        $permissionCodes = collect($permissions)->pluck('code')->toArray();
        $this->assertContains('test.permission_one', $permissionCodes);
        $this->assertContains('test.permission_two', $permissionCodes);
    }

    public function testRegisterPermissions()
    {
        $manager = $this->instance;
        $manager->registerPermissions('October.TestCase', [
            'test.permission_three' => [
                'label' => 'Test Permission 3',
                'tab' => 'Test',
                'order' => 100
            ]
        ]);

        $permissions = $manager->listPermissions();
        $permissionCodes = collect($permissions)->pluck('code')->toArray();

        $this->assertContains('test.permission_one', $permissionCodes);
        $this->assertContains('test.permission_two', $permissionCodes);
        $this->assertContains('test.permission_three', $permissionCodes);

        // Continue
        $manager->registerPermissions('October.TestCase', [
            'test.permission_three' => [
                'label' => 'Test Permission 3',
                'tab' => 'Test',
                'order' => 100
            ]
        ]);

        $manager->registerPermissions('October.TestCase', [
            'test.permission_four' => [
                'label' => 'Test Permission 4',
                'tab' => 'Test',
                'order' => 400
            ]
        ]);

        $permissions = $manager->listPermissions();
        $permissionCodes = collect($permissions)->pluck('code')->toArray();

        $this->assertContains('test.permission_one', $permissionCodes);
        $this->assertContains('test.permission_two', $permissionCodes);
        $this->assertContains('test.permission_three', $permissionCodes);
        $this->assertContains('test.permission_four', $permissionCodes);
    }

    public function testRegisterAdditionalTab()
    {
        $manager = $this->instance;

        $manager->registerPermissions('October.TestCase', [
            'test.permission_three' => [
                'label' => 'Test Permission 3',
                'tab' => 'Test 2',
                'order' => 100
            ]
        ]);

        $manager->registerCallback(function ($manager) {
            $manager->registerPermissions('October.TestCase', [
                'test.permission_four' => [
                    'label' => 'Test Permission 4',
                    'tab' => 'Test 2',
                    'order' => 400
                ]
            ]);
        });

        $tabs = $this->listTabbedPermissions($manager->listPermissions());
        $this->assertArrayHasKey('Test', $tabs);
        $this->assertArrayHasKey('Test 2', $tabs);

        $tabs1 = collect($tabs['Test'])->pluck('code')->toArray();
        $this->assertContains('test.permission_one', $tabs1);
        $this->assertContains('test.permission_two', $tabs1);

        $tabs2 = collect($tabs['Test 2'])->pluck('code')->toArray();
        $this->assertContains('test.permission_three', $tabs2);
        $this->assertContains('test.permission_four', $tabs2);
    }

    public function testRemovePermission()
    {
        $manager = $this->instance;
        $manager->removePermission('October.TestCase', 'test.permission_one');

        $permissions = $manager->listPermissions();
        $permissionCodes = collect($permissions)->pluck('code')->toArray();
        $this->assertNotContains('test.permission_one', $permissionCodes);
    }

    public function testCannotRemovePermissionsBeforeLoaded()
    {
        $this->expectException(SystemException::class);
        $this->expectExceptionMessage('Unable to remove permissions before they are loaded.');

        $manager = new RoleManager;
        $manager->removePermission('October.TestCase', 'test.permission_one');
    }

    protected function listTabbedPermissions($permissions)
    {
        $tabs = [];

        foreach ($permissions as $permission) {
            $tab = $permission->tab ?? "Misc";

            if (!array_key_exists($tab, $tabs)) {
                $tabs[$tab] = [];
            }

            $tabs[$tab][] = $permission;
        }

        return $tabs;
    }
}
