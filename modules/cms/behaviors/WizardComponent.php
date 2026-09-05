<?php namespace Cms\Behaviors;

use Event;
use Session;
use October\Rain\Database\Model;
use ApplicationException;

/**
 * WizardComponent behavior adds multi-step form handling to CMS components.
 *
 * This behavior extends FormComponent with multi-step submissions, where each
 * step validates and saves the subset of fields carrying the posted form tag
 * against the same record. The record is created by the first step as a
 * partial submission and tracked in the visitor session until the final
 * submit completes it, so a lead is captured even when later steps are
 * abandoned. Visitors can move forward and back between steps without losing
 * earlier input, since every step is persisted to the record.
 *
 * Fields opt into wizard steps with a `tags` property, accepting an array
 * or a singular string. A blueprint without tagged fields has no valid form
 * tags and cannot be stepped through.
 *
 * Components using this behavior should implement formMarkPartial and
 * formMarkComplete so incomplete records can be distinguished, and may
 * override formFindPartialModel to constrain how partial records resolve.
 *
 * Usage in a component:
 *
 *     public $implement = [
 *         \Cms\Behaviors\WizardComponent::class,
 *     ];
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class WizardComponent extends FormComponent
{
    /**
     * formGetFields returns field metadata including tags, with an optional
     * tag argument limiting the result to fields carrying that tag.
     */
    public function formGetFields(?string $tag = null): array
    {
        $config = $this->component->formGetFieldConfig();
        $fields = [];

        foreach (parent::formGetFields() as $field) {
            $tags = (array) ($config[$field['name']]['tags'] ?? []);

            if ($tag !== null && !in_array($tag, $tags)) {
                continue;
            }

            $fields[] = $field + ['tags' => $tags];
        }

        return $fields;
    }

    /**
     * formGetFieldConfigByTag returns field configuration for fields carrying the tag,
     * throwing an exception when the tag matches nothing to prevent a validation bypass.
     */
    public function formGetFieldConfigByTag(string $tag): array
    {
        $result = [];

        foreach ($this->component->formGetFieldConfig() as $name => $field) {
            if (in_array($tag, (array) ($field['tags'] ?? []))) {
                $result[$name] = $field;
            }
        }

        if (!$result) {
            throw new ApplicationException(__("Unknown form tag [:tag]", ['tag' => $tag]));
        }

        return $result;
    }

    /**
     * onFormSubmit completes a deferred submission tracked by the session,
     * or falls back to saving a new record, enforcing the full rule set.
     */
    public function onFormSubmit()
    {
        $this->formCheckThrottle();

        $model = $this->component->formResolveDeferredModel();
        $allowedFields = $this->formGetFieldNames();
        $fileFields = $this->formGetFileFieldNames();

        // File fields accept uploaded files only, never postback values
        $data = array_except(array_only(post(), $allowedFields), $fileFields);
        $files = $this->formGetValidatedFiles($fileFields);

        $model->fill(array_merge($data, $files));

        Event::fire('cms.form.beforeSubmit', [$this->component, $model]);

        $this->component->formMarkComplete($model);

        $model->save();

        // Release the session tracker only when this save completed the partial
        $sessionKey = $this->component->formGetSessionKey();
        if (Session::get($sessionKey) == $model->getKey()) {
            Session::forget($sessionKey);
        }

        Event::fire('cms.form.submit', [$this->component, $model]);

        $this->controller->vars['formSubmitted'] = true;
        $this->controller->vars['formModel'] = $model;
    }

    /**
     * onFormStep advances a multi-step form, validating and saving the fields
     * of the step named by the posted _form_step value. This is the "Next"
     * action, and the saved step becomes the active step.
     */
    public function onFormStep()
    {
        $stepTag = (string) post('_form_step');

        if (!strlen($stepTag)) {
            throw new ApplicationException(__('Missing step for the form.'));
        }

        $model = $this->component->formResolveDeferredModel();

        // Only throttle the creation of a new partial record. Once a visitor
        // owns a record through their session, moving between steps merely
        // updates it and is not rate limited.
        if (!$model->exists) {
            $this->formCheckThrottle();
        }

        $this->formSaveStep($model, $stepTag);

        $this->controller->vars['formStepped'] = true;
        $this->controller->vars['formModel'] = $model;
        $this->controller->vars['formTag'] = $stepTag;
    }

    /**
     * onFormGoto navigates a multi-step form to the step named by _form_goto
     * without validating or saving, displaying the already-saved values. This
     * is the "Back" action, so the visitor never loses earlier input. An empty
     * _form_goto returns to the first step.
     */
    public function onFormGoto()
    {
        $this->controller->vars['formStepped'] = true;
        $this->controller->vars['formModel'] = $this->component->formResolveDeferredModel();
        $this->controller->vars['formTag'] = (string) post('_form_goto');
    }

    /**
     * formSaveStep validates the tagged fields and saves them to the partial record
     */
    protected function formSaveStep(Model $model, string $tag): void
    {
        $config = $this->formGetFieldConfigByTag($tag);
        $allowedFields = array_keys($config);
        $fileFields = array_intersect($this->formGetFileFieldNames(), $allowedFields);

        // File fields accept uploaded files only, never postback values
        $data = array_except(array_only(post(), $allowedFields), $fileFields);
        $files = $this->formGetValidatedFiles($fileFields);

        $model->fill(array_merge($data, $files));

        // Limit validation to the fields included in this step
        $model->rules = array_only((array) $model->rules, $allowedFields);

        /**
         * @event cms.form.beforeStep
         * Fires before a form step is saved, throw an exception to reject it.
         *
         * Example usage:
         *
         *     Event::listen('cms.form.beforeStep', function ($component, $model, $tag) {
         *         if ($tag === 'step1' && !CaptchaService::verify()) {
         *             throw new ValidationException(['captcha' => 'Please complete the captcha.']);
         *         }
         *     });
         */
        Event::fire('cms.form.beforeStep', [$this->component, $model, $tag]);

        $this->component->formMarkPartial($model);

        $model->save();

        Session::put($this->component->formGetSessionKey(), $model->getKey());

        /**
         * @event cms.form.step
         * Fires after a form step has been saved successfully.
         *
         * Example usage:
         *
         *     Event::listen('cms.form.step', function ($component, $model, $tag) {
         *         // Capture the lead, log progress, etc.
         *     });
         */
        Event::fire('cms.form.step', [$this->component, $model, $tag]);
    }

    /**
     * formResolveDeferredModel returns the partial model tracked by the session,
     * or a newly created model when no valid partial submission exists.
     */
    public function formResolveDeferredModel()
    {
        $model = $this->component->formCreateModel();

        $sessionKey = $this->component->formGetSessionKey();
        if (!$recordId = Session::get($sessionKey)) {
            return $model;
        }

        $existing = $this->component->formFindPartialModel($model, $recordId);
        if (!$existing) {
            Session::forget($sessionKey);
            return $model;
        }

        return $existing;
    }

    /**
     * formFindPartialModel locates a previously deferred model by its primary key
     */
    public function formFindPartialModel(Model $model, $recordId): ?Model
    {
        return $model->newQuery()->where($model->getKeyName(), $recordId)->first();
    }

    /**
     * formMarkPartial flags the model as an incomplete submission before a deferred save
     */
    public function formMarkPartial(Model $model): void
    {
    }

    /**
     * formMarkComplete clears the incomplete flag from the model before the final save
     */
    public function formMarkComplete(Model $model): void
    {
    }

    /**
     * formGetSessionKey returns the session key used to track partial submissions
     */
    public function formGetSessionKey(): string
    {
        return 'cms_form_partial.' . get_class($this->component);
    }
}
