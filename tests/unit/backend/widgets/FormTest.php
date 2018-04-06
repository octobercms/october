<?php

use Backend\Widgets\Form;
use Illuminate\Database\Eloquent\Model;

class FormTestModel extends Model
{

}

class FormTest extends TestCase
{
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
}
