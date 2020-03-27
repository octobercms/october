<?php

use Backend\Widgets\Filter;
use Backend\Models\User;
use October\Tests\Fixtures\Backend\Models\UserFixture;

class FilterTest extends PluginTestCase
{
    public function testRestrictedScopeWithUserWithNoPermissions()
    {
        $user = new UserFixture;
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
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

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
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeWithUserWithRightWildcardPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

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
        $user = new UserFixture;
        $this->actingAs($user->asSuperUser());

        $filter = $this->restrictedFilterFixture();
        $filter->render();

        $this->assertNotNull($filter->getScope('id'));
        $this->assertNotNull($filter->getScope('email'));
    }

    public function testRestrictedScopeSinglePermissionWithUserWithWrongPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

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
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

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
