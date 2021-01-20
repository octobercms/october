<?php

use Backend\Models\User;
use Backend\Models\UserRole;
use Backend\Widgets\Lists;
use October\Rain\Exception\ApplicationException;
use October\Tests\Fixtures\Backend\Models\UserFixture;

class ListsTest extends PluginTestCase
{
    public function testRestrictedColumnWithUserWithNoPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for column email');
        $column = $list->getColumn('email');
    }

    public function testRestrictedColumnWithUserWithWrongPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for column email');
        $column = $list->getColumn('email');
    }

    public function testRestrictedColumnWithUserWithRightPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testRestrictedColumnWithUserWithRightWildcardPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $list = new Lists(null, [
            'model' => new User,
            'arrayName' => 'array',
            'columns' => [
                'id' => [
                    'type' => 'text',
                    'label' => 'ID'
                ],
                'email' => [
                    'type' => 'text',
                    'label' => 'Email',
                    'permission' => 'test.*'
                ]
            ]
        ]);
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testRestrictedColumnWithSuperuser()
    {
        $user = new UserFixture;
        $this->actingAs($user->asSuperUser());

        $list = $this->restrictedListsFixture();
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testRestrictedColumnSinglePermissionWithUserWithWrongPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $list = $this->restrictedListsFixture(true);
        $list->render();

        $this->assertNotNull($list->getColumn('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for column email');
        $column = $list->getColumn('email');
    }

    public function testRestrictedColumnSinglePermissionWithUserWithRightPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $list = $this->restrictedListsFixture(true);
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));
    }

    public function testSelectableColumnType()
    {
        $user = new UserFixture;
        $this->actingAs($user->asSuperUser());
        $developerRole = UserRole::where('name', 'Developer')->first();
        $user->role()->associate($developerRole);

        $list = $this->restrictedListsFixture(true);
        $list->render();

        $selectableColumn = $list->getColumn('role_id');

        // Test if the type is set to selectable
        $this->assertEquals($selectableColumn->type, 'selectable');

        // Test if the value is processed correctly
        $this->assertEquals($list->getColumnValueRaw($user, $selectableColumn), $developerRole->id);
        $this->assertEquals($list->getColumnValue($user, $selectableColumn), 'Developer');
    }

    protected function restrictedListsFixture(bool $singlePermission = false)
    {
        return new Lists(null, [
            'model' => new UserFixture,
            'arrayName' => 'array',
            'columns' => [
                'id' => [
                    'type' => 'text',
                    'label' => 'ID'
                ],
                'email' => [
                    'type' => 'text',
                    'label' => 'Email',
                    'permissions' => ($singlePermission) ? 'test.access_field' : [
                        'test.access_field'
                    ]
                ],
                'role_id' => [
                    'type' => 'selectable',
                    'label' => 'Role',
                    'options' => UserRole::all()->pluck('name', 'id')->toArray()
                ]
            ]
        ]);
    }
}
