<?php namespace Backend\Classes;

use Str;
use Lang;
use System\Classes\ApplicationException;
use October\Rain\Extension\ExtensionBase;
use Backend\Traits\ViewMaker;

/**
 * Controller Behavior base class
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ControllerBehavior extends ExtensionBase
{
    use \System\Traits\AssetMaker;
    use \System\Traits\ConfigMaker;
    use \Backend\Traits\WidgetMaker;
    use \Backend\Traits\ViewMaker {
        ViewMaker::makeFileContents as localMakeFileContents;
    }

    /**
     * @var array Supplied configuration.
     */
    protected $config;

    /**
     * @var Backend\Classes\Controller Reference to the back end controller.
     */
    protected $controller;

    /**
     * @var array Properties that must exist in the controller using this behavior.
     */
    protected $requiredProperties = [];

    /**
     * Constructor.
     */
    public function __construct($controller)
    {
        $this->controller = $controller;

        // Option A: (@todo Determine which is faster by benchmark)
        // $relativePath = strtolower(str_replace('\\', '/', get_called_class()));
        // $this->viewPath = $this->configPath = ['modules/' . $relativePath . '/partials', 'plugins/' . $relativePath . '/partials'];
        // $this->assetPath = ['modules/' . $relativePath . '/assets', 'plugins/' . $relativePath . '/assets'];

        // Option B:
        $this->viewPath = $this->configPath = $this->guessViewPath('/partials');
        $this->assetPath = $this->guessViewPath('/assets', true);

        /*
         * Validate controller properties
         */
        foreach ($this->requiredProperties as $property) {
            if (!isset($controller->{$property})) {
                throw new ApplicationException(Lang::get('system::lang.behavior.missing_property', [
                    'class' => get_class($controller),
                    'property' => $property,
                    'behavior' => get_called_class()
                ]));
            }
        }
    }

    /**
     * Sets the configuration values
     * @param mixed $config   Config object or array
     * @param array $required Required config items
     */
    public function setConfig($config, $required = null)
    {
        $this->config = $this->makeConfig($config, $required);
    }

    /**
     * Safe accessor for configuration values.
     * @param $name Config name, supports array names like "field[key]"
     * @param $default Default value if nothing is found
     * @return string
     */
    public function getConfig($name, $default = null)
    {
        /*
         * Array field name, eg: field[key][key2][key3]
         */
        $keyParts = Str::evalHtmlArray($name);

        /*
         * First part will be the field name, pop it off
         */
        $fieldName = array_shift($keyParts);
        if (!isset($this->config->{$fieldName}))
            return $default;

        $result = $this->config->{$fieldName};

        /*
         * Loop the remaining key parts and build a result
         */
        foreach ($keyParts as $key) {
            if (!array_key_exists($key, $result))
                return $default;

            $result = $result[$key];
        }

        return $result;
    }

    /**
     * Protects a public method from being available as an controller action.
     * These methods could be defined in a controller to override a behavior default action.
     * Such methods should be defined as public, to allow the behavior object to access it.
     * By default public methods of a controller are considered as actions.
     * To prevent this occurrence, methods should be hidden by using this method.
     * @param mixed $methodName Specifies a method name.
     */
    protected function hideAction($methodName)
    {
        if (!is_array($methodName))
            $methodName = [$methodName];

        $this->controller->hiddenActions = array_merge($this->controller->hiddenActions, $methodName);
    }

    /**
     * Makes all views in context of the controller, not the behavior.
     * @param string $filePath Absolute path to the view file.
     * @param array $extraParams Parameters that should be available to the view.
     * @return string
     */
    public function makeFileContents($filePath, $extraParams = [])
    {
        $this->controller->vars = array_merge($this->controller->vars, $this->vars);
        return $this->controller->makeFileContents($filePath, $extraParams);
    }

    /**
     * Returns true in case if a specified method exists in the extended controller.
     * @param string $methodName Specifies the method name
     * @return bool
     */
    protected function controllerMethodExists($methodName)
    {
        return method_exists($this->controller, $methodName);
    }
}