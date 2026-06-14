<?php namespace Tailor\ContentFields;

use Tailor\Models\RepeaterItem;
use Tailor\Classes\ContentFieldBase;
use Tailor\Classes\Relations\CustomFieldHasManyRelation;
use October\Contracts\Element\FormElement;
use October\Contracts\Element\ListElement;
use SystemException;

/**
 * RepeaterField
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class RepeaterField extends ContentFieldBase
{
    /**
     * @var array fieldsetConfig definition
     */
    public $fieldsetConfig;

    /**
     * @var bool useGroups
     */
    protected $useGroups;

    /**
     * defineConfig will process the field configuration.
     */
    public function defineConfig(array $config)
    {
        if (isset($config['form'])) {
            $this->fieldsetConfig = (array) $config['form'];
            $this->useGroups = false;
        }

        if (isset($config['groups'])) {
            $this->fieldsetConfig = (array) $config['groups'];
            $this->useGroups = true;
        }
    }

    /**
     * validateConfig
     */
    public function validateConfig()
    {
        if ($this->fieldsetConfig === null) {
            throw new SystemException('Repeater must specify either a "form" or "group" property for the form fields');
        }
    }

    /**
     * defineFormField will define how a field is displayed in a form.
     */
    public function defineFormField(FormElement $form, $context = null)
    {
        $config = ['groupKeyFrom' => 'content_group'] + $this->getCleanFormConfig();

        $form->addFormField($this->fieldName, $this->label)->useConfig($config);
    }

    /**
     * defineBatchListColumn
     */
    public function defineBatchListColumn(ListElement $list, $context = null)
    {
        $list->defineColumn($this->fieldName, $this->label);
    }

    /**
     * getCleanFormConfig strips fields from the repeater configuration, since they
     * are provided by the RepeaterItem::defineFormFields model
     */
    protected function getCleanFormConfig(): array
    {
        $config = $this->config;

        if (isset($config['form'])) {
            $config['form']['fields'] = [];
        }
        if (isset($config['groups'])) {
            foreach ($config['groups'] as &$group) {
                $group['fields'] = [];
            }
        }

        return $config;
    }

    /**
     * extendModelObject will extend the record model.
     */
    public function extendModelObject($model)
    {
        // Define the relationship
        $relationConfig = [
            RepeaterItem::class,
            'key' => 'host_id',
            'delete' => true,
            'relationClass' => CustomFieldHasManyRelation::class
        ];

        // Add multisiteSync flag to prevent otherKey rewrite
        if ($this->translatable === 'sync') {
            $relationConfig['multisiteSync'] = true;
        }

        $model->hasMany[$this->fieldName] = $relationConfig;

        // Pass the fieldset configuration to all related instances
        $model->bindEvent('model.afterRelation', function($name, $related) use ($model) {
            if ($name === $this->fieldName) {
                $related->setBlueprintFieldConfig(
                    $model,
                    $this->getRepeaterTableName($model),
                    $this->fieldName,
                    $this->fieldsetConfig,
                    $this->useGroups
                );
            }
        });
    }

    /**
     * getRepeaterTableName
     */
    protected function getRepeaterTableName($model)
    {
        if ($model instanceof RepeaterItem) {
            return $model->getTable();
        }

        return $model->getBlueprintDefinition()->getRepeaterTableName();
    }
}
