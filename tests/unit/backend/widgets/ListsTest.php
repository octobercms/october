<?php

use Backend\Widgets\Lists;
use Illuminate\Database\Eloquent\Model;

class ListsTestModel extends Model
{

}

class ListsTest extends TestCase
{
    public function testRestrictedColumnWithUserWithNoPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make();
        $this->actingAs($user);

        $list = $this->restrictedListsFixture();

        $list->render();
        $this->assertNull($list->getColumn('testRestricted'));
    }

    public function testRestrictedColumnWithUserWithWrongPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $list = $this->restrictedListsFixture();

        $list->render();
        $this->assertNull($list->getColumn('testRestricted'));
    }

    public function testRestrictedColumnWithUserWithRightPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $list = $this->restrictedListsFixture();

        $list->render();
        $this->assertNotNull($list->getColumn('testRestricted'));
    }

    public function testRestrictedColumnWithUserWithRightWildcardPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $list = new Lists(null, [
            'model' => new ListsTestModel,
            'arrayName' => 'array',
            'columns' => [
                'testField' => [
                    'type' => 'text',
                    'label' => 'Test 1'
                ],
                'testRestricted' => [
                    'type' => 'text',
                    'label' => 'Test 2',
                    'permission' => 'test.*'
                ]
            ]
        ]);

        $list->render();
        $this->assertNotNull($list->getColumn('testRestricted'));
    }

    public function testRestrictedColumnWithSuperuser()
    {
        $user = factory(Backend\Models\User::class)
            ->states('superuser')
            ->make();
        $this->actingAs($user);

        $list = $this->restrictedListsFixture();

        $list->render();
        $this->assertNotNull($list->getColumn('testRestricted'));
    }

    public function testRestrictedColumnSinglePermissionWithUserWithWrongPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $list = $this->restrictedListsFixture(true);

        $list->render();
        $this->assertNull($list->getColumn('testRestricted'));
    }

    public function testRestrictedColumnSinglePermissionWithUserWithRightPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $list = $this->restrictedListsFixture(true);

        $list->render();
        $this->assertNotNull($list->getColumn('testRestricted'));
    }

    protected function restrictedListsFixture(bool $singlePermission = false)
    {
        return new Lists(null, [
            'model' => new ListsTestModel,
            'arrayName' => 'array',
            'columns' => [
                'testField' => [
                    'type' => 'text',
                    'label' => 'Test 1'
                ],
                'testRestricted' => [
                    'type' => 'text',
                    'label' => 'Test 2',
                    'permissions' => ($singlePermission) ? 'test.access_field' : [
                        'test.access_field'
                    ]
                ]
            ]
        ]);
    }
}
