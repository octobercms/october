<?php namespace Backend\Behaviors;

use Db;
use Str;
use Lang;
use Flash;
use Event;
use Redirect;
use Backend;
use Backend\Classes\ControllerBehavior;
use October\Rain\Router\Helper as RouterHelper;
use ApplicationException;
use Exception;

/**
 * Adds features for working with backend forms. This behavior
 * will inject CRUD actions to the controller -- including create,
 * update and preview -- along with some relevant AJAX handlers.
 *
 * Each action supports a custom context code, allowing fields
 * to be displayed or hidden on a contextual basis, as specified
 * by the form field definitions or some other custom logic.
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         'Backend.Behaviors.FormController',
 *     ];
 *
 *     public $formConfig = 'config_form.yaml';
 *
 * The `$formConfig` property makes reference to the form configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @see http://octobercms.com/docs/backend/forms Back-end form documentation
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FormController extends ControllerBehavior
{
    use \Backend\Traits\FormModelSaver;

    /**
     * @var string Default context for "create" pages.
     */
    const CONTEXT_CREATE = 'create';

    /**
     * @var string Default context for "update" pages.
     */
    const CONTEXT_UPDATE = 'update';

    /**
     * @var string Default context for "preview" pages.
     */
    const CONTEXT_PREVIEW = 'preview';

    /**
     * @var \Backend\Classes\Controller|FormController Reference to the back end controller.
     */
    protected $controller;

    /**
     * @var \Backend\Widgets\Form Reference to the widget object.
     */
    protected $formWidget;

    /**
     * @inheritDoc
     */
    protected $requiredProperties = ['formConfig'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     * - modelClass: Class name for the model
     * - form: Form field definitions
     */
    protected $requiredConfig = ['modelClass', 'form'];

    /**
     * @var array Visible actions in context of the controller
     */
    protected $actions = ['create', 'update', 'preview'];

    /**
     * @var string The context to pass to the form widget.
     */
    protected $context;

    /**
     * @var \October\Rain\Database\Model|\October\Rain\Halcyon\Model The initialized model used by the form.
     */
    protected $model;

    /**
     * Behavior constructor
     * @param \Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        /*
         * Build configuration
         */
        $this->config = $this->makeConfig($controller->formConfig, $this->requiredConfig);
        $this->config->modelClass = Str::normalizeClassName($this->config->modelClass);
    }

    /**
     * Initialize the form configuration against a model and context value.
     * This will process the configuration found in the `$formConfig` property
     * and prepare the Form widget, which is the underlying tool used for
     * actually rendering the form. The model used by this form is passed
     * to this behavior via this method as the first argument.
     *
     * @see \Backend\Widgets\Form
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model $model
     * @param string $context Form context
     * @return void
     */
    public function initForm($model, $context = null)
    {
        if ($context !== null) {
            $this->context = $context;
        }

        $context = $this->formGetContext();

        /*
         * Each page can supply a unique form definition, if desired
         */
        $formFields = $this->getConfig("{$context}[form]", $this->config->form);

        $config = $this->makeConfig($formFields);
        $config->model = $model;
        $config->arrayName = class_basename($model);
        $config->context = $context;

        /*
         * Form Widget with extensibility
         */
        $this->formWidget = $this->makeWidget('Backend\Widgets\Form', $config);

        // Setup the default preview mode on form initialization if the context is preview
        if ($config->context === 'preview') {
            $this->formWidget->previewMode = true;
        }

        $this->formWidget->bindEvent('form.extendFieldsBefore', function () {
            $this->controller->formExtendFieldsBefore($this->formWidget);
        });

        $this->formWidget->bindEvent('form.extendFields', function ($fields) {
            $this->controller->formExtendFields($this->formWidget, $fields);
        });

        $this->formWidget->bindEvent('form.beforeRefresh', function ($holder) {
            $result = $this->controller->formExtendRefreshData($this->formWidget, $holder->data);
            if (is_array($result)) {
                $holder->data = $result;
            }
        });

        $this->formWidget->bindEvent('form.refreshFields', function ($fields) {
            return $this->controller->formExtendRefreshFields($this->formWidget, $fields);
        });

        $this->formWidget->bindEvent('form.refresh', function ($result) {
            return $this->controller->formExtendRefreshResults($this->formWidget, $result);
        });

        $this->formWidget->bindToController();

        /*
         * Detected Relation controller behavior
         */
        if ($this->controller->isClassExtendedWith('Backend.Behaviors.RelationController')) {
            $this->controller->initRelation($model);
        }

        $this->prepareVars($model);
        $this->model = $model;
    }

    /**
     * Prepares commonly used view data.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model $model
     */
    protected function prepareVars($model)
    {
        $this->controller->vars['formModel'] = $model;
        $this->controller->vars['formContext'] = $this->formGetContext();
        $this->controller->vars['formRecordName'] = Lang::get($this->getConfig('name', 'backend::lang.model.name'));
    }

    //
    // Create
    //

    /**
     * Controller "create" action used for creating new model records.
     *
     * @param string $context Form context
     * @return void
     */
    public function create($context = null)
    {
        try {
            $this->context = strlen($context) ? $context : $this->getConfig('create[context]', self::CONTEXT_CREATE);
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang(
                "{$this->context}[title]",
                'backend::lang.form.create_title'
            );

            $model = $this->controller->formCreateModelObject();
            $model = $this->controller->formExtendModel($model) ?: $model;

            $this->initForm($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    /**
     * AJAX handler "onSave" called from the create action and
     * primarily used for creating new records.
     *
     * This handler will invoke the unique controller overrides
     * `formBeforeCreate` and `formAfterCreate`.
     *
     * @param string $context Form context
     * @return \Illuminate\Http\RedirectResponse|void
     */
    public function create_onSave($context = null)
    {
        $this->context = strlen($context) ? $context : $this->getConfig('create[context]', self::CONTEXT_CREATE);

        $model = $this->controller->formCreateModelObject();
        $model = $this->controller->formExtendModel($model) ?: $model;

        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeCreate($model);

        $modelsToSave = $this->prepareModelsToSave($model, $this->formWidget->getSaveData());
        Db::transaction(function () use ($modelsToSave) {
            foreach ($modelsToSave as $modelToSave) {
                $modelToSave->save(null, $this->formWidget->getSessionKey());
            }
        });

        $this->controller->formAfterSave($model);
        $this->controller->formAfterCreate($model);

        Flash::success($this->getLang("{$this->context}[flashSave]", 'backend::lang.form.create_success'));

        if ($redirect = $this->makeRedirect($this->context, $model)) {
            return $redirect;
        }
    }

    //
    // Update
    //

    /**
     * Controller "update" action used for updating existing model records.
     * This action takes a record identifier (primary key of the model)
     * to locate the record used for sourcing the existing form values.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return void
     */
    public function update($recordId = null, $context = null)
    {
        try {
            $this->context = strlen($context) ? $context : $this->getConfig('update[context]', self::CONTEXT_UPDATE);
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang(
                "{$this->context}[title]",
                'backend::lang.form.update_title'
            );

            $model = $this->controller->formFindModelObject($recordId);
            $this->initForm($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    /**
     * AJAX handler "onSave" called from the update action and
     * primarily used for updating existing records.
     *
     * This handler will invoke the unique controller overrides
     * `formBeforeUpdate` and `formAfterUpdate`.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return \Illuminate\Http\RedirectResponse|void
     * @throws \October\Rain\Exception\ApplicationException if the provided recordId is not found
     */
    public function update_onSave($recordId = null, $context = null)
    {
        $this->context = strlen($context) ? $context : $this->getConfig('update[context]', self::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeUpdate($model);

        $modelsToSave = $this->prepareModelsToSave($model, $this->formWidget->getSaveData());
        Db::transaction(function () use ($modelsToSave) {
            foreach ($modelsToSave as $modelToSave) {
                $modelToSave->save(null, $this->formWidget->getSessionKey());
            }
        });

        $this->controller->formAfterSave($model);
        $this->controller->formAfterUpdate($model);

        Flash::success($this->getLang("{$this->context}[flashSave]", 'backend::lang.form.update_success'));

        if ($redirect = $this->makeRedirect($this->context, $model)) {
            return $redirect;
        }
    }

    /**
     * AJAX handler "onDelete" called from the update action and
     * used for deleting existing records.
     *
     * This handler will invoke the unique controller override
     * `formAfterDelete`.
     *
     * @param int $recordId Record identifier
     * @return \Illuminate\Http\RedirectResponse|void
     * @throws \October\Rain\Exception\ApplicationException if the provided recordId is not found
     * @throws Exception if there is no primary key on the model
     */
    public function update_onDelete($recordId = null)
    {
        $this->context = $this->getConfig('update[context]', self::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $model->delete();

        $this->controller->formAfterDelete($model);

        Flash::success($this->getLang("{$this->context}[flashDelete]", 'backend::lang.form.delete_success'));

        if ($redirect = $this->makeRedirect('delete', $model)) {
            return $redirect;
        }
    }

    //
    // Preview
    //

    /**
     * Controller "preview" action used for viewing existing model records.
     * This action takes a record identifier (primary key of the model)
     * to locate the record used for sourcing the existing preview data.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return void
     */
    public function preview($recordId = null, $context = null)
    {
        try {
            $this->context = strlen($context) ? $context : $this->getConfig('preview[context]', self::CONTEXT_PREVIEW);
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang(
                "{$this->context}[title]",
                'backend::lang.form.preview_title'
            );

            $model = $this->controller->formFindModelObject($recordId);
            $this->initForm($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    //
    // Utils
    //

    /**
     * Method to render the prepared form markup. This method is usually
     * called from a view file.
     *
     *     <?= $this->formRender() ?>
     *
     * The first argument supports an array of render options. The supported
     * options can be found via the `render` method of the Form widget class.
     *
     *     <?= $this->formRender(['preview' => true, section' => 'primary']) ?>
     *
     * @see \Backend\Widgets\Form
     * @param array $options Render options
     * @return string Rendered HTML for the form.
     * @throws \October\Rain\Exception\ApplicationException if the Form Widget isn't set
     */
    public function formRender($options = [])
    {
        if (!$this->formWidget) {
            throw new ApplicationException(Lang::get('backend::lang.form.behavior_not_ready'));
        }

        return $this->formWidget->render($options);
    }

    /**
     * Returns the model initialized by this form behavior.
     * The model will be provided by one of the page actions or AJAX
     * handlers via the `initForm` method.
     *
     * @return \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formGetModel()
    {
        return $this->model;
    }

    /**
     * Returns the active form context, either obtained from the postback
     * variable called `form_context` or detected from the configuration,
     * or routing parameters.
     *
     * @return string
     */
    public function formGetContext()
    {
        return post('form_context', $this->context);
    }

    /**
     * Internal method used to prepare the form model object.
     *
     * @return \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    protected function createModel()
    {
        $class = $this->config->modelClass;
        return new $class;
    }

    /**
     * Returns a Redirect object based on supplied context and parses
     * the model primary key.
     *
     * @param string $context Redirect context, eg: create, update, delete
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model $model The active model to parse in it's ID and attributes.
     * @return \Illuminate\Http\RedirectResponse
     */
    public function makeRedirect($context = null, $model = null)
    {
        $redirectUrl = null;
        if (post('close') && !ends_with($context, '-close')) {
            $context .= '-close';
        }

        if (post('refresh', false)) {
            return Redirect::refresh();
        }

        if (post('redirect', true)) {
            $redirectUrl = $this->controller->formGetRedirectUrl($context, $model);
        }

        if ($model && $redirectUrl) {
            $redirectUrl = RouterHelper::replaceParameters($model, $redirectUrl);
        }

        if (starts_with($redirectUrl, 'http://') || starts_with($redirectUrl, 'https://')) {
            // Process absolute redirects
            $redirect = Redirect::to($redirectUrl);
        } else {
            // Process relative redirects
            $redirect = $redirectUrl ? Backend::redirect($redirectUrl) : null;
        }

        return $redirect;
    }

    /**
     * Returns a redirect URL from the config based on supplied context.
     * Otherwise the default redirect is used. Relative URLs are treated as
     * backend URLs.
     *
     * @param string $context Redirect context, eg: create, update, delete.
     * @param Model $model The active model.
     * @return string
     */
    public function formGetRedirectUrl($context = null, $model = null)
    {
        $redirectContext = explode('-', $context, 2)[0];
        $redirectSource = ends_with($context, '-close') ? 'redirectClose' : 'redirect';

        // Get the redirect for the provided context
        $redirects = [$context => $this->getConfig("{$redirectContext}[{$redirectSource}]", '')];

        // Assign the default redirect afterwards to prevent the
        // source for the default redirect being default[redirect]
        $redirects['default'] = $this->getConfig('defaultRedirect', '');

        if (empty($redirects[$context])) {
            return $redirects['default'];
        }

        return $redirects[$context];
    }

    /**
     * Parses in some default variables to a language string defined in config.
     *
     * @param string $name Configuration property containing the language string
     * @param string $default A default language string to use if the config is not found
     * @param array $extras Any extra params to include in the language string variables
     * @return string The translated string.
     */
    protected function getLang($name, $default = null, $extras = [])
    {
        $name = $this->getConfig($name, $default);
        $vars = [
            'name' => Lang::get($this->getConfig('name', 'backend::lang.model.name'))
        ];
        $vars = array_merge($vars, $extras);
        return Lang::get($name, $vars);
    }

    //
    // Pass-through Helpers
    //

    /**
     * View helper to render a single form field.
     *
     *     <?= $this->formRenderField('field_name') ?>
     *
     * @param string $name Field name
     * @param array $options (e.g. ['useContainer'=>false])
     * @return string HTML markup
     */
    public function formRenderField($name, $options = [])
    {
        return $this->formWidget->renderField($name, $options);
    }

    /**
     * View helper to render the form in preview mode.
     *
     *     <?= $this->formRenderPreview() ?>
     *
     * @return string The form HTML markup.
     * @throws \October\Rain\Exception\ApplicationException if the Form Widget isn't set
     */
    public function formRenderPreview()
    {
        return $this->formRender(['preview' => true]);
    }

    /**
     * View helper to check if a form tab has fields in the
     * non-tabbed section (outside fields).
     *
     *     <?php if ($this->formHasOutsideFields()): ?>
     *         <!-- Do something -->
     *     <?php endif ?>
     *
     * @return bool
     */
    public function formHasOutsideFields()
    {
        return $this->formWidget->getTab('outside')->hasFields();
    }

    /**
     * View helper to render the form fields belonging to the
     * non-tabbed section (outside form fields).
     *
     *     <?= $this->formRenderOutsideFields() ?>
     *
     * @return string HTML markup
     * @throws \October\Rain\Exception\ApplicationException if the Form Widget isn't set
     */
    public function formRenderOutsideFields()
    {
        return $this->formRender(['section' => 'outside']);
    }

    /**
     * View helper to check if a form tab has fields in the
     * primary tab section.
     *
     *     <?php if ($this->formHasPrimaryTabs()): ?>
     *         <!-- Do something -->
     *     <?php endif ?>
     *
     * @return bool
     */
    public function formHasPrimaryTabs()
    {
        return $this->formWidget->getTab('primary')->hasFields();
    }

    /**
     * View helper to render the form fields belonging to the
     * primary tabs section.
     *
     *     <?= $this->formRenderPrimaryTabs() ?>
     *
     * @return string HTML markup
     * @throws \October\Rain\Exception\ApplicationException if the Form Widget isn't set
     */
    public function formRenderPrimaryTabs()
    {
        return $this->formRender(['section' => 'primary']);
    }

    /**
     * View helper to check if a form tab has fields in the
     * secondary tab section.
     *
     *     <?php if ($this->formHasSecondaryTabs()): ?>
     *         <!-- Do something -->
     *     <?php endif ?>
     *
     * @return bool
     */
    public function formHasSecondaryTabs()
    {
        return $this->formWidget->getTab('secondary')->hasFields();
    }

    /**
     * View helper to render the form fields belonging to the
     * secondary tabs section.
     *
     *     <?= $this->formRenderSecondaryTabs() ?>
     *
     * @return string HTML markup
     * @throws \October\Rain\Exception\ApplicationException if the Form Widget isn't set
     */
    public function formRenderSecondaryTabs()
    {
        return $this->formRender(['section' => 'secondary']);
    }

    /**
     * Returns the form widget used by this behavior.
     *
     * @return \Backend\Widgets\Form
     */
    public function formGetWidget()
    {
        return $this->formWidget;
    }

    /**
     * Returns a unique ID for the form widget used by this behavior.
     * This is useful for dealing with identifiers in the markup.
     *
     *     <div id="<?= $this->formGetId()">...</div>
     *
     * A suffix may be used passed as the first argument to reuse
     * the identifier in other areas.
     *
     *     <button id="<?= $this->formGetId('button')">...</button>
     *
     * @param string $suffix
     * @return string
     */
    public function formGetId($suffix = null)
    {
        return $this->formWidget->getId($suffix);
    }

    /**
     * Helper to get the form session key.
     *
     * @return string
     */
    public function formGetSessionKey()
    {
        return $this->formWidget->getSessionKey();
    }

    //
    // Overrides
    //

    /**
     * Called before the creation or updating form is saved.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formBeforeSave($model)
    {
    }

    /**
     * Called after the creation or updating form is saved.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formAfterSave($model)
    {
    }

    /**
     * Called before the creation form is saved.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formBeforeCreate($model)
    {
    }

    /**
     * Called after the creation form is saved.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formAfterCreate($model)
    {
    }

    /**
     * Called before the updating form is saved.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formBeforeUpdate($model)
    {
    }

    /**
     * Called after the updating form is saved.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formAfterUpdate($model)
    {
    }

    /**
     * Called after the form model is deleted.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formAfterDelete($model)
    {
    }

    /**
     * Finds a Model record by its primary identifier, used by update actions. This logic
     * can be changed by overriding it in the controller.
     * @param string $recordId
     * @return \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     * @throws \October\Rain\Exception\ApplicationException if the provided recordId is not found
     */
    public function formFindModelObject($recordId)
    {
        if (!strlen($recordId)) {
            throw new ApplicationException($this->getLang('not-found-message', 'backend::lang.form.missing_id'));
        }

        $model = $this->controller->formCreateModelObject();

        /*
         * Prepare query and find model record
         */
        $query = $model->newQuery();
        $this->controller->formExtendQuery($query);
        $result = $query->find($recordId);

        if (!$result) {
            throw new ApplicationException($this->getLang('not-found-message', 'backend::lang.form.not_found', [
                'class' => get_class($model), 'id' => $recordId
            ]));
        }

        $result = $this->controller->formExtendModel($result) ?: $result;

        return $result;
    }

    /**
     * Creates a new instance of a form model. This logic can be changed
     * by overriding it in the controller.
     * @return \October\Rain\Database\Model|\October\Rain\Halcyon\Model
     */
    public function formCreateModelObject()
    {
        return $this->createModel();
    }

    /**
     * Called before the form fields are defined.
     * @param \Backend\Widgets\Form $host The hosting form widget
     * @return void
     */
    public function formExtendFieldsBefore($host)
    {
    }

    /**
     * Called after the form fields are defined.
     * @param \Backend\Widgets\Form $host The hosting form widget
     * @param array $fields Array of all defined form field objects (\Backend\Classes\FormField)
     * @return void
     */
    public function formExtendFields($host, $fields)
    {
    }

    /**
     * Called before the form is refreshed, should return an array of additional save data.
     * @param \Backend\Widgets\Form $host The hosting form widget
     * @param array $saveData Current save data
     * @return array|void
     */
    public function formExtendRefreshData($host, $saveData)
    {
    }

    /**
     * Called when the form is refreshed, giving the opportunity to modify the form fields.
     * @param \Backend\Widgets\Form $host The hosting form widget
     * @param array $fields Current form fields
     * @return array|void
     */
    public function formExtendRefreshFields($host, $fields)
    {
    }

    /**
     * Called after the form is refreshed, should return an array of additional result parameters.
     * @param \Backend\Widgets\Form $host The hosting form widget
     * @param array $result Current result parameters.
     * @return array|void
     */
    public function formExtendRefreshResults($host, $result)
    {
    }

    /**
     * Extend supplied model used by create and update actions, the model can
     * be altered by overriding it in the controller.
     * @param \October\Rain\Database\Model|\October\Rain\Halcyon\Model $model
     * @return \October\Rain\Database\Model|\October\Rain\Halcyon\Model|void
     */
    public function formExtendModel($model)
    {
    }

    /**
     * Extend the query used for finding the form model. Extra conditions
     * can be applied to the query, for example, $query->withTrashed();
     * @param \October\Rain\Database\Builder|\October\Rain\Halcyon\Builder $query
     * @return void
     */
    public function formExtendQuery($query)
    {
    }

    /**
     * Static helper for extending form fields.
     * @param  callable $callback
     * @return void
     */
    public static function extendFormFields($callback)
    {
        $calledClass = self::getCalledExtensionClass();
        Event::listen('backend.form.extendFields', function ($widget) use ($calledClass, $callback) {
            if (!is_a($widget->getController(), $calledClass)) {
                return;
            }
            call_user_func_array($callback, [$widget, $widget->model, $widget->getContext()]);
        });
    }
}
