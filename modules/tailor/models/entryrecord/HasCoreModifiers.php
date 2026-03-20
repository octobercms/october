<?php namespace Tailor\Models\EntryRecord;

use October\Contracts\Element\ListElement;
use October\Contracts\Element\FormElement;
use October\Contracts\Element\FilterElement;

/**
 * HasCoreModifiers modifies specific field properties to core fields,
 * which are fields not defined in a blueprint
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasCoreModifiers
{
    /**
     * applyCoreFieldModifiers will transfer modified attributes from the blueprint
     * to the core field definition. For example, the title placeholder value or
     * the is_enabled default state.
     */
    protected function applyCoreFieldModifiers(FormElement $host)
    {
        $toTransfer = [
            'column',
            'comment',
            'commentAbove',
            'commentHtml',
            'default',
            'dependsOn',
            'hidden',
            'label',
            'placeholder',
            'readOnly',
            'scope',
        ];

        // To remove from validation rules when hidden
        $toInvalidate = [
            'title',
            'slug',
        ];

        $fieldset = $this->getFieldsetDefinition();
        $formFields = $host->getFormFieldset();

        foreach ($formFields->getAllFields() as $name => $field) {
            if ($modifier = $fieldset->getField($name)) {
                $field->useConfig(array_only($modifier->getConfig(), $toTransfer));
            }

            // Remove required validation for title field
            if (in_array($name, $toInvalidate) && $field->hidden) {
                unset($this->rules[$name]);
            }
        }
    }

    /**
     * applyCoreColumnModifiers will transfer modified attributes from the blueprint
     * to the core column definition. For example, the title column.
     */
    protected function applyCoreColumnModifiers(ListElement $host)
    {
        $coreColumns = [
            'id',
            'title',
            'slug',
            'fullslug',
            'entry_type_name',
            'published_at_date',
            'status_code',
            'created_at',
            'updated_at',
            'created_user',
            'updated_user',
        ];

        $toTransfer = [
            'label',
            'shortLabel',
            'valueFrom',
            'invisible',
            'hidden'
        ];

        $fieldset = $this->getFieldsetDefinition();
        $listColumns = $host->getColumns();

        foreach ($coreColumns as $columnName) {
            $column = $listColumns[$columnName] ?? null;
            $field = $fieldset->getField($columnName);

            // Checking the external scopes definition is needed for core fields
            // since they are not in the fieldset and not defined in the blueprint
            $modifier = $field ? $field->column : ($fieldset->columns[$columnName] ?? null);
            if (!$column || $modifier === null) {
                continue;
            }

            if (is_array($modifier)) {
                $column->useConfig(array_only($modifier, $toTransfer));
            }
            elseif (is_string($modifier)) {
                $column->$modifier();
            }
            elseif (($field && $field->hidden) || $modifier === false) {
                $column->hidden();
            }
        }
    }

    /**
     * applyCoreScopeModifiers will transfer modified attributes from the blueprint
     * to the core scope definition. For example, the published_at_date scope.
     */
    protected function applyCoreScopeModifiers(FilterElement $host)
    {
        $coreScopes = [
            'published_at_date',
            'status_code',
        ];

        $toTransfer = [
            'label',
            'hidden'
        ];

        $fieldset = $this->getFieldsetDefinition();
        $filterScopes = $host->getScopes();

        foreach ($coreScopes as $scopeName) {
            $scope = $filterScopes[$scopeName] ?? null;
            $field = $fieldset->getField($scopeName);

            // Checking the external scopes definition is needed for core fields
            // since they are not in the fieldset and not defined in the blueprint
            $modifier = $field ? $field->scope : ($fieldset->scopes[$scopeName] ?? null);
            if (!$scope || $modifier === null) {
                continue;
            }

            if (is_array($modifier)) {
                $scope->useConfig(array_only($modifier, $toTransfer));
            }
            elseif (is_string($modifier)) {
                $scope->$modifier();
            }
            elseif (($field && $field->hidden) || $modifier === false) {
                $scope->hidden();
            }
        }
    }
}
