<?php namespace Tailor\Components;

use Tailor\Classes\BlueprintIndexer;
use Tailor\Models\SubmissionRecord;
use Cms\Classes\ComponentModuleBase;
use ApplicationException;

/**
 * SubmissionComponent handles user-submitted content via a Tailor blueprint

 */
class SubmissionComponent extends ComponentModuleBase
{
    /**
     * init attaches the wizard or standard form behavior based on the wizard property
     */
    public function init()
    {
        $this->extendClassWith(
            $this->property('wizard')
                ? \Cms\Behaviors\WizardComponent::class
                : \Cms\Behaviors\FormComponent::class
        );
    }

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
            'wizard' => [
                'title' => 'Wizard Submission',
                'description' => 'Allow partial submissions across multiple steps',
                'type' => 'checkbox',
                'default' => false,
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
                'tags' => (array) ($field->tags ?? []),
            ];
        }

        return $config;
    }

    /**
     * onFormSubmit adds spam protection before delegating to the behavior
     */
    public function onFormSubmit()
    {
        $this->checkHoneypot();

        $result = $this->getFormBehavior()->onFormSubmit();

        $model = $this->controller->vars['formModel'] ?? null;
        if ($model instanceof SubmissionRecord) {
            $model->sendSubmissionNotifications();
        }

        return $result;
    }

    /**
     * onFormStep adds spam protection before delegating the forward step to the behavior
     */
    public function onFormStep()
    {
        if (!$this->isClassExtendedWith(\Cms\Behaviors\WizardComponent::class)) {
            throw new ApplicationException('Multi-step submissions are not enabled for this form.');
        }

        $this->checkHoneypot();

        return $this->getFormBehavior()->onFormStep();
    }

    /**
     * onFormGoto delegates back navigation to the behavior, no validation required
     */
    public function onFormGoto()
    {
        if (!$this->isClassExtendedWith(\Cms\Behaviors\WizardComponent::class)) {
            throw new ApplicationException('Multi-step submissions are not enabled for this form.');
        }

        return $this->getFormBehavior()->onFormGoto();
    }

    /**
     * getFormBehavior returns the form behavior attached to this component
     * @return \Cms\Behaviors\FormComponent|\Cms\Behaviors\WizardComponent
     */
    protected function getFormBehavior()
    {
        return $this->asExtension('WizardComponent') ?: $this->asExtension('FormComponent');
    }

    /**
     * formMarkPartial flags the record as an incomplete submission
     */
    public function formMarkPartial($model): void
    {
        $model->is_partial_submission = true;
    }

    /**
     * formMarkComplete clears the incomplete submission flag
     */
    public function formMarkComplete($model): void
    {
        $model->is_partial_submission = false;
    }

    /**
     * formFindPartialModel only resolves records still marked as partial submissions
     */
    public function formFindPartialModel($model, $recordId)
    {
        return $model->newQuery()
            ->where($model->getKeyName(), $recordId)
            ->where('is_partial_submission', true)
            ->first();
    }

    /**
     * formGetSessionKey scopes partial submission tracking to the blueprint
     */
    public function formGetSessionKey(): string
    {
        return 'cms_form_partial.' . $this->getBlueprintUuid();
    }

    /**
     * checkHoneypot rejects submissions that fill the hidden honeypot field
     */
    protected function checkHoneypot(): void
    {
        if (post('_oc_hp') !== null && strlen(post('_oc_hp')) > 0) {
            throw new ApplicationException('Submission blocked.');
        }
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
