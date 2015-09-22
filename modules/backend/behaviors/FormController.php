<?php namespace Backend\Behaviors;

use Str;
use Lang;
use Flash;
use Event;
use Input;
use Redirect;
use Backend;
use Backend\Classes\ControllerBehavior;
use October\Rain\Router\Helper as RouterHelper;
use ApplicationException;
use Exception;

/**
 * Form Controller Behavior
 * Adds features for working with backend forms.
 *
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
     * @var Backend\Classes\WidgetBase Reference to the widget object.
     */
    protected $formWidget;

    /**
     * {@inheritDoc}
     */
    protected $requiredProperties = ['formConfig'];

    /**
     * @var array Configuration values that must exist when applying the primary config file.
     * - modelClass: Class name for the model
     * - form: Form field definitions
     */
    protected $requiredConfig = ['modelClass', 'form'];

    /**
     * @var string The context to pass to the form widget.
     */
    protected $context;

    /**
     * @var Model The initialized model used by the form.
     */
    protected $model;

    /**
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
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
     * Prepare the widgets used by this action
     * @param Model $model
     * @return void
     */
    public function initForm($model, $context = null)
    {
        if ($context !== null)
            $this->context = $context;

        $context = $this->formGetContext();

        /*
         * Each page can supply a unique form definition, if desired
         */
        $formFields = $this->config->form;

        if ($context == self::CONTEXT_CREATE) {
            $formFields = $this->getConfig('create[form]', $formFields);
        }
        elseif ($context == self::CONTEXT_UPDATE) {
            $formFields = $this->getConfig('update[form]', $formFields);
        }
        elseif ($context == self::CONTEXT_PREVIEW) {
            $formFields = $this->getConfig('preview[form]', $formFields);
        }

        $config = $this->makeConfig($formFields);
        $config->model = $model;
        $config->arrayName = class_basename($model);
        $config->context = $context;

        /*
         * Form Widget with extensibility
         */
        $this->formWidget = $this->makeWidget('Backend\Widgets\Form', $config);

        $this->formWidget->bindEvent('form.extendFieldsBefore', function () {
            $this->controller->formExtendFieldsBefore($this->formWidget);
        });

        $this->formWidget->bindEvent('form.extendFields', function ($fields) {
            $this->controller->formExtendFields($this->formWidget, $fields);
        });

        $this->formWidget->bindEvent('form.beforeRefresh', function ($holder) {
            $result = $this->controller->formExtendRefreshData($this->formWidget, $holder->data);
            if (is_array($result)) $holder->data = $result;
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
     * Prepares common form data
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
     * Create Controller action
     * @param string $context Explicitly define a form context.
     * @return void
     */
    public function create($context = null)
    {
        try {
            $this->context = strlen($context) ? $context : $this->getConfig('create[context]', self::CONTEXT_CREATE);
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang(
                'create[title]',
                'backend::lang.form.create_title'
            );

            $model = $this->controller->formCreateModelObject();
            $this->initForm($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    /**
     * Ajax handler for saving from the creation form.
     * @return mixed
     */
    public function create_onSave($context = null)
    {
        $this->context = strlen($context) ? $context : $this->getConfig('create[context]', self::CONTEXT_CREATE);
        $model = $this->controller->formCreateModelObject();
        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeCreate($model);

        $modelsToSave = $this->prepareModelsToSave($model, $this->formWidget->getSaveData());
        foreach ($modelsToSave as $modelToSave) {
            $modelToSave->save(null, $this->formWidget->getSessionKey());
        }

        $this->controller->formAfterSave($model);
        $this->controller->formAfterCreate($model);

        Flash::success($this->getLang('create[flashSave]', 'backend::lang.form.create_success'));

        if ($redirect = $this->makeRedirect('create', $model)) {
            return $redirect;
        }
    }

    //
    // Update
    //

    /**
     * Edit Controller action
     * @param int $recordId The model primary key to update.
     * @param string $context Explicitly define a form context.
     * @return void
     */
    public function update($recordId = null, $context = null)
    {
        try {
            $this->context = strlen($context) ? $context : $this->getConfig('update[context]', self::CONTEXT_UPDATE);
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang(
                'update[title]',
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
     * Ajax handler for updating the form.
     * @param int $recordId The model primary key to update.
     * @return mixed
     */
    public function update_onSave($recordId = null, $context = null)
    {
        $this->context = strlen($context) ? $context : $this->getConfig('update[context]', self::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeUpdate($model);

        $modelsToSave = $this->prepareModelsToSave($model, $this->formWidget->getSaveData());
        foreach ($modelsToSave as $modelToSave) {
            $modelToSave->save(null, $this->formWidget->getSessionKey());
        }

        $this->controller->formAfterSave($model);
        $this->controller->formAfterUpdate($model);

        Flash::success($this->getLang('update[flashSave]', 'backend::lang.form.update_success'));

        if ($redirect = $this->makeRedirect('update', $model)) {
            return $redirect;
        }
    }

    /**
     * Ajax handler for deleting the record.
     * @param int $recordId The model primary key to delete.
     * @return mixed
     */
    public function update_onDelete($recordId = null)
    {
        $this->context = $this->getConfig('update[context]', self::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $model->delete();

        $this->controller->formAfterDelete($model);

        Flash::success($this->getLang('update[flashDelete]', 'backend::lang.form.delete_success'));

        if ($redirect = $this->makeRedirect('delete', $model)) {
            return $redirect;
        }
    }

    //
    // Preview
    //

    /**
     * Preview Controller action
     * @param int $recordId The model primary key to preview.
     * @param string $context Explicitly define a form context.
     * @return void
     */
    public function preview($recordId = null, $context = null)
    {
        try {
            $this->context = strlen($context) ? $context : $this->getConfig('preview[context]', self::CONTEXT_PREVIEW);
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang(
                'preview[title]',
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
     * Render the form.
     * @param array $options Custom options to pass to the form widget.
     * @return string Rendered HTML for the form.
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
     * @return Model
     */
    public function formGetModel()
    {
        return $this->model;
    }

    /**
     * Returns the form context from the postback or configuration.
     * @return string
     */
    public function formGetContext()
    {
        return post('form_context', $this->context);
    }

    /**
     * Internal method, prepare the form model object
     * @return Model
     */
    protected function createModel()
    {
        $class = $this->config->modelClass;
        $model = new $class();

        $model = $this->controller->formExtendModel($model);
        return $model;
    }

    /**
     * Returns a Redirect object based on supplied context and parses the model primary key.
     * @param string $context Redirect context, eg: create, update, delete
     * @param Model $model The active model to parse in it's ID and attributes.
     * @return Redirect
     */
    public function makeRedirect($context = null, $model = null)
    {
        $redirectUrl = null;
        if (post('close') && !ends_with($context, '-close')) {
            $context .= '-close';
        }

        if (post('redirect', true)) {
            $redirectUrl = $this->getRedirectUrl($context);
        }

        if ($model && $redirectUrl) {
            $redirectUrl = RouterHelper::parseValues($model, array_keys($model->getAttributes()), $redirectUrl);
        }

        return ($redirectUrl) ? Backend::redirect($redirectUrl) : null;
    }

    /**
     * Internal method, returns a redirect URL from the config based on 
     * supplied context. Otherwise the default redirect is used.
     * @param string $context Redirect context, eg: create, update, delete.
     * @return string
     */
    protected function getRedirectUrl($context = null)
    {
        $redirects = [
            'default'      => $this->getConfig('defaultRedirect', ''),
            'create'       => $this->getConfig('create[redirect]', ''),
            'create-close' => $this->getConfig('create[redirectClose]', ''),
            'update'       => $this->getConfig('update[redirect]', ''),
            'update-close' => $this->getConfig('update[redirectClose]', ''),
            'preview'      => $this->getConfig('preview[redirect]', ''),
        ];

        if (!isset($redirects[$context])) {
            return $redirects['default'];
        }

        return $redirects[$context];
    }

    /**
     * Parses in some default variables to a language string defined in config.
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
     * Renders a single form field.
     * @param string Field name
     * @return string The field HTML markup.
     */
    public function formRenderField($name)
    {
        return $this->formWidget->renderField($name);
    }

    /**
     * Renders the form in preview mode.
     * @return string The form HTML markup.
     */
    public function formRenderPreview()
    {
        return $this->formRender(['preview' => true]);
    }

    /**
     * Helper for custom layouts. Renders Outside Fields.
     * @return string The area HTML markup.
     */
    public function formRenderOutsideFields()
    {
        return $this->formRender(['section' => 'outside']);
    }

    /**
     * Helper for custom layouts. Renders Primary Tabs.
     * @return string The tab HTML markup.
     */
    public function formRenderPrimaryTabs()
    {
        return $this->formRender(['section' => 'primary']);
    }

    /**
     * Helper for custom layouts. Renders Secondary Tabs.
     * @return string The tab HTML markup.
     */
    public function formRenderSecondaryTabs()
    {
        return $this->formRender(['section' => 'secondary']);
    }

    /**
     * Returns the widget used by this behavior.
     * @return Backend\Classes\WidgetBase
     */
    public function formGetWidget()
    {
        return $this->formWidget;
    }

    /**
     * Helper to get a unique ID for the form widget.
     * @return string
     */
    public function formGetId($suffix = null)
    {
        return $this->formWidget->getId($suffix);
    }

    /**
     * Helper to get the form session key.
     * @return string
     */
    public function formGetSessionKey($suffix = null)
    {
        return $this->formWidget->getSessionKey();
    }

    //
    // Overrides
    //

    /**
     * Called before the creation or updating form is saved.
     * @param Model
     */
    public function formBeforeSave($model)
    {
    }

    /**
     * Called after the creation or updating form is saved.
     * @param Model
     */
    public function formAfterSave($model)
    {
    }

    /**
     * Called before the creation form is saved.
     * @param Model
     */
    public function formBeforeCreate($model)
    {
    }

    /**
     * Called after the creation form is saved.
     * @param Model
     */
    public function formAfterCreate($model)
    {
    }

    /**
     * Called before the updating form is saved.
     * @param Model
     */
    public function formBeforeUpdate($model)
    {
    }

    /**
     * Called after the updating form is saved.
     * @param Model
     */
    public function formAfterUpdate($model)
    {
    }

    /**
     * Called after the form model is deleted.
     * @param Model
     */
    public function formAfterDelete($model)
    {
    }


    /**
     * Finds a Model record by its primary identifier, used by update actions. This logic
     * can be changed by overriding it in the controller.
     * @param string $recordId
     * @return Model
     */
    public function formFindModelObject($recordId)
    {
        if (!strlen($recordId)) {
            throw new ApplicationException($this->getLang('not-found-message', 'backend::lang.form.missing_id'));
        }

        $model = $this->createModel();

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

        return $result;
    }

    /**
     * Creates a new instance of a form model, used by create actions. This logic
     * can be changed by overriding it in the controller.
     * @return Model
     */
    public function formCreateModelObject()
    {
        return $this->createModel();
    }

    /**
     * Called before the form fields are defined.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @return void
     */
    public function formExtendFieldsBefore($host)
    {
    }

    /**
     * Called after the form fields are defined.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @return void
     */
    public function formExtendFields($host, $fields)
    {
    }

    /**
     * Called before the form is refreshed, should return an array of additional save data.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @param array $saveData Current save data
     * @return array
     */
    public function formExtendRefreshData($host, $saveData)
    {
    }

    /**
     * Called when the form is refreshed, giving the opportunity to modify the form fields.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @param array $fields Current form fields
     * @return array
     */
    public function formExtendRefreshFields($host, $fields)
    {
    }

    /**
     * Called after the form is refreshed, should return an array of additional result parameters.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @param array $result Current result parameters.
     * @return array
     */
    public function formExtendRefreshResults($host, $result)
    {
    }

    /**
     * Extend supplied model used by create and update actions, the model can
     * be altered by overriding it in the controller.
     * @param Model $model
     * @return Model
     */
    public function formExtendModel($model)
    {
        return $model;
    }

    /**
     * Extend the query used for finding the form model. Extra conditions
     * can be applied to the query, for example, $query->withTrashed();
     * @param October\Rain\Database\Builder $query
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
