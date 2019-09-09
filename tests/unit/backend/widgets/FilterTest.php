<?php

use Backend\Widgets\Filter;
use Illuminate\Database\Eloquent\Model;

class FilterTestModel extends Model
{

}

class FilterTest extends TestCase
{
    public function testRestrictedScopeWithUserWithNoPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make();
        $this->actingAs($user);

        $form = $this->restrictedFilterFixture();

        $form->render();
        $this->assertNull($form->getScope('testRestricted'));
    }

    public function testRestrictedScopeWithUserWithWrongPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = $this->restrictedFilterFixture();

        $form->render();
        $this->assertNull($form->getScope('testRestricted'));
    }

    public function testRestrictedScopeWithUserWithRightPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = $this->restrictedFilterFixture();

        $form->render();
        $this->assertNotNull($form->getScope('testRestricted'));
    }

    public function testRestrictedScopeWithUserWithRightWildcardPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = new Filter(null, [
            'model' => new FilterTestModel,
            'arrayName' => 'array',
            'scopes' => [
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

        $form->render();
        $this->assertNotNull($form->getScope('testRestricted'));
    }

    public function testRestrictedScopeWithSuperuser()
    {
        $user = factory(Backend\Models\User::class)
            ->states('superuser')
            ->make();
        $this->actingAs($user);

        $form = $this->restrictedFilterFixture();

        $form->render();
        $this->assertNotNull($form->getScope('testRestricted'));
    }

    public function testRestrictedScopeSinglePermissionWithUserWithWrongPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = $this->restrictedFilterFixture(true);

        $form->render();
        $this->assertNull($form->getScope('testRestricted'));
    }

    public function testRestrictedScopeSinglePermissionWithUserWithRightPermissions()
    {
        $user = factory(Backend\Models\User::class)
            ->make([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = $this->restrictedFilterFixture(true);

        $form->render();
        $this->assertNotNull($form->getScope('testRestricted'));
    }

    protected function restrictedFilterFixture(bool $singlePermission = false)
    {
        return new Filter(null, [
            'model' => new FilterTestModel,
            'arrayName' => 'array',
            'scopes' => [
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
