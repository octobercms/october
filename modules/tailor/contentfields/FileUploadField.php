<?php namespace Tailor\ContentFields;

use October\Contracts\Element\FormElement;
use October\Contracts\Element\ListElement;

/**
 * FileUploadField
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class FileUploadField extends FallbackField
{
    /**
     * @var int|null maxItems allowed
     */
    public $maxFiles;

    /**
     * defineConfig will process the field configuration.
     */
    public function defineConfig(array $config)
    {
        if (isset($config['maxFiles'])) {
            $this->maxFiles = (int) $config['maxFiles'];
        }
    }

    /**
     * defineFormField will define how a field is displayed in a form.
     */
    public function defineFormField(FormElement $form, $context = null)
    {
        $config = $this->config;

        if (isset($config['span']) && $config['span'] === 'adaptive') {
            $config['externalToolbarAppState'] = 'toolbarExtensionPoint';
        }

        $form->addFormField($this->fieldName, $this->label)->useConfig($config);
    }

    /**
     * defineListColumn
     */
    public function defineListColumn(ListElement $list, $context = null)
    {
        $list->defineColumn($this->fieldName, $this->label)
            ->displayAs($this->mode === 'file' ? 'file' : 'image')
            ->shortLabel($this->shortLabel)
            ->clickable($this->mode !== 'file')
            ->useConfig($this->column ?: [])
        ;
    }

    /**
     * extendModelObject will extend the record model.
     */
    public function extendModelObject($model)
    {
        // Define the relationship
        if ($this->maxFiles === 1) {
            $model->attachOne[$this->fieldName] = \System\Models\File::class;
        }
        else {
            $model->attachMany[$this->fieldName] = \System\Models\File::class;
        }
    }

    /**
     * extendDatabaseTable
     */
    public function extendDatabaseTable($table)
    {
        // No column needed
    }
}
