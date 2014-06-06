<?php namespace Backend\Behaviors;

use Str;
use Lang;
use Flash;
use Event;
use Input;
use Redirect;
use Backend;
use Backend\Classes\ControllerBehavior;
use October\Rain\Support\Util;
use October\Rain\Router\Helper as RouterHelper;
use System\Classes\ApplicationException;
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
    /**
     * @var Backend\Classes\WidgetBase Reference to the widget object.
     */
    private $formWidget;

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
     * Behavior constructor
     * @param Backend\Classes\Controller $controller
     * @return void
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
    public function initForm($model)
    {
        $context = $this->formGetContext();

        $config = $this->makeConfig($this->config->form);
        $config->model = $model;
        $config->arrayName = Str::getRealClass($model);
        $config->context = $context;

        /*
         * Form Widget with extensibility
         */
        $this->formWidget = $this->makeWidget('Backend\Widgets\Form', $config);

        $this->formWidget->bindEvent('form.extendFieldsBefore', function($host) {
            $this->controller->formExtendFieldsBefore($host);
        });

        $this->formWidget->bindEvent('form.extendFields', function($host) {
            $this->controller->formExtendFields($host);
        });

        $this->formWidget->bindToController();

        /*
         * Detected Relation controller behavior
         */
        if ($this->controller->isClassExtendedWith('Backend.Behaviors.RelationController'))
            $this->controller->initRelation($model);
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
            $this->context = strlen($context) ? $context : $this->getConfig('create[context]', 'create');
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang('create[title]', 'backend::lang.form.create_title');
            $model = $this->createModel();
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
    public function create_onSave()
    {
        $model = $this->createModel();
        $this->initForm($model);

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeCreate($model);

        $this->setModelAttributes($model, $this->formWidget->getSaveData());
        $model->push($this->formWidget->getSessionKey());

        $this->controller->formAfterSave($model);
        $this->controller->formAfterCreate($model);

        Flash::success($this->getLang('create[flash-save]', 'backend::lang.form.create_success'));

        if ($redirect = $this->makeRedirect('create', $model))
            return $redirect;
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
            $this->context = strlen($context) ? $context : $this->getConfig('update[context]', 'update');
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang('update[title]', 'backend::lang.form.update_title');
            $model = $this->controller->formFindModelObject($recordId);
            $this->initForm($model);

            $this->controller->vars['formModel'] = $model;
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
    public function update_onSave($recordId = null)
    {
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model, 'update');

        $this->controller->formBeforeSave($model);
        $this->controller->formBeforeUpdate($model);

        $this->setModelAttributes($model, $this->formWidget->getSaveData());
        $model->push($this->formWidget->getSessionKey());

        $this->controller->formAfterSave($model);
        $this->controller->formAfterUpdate($model);

        Flash::success($this->getLang('update[flash-save]', 'backend::lang.form.update_success'));

        if ($redirect = $this->makeRedirect('update', $model))
            return $redirect;
    }

    /**
     * Ajax handler for deleting the record.
     * @param int $recordId The model primary key to delete.
     * @return mixed
     */
    public function update_onDelete($recordId = null)
    {
        $model = $this->controller->formFindModelObject($recordId);
        $this->initForm($model, 'update');

        $model->delete();

        $this->controller->formAfterDelete($model);

        Flash::success($this->getLang('update[flash-delete]', 'backend::lang.form.delete_success'));

        if ($redirect = $this->makeRedirect('delete', $model))
            return $redirect;
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
            $this->context = strlen($context) ? $context : $this->getConfig('preview[context]', 'preview');
            $this->controller->pageTitle = $this->controller->pageTitle ?: $this->getLang('preview[title]', 'backend::lang.form.preview_title');
            $model = $this->controller->formFindModelObject($recordId);
            $this->initForm($model);

            $this->controller->vars['formModel'] = $model;
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
        if (!$this->formWidget)
            throw new ApplicationException(Lang::get('backend::lang.form.behavior_not_ready'));

        return $this->formWidget->render($options);
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
        if (post('close') && !ends_with($context, '-close'))
            $context .= '-close';

        if (post('redirect', true))
            $redirectUrl = Backend::url($this->getRedirectUrl($context));

        if ($model && $redirectUrl)
            $redirectUrl = RouterHelper::parseValues($model, [$model->getKeyName()], $redirectUrl);

        return ($redirectUrl) ? Redirect::to($redirectUrl) : null;
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

        if (!isset($redirects[$context]))
            return $redirects['default'];

        return $redirects[$context];
    }

    /**
     * Parses in some default variables to a language string defined in config.
     * @param string $name Configuration property containing the language string
     * @param string $default A default language string to use if the config is not found
     * @param array $extras Any extra params to include in the language string variables
     * @return string The translated string.
     */
    private function getLang($name, $default = null, $extras = [])
    {
        $name = $this->getConfig($name, $default);
        $vars = [
            'name' => Lang::get($this->getConfig('name', trans('backend::lang.model.name')))
        ];
        $vars = array_merge($vars, $extras);
        return trans($name, $vars);
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
    public function formRenderSecondaryTabs($suppressTabs = false)
    {
        return $this->formRender(['section' => 'secondary']);
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
    public function formBeforeSave($model) {}

    /**
     * Called after the creation or updating form is saved.
     * @param Model
     */
    public function formAfterSave($model) {}

    /**
     * Called before the creation form is saved.
     * @param Model
     */
    public function formBeforeCreate($model) {}

    /**
     * Called after the creation form is saved.
     * @param Model
     */
    public function formAfterCreate($model) {}

    /**
     * Called before the updating form is saved.
     * @param Model
     */
    public function formBeforeUpdate($model) {}

    /**
     * Called after the updating form is saved.
     * @param Model
     */
    public function formAfterUpdate($model) {}

    /**
     * Called after the form model is deleted.
     * @param Model
     */
    public function formAfterDelete($model) {}

    /**
     * Finds a Model record based on it's primary identifier. This logic
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
     * Called before the form fields are defined.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @return void
     */
    public function formExtendFieldsBefore($host) {}

    /**
     * Called after the form fields are defined.
     * @param Backend\Widgets\Form $host The hosting form widget
     * @return void
     */
    public function formExtendFields($host) {}

    /**
     * Extend supplied model, the model can be altered by overriding
     * it in the controller.
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
    public function formExtendQuery($query) {}

    //
    // Internals
    //

    /**
     * Sets a data collection to a model attributes, relations will also be set.
     * @param array $saveData Data to save.
     * @param Model $model Model to save to
     * @return void
     */
    private function setModelAttributes($model, $saveData)
    {
        if (!is_array($saveData))
            return;

        $singularTypes = ['belongsTo', 'hasOne', 'morphOne'];
        foreach ($saveData as $attribute => $value) {
            if (is_array($value) && $model->hasRelation($attribute) && in_array($model->getRelationType($attribute), $singularTypes))
                $this->setModelAttributes($model->{$attribute}, $value);
            else
                $model->{$attribute} = $value;
        }
    }

}