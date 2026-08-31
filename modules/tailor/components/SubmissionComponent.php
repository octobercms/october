<?php namespace Tailor\Components;

use Tailor\Classes\BlueprintIndexer;
use Tailor\Models\SubmissionRecord;
use Cms\Classes\ComponentModuleBase;
use ApplicationException;

/**
 * SubmissionComponent handles user-submitted content via a Tailor blueprint.
 *
 * Uses the FormComponent behavior to provide form rendering, validation,
 * and save handling. The component wires the behavior to a Tailor submission
 * blueprint, deriving fields from the blueprint's fieldset.
 */
class SubmissionComponent extends ComponentModuleBase
{
    /**
     * @var array implement extensions
     */
    public $implement = [
        \Cms\Behaviors\FormComponent::class,
    ];

    /**
     * componentDetails
     */
    public function componentDetails()
    {
        return [
            'name' => 'Submission',
            'description' => 'Displays a submission form for user content.',
            'icon' => 'icon-inbox',
            'ajaxPartial' => true
        ];
    }

    /**
     * defineProperties
     */
    public function defineProperties()
    {
        return [
            'handle' => [
                'title' => 'Handle',
                'type' => 'dropdown',
                'showExternalParam' => false
            ],
        ];
    }

    /**
     * getHandleOptions
     */
    public function getHandleOptions()
    {
        $blueprints = BlueprintIndexer::instance()->listSections();

        $result = [];
        foreach ($blueprints as $bp) {
            if ($bp->type === 'submission') {
                $result[$bp->handle] = $bp->name . ' ('.$bp->handle.')';
            }
        }

        return $result;
    }

    /**
     * formCreateModel returns a new SubmissionRecord wired to the blueprint
     */
    public function formCreateModel()
    {
        $model = new SubmissionRecord;
        $model->extendWithBlueprint($this->getBlueprintUuid());
        return $model;
    }

    /**
     * formGetFieldConfig derives field definitions from the blueprint fieldset
     */
    public function formGetFieldConfig(): array
    {
        $fieldset = BlueprintIndexer::instance()
            ->findContentFieldset($this->getBlueprintUuid());

        if (!$fieldset) {
            return [];
        }

        $config = [];
        foreach ($fieldset->getAllFields() as $name => $field) {
            $config[$name] = [
                'label' => $field->label,
                'type' => $field->type ?? 'text',
                'validation' => $field->validation ?? '',
                'options' => $field->options ?? [],
                'placeholder' => $field->placeholder ?? '',
                'comment' => $field->comment ?? '',
                'fileTypes' => $field->fileTypes ?? null,
                'maxFiles' => $field->maxFiles ?? null,
            ];
        }

        return $config;
    }

    /**
     * onFormSubmit adds spam protection before delegating to the behavior
     */
    public function onFormSubmit()
    {
        // Honeypot check
        if (post('_oc_hp') !== null && strlen(post('_oc_hp')) > 0) {
            throw new ApplicationException('Submission blocked.');
        }

        $result = $this->asExtension('FormComponent')->onFormSubmit();

        $model = $this->controller->vars['formModel'] ?? null;
        if ($model instanceof SubmissionRecord) {
            $model->sendSubmissionNotifications();
        }

        return $result;
    }

    /**
     * getBlueprintUuid resolves the handle to a blueprint UUID
     */
    protected function getBlueprintUuid(): string
    {
        $handle = $this->property('handle');

        $blueprint = BlueprintIndexer::instance()->findSectionByHandle($handle);
        if (!$blueprint) {
            throw new ApplicationException("Submission handle [{$handle}] not found");
        }

        return $blueprint->uuid;
    }
}
