<?php

use Backend\Models\User;
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

    protected function restrictedListsFixture(bool $singlePermission = false)
    {
        return new Lists(null, [
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
                    'permissions' => ($singlePermission) ? 'test.access_field' : [
                        'test.access_field'
                    ]
                ]
            ]
        ]);
    }

    public function testColumnSortableArrayOverride()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        // Test that the records can be sorted in 'ascending' order

        $list = $this->sortableListsFixture(false, 'asc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals([3, 4, 2, 1], $list->getColumn('id')->sortable, 'The sortable array map (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([3, 4, 2, 1], $recordIds, 'The sortable array map records (asc) do not match the one defined in the List');

        // Test that the records can be sorted in 'descending' order

        $list = $this->sortableListsFixture(false, 'desc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals([3, 4, 2, 1], $list->getColumn('id')->sortable, 'The sortable array map (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([1, 2, 4, 3], $recordIds, 'The sortable array map records (desc) do not match the one defined in the List');
    }

    public function testColumnSortableMethodOverrideReturnMap()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        User::extend(function ($user) {
            $user->addDynamicMethod('sortIdField', function ($query, $listColumn) use ($user) {
                return [2, 3, 1, 4];
            });
        });

        // Test that the records can be sorted in 'ascending' order

        $list = $this->sortableListsFixture(true, 'asc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals('sortIdField', $list->getColumn('id')->sortable, 'The sortable method callback (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([2, 3, 1, 4], $recordIds, 'The sortable method callback records (asc) do not match the one defined in the List');

        // Test that the records can be sorted in 'descending' order

        $list = $this->sortableListsFixture(true, 'desc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals('sortIdField', $list->getColumn('id')->sortable, 'The sortable method callback (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([4, 1, 3, 2], $recordIds, 'The sortable method callback records (desc) do not match the one defined in the List');
    }

    protected function sortableListsFixture(bool $method = false, string $sortDirection = 'asc')
    {
        User::firstOrCreate([
            'id' => 2,
        ], [
            'first_name' => 'Test',
            'last_name' => 'Person',
            'login' => 'testperson',
            'email' => 'test@person.org',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        User::firstOrCreate([
            'id' => 3,
        ], [
            'first_name' => 'Foo',
            'last_name' => 'Person',
            'login' => 'fooperson',
            'email' => 'foo@person.org',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        User::firstOrCreate([
            'id' => 4,
        ], [
            'first_name' => 'Bar',
            'last_name' => 'Person',
            'login' => 'barperson',
            'email' => 'bar@person.org',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        return new Lists(null, [
            'model' => new User,
            'arrayName' => 'array',
            'columns' => [
                'id' => [
                    'type' => 'text',
                    'label' => 'ID',
                    'sortable' => ($method) ? 'sortIdField' : [
                        3,
                        4,
                        2,
                        1,
                    ],
                ],
                'email' => [
                    'type' => 'text',
                    'label' => 'Email',
                ],
            ],
            'defaultSort' => [
                'column' => 'id',
                'direction' => $sortDirection,
            ],
        ]);
    }
}
