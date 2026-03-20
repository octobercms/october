<?php namespace Dashboard\Behaviors;

use Backend;
use BackendAuth;
use October\Rain\Html\Helper as HtmlHelper;
use Backend\Classes\ControllerBehavior;
use ApplicationException;

/**
 * DashController adds features for working with dashboard reports. This behavior will include
 * methods for rendering registered dashboards to the controller along with some relevant
 * AJAX handlers.
 *
 * This behavior is implemented in the controller like so:
 *
 *     public $implement = [
 *         \Dashboard\Behaviors\DashController::class,
 *     ];
 *
 *     public $dashConfig = 'config_dash.yaml';
 *
 * The `$dashConfig` property makes reference to the form configuration
 * values as either a YAML file, located in the controller view directory,
 * or directly as a PHP array.
 *
 * @see https://docs.octobercms.com/4.x/extend/dashboards/dash-controller.html Dash Controller Documentation
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
class DashController extends ControllerBehavior
{
    /**
     * @var const PARAM_DEFINITION postback parameter for the active dashboard name
     */
    const PARAM_DEFINITION = '_dash_definition';

    /**
     * @var string definition code for the active dashboard
     */
    protected $definition;

    /**
     * @var array dashDefinitions are keys for alias and value for configuration.
     */
    protected $dashDefinitions;

    /**
     * @var array dashConfig are keys for alias and value for config objects.
     */
    protected $dashConfig = [];

    /**
     * @var \Backend\Classes\WidgetBase dashWidget reference to the dash widget object.
     */
    protected $dashWidget = [];

    /**
     * @var array requiredProperties in the controller
     */
    protected $requiredProperties = ['dashConfig'];

    /**
     * @var array requiredDashProperties that must exist for each dashboard definition
     */
    protected $requiredDashProperties = [];

    /**
     * @var array requiredConfig values that must exist when applying the primary config file.
     */
    protected $requiredConfig = [];

    /**
     * @var object originalConfig values
     */
    protected $originalConfig;

    /**
     * __construct the behavior
     * @param \Backend\Classes\Controller $controller
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        // Build configuration
        $this->setConfig($controller->dashConfig ?? [], $this->requiredConfig);
    }

    /**
     * validateDash validates the supplied field and initializes the dashboard.
     * @param string $definition
     * @return string
     */
    protected function validateDash($definition)
    {
        $definition = $definition ?: post(self::PARAM_DEFINITION);

        if ($definition && $definition !== $this->definition) {
            $this->initDash($definition);
        }

        if (!$definition && !$this->definition) {
            throw new ApplicationException(__("Dash behavior does not contain a definition for [:field]", ['field' => $definition]));
        }

        return $definition ?: $this->definition;
    }

    /**
     * prepareVars for display
     */
    public function prepareVars()
    {
        $this->vars['dashDefinition'] = $this->definition;
        $this->vars['dashWidget'] = $this->dashWidget;
    }

    /**
     * initDash
     */
    public function initDash($definition = null)
    {
        if ($this->originalConfig === null) {
            $this->originalConfig = $this->controller->dashGetConfig();
        }

        if ($definition === null) {
            $definition = post(self::PARAM_DEFINITION);
        }

        $this->config = $this->originalConfig;
        $this->definition = $definition;

        if (!$definition) {
            return;
        }

        // Configuration details
        if (!$this->dashHasDefinition($definition)) {
            throw new ApplicationException(__("Dash behavior does not contain a definition for [:field]", ['field' => $definition]));
        }

        $this->config = $this->makeConfig($this->originalConfig->{$definition}, $this->requiredDashProperties);

        // Dash widget
        if ($this->dashWidget = $this->makeDashWidget()) {
            $this->dashWidget->bindToController();
        }
    }

    /**
     * dashHasDefinition
     */
    public function dashHasDefinition(string $definition): bool
    {
        if ($this->originalConfig === null) {
            $this->config = $this->originalConfig = $this->controller->dashGetConfig();
        }

        return (bool) ($this->originalConfig->{$definition} ?? false);
    }

    /**
     * dashRegisterDefinition registers a new dash dynamically
     */
    public function dashRegisterDefinition(string $dashName, array $config)
    {
        if ($this->originalConfig === null) {
            $this->config = $this->originalConfig = $this->controller->dashGetConfig();
        }

        $this->originalConfig->{$dashName} = $config;
    }

    /**
     * dashRender the prepared form markup. This method is usually called from a view file.
     *
     *     <?= $this->dashRender('system') ?>
     *
     * The first argument supports an array of render options. The supported
     * options can be found via the `render` method of the Dash widget class.
     *
     *     <?= $this->dashRender('system', ['preview' => true]) ?>
     *
     * @see Backend\Widgets\Form
     * @param array $options Render options
     * @return string Rendered HTML for the form.
     */
    public function dashRender($definition, $options = [])
    {
        if ($definition === null) {
            $definition = $this->definition;
        }

        // Initialize
        $this->validateDash($definition);
        $this->prepareVars();

        return $this->dashMakePartial('container');
    }

    /**
     * dashMakePartial is a controller accessor for making partials within this behavior.
     * @param string $partial
     * @param array $params
     * @return string Partial contents
     */
    public function dashMakePartial($partial, $params = [])
    {
        $contents = $this->controller->makePartial('dash_'.$partial, $params + $this->vars, false);
        if (!$contents) {
            $contents = $this->makePartial($partial, $params);
        }

        return $contents;
    }

    /**
     * dashGetId returns a unique ID for this dash and field combination.
     * @param string $suffix A suffix to use with the identifier.
     * @return string
     */
    public function dashGetId($suffix = null)
    {
        $id = class_basename($this);
        if ($this->definition) {
            $id .= '-' . HtmlHelper::nameToId($this->definition);
        }

        if ($suffix !== null) {
            $id .= '-' . $suffix;
        }

        return $this->controller->getId($id);
    }

    /**
     * dashGetConfig returns the configuration used by this behavior. You may override this
     * method in your controller as an alternative to defining a dashConfig property.
     * @return object|null
     */
    public function dashGetConfig()
    {
        return $this->config;
    }

    /**
     * makeDash prepares the widgets used by this action
     * @return \Backend\Classes\WidgetBase
     */
    protected function makeDashWidget()
    {
        $widgetConfig = $this->config;
        $widgetConfig->canCreateAndEdit = BackendAuth::userHasAccess('dashboard.manage');
        $widgetConfig->alias = camel_case('dash '.HtmlHelper::nameToId($this->definition));
        $widgetConfig->code = $this->definition;

        $widget = $this->makeWidget(\Dashboard\Widgets\Dash::class, $widgetConfig);

        return $widget;
    }
}
