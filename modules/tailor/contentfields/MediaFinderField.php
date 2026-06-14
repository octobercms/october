<?php namespace Tailor\ContentFields;

use October\Contracts\Element\FormElement;
use October\Contracts\Element\ListElement;

/**
 * MediaFinderField
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class MediaFinderField extends FallbackField
{
    /**
     * @var int|null maxItems allowed
     */
    public $maxItems;

    /**
     * defineConfig will process the field configuration.
     */
    public function defineConfig(array $config)
    {
        if (isset($config['maxItems'])) {
            $this->maxItems = (int) $config['maxItems'];
        }
    }

    /**
     * defineFormField will define how a field is displayed in a form.
     */
    public function defineFormField(FormElement $form, $context = null)
    {
        $config = $this->config;

        $form->addFormField($this->fieldName, $this->label)->useConfig($config);
    }

    /**
     * defineListColumn
     */
    public function defineListColumn(ListElement $list, $context = null)
    {
        $list->defineColumn($this->fieldName, $this->label)
            ->displayAs('image')
            ->shortLabel($this->shortLabel)
            ->useConfig($this->column ?: [])
        ;
    }

    /**
     * extendModelObject will extend the record model.
     */
    public function extendModelObject($model)
    {
        if ($this->maxItems !== 1) {
            $model->addJsonable($this->fieldName);
        }
    }

    /**
     * extendDatabaseTable
     */
    public function extendDatabaseTable($table)
    {
        $table->mediumText($this->fieldName)->nullable();
    }
}
