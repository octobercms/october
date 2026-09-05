<?php namespace Cms\Behaviors;

use Event;
use File;
use Html;
use Config;
use Validator;
use Cms\Classes\ComponentBehavior;
use System\Classes\RateLimiter;
use October\Rain\Filesystem\Definitions as FileDefinitions;
use Illuminate\Http\UploadedFile;
use System\Models\File as FileModel;
use ApplicationException;
use ValidationException;

/**
 * FormComponent behavior adds form handling capabilities to CMS components.
 *
 * This behavior provides model binding, field schema exposure, validation,
 * and AJAX save handlers. It follows the "schema in, template freedom out"
 * pattern — the component defines what fields exist and their validation,
 * while the theme developer has full control over HTML rendering.
 *
 * Usage in a component:
 *
 *     public $implement = [
 *         \Cms\Behaviors\FormComponent::class,
 *     ];
 *
 *     public function formCreateModel() { return new MyModel; }
 *     public function formGetFieldConfig() { return [...]; }
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class FormComponent extends ComponentBehavior
{
    /**
     * @var array htmlTypeMap maps blueprint field types to HTML input types
     */
    protected $htmlTypeMap = [
        'text' => 'text',
        'number' => 'number',
        'password' => 'password',
        'email' => 'email',
        'textarea' => 'textarea',
        'checkbox' => 'checkbox',
        'switch' => 'checkbox',
        'dropdown' => 'select',
        'radio' => 'radio',
        'richeditor' => 'textarea',
        'markdown' => 'textarea',
        'codeeditor' => 'textarea',
        'datepicker' => 'date',
        'colorpicker' => 'color',
        'fileupload' => 'file',
    ];

    /**
     * @var array skippedTypes are field types not renderable in auto-generated forms
     */
    protected $skippedTypes = [
        'repeater',
        'entries',
        'relation',
        'recordfinder',
        'nestedform',
        'mediafinder',
    ];

    /**
     * formGetFields returns field metadata for use in Twig templates.
     *
     * Each field is returned as an array with keys: name, label, type,
     * htmlType, options, required, placeholder, comment.
     */
    public function formGetFields(): array
    {
        $config = $this->component->formGetFieldConfig();
        $fields = [];

        foreach ($config as $name => $field) {
            $type = $field['type'] ?? 'text';

            if (in_array($type, $this->skippedTypes)) {
                continue;
            }

            $validation = $field['validation'] ?? '';
            $isRequired = is_string($validation) && str_contains($validation, 'required');

            $htmlType = $this->htmlTypeMap[$type] ?? 'text';

            $fields[] = [
                'name' => $name,
                'label' => __($field['label'] ?? $name),
                'type' => $type,
                'htmlType' => $htmlType,
                'options' => $field['options'] ?? [],
                'required' => $isRequired,
                'placeholder' => __($field['placeholder'] ?? ''),
                'comment' => __($field['comment'] ?? ''),
                'multiple' => $htmlType === 'file' && (int) ($field['maxFiles'] ?? 0) !== 1,
            ];
        }

        return $fields;
    }

    /**
     * formGetFieldNames returns the allowed field names from the config
     */
    public function formGetFieldNames(): array
    {
        return array_keys($this->component->formGetFieldConfig());
    }

    /**
     * formGetFileFieldNames returns field names that accept uploaded files
     */
    public function formGetFileFieldNames(): array
    {
        $result = [];

        foreach ($this->component->formGetFieldConfig() as $name => $field) {
            if (($this->htmlTypeMap[$field['type'] ?? 'text'] ?? null) === 'file') {
                $result[] = $name;
            }
        }

        return $result;
    }

    /**
     * formHasFileFields returns true if the form contains file upload fields
     */
    public function formHasFileFields(): bool
    {
        return count($this->formGetFileFieldNames()) > 0;
    }

    /**
     * onFormSubmit is the default AJAX handler for form submissions.
     *
     * It creates a model, fills it with filtered POST data, validates and
     * saves, then fires an event for extensibility.
     */
    public function onFormSubmit()
    {
        $this->formCheckThrottle();

        $model = $this->component->formCreateModel();
        $allowedFields = $this->formGetFieldNames();
        $fileFields = $this->formGetFileFieldNames();

        // File fields accept uploaded files only, never postback values
        $data = array_except(array_only(post(), $allowedFields), $fileFields);
        $files = $this->formGetValidatedFiles($fileFields);

        $model->fill(array_merge($data, $files));

        /**
         * @event cms.form.beforeSubmit
         * Fires before a form submission is saved, throw an exception to reject it.
         *
         * Example usage:
         *
         *     Event::listen('cms.form.beforeSubmit', function ($component, $model) {
         *         if (SpamService::isSpam($model)) {
         *             throw new ValidationException(['content' => 'Submission rejected.']);
         *         }
         *     });
         */
        Event::fire('cms.form.beforeSubmit', [$this->component, $model]);

        $model->save();

        /**
         * @event cms.form.submit
         * Fires after a form submission has been saved successfully.
         *
         * Example usage:
         *
         *     Event::listen('cms.form.submit', function ($component, $model) {
         *         // Send notification, log activity, etc.
         *     });
         */
        Event::fire('cms.form.submit', [$this->component, $model]);

        $this->controller->vars['formSubmitted'] = true;
        $this->controller->vars['formModel'] = $model;
    }

    /**
     * formGetThrottleRate returns the maximum submissions per minute per IP, zero to disable
     */
    public function formGetThrottleRate(): int
    {
        return 6;
    }

    /**
     * formCheckThrottle enforces the submission rate limit for the visitor
     */
    protected function formCheckThrottle(): void
    {
        $rate = (int) $this->component->formGetThrottleRate();
        if ($rate <= 0) {
            return;
        }

        $limiter = new RateLimiter('cms-form-submit');

        if ($limiter->tooManyAttempts($rate)) {
            throw new ApplicationException(__('Too many submissions, please try again later.'));
        }

        $limiter->increment(60);
    }

    /**
     * formGetValidatedFiles returns uploaded files for file fields after validation
     */
    protected function formGetValidatedFiles(array $fileFields): array
    {
        $config = $this->component->formGetFieldConfig();
        $result = [];

        foreach (array_only(files(), $fileFields) as $name => $value) {
            $files = is_array($value) ? $value : [$value];
            $fieldConfig = $config[$name] ?? [];

            if (($maxFiles = (int) ($fieldConfig['maxFiles'] ?? 0)) && count($files) > $maxFiles) {
                throw new ValidationException([$name => __('Too many files were uploaded')]);
            }

            foreach ($files as $file) {
                $this->formValidateFile($name, $file, $fieldConfig);
            }

            $result[$name] = $value;
        }

        return $result;
    }

    /**
     * formValidateFile validates a single uploaded file against size and extension rules
     */
    protected function formValidateFile(string $name, mixed $file, array $fieldConfig): void
    {
        if (!$file instanceof UploadedFile || !$file->isValid()) {
            throw new ApplicationException(__('The uploaded file is not valid'));
        }

        $rules = ['max:'.FileModel::getMaxFilesize()];

        if ($fileTypes = $this->formGetAllowedFileTypes($fieldConfig)) {
            $rules[] = 'extensions:'.$fileTypes;
        }

        $validation = Validator::make(
            [$name => $file],
            [$name => $rules]
        );

        if ($validation->fails()) {
            throw new ValidationException($validation);
        }

        // Check and clean vector files
        $extension = strtolower($file->getClientOriginalExtension());
        if ($extension === 'svg' && Config::get('media.clean_vectors', true)) {
            $realPath = empty(trim($file->getRealPath()))
                ? $file->getPath() . DIRECTORY_SEPARATOR . $file->getFileName()
                : $file->getRealPath();

            File::put($realPath, Html::cleanVector(File::get($realPath)));
        }
    }

    /**
     * formGetAllowedFileTypes returns the allowed extensions for a file field
     */
    protected function formGetAllowedFileTypes(array $fieldConfig): ?string
    {
        $types = $fieldConfig['fileTypes'] ?? null;

        if (!$types) {
            $types = FileDefinitions::get('default_extensions');
        }

        if ($types === '*') {
            return null;
        }

        if (is_array($types)) {
            $types = implode(',', $types);
        }

        return $types;
    }
}
