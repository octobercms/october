<?php namespace Tailor\Classes;

use Db;
use October\Contracts\Element\ListElement;
use October\Contracts\Element\FormElement;
use October\Contracts\Element\FilterElement;
use October\Rain\Element\Form\FieldDefinition;
use October\Rain\Element\Form\FieldsetDefinition;
use October\Rain\Database\Schema\Blueprint as DbBlueprint;
use SystemException;

/**
 * Fieldset definition is a group of fields and can come from various sources
 *
 * @method Fieldset contentUuid(string $contentUuid) contentUuid
 * @method Fieldset name(string $name) name
 * @method Fieldset handle(string $handle) handle
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class Fieldset extends FieldsetDefinition
{
    /**
     * @var array fieldsWithContext captures fields that use context
     */
    protected $fieldsWithContext = [];

    /**
     * addField to the fieldset collection, with context support
     */
    public function addField($name, FieldDefinition $field)
    {
        if (strpos($name, '@') !== false) {
            [$name, $context] = explode('@', $name, 2);
            $field->fieldName($name);
            $field->context($context);
            $this->fieldsWithContext[$context][$name] = $field;
        }

        // Take first field as core definition
        if (isset($this->fields[$name])) {
            return;
        }

        parent::addField($name, $field);
    }

    /**
     * getFieldInContext checks if a field exists within a given context
     */
    public function getFieldInContext($name, $context)
    {
        return $this->fieldsWithContext[$context][$name] ?? null;
    }

    /**
     * validate all the fields
     */
    public function validate()
    {
        foreach ($this->getAllFields() as $field) {
            $field->validate();
        }
    }

    /**
     * applyModelExtensions
     */
    public function applyModelExtensions($model, $context = null)
    {
        if (!$model) {
            throw new SystemException('Cannot extend an empty model.');
        }

        $fillable = [];

        foreach ($this->getAllFields() as $field) {
            if (in_array($context, ['export', 'import'])) {
                $field->extendBatchModelObject($model);
            }
            else {
                $field->extendModel($model);
            }

            if ($field->guarded !== true) {
                $fillable[] = $field->fieldName;
            }
        }

        if ($fillable) {
            $model->addFillable($fillable);
        }
    }

    /**
     * applyModelExtensions
     */
    public function applyBatchModelExtensions($model)
    {
    }

    /**
     * defineAllFormFields
     */
    public function defineAllFormFields(FormElement $form, $options = [])
    {
        extract(array_merge([
            'context' => null,
            'except' => []
        ], $options));

        // Set the default tab
        $form->getFormFieldset()->defaultTab('Content');

        // Define the fields
        foreach ($this->getAllFields() as $field) {
            if (in_array($field->fieldName, $except)) {
                continue;
            }

            if ($contextField = $this->getFieldInContext($field->fieldName, $context)) {
                $field = $contextField;
            }

            if (!$field->matchesContext($context)) {
                continue;
            }

            $field->defineFormField($form, $context);
        }
    }

    /**
     * defineAllListColumns
     */
    public function defineAllListColumns(ListElement $list, $options = [])
    {
        extract(array_merge([
            'context' => null,
            'except' => []
        ], $options));

        foreach ($this->getAllFields() as $field) {
            if (in_array($field->fieldName, $except)) {
                continue;
            }

            if ($field->column === 'invisible') {
                $field->column = ['invisible' => true];
            }

            if ($field->column !== false) {
                if (in_array($context, ['export', 'import'])) {
                    $field->defineBatchListColumn($list, $context);
                }
                else {
                    $field->defineListColumn($list, $context);
                }
            }
        }
    }

    /**
     * defineAllFilterScopes
     */
    public function defineAllFilterScopes(FilterElement $filter, $options = [])
    {
        extract(array_merge([
            'context' => null,
            'except' => []
        ], $options));

        foreach ($this->getAllFields() as $field) {
            if (in_array($field->fieldName, $except)) {
                continue;
            }

            if ($field->scope !== false) {
                $field->defineFilterScope($filter, $context);
            }
        }
    }

    /**
     * getContentColumnNames spins over every field to determine the actual column
     * names that it uses in the database, as opposed to its field name
     */
    public function getContentColumnNames()
    {
        $columnNames = [];

        // Lazy load the grammar
        Db::connection()->getSchemaBuilder();

        $table = new DbBlueprint(Db::connection(), 'temp');
        foreach ($this->getAllFields() as $name => $fieldObj) {
            if (!str_starts_with($name, '_')) {
                $fieldObj->extendDatabaseTable($table);
            }
        }

        foreach ($table->getColumns() as $column) {
            if (isset($column['name'])) {
                $columnNames[] = $column['name'];
            }
        }

        return $columnNames;
    }
}
