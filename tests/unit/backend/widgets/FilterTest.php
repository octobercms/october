<?php

use Backend\Widgets\Filter;
use Backend\Models\User;

class FilterTest extends TestCase
{
    public $enableFullTesting = true;

    public function testRestrictedScopeWithUserWithNoPermissions()
    {
        $user = factory(User::class)
            ->make();
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for scope email');
        $scope = $filter->getScope('email');
    }

    public function testRestrictedScopeWithUserWithWrongPermissions()
    {
        $user = factory(User::class)
            ->make([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for scope email');
        $scope = $filter->getScope('email');
    }

    public function testRestrictedScopeWithUserWithRightPermissions()
    {
        $user = factory(User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeWithUserWithRightWildcardPermissions()
    {
        $user = factory(User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $filter = new Filter(null, [
            'model' => new User,
            'arrayName' => 'array',
            'scopes' => [
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
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeWithSuperuser()
    {
        $user = factory(User::class)
            ->states('superuser')
            ->make();
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeSinglePermissionWithUserWithWrongPermissions()
    {
        $user = factory(User::class)
            ->make([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture(true);
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));

        // Expect an exception
        $this->expectException(ApplicationException::class);
        $this->expectExceptionMessage('No definition for scope email');
        $scope = $filter->getScope('email');
    }

    public function testRestrictedScopeSinglePermissionWithUserWithRightPermissions()
    {
        $user = factory(User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $filter = $this->restrictedFilterFixture(true);
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    protected function restrictedFilterFixture(bool $singlePermission = false)
    {
        return new Filter(null, [
            'model' => new User,
            'arrayName' => 'array',
            'scopes' => [
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
}
