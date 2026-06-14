<?php namespace Tailor\ContentFields;

use October\Contracts\Element\FormElement;
use October\Contracts\Element\ListElement;

/**
 * RichEditorField
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class RichEditorField extends FallbackField
{
    /**
     * defineFormField will define how a field is displayed in a form.
     */
    public function defineFormField(FormElement $form, $context = null)
    {
        $config = $this->config;

        if (isset($config['span']) && $config['span'] === 'adaptive') {
            $config['showMargins'] = true;
        }

        $form->addFormField($this->fieldName, $this->label)->useConfig($config);
    }

    /**
     * defineListColumn
     */
    public function defineListColumn(ListElement $list, $context = null)
    {
        $list->defineColumn($this->fieldName, $this->label)
            ->displayAs('summary')
            ->searchable()
            ->shortLabel($this->shortLabel)
            ->useConfig($this->column ?: [])
        ;
    }

    /**
     * extendDatabaseTable
     */
    public function extendDatabaseTable($table)
    {
        $table->mediumText($this->fieldName)->nullable();
    }
}
