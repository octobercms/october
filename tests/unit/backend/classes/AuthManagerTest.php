<?php
use Backend\Classes\AuthManager;
use October\Rain\Exception\SystemException;

class AuthManagerTest extends TestCase
{
    public function setUp()
    {
        $this->createApplication();

        $this->instance = AuthManager::instance();
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

    public function tearDown()
    {
        AuthManager::forgetInstance();
    }

    public function testListPermissions()
    {
        $permissions = $this->instance->listPermissions();
        $this->assertCount(2, $permissions);
        $this->assertEquals([
            'test.permission_one',
            'test.permission_two'
        ], collect($permissions)->pluck('code')->toArray());
    }

    public function testRegisterPermissions()
    {
        $this->instance->registerPermissions('October.TestCase', [
            'test.permission_three' => [
                'label' => 'Test Permission 3',
                'tab' => 'Test',
                'order' => 100
            ]
        ]);

        $permissions = $this->instance->listPermissions();
        $this->assertCount(3, $permissions);
        $this->assertEquals([
            'test.permission_three',
            'test.permission_one',
            'test.permission_two'
        ], collect($permissions)->pluck('code')->toArray());
    }

    public function testRegisterPermissionsThroughCallbacks()
    {
        // Callback one
        $this->instance->registerCallback(function ($manager) {
            $manager->registerPermissions('October.TestCase', [
                'test.permission_three' => [
                    'label' => 'Test Permission 3',
                    'tab' => 'Test',
                    'order' => 100
                ]
            ]);
        });

        // Callback two
        $this->instance->registerCallback(function ($manager) {
            $manager->registerPermissions('October.TestCase', [
                'test.permission_four' => [
                    'label' => 'Test Permission 4',
                    'tab' => 'Test',
                    'order' => 400
                ]
            ]);
        });

        $permissions = $this->instance->listPermissions();
        $this->assertCount(4, $permissions);
        $this->assertEquals([
            'test.permission_three',
            'test.permission_one',
            'test.permission_two',
            'test.permission_four'
        ], collect($permissions)->pluck('code')->toArray());
    }

    public function testRegisterAdditionalTab()
    {
        $this->instance->registerPermissions('October.TestCase', [
            'test.permission_three' => [
                'label' => 'Test Permission 3',
                'tab' => 'Test 2',
                'order' => 100
            ]
        ]);

        $this->instance->registerCallback(function ($manager) {
            $manager->registerPermissions('October.TestCase', [
                'test.permission_four' => [
                    'label' => 'Test Permission 4',
                    'tab' => 'Test 2',
                    'order' => 400
                ]
            ]);
        });

        $tabs = $this->instance->listTabbedPermissions();
        $this->assertCount(2, $tabs);
        $this->assertEquals([
            'Test 2',
            'Test'
        ], array_keys($tabs));
        $this->assertEquals([
            'test.permission_three',
            'test.permission_four'
        ], collect($tabs['Test 2'])->pluck('code')->toArray());
        $this->assertEquals([
            'test.permission_one',
            'test.permission_two',
        ], collect($tabs['Test'])->pluck('code')->toArray());
    }

    public function testRemovePermission()
    {
        $this->instance->removePermission('October.TestCase', 'test.permission_one');

        $permissions = $this->instance->listPermissions();
        $this->assertCount(1, $permissions);
        $this->assertEquals([
            'test.permission_two'
        ], collect($permissions)->pluck('code')->toArray());
    }

    public function testCannotRemovePermissionsBeforeLoaded()
    {
        $this->expectException(SystemException::class);
        $this->expectExceptionMessage('Unable to remove permissions before they are loaded.');

        AuthManager::forgetInstance();
        $this->instance = AuthManager::instance();
        $this->instance->removePermission('October.TestCase', 'test.permission_one');
    }
}
