<?php

use Backend\Widgets\Form;
use Illuminate\Database\Eloquent\Model;
use October\Tests\Fixtures\Backend\Models\UserFixture;

class FormTestModel extends Model
{
    public function modelCustomOptionsMethod()
    {
        return ['model', 'custom', 'options'];
    }

    public function getFieldNameOnModelOptionsMethodOptions()
    {
        return ['model', 'field name', 'options method'];
    }

    public function getDropdownOptions()
    {
        return ['dropdown', 'options'];
    }

    public function staticMethodOptions()
    {
        return ['static', 'method'];
    }
}

class FormHelper
{
    public static function staticMethodOptions()
    {
        return ['static', 'method'];
    }
}

class FormTest extends PluginTestCase
{
    public function testRestrictedFieldWithUserWithNoPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user);

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithWrongPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithRightPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithRightWildcardPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

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
        $user = new UserFixture;
        $this->actingAs($user->asSuperUser());

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldSinglePermissionWithUserWithWrongPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $form = $this->restrictedFormFixture(true);

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldSinglePermissionWithUserWithRightPermissions()
    {
        $user = new UserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $form = $this->restrictedFormFixture(true);

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

    public function testOptionsGeneration()
    {
        $form = new Form(null, [
            'model' => new FormTestModel,
            'arrayName' => 'array',
            'fields' => [
                'static_method_options' => [
                    'type' => 'dropdown',
                    'options' => 'FormHelper::staticMethodOptions',
                    'expect' => ['static', 'method'],
                ],
                'callable_options' => [
                    'type' => 'dropdown',
                    'options' => [\FormHelper::class, 'staticMethodOptions'],
                    'expect' => ['static', 'method'],
                ],
                'model_method_options' => [
                    'type' => 'dropdown',
                    'options' => 'modelCustomOptionsMethod',
                    'expect' => ['model', 'custom', 'options'],
                ],
                'defined_options' => [
                    'type' => 'dropdown',
                    'options' => ['value1', 'value2'],
                    'expect' => ['value1', 'value2'],
                ],
                'defined_options_key_value' => [
                    'type' => 'dropdown',
                    'options' => [
                        'key1' => 'value1',
                        'key2' => 'value2',
                    ],
                    'expect' => [
                        'key1' => 'value1',
                        'key2' => 'value2',
                    ],
                ],
                'field_name_on_model_options_method' => [
                    'type' => 'dropdown',
                    'expect' => ['model', 'field name', 'options method'],
                ],
                'get_dropdown_options_method' => [
                    'type' => 'dropdown',
                    'expect' => ['dropdown', 'options'],
                ],
            ]
        ]);

        $form->render();

        foreach ($form->getFields() as $name => $field) {
            $this->assertEquals($field->options(), $field->config['expect']);
        }
    }

    protected function restrictedFormFixture(bool $singlePermission = false)
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
                    'permissions' => ($singlePermission) ? 'test.access_field' : [
                        'test.access_field'
                    ]
                ]
            ]
        ]);
    }
}
