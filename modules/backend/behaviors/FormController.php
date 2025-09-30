<?php namespace Backend\Behaviors;

use Str;
use App;
use Lang;
use Flash;
use Event;
use Redirect;
use Backend;
use BackendAuth;
use Backend\Classes\FormField;
use Backend\Classes\ControllerBehavior;
use October\Rain\Router\Helper as RouterHelper;
use ApplicationException;
use ForbiddenException;
use Exception;

/**
 * FormController adds features for working with backend forms. This behavior will inject
 * CRUD actions to the controller -- including create, update and preview -- along with
 * some relevant AJAX handlers.
 *
 * Each action supports a custom context code, allowing fields to be displayed or hidden
 * on a contextual basis, as specified by the form field definitions or some other
 * custom logic.
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         \Backend\Behaviors\FormController::class,
 *     ];
 *
 *     public $formConfig = 'config_form.yaml';
 *
 * The `$formConfig` property makes reference to the form configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @see https://docs.octobercms.com/4.x/extend/forms/form-controller.html Form Controller Documentation
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class FormController extends ControllerBehavior
{
    use \Backend\Traits\FormModelSaver;
    use \Backend\Behaviors\FormController\HasMultisite;
    use \Backend\Behaviors\FormController\HasOverrides;
    use \Backend\Behaviors\FormController\HasFormDesigns;
    use \Backend\Behaviors\FormController\HasRenderers;

    /**
     * @var \Backend\Classes\Controller|FormController controller reference
     */
    protected $controller;

    /**
     * @var \Backend\Widgets\Form formWidget object
     */
    protected $formWidget;

    /**
     * @inheritDoc
     */
    protected $requiredProperties = ['formConfig'];

    /**
     * @var array requiredConfig that must exist when applying the primary config file
     */
    protected $requiredConfig = ['modelClass', 'form'];

    /**
     * @var array actions visible in context of the controller
     */
    protected $actions = ['create', 'update', 'preview'];

    /**
     * @var string context to pass to the form widget
     */
    protected $context;

    /**
     * @var Model model used by the form
     */
    protected $model;

    /**
     * @var array customMessages contains default messages that you can override
     */
    protected $customMessages = [
        'notFound' => "Form record with an ID of :id could not be found.",
        'flashCreate' => ":name Created",
        'flashUpdate' => ":name Updated",
        'flashDelete' => ":name Deleted",
    ];

    /**
     * __construct the behavior
     * @param Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        // Build configuration
        $this->setConfig($controller->formConfig, $this->requiredConfig);

        if (!$this->isPopupDesign()) {
            $this->hidePopupDesign();
        }
    }

    /**
     * beforeDisplay fires before the page is displayed and AJAX is executed.
     */
    public function beforeDisplay()
    {
        if ($this->isPopupDesign()) {
            $this->beforeDisplayPopup();
        }
    }

    /**
     * initForm initializes the form configuration against a model and context value.
     * This will process the configuration found in the `$formConfig` property
     * and prepare the Form widget, which is the underlying tool used for
     * actually rendering the form. The model used by this form is passed
     * to this behavior via this method as the first argument.
     *
     * @see Backend\Widgets\Form
     * @param October\Rain\Database\Model $model
     * @param string $context Form context
     * @return void
     */
    public function initForm($model, $context = null)
    {
        if ($context !== null) {
            $this->context = $context;
        }

        $context = $this->formGetContext();
        $formConfig = $this->config = $this->controller->formGetConfig();

        // Each page can supply a unique form definition, if desired
        $formFields = $this->getConfig("{$context}[form]", $formConfig->form);

        $config = $this->makeConfig($formFields);
        $config->model = $model;
        $config->arrayName = class_basename($model);
        $config->context = $this->getConfig("{$context}[context]", $context);
        $config->surveyMode = $this->isSurveyDesign();
        $config->sessionKey = post('_form_session_key');
        $config->horizontalMode = $this->isHorizontalForm();

        // Make Form Widget and apply extensions
        $this->formWidget = $this->makeWidget(\Backend\Widgets\Form::class, $config);

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

        // Detected Relation controller behavior
        if ($this->controller->isClassExtendedWith(\Backend\Behaviors\RelationController::class)) {
            $this->controller->initRelation($model);
        }

        $this->prepareVars($model);
        $this->model = $model;
    }

    /**
     * Prepares commonly used view data.
     * @param October\Rain\Database\Model $model
     */
    protected function prepareVars($model)
    {
        $this->controller->vars['formModel'] = $model;
        $this->controller->vars['formContext'] = $this->formGetContext();
        $this->controller->vars['formRecordName'] = Lang::get($this->getConfig('name', 'backend::lang.model.name'));
        $this->controller->vars['formSidebarWidth'] = $this->getDesignFormSize('sidebarSize');
    }

    //
    // Create
    //

    /**
     * create controller action used for creating new model records.
     *
     * @param string $context Form context
     * @return void
     */
    public function create($context = null)
    {
        if (!$this->controller->formCheckPermission('modelCreate')) {
            throw new ForbiddenException;
        }

        try {
            $this->context = $context ?: $this->getConfig('create[context]', FormField::CONTEXT_CREATE);
            $this->controller->bodyClass ??= $this->getDesignBodyClass();
            $this->controller->pageSize ??= $this->getDesignFormSize();
            $this->controller->pageTitle ??= $this->getLang('create[title]', 'backend::lang.form.create_title');

            $model = $this->controller->formCreateModelObject();
            $model = $this->controller->formExtendModel($model) ?: $model;

            $this->initForm($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    /**
     * create_onSave AJAX handler called from the create action and
     * primarily used for creating new records.
     *
     * This handler will invoke the unique controller overrides
     * `formBeforeCreate` and `formAfterCreate`.
     *
     * @param string $context Form context
     * @return mixed
     */
    public function create_onSave($context = null)
    {
        if (!$this->controller->formCheckPermission('modelCreate')) {
            throw new ForbiddenException;
        }

        $this->context = $context ?: $this->getConfig('create[context]', FormField::CONTEXT_CREATE);

        $model = $this->controller->formCreateModelObject();
        $model = $this->controller->formExtendModel($model) ?: $model;

        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeCreate($model);
        $this->controller->fireSystemEvent('backend.form.beforeSave', [$model]);
        $this->controller->fireSystemEvent('backend.form.beforeCreate', [$model]);

        $this->performSaveOnModel(
            $model,
            $this->formWidget->getSaveData(),
            ['sessionKey' => $this->formWidget->getSessionKey(), 'propagate' => true]
        );

        $this->controller->formAfterSave($model);
        $this->controller->formAfterCreate($model);
        $this->controller->fireSystemEvent('backend.form.afterSave', [$model]);
        $this->controller->fireSystemEvent('backend.form.afterCreate', [$model]);

        Flash::success($this->getCustomLang('flashCreate'));

        if ($redirect = $this->makeRedirect('create', $model)) {
            return $redirect;
        }
    }

    /**
     * create_onCancel AJAX handler called from the create action and
     * used for aborting record creation
     *
     * This handler will invoke the unique controller override
     * `formAfterCancel`.
     *
     * @return mixed
     */
    public function create_onCancel($context = null)
    {
        $this->context = $context ?: $this->getConfig('create[context]', FormField::CONTEXT_CREATE);

        $model = $this->controller->formCreateModelObject();
        $model = $this->controller->formExtendModel($model) ?: $model;

        $this->initForm($model);

        $model->cancelDeferred($this->formWidget->getSessionKey());

        $this->controller->formAfterCancel($model);
        $this->controller->fireSystemEvent('backend.form.afterCancel', [$model]);

        if ($redirect = $this->makeRedirect('cancel')) {
            return $redirect;
        }
    }

    //
    // Update
    //

    /**
     * update controller action used for updating existing model records.
     * This action takes a record identifier (primary key of the model)
     * to locate the record used for sourcing the existing form values.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return void
     */
    public function update($recordId = null, $context = null)
    {
        if (!$this->controller->formCheckPermission('modelUpdate')) {
            throw new ForbiddenException;
        }

        try {
            $this->context = $context ?: $this->getConfig('update[context]', FormField::CONTEXT_UPDATE);
            $this->controller->bodyClass ??= $this->getDesignBodyClass();
            $this->controller->pageSize ??= $this->getDesignFormSize();
            $this->controller->pageTitle ??= $this->getLang('update[title]', 'backend::lang.form.update_title');

            $model = $this->controller->formFindModelObject($recordId);

            // Multisite
            if ($this->controller->formHasMultisite($model)) {
                if ($redirect = $this->makeMultisiteRedirect('create', $model)) {
                    return $redirect;
                }

                $this->addHandlerToSiteSwitcher();
            }

            $this->initForm($model);
        }
        catch (Exception $ex) {
            $this->controller->handleError($ex);
        }
    }

    /**
     * update_onSave AJAX handler called from the update action and
     * primarily used for updating existing records.
     *
     * This handler will invoke the unique controller overrides
     * `formBeforeUpdate` and `formAfterUpdate`.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return mixed
     */
    public function update_onSave($recordId = null, $context = null)
    {
        if (!$this->controller->formCheckPermission('modelUpdate')) {
            throw new ForbiddenException;
        }

        $this->context = $context ?: $this->getConfig('update[context]', FormField::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeUpdate($model);
        $this->controller->fireSystemEvent('backend.form.beforeSave', [$model]);
        $this->controller->fireSystemEvent('backend.form.beforeUpdate', [$model]);

        $this->performSaveOnModel(
            $model,
            $this->formWidget->getSaveData(),
            ['sessionKey' => $this->formWidget->getSessionKey(), 'propagate' => true]
        );

        $this->controller->formAfterSave($model);
        $this->controller->formAfterUpdate($model);
        $this->controller->fireSystemEvent('backend.form.afterSave', [$model]);
        $this->controller->fireSystemEvent('backend.form.afterUpdate', [$model]);

        Flash::success($this->getCustomLang('flashUpdate'));

        if ($redirect = $this->makeRedirect('update', $model)) {
            return $redirect;
        }
    }

    /**
     * update_onDelete AJAX handler called from the update action and
     * used for deleting existing records.
     *
     * This handler will invoke the unique controller override
     * `formAfterDelete`.
     *
     * @param int $recordId Record identifier
     * @return mixed
     */
    public function update_onDelete($recordId = null)
    {
        if (!$this->controller->formCheckPermission('modelDelete')) {
            throw new ForbiddenException;
        }

        $this->context = $this->getConfig('update[context]', FormField::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $model->delete();

        $this->controller->formAfterDelete($model);
        $this->controller->fireSystemEvent('backend.form.afterDelete', [$model]);

        Flash::success($this->getCustomLang('flashDelete'));

        if ($redirect = $this->makeRedirect('delete', $model)) {
            return $redirect;
        }
    }

    /**
     * update_onCancel AJAX handler called from the update action and
     * used for aborting existing record updates.
     *
     * This handler will invoke the unique controller override
     * `formAfterCancel`.
     *
     * @param int $recordId Record identifier
     * @return mixed
     */
    public function update_onCancel($recordId = null)
    {
        $this->context = $this->getConfig('update[context]', FormField::CONTEXT_UPDATE);
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model);

        $model->cancelDeferred($this->formWidget->getSessionKey());

        $this->controller->formAfterCancel($model);
        $this->controller->fireSystemEvent('backend.form.afterCancel', [$model]);

        if ($redirect = $this->makeRedirect('cancel')) {
            return $redirect;
        }
    }

    //
    // Preview
    //

    /**
     * preview controller action used for viewing existing model records.
     * This action takes a record identifier (primary key of the model)
     * to locate the record used for sourcing the existing preview data.
     *
     * @param int $recordId Record identifier
     * @param string $context Form context
     * @return void
     */
    public function preview($recordId = null, $context = null)
    {
        if (!$this->controller->formCheckPermission('modelPreview')) {
            throw new ForbiddenException;
        }

        try {
            $this->context = $context ?: $this->getConfig('preview[context]', FormField::CONTEXT_PREVIEW);
            $this->controller->bodyClass ??= $this->getDesignBodyClass();
            $this->controller->pageSize ??= $this->getDesignFormSize();
            $this->controller->pageTitle ??= $this->getLang('preview[title]', 'backend::lang.form.preview_title');

            $model = $this->controller->formFindModelObject($recordId);

            // Multisite
            if ($this->controller->formHasMultisite($model)) {
                if ($redirect = $this->makeMultisiteRedirect('preview', $model)) {
                    return $redirect;
                }

                $this->addHandlerToSiteSwitcher();
            }

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
     * formRender the prepared form markup. This method is usually called from a view file.
     *
     *     <?= $this->formRender() ?>
     *
     * The first argument supports an array of render options. The supported
     * options can be found via the `render` method of the Form widget class.
     *
     *     <?= $this->formRender(['preview' => true, 'section' => 'primary']) ?>
     *
     * @see Backend\Widgets\Form
     * @param array $options Render options
     * @return string Rendered HTML for the form.
     */
    public function formRender($options = [])
    {
        if (!$this->formWidget) {
            throw new ApplicationException(Lang::get('backend::lang.form.behavior_not_ready'));
        }

        // Sections provided by the behavior, then use the widget as fallback
        $section = strtolower($options['section'] ?? '');
        switch ($section) {
            case 'buttons':
                return $this->formMakePartial($this->isPopupDesign() ? 'popup_buttons' : 'buttons');
        }

        return $this->formWidget->render($options);
    }

    /**
     * formRenderDesign renders a preset form design as either:
     * basic, custom, sidebar, document, popup
     */
    public function formRenderDesign($options = [])
    {
        if ($this->controller->hasFatalError()) {
            return $this->formMakePartial($this->isPopupDesign() ? 'popup_error' : 'error', [
                'fatalError' => $this->controller->getFatalError()
            ]);
        }

        if (!isset($options['displayMode'])) {
            $options['displayMode'] = $this->getDesignDisplayMode();
        }

        $this->vars['options'] = $options;

        $displayMode = strtolower($options['displayMode'] ?? 'basic');
        switch ($displayMode) {
            case 'popup':
            case 'sidebar':
            case 'document':
                return $this->formMakePartial("mode_{$displayMode}");

            case 'custom':
                return $this->formRender();

            default:
                return $this->formMakePartial('mode_basic');
        }
    }

    /**
     * formMakePartial is a controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string
     */
    public function formMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial('form_'.$partial, $params + $this->vars, false);
        if (!$contents) {
            $contents = $this->makePartial($partial, $params);
        }

        return $contents;
    }

    /**
     * formGetModel returns the model initialized by this form behavior.
     * The model will be provided by one of the page actions or AJAX
     * handlers via the `initForm` method.
     *
     * @return \October\Rain\Database\Model
     */
    public function formGetModel()
    {
        return $this->model;
    }

    /**
     * formGetContext returns the active form context, either obtained from the postback
     * variable called `form_context` or detected from the configuration,
     * or routing parameters.
     *
     * @return string
     */
    public function formGetContext()
    {
        return post('form_context') ?: $this->context;
    }

    /**
     * createModel internal method used to prepare the form model object.
     *
     * @return \October\Rain\Database\Model
     */
    protected function createModel()
    {
        return App::make($this->config->modelClass);
    }

    /**
     * makeRedirect returns a Redirect object based on supplied context and parses
     * the model primary key.
     *
     * @param string $context Redirect context, eg: create, update, delete
     * @param Model $model The active model to parse in it's ID and attributes.
     * @return Redirect
     */
    public function makeRedirect($context = null, $model = null, $queryParams = [])
    {
        $redirectUrl = null;
        if (post('close') && !ends_with($context, '-close')) {
            $context .= '-close';
        }

        if (post('refresh', false)) {
            return Redirect::refresh();
        }

        if (post('redirect', true)) {
            $redirectUrl = $this->getRedirectUrl($context);
        }

        if ($model && $redirectUrl) {
            $redirectUrl = RouterHelper::replaceParameters($model, $redirectUrl);
        }

        $url = $this->controller->formGetRedirectUrl($context, $model);
        if ($url) {
            $redirectUrl = $url;
        }

        if (!$redirectUrl) {
            return null;
        }

        if ($queryParams) {
            $redirectUrl .= '?' . http_build_query($queryParams);
        }

        if (starts_with($redirectUrl, ['//', 'http://', 'https://'])) {
            $redirect = Redirect::to($redirectUrl);
        }
        else {
            $redirect = Backend::redirect($redirectUrl);
        }

        return $redirect;
    }

    /**
     * getRedirectUrl is an internal method that returns a redirect URL from the config
     * based on supplied context. Otherwise the default redirect is used.
     *
     * @param string $context Redirect context, eg: create, update, delete.
     * @return string
     */
    protected function getRedirectUrl($context = null)
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
     * getLang parses in some default variables to a language string defined in config.
     *
     * @param string $name Configuration property containing the language string
     * @param string $default A default language string to use if the config is not found
     * @param array $extras Any extra params to include in the language string variables
     * @return string The translated string.
     */
    protected function getLang($name, $default = null, $extras = [])
    {
        $name = $this->getConfig($name, $default);

        $vars = $extras + [
            'name' => Lang::get($this->getConfig('name', 'backend::lang.model.name'))
        ];

        return Lang::get($name, $vars);
    }

    /**
     * getCustomLang parses custom messages provided by the config
     */
    protected function getCustomLang(string $name, ?string $default = null, array $extras = []): string
    {
        $foundKey = $this->getConfig("{$this->context}[customMessages][{$name}]");

        // @deprecated messages can be local to the config
        if ($foundKey === null) {
            $foundKey = $this->getConfig("{$this->context}[{$name}]");
        }

        if ($foundKey === null) {
            $foundKey = $this->getConfig("customMessages[{$name}]");
        }

        // @deprecated flashSave overrides flashCreate and flashUpdate
        if ($foundKey === null && in_array($name, ['flashCreate', 'flashUpdate'])) {
            return $this->getCustomLang('flashSave', $this->customMessages[$name], $extras);
        }

        if ($foundKey === null) {
            $foundKey = $default;
        }

        if ($foundKey === null) {
            $foundKey = $this->customMessages[$name] ?? '???';
        }

        $vars = $extras + [
            'name' => Lang::get($this->getConfig('name', 'backend::lang.model.name'))
        ];

        return Lang::get($foundKey, $vars);
    }

    //
    // Pass-through Helpers
    //

    /**
     * formGetWidget returns the form widget used by this behavior.
     *
     * @return Backend\Widgets\Form
     */
    public function formGetWidget()
    {
        return $this->formWidget;
    }

    /**
     * formGetId returns a unique ID for the form widget used by this behavior.
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
     * formGetSessionKey is a helper to get the form session key.
     * @return string
     */
    public function formGetSessionKey()
    {
        return $this->formWidget->getSessionKey();
    }

    /**
     * formGetConfig returns the configuration used by this behavior. You may override this
     * method in your controller as an alternative to defining a formConfig property.
     * @return object
     */
    public function formGetConfig()
    {
        $config = $this->config;

        $config->modelClass = Str::normalizeClassName($config->modelClass);

        return $config;
    }

    /**
     * formSetSaveValue will override the save values passed to the form. Set the value
     * to null to omit the field from the dataset.
     */
    public function formSetSaveValue($key, $value)
    {
        $this->formWidget->setSaveDataOverride($key, $value);
    }

    /**
     * formCheckPermission checks if a custom permission has been specified
     */
    public function formCheckPermission(string $name)
    {
        $foundKey = $this->getConfig("permissions[{$name}]");

        return $foundKey ? BackendAuth::userHasAccess($foundKey) : true;
    }

    //
    // Overrides
    //

    /**
     * formFindModelObject finds a Model record by its primary identifier, used by update
     * actions. This logic can be changed by overriding it in the controller.
     * @param string $recordId
     * @return Model
     */
    public function formFindModelObject($recordId)
    {
        if (!strlen($recordId)) {
            throw new ApplicationException($this->getCustomLang('notFound', 'backend::lang.form.missing_id'));
        }

        $model = $this->controller->formCreateModelObject();

        // Prepare query and find model record
        $query = $model->newQuery();

        // Remove multisite restriction
        if ($this->controller->formHasMultisite($model)) {
            $query->withSites();
        }

        $this->controller->formExtendQuery($query);
        $result = $query->find($recordId);

        if (!$result) {
            throw new ApplicationException($this->getCustomLang('notFound', null, [
                'class' => get_class($model), 'id' => $recordId
            ]));
        }

        $result = $this->controller->formExtendModel($result) ?: $result;

        return $result;
    }

    /**
     * extendFormFields is a static helper for extending form fields
     * @deprecated for best performance, use Event class directly, see docs
     * @link https://docs.octobercms.com/4.x/extend/forms/form-controller.html#extending-form-fields
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
