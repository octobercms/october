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

    /**
     * Ensure that the sortable property can be represented by an array
     * of integer keys (typically be an integer enum) that control the
     * order of the results in both ASC and DESC order
     *
     * YAML example:
     *
     *     status:
     *         type: text
     *         valueFrom: status_label
     *         sortable:
     *             - 3
     *             - 1
     *             - 2
     *
     * @return void
     */
    public function testColumnSortableCanSortByArrayWithIntegerKeys()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        // Test that the records can be sorted in 'ascending' order

        $list = $this->createListFixtureIntegerKeys(false, 'asc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals([3, 4, 2, 1], $list->getColumn('id')->sortable, 'The sortable array map (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([3, 4, 2, 1], $recordIds, 'The sortable array map records (asc) do not match the one defined in the List');

        // Test that the records can be sorted in 'descending' order

        $list = $this->createListFixtureIntegerKeys(false, 'desc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals([3, 4, 2, 1], $list->getColumn('id')->sortable, 'The sortable array map (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([1, 2, 4, 3], $recordIds, 'The sortable array map records (desc) do not match the one defined in the List');
    }

    /**
     * Ensure that the sortable property can be represented by an array
     * of string keys (typically be a string enum) that control the
     * order of the results in both ASC and DESC order
     *
     * YAML example:
     *
     *     service:
     *         type: text
     *         valueFrom: service_label
     *         sortable:
     *             - local
     *             - whm
     *             - cpanel
     *
     * @return void
     */
    public function testColumnSortableCanSortByArrayWithStringKeys()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        // Test that the records can be sorted in 'ascending' order

        $list = $this->createListFixtureStringKeys('asc');
        $list->render();

        $this->assertNotNull($list->getColumn('first_name'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals(['Admin', 'Def', 'Ghi', 'Abc'], $list->getColumn('first_name')->sortable, 'The sortable array map (asc) does not match the one defined in the List');

        $recordNames = $list->vars['records']->pluck('first_name')->toArray();
        $this->assertEquals(['Admin', 'Def', 'Ghi', 'Abc'], $recordNames, 'The sortable array map records (asc) do not match the one defined in the List');

        // Test that the records can be sorted in 'descending' order

        $list = $this->createListFixtureStringKeys('desc');
        $list->render();

        $this->assertNotNull($list->getColumn('first_name'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals(['Admin', 'Def', 'Ghi', 'Abc'], $list->getColumn('first_name')->sortable, 'The sortable array map (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('first_name')->toArray();
        $this->assertEquals(['Abc', 'Ghi', 'Def', 'Admin'], $recordIds, 'The sortable array map records (desc) do not match the one defined in the List');
    }

    /**
     * Ensure that the sortable property can be represented by a model
     * callback that returns an array of integer keys that control the
     * order of the results in both ASC and DESC order
     *
     * Model example (Order model):
     *
     *     public function sortOrderStatusField(Builder $query)
     *     {
     *         return [OrderStatus::PENDING, OrderStatus::PROCESSING, OrderStatus::DISPATCHED, OrderStatus::COMPLETED];
     *     }
     *
     * @return void
     */
    public function testColumnSortableCanSortByMethodWithArrayResponse()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        User::extend(function ($user) {
            $user->addDynamicMethod('sortIdField', function ($query, $listColumn) use ($user) {
                return [2, 3, 1, 4];
            });
        });

        // Test that the records can be sorted in 'ascending' order

        $list = $this->createListFixtureIntegerKeys(true, 'asc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals('sortIdField', $list->getColumn('id')->sortable, 'The sortable method callback (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([2, 3, 1, 4], $recordIds, 'The sortable method callback records (asc) do not match the one defined in the List');

        // Test that the records can be sorted in 'descending' order

        $list = $this->createListFixtureIntegerKeys(true, 'desc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals('sortIdField', $list->getColumn('id')->sortable, 'The sortable method callback (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([4, 1, 3, 2], $recordIds, 'The sortable method callback records (desc) do not match the one defined in the List');
    }

    /**
     * Ensure that the sortable property can be represented by a model
     * callback that returns an SQL query string that controls the
     * order of the results in both ASC and DESC order.
     *
     * Model example (Order model):
     *
     *     public function sortOrderStatusField(Builder $query)
     *     {
     *         return 'CASE WHEN id = 2 THEN 1 WHEN id = 1 THEN 2 WHEN id = 4 THEN 3 WHEN id = 3 THEN 4 END';
     *     }
     *
     * @return void
     */
    public function testColumnSortableCanSortByMethodWithQueryStringResponse()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        User::extend(function ($user) {
            $user->addDynamicMethod('sortIdField', function ($query, $listColumn) use ($user) {
                // same as: return [2, 1, 4, 3];
                return 'CASE WHEN id = 2 THEN 1 WHEN id = 1 THEN 2 WHEN id = 4 THEN 3 WHEN id = 3 THEN 4 END';
            });
        });

        // Test that the records can be sorted in 'ascending' order

        $list = $this->createListFixtureIntegerKeys(true, 'asc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals('sortIdField', $list->getColumn('id')->sortable, 'The sortable method callback (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();

        $this->assertEquals([2, 1, 4, 3], $recordIds, 'The sortable method callback records (asc) do not match the one defined in the List');

        // Test that the records can be sorted in 'descending' order (which should be manually specified by the developer in the string)

        User::extend(function ($user) {
            $user->addDynamicMethod('sortIdField', function ($query, $listColumn) use ($user) {
                // same as: return [2, 1, 4, 3];
                return 'CASE WHEN id = 2 THEN 1 WHEN id = 1 THEN 2 WHEN id = 4 THEN 3 WHEN id = 3 THEN 4 END DESC';
            });
        });

        $list = $this->createListFixtureIntegerKeys(true, 'desc');
        $list->render();

        $this->assertNotNull($list->getColumn('id'));
        $this->assertNotNull($list->getColumn('email'));

        $this->assertEquals('sortIdField', $list->getColumn('id')->sortable, 'The sortable method callback (asc) does not match the one defined in the List');

        $recordIds = $list->vars['records']->pluck('id')->toArray();
        $this->assertEquals([3, 4, 1, 2], $recordIds, 'The sortable method callback records (desc) do not match the one defined in the List');
    }

    /**
     * Several of these test require multiple entities with custom sorting of the IDs using a custom map.
     * This mimicks the real-use of an integer Enum field.
     *
     * The list returned will either have a hard-defined map of integer values ($method === true) or a
     * callback against the User method called sortIdField ($method === false).
     *
     * The list returned will be ASC order by default unless specified (via $sortDirection)
     *
     * @param boolean $method
     * @param string $sortDirection
     * @return Lists
     */
    protected function createListFixtureIntegerKeys(bool $method = false, string $sortDirection = 'asc')
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

    /**
     * One of the above tests will need multiple entities with custom sorting of the first name field.
     * This mimicks the real-use of an string Enum field.
     *
     * The list returned will have a hard-defined map of first name values. No method callback needs
     * to be tested here.
     *
     * The list returned will be ASC order by default unless specified (via $sortDirection)
     *
     * @param string $sortDirection
     * @return Lists
     */
    protected function createListFixtureStringKeys(string $sortDirection = 'asc')
    {
        User::firstOrCreate([
            'id' => 2,
        ], [
            'first_name' => 'Abc',
            'last_name' => 'Person',
            'login' => 'testperson',
            'email' => 'test@person.org',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        User::firstOrCreate([
            'id' => 3,
        ], [
            'first_name' => 'Def',
            'last_name' => 'Person',
            'login' => 'fooperson',
            'email' => 'foo@person.org',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        User::firstOrCreate([
            'id' => 4,
        ], [
            'first_name' => 'Ghi',
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
                ],
                'first_name' => [
                    'label' => 'First Name',
                    'type' => 'text',
                    'sortable' => [
                        'Admin',
                        'Def',
                        'Ghi',
                        'Abc',
                    ],
                ],
                'email' => [
                    'type' => 'text',
                    'label' => 'Email',
                ],
            ],
            'defaultSort' => [
                'column' => 'first_name',
                'direction' => $sortDirection,
            ],
        ]);
    }
}
