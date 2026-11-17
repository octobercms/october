<?php

use Backend\Classes\FormField;
use Tailor\Classes\FieldManager;
use Tailor\ContentFields\EntriesField;
use October\Contracts\Element\FormElement;
use October\Rain\Element\Form\FieldDefinition;
use October\Rain\Element\Form\FieldsetDefinition;

/**
 * EntriesFieldTest covers how the entries content field configures the relation controller.
 */
class EntriesFieldTest extends PluginTestCase
{
    /**
     * @var bool autoMigrateTailor migrates the tailor blueprints once for the reused database
     */
    protected $autoMigrateTailor = true;

    /**
     * @var bool useTransactions isolates each test with a database transaction
     */
    protected $useTransactions = true;

    /**
     * testControllerReadOnlyIsPassedToRelationController checks a readOnly in the controller block locks the relation, as it does on a regular form field.
     */
    public function testControllerReadOnlyIsPassedToRelationController()
    {
        $field = $this->defineFormField(['displayMode' => 'controller', 'controller' => ['readOnly' => true]]);
        $this->assertTrue($field->controller['readOnly']);

        $field = $this->defineFormField(['displayMode' => 'controller', 'controller' => ['readOnly' => false]]);
        $this->assertFalse($field->controller['readOnly']);
    }

    /**
     * testFieldReadOnlyIsNotPassedToRelationController checks a field readOnly stays a display setting, as it does on a regular form field.
     */
    public function testFieldReadOnlyIsNotPassedToRelationController()
    {
        $field = $this->defineFormField(['displayMode' => 'controller', 'readOnly' => true]);

        $this->assertArrayNotHasKey('readOnly', $field->controller);
        $this->assertTrue($field->readOnly);
    }

    /**
     * defineFormField defines an entries content field on a form and returns its form field.
     */
    protected function defineFormField(array $config): FormField
    {
        $fieldset = FieldManager::instance()->makeFieldset(['fields' => [
            'authors' => $config + [
                'label' => 'Authors',
                'type' => 'entries',
                'source' => 'UnitTest\Author',
            ]
        ]]);

        $contentField = $fieldset->getField('authors');
        $this->assertInstanceOf(EntriesField::class, $contentField);

        $form = new class implements FormElement {
            public $fields = [];

            public function addFormField(string $fieldName, ?string $label = null): FieldDefinition
            {
                return $this->fields[$fieldName] = new FormField([
                    'fieldName' => $fieldName,
                    'label' => $label
                ]);
            }

            public function getFormFieldset(): FieldsetDefinition
            {
                return new FieldsetDefinition;
            }

            public function getFormContext()
            {
                return null;
            }
        };

        $contentField->defineFormField($form);

        return $form->fields['authors'];
    }
}
