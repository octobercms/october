<?php

use Backend\Widgets\Form;
use Illuminate\Database\Eloquent\Model;

class FormTestModel extends Model
{

}

class FormTest extends TestCase
{
    public function testRestrictedFieldWithUserWithNoPermissions()
    {
        // Act as a super user
        $user = factory(Backend\Models\User::class)
            ->create();
        $this->actingAs($user);

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithWrongPermissions()
    {
        // Act as a super user
        $user = factory(Backend\Models\User::class)
            ->create([
                'permissions' => [
                    'test.wrong_permission' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithRightPermissions()
    {
        // Act as a super user
        $user = factory(Backend\Models\User::class)
            ->create([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithRightWildcardPermissions()
    {
        // Act as a super user
        $user = factory(Backend\Models\User::class)
            ->create([
                'permissions' => [
                    'test.access_field' => 1
                ]
            ]);
        $this->actingAs($user);

        $form = new Form(null, [
            'model' => new FormTestModel,
            'arrayName' => 'array',
            'fields' => [
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
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithSuperuser()
    {
        // Act as a super user
        $user = factory(Backend\Models\User::class)
            ->states('superuser')
            ->create();
        $this->actingAs($user);

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testCheckboxlistTrigger()
    {
        $form = new Form(null, [
            'model' => new FormTestModel,
            'arrayName' => 'array',
            'fields' => [
                'trigger' => [
                    'type' => 'checkboxlist',
                    'options' => [
                        '1' => 'Value One'
                    ]
                ],
                'triggered' => [
                    'type' => 'text',
                    'trigger' => [
                        'field' => 'trigger[]',
                        'action' => 'show',
                        'condition' => 'value[1]'
                    ]
                ]
            ]
        ]);

        $form->render();

        $attributes = $form->getField('triggered')->getAttributes('container', false);
        $this->assertEquals('[name="array[trigger][]"]', array_get($attributes, 'data-trigger'));
    }

    protected function restrictedFormFixture()
    {
        return new Form(null, [
            'model' => new FormTestModel,
            'arrayName' => 'array',
            'fields' => [
                'testField' => [
                    'type' => 'text',
                    'label' => 'Test 1'
                ],
                'testRestricted' => [
                    'type' => 'text',
                    'label' => 'Test 2',
                    'permission' => 'test.access_field'
                ]
            ]
        ]);
    }
}
