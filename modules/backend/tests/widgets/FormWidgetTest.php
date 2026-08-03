<?php

use Backend\Widgets\Form;
use Illuminate\Database\Eloquent\Model;

require_once __DIR__.'/../fixtures/models/BackendUserFixture.php';

class FormTestModel extends Model
{

}

class FormWidgetTest extends PluginTestCase
{
    public function testCleanSaveDataInternal()
    {
        $form = new Form(null, [
            'model' => new FormTestModel,
            'fields' => [
                'name' => [
                    'label' => 'Author Name',
                    'commentAbove' => 'Text field, inside a popup.',
                ],
                'post[name]' => [
                    'comment' => 'This Comment belongs to the Post selected above.',
                    'disabled' => true
                ]
            ]
        ]);

        self::callProtectedMethod($form, 'defineFormFields');

        $data = self::callProtectedMethod($form, 'cleanSaveDataInternal', [[
            'name' => 'First Level',
            'post' => ['name' => 'Second Level']
        ]]);

        $this->assertEquals([
            'name' => 'First Level',
            'post' => []
        ], $data);

       $data = self::callProtectedMethod($form, 'cleanSaveDataInternal', [[
            'name' => 'First Level'
        ]]);

        $this->assertEquals([
            'name' => 'First Level'
        ], $data);
    }

    public function testRestrictedFieldWithUserWithNoPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user);

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithWrongPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithRightPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldWithUserWithRightWildcardPermissions()
    {
        $user = new BackendUserFixture;
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
        $user = new BackendUserFixture;
        $this->actingAs($user->asSuperUser());

        $form = $this->restrictedFormFixture();

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldSinglePermissionWithUserWithWrongPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.wrong_permission', true));

        $form = $this->restrictedFormFixture(true);

        $form->render();
        $this->assertNull($form->getField('testRestricted'));
    }

    public function testRestrictedFieldSinglePermissionWithUserWithRightPermissions()
    {
        $user = new BackendUserFixture;
        $this->actingAs($user->withPermission('test.access_field', true));

        $form = $this->restrictedFormFixture(true);

        $form->render();
        $this->assertNotNull($form->getField('testRestricted'));
    }

    public function testValuePopulateOptOut()
    {
        $model = new FormTestModel;
        $model->name = 'Acme Author';

        $form = new Form(null, [
            'model' => $model,
            'fields' => [
                'name' => [
                    'label' => 'Author Name'
                ],
                'nameCopy' => [
                    'label' => 'Author Name Copy',
                    'valueFrom' => 'name',
                    'valuePopulate' => false
                ]
            ]
        ]);

        self::callProtectedMethod($form, 'defineFormFields');

        $this->assertEquals('Acme Author', $form->getField('name')->value);
        $this->assertNull($form->getField('nameCopy')->value);
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
