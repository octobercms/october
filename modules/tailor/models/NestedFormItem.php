<?php namespace Tailor\Models;

use Tailor\Classes\Fieldset;
use Tailor\Classes\FieldManager;
use October\Contracts\Element\FormElement;

/**
 * NestedFormItem stores generic content serialized as JSON
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class NestedFormItem extends RepeaterItem
{
    use \October\Rain\Database\Traits\SimpleTree;

    /**
     * defineFormFields
     */
    public function defineFormFields(FormElement $host)
    {
        $this->getTabbedFieldsetDefinition()->defineAllFormFields($host);
    }

    /**
     * definePrimaryFormFields
     */
    public function definePrimaryFormFields(FormElement $host)
    {
        $this->getTabbedFieldsetDefinition('tabs')->defineAllFormFields($host);
    }

    /**
     * defineSecondaryFormFields
     */
    public function defineSecondaryFormFields(FormElement $host)
    {
        $this->getTabbedFieldsetDefinition('secondaryTabs')->defineAllFormFields($host);
    }

    /**
     * getFieldsetDefinition returns a fieldset for the selected content group.
     */
    protected function getTabbedFieldsetDefinition($section = null): Fieldset
    {
        $config = $section ? ($this->fieldsetConfig[$section] ?? []) : $this->fieldsetConfig;

        $fieldset = FieldManager::instance()->makeFieldset($config);

        $fieldset->validate();

        return $fieldset;
    }

    /**
     * getFieldsetDefinition returns a fieldset for the selected content group.
     */
    public function getFieldsetDefinition(): Fieldset
    {
        return $this->getContentFieldsetDefinition();
    }

    /**
     * getContentFieldsetDefinition returns a merged fieldset for tab sections
     */
    protected function getContentFieldsetDefinition(): Fieldset
    {
        $config = ['fields'=>[]];

        if (isset($this->fieldsetConfig['fields'])) {
            $config['fields'] += $this->fieldsetConfig['fields'];
        }

        if (isset($this->fieldsetConfig['tabs']['fields'])) {
            $config['fields'] += $this->fieldsetConfig['tabs']['fields'];
        }

        if (isset($this->fieldsetConfig['secondaryTabs']['fields'])) {
            $config['fields'] += $this->fieldsetConfig['secondaryTabs']['fields'];
        }

        return FieldManager::instance()->makeFieldset((array) $config);
    }
}
