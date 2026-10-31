<?php

use Backend\Classes\Controller;
use Backend\Classes\FormField;
use Backend\Classes\FormWidgetBase;
use Backend\FormWidgets\Relation;
use Backend\FormWidgets\RecordFinder;
use Tailor\Classes\FieldManager;
use Tailor\ContentFields\RecordFinderField;
use October\Contracts\Element\FormElement;
use October\Contracts\Element\FilterElement;
use October\Rain\Element\Filter\ScopeDefinition;
use October\Rain\Element\Form\FieldDefinition;
use October\Rain\Element\Form\FieldsetDefinition;

/**
 * RecordFinderFieldTest covers how the recordfinder content field configures its filter scope and form widget.
 */
class RecordFinderFieldTest extends TestCase
{
    /**
     * testFilterScopeUsesConfiguredNameFrom checks the filter scope displays the configured nameFrom column, defaulting to title.
     */
    public function testFilterScopeUsesConfiguredNameFrom()
    {
        $scope = $this->defineFilterScope(['nameFrom' => 'login']);
        $this->assertSame('login', $scope->nameFrom);

        $scope = $this->defineFilterScope([]);
        $this->assertSame('title', $scope->nameFrom);

        // The scope config takes priority over the field config
        $scope = $this->defineFilterScope(['nameFrom' => 'login', 'scope' => ['nameFrom' => 'email']]);
        $this->assertSame('email', $scope->nameFrom);
    }

    /**
     * testFilterScopeConfigIsNotPassedToFormWidget checks the filter scope config does not become the form widget model scope.
     */
    public function testFilterScopeConfigIsNotPassedToFormWidget()
    {
        $widget = $this->makeFormWidget(['maxItems' => 1, 'scope' => ['label' => 'Filter Label']]);
        $this->assertInstanceOf(RecordFinder::class, $widget);
        $this->assertNull($widget->modelScope);

        $widget = $this->makeFormWidget(['maxItems' => 1, 'scope' => false]);
        $this->assertNull($widget->modelScope);

        // Multiple items display as a relation widget
        $widget = $this->makeFormWidget(['scope' => ['label' => 'Filter Label']]);
        $this->assertInstanceOf(Relation::class, $widget);
        $this->assertNull($widget->modelScope);
    }

    /**
     * testModelScopeIsPassedToFormWidget checks a configured modelScope reaches the form widget alongside a filter scope.
     */
    public function testModelScopeIsPassedToFormWidget()
    {
        $config = ['modelScope' => 'applyActive', 'scope' => ['label' => 'Filter Label']];

        $widget = $this->makeFormWidget(['maxItems' => 1] + $config);
        $this->assertInstanceOf(RecordFinder::class, $widget);
        $this->assertSame('applyActive', $widget->modelScope);

        $widget = $this->makeFormWidget($config);
        $this->assertInstanceOf(Relation::class, $widget);
        $this->assertSame('applyActive', $widget->modelScope);

        // A scope method name is not a filter config, so the widget still reads it as a model scope
        $widget = $this->makeFormWidget(['maxItems' => 1, 'scope' => 'applyActive']);
        $this->assertSame('applyActive', $widget->modelScope);
    }

    /**
     * makeContentField returns a recordfinder content field for a model without a title column.
     */
    protected function makeContentField(array $config): RecordFinderField
    {
        $fieldset = FieldManager::instance()->makeFieldset(['fields' => [
            'author' => $config + [
                'label' => 'Author',
                'type' => 'recordfinder',
                'modelClass' => \Backend\Models\User::class,
                'list' => '~/modules/backend/models/user/columns.yaml',
            ]
        ]]);

        $field = $fieldset->getField('author');
        $this->assertInstanceOf(RecordFinderField::class, $field);

        return $field;
    }

    /**
     * defineFilterScope defines the content field on a filter and returns its scope definition.
     */
    protected function defineFilterScope(array $config): ScopeDefinition
    {
        $filter = new class implements FilterElement {
            public $scopes = [];

            public function defineScope(string $scopeName, ?string $label = null): ScopeDefinition
            {
                return $this->scopes[$scopeName] = new ScopeDefinition([
                    'scopeName' => $scopeName,
                    'label' => $label
                ]);
            }
        };

        $this->makeContentField($config)->defineFilterScope($filter);

        return $filter->scopes['author'];
    }

    /**
     * makeFormWidget defines the content field on a form and returns the form widget that displays it.
     */
    protected function makeFormWidget(array $config): FormWidgetBase
    {
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

        $this->makeContentField($config)->defineFormField($form);

        $formField = $form->fields['author'];
        $widgetClass = $formField->type === 'recordfinder' ? RecordFinder::class : Relation::class;

        return new $widgetClass(new Controller, $formField, $formField->config);
    }
}
