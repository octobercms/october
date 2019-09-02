<?php namespace Cms\Classes;

use Str;
use Lang;
use Config;
use October\Rain\Extension\Extendable;
use BadMethodCallException;

/**
 * Component base class
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ComponentBase extends Extendable
{
    use \System\Traits\AssetMaker;
    use \System\Traits\EventEmitter;
    use \System\Traits\PropertyContainer;

    /**
     * @var string A unique identifier for this component.
     */
    public $id;

    /**
     * @var string Alias used for this component.
     */
    public $alias;

    /**
     * @var string Component class name or class alias used in the component declaration in a template.
     */
    public $name;

    /**
     * @var boolean Determines whether the component is hidden from the back-end UI.
     */
    public $isHidden = false;

    /**
     * @var string Icon of the plugin that defines the component.
     * This field is used by the CMS internally.
     */
    public $pluginIcon;

    /**
     * @var string Component CSS class name for the back-end page/layout component list.
     * This field is used by the CMS internally.
     */
    public $componentCssClass;

    /**
     * @var boolean Determines whether Inspector can be used with the component.
     * This field is used by the CMS internally.
     */
    public $inspectorEnabled = true;

    /**
     * @var string Specifies the component directory name.
     */
    protected $dirName;

    /**
     * @var \Cms\Classes\Controller Controller object.
     */
    protected $controller;

    /**
     * @var \Cms\Classes\PageCode Page object object.
     */
    protected $page;

    /**
     * @var array A collection of external property names used by this component.
     */
    protected $externalPropertyNames = [];

    /**
     * Component constructor. Takes in the page or layout code section object
     * and properties set by the page or layout.
     * @param null|CodeBase $cmsObject
     * @param array $properties
     */
    public function __construct(CodeBase $cmsObject = null, $properties = [])
    {
        if ($cmsObject !== null) {
            $this->page = $cmsObject;
            $this->controller = $cmsObject->controller;
        }

        $this->properties = $this->validateProperties($properties);

        $className = Str::normalizeClassName(get_called_class());
        $this->dirName = strtolower(str_replace('\\', '/', $className));
        $this->assetPath = Config::get('cms.pluginsPath', '/plugins').dirname(dirname($this->dirName));

        parent::__construct();
    }

    /**
     * Returns information about this component, including name and description.
     */
    abstract public function componentDetails();

    /**
     * Returns the absolute component path.
     */
    public function getPath()
    {
        return plugins_path() . $this->dirName;
    }

    /**
     * Executed when this component is first initialized, before AJAX requests.
     */
    public function init()
    {
    }

    /**
     * Executed when this component is bound to a page or layout, part of
     * the page life cycle.
     */
    public function onRun()
    {
    }

    /**
     * Executed when this component is rendered on a page or layout.
     */
    public function onRender()
    {
    }

    /**
     * Renders a requested partial in context of this component,
     * see Cms\Classes\Controller@renderPartial for usage.
     */
    public function renderPartial()
    {
        $this->controller->setComponentContext($this);
        $result = call_user_func_array([$this->controller, 'renderPartial'], func_get_args());
        $this->controller->setComponentContext(null);
        return $result;
    }

    /**
     * Executes the event cycle when running an AJAX handler.
     * @return boolean Returns true if the handler was found. Returns false otherwise.
     */
    public function runAjaxHandler($handler)
    {
        /**
         * @event cms.component.beforeRunAjaxHandler
         * Provides an opportunity to modify an AJAX request to a component before it is processed by the component
         *
         * The parameter provided is `$handler` (the requested AJAX handler to be run)
         *
         * Example usage (forwards AJAX handlers to a backend widget):
         *
         *     Event::listen('cms.component.beforeRunAjaxHandler', function ((\Cms\Classes\ComponentBase) $component, (string) $handler) {
         *         if (strpos($handler, '::')) {
         *             list($componentAlias, $handlerName) = explode('::', $handler);
         *             if ($componentAlias === $this->getBackendWidgetAlias()) {
         *                 return $this->backendControllerProxy->runAjaxHandler($handler);
         *             }
         *         }
         *     });
         *
         * Or
         *
         *     $this->controller->bindEvent('component.beforeRunAjaxHandler', function ((string) $handler) {
         *         if (strpos($handler, '::')) {
         *             list($componentAlias, $handlerName) = explode('::', $handler);
         *             if ($componentAlias === $this->getBackendWidgetAlias()) {
         *                 return $this->backendControllerProxy->runAjaxHandler($handler);
         *             }
         *         }
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.component.beforeRunAjaxHandler', [$handler])) {
            return $event;
        }

        $result = $this->$handler();

        /**
         * @event cms.component.runAjaxHandler
         * Provides an opportunity to modify an AJAX request to a component after it is processed by the component
         *
         * The parameters provided are `$handler` (the requested AJAX handler to be run) and `$result` (the result of the component processing the request)
         *
         * Example usage (Logs requests and their response):
         *
         *     Event::listen('cms.component.beforeRunHandler', function ((\Cms\Classes\ComponentBase) $component, (string) $handler, (mixed) $result) {
         *         if (in_array($handler, $interceptHandlers)) {
         *             return 'request has been intercepted, original response: ' . json_encode($result);
         *         }
         *     });
         *
         * Or
         *
         *     $this->controller->bindEvent('componenet.beforeRunAjaxHandler', function ((string) $handler, (mixed) $result) {
         *         if (in_array($handler, $interceptHandlers)) {
         *             return 'request has been intercepted, original response: ' . json_encode($result);
         *         }
         *     });
         *
         */
        if ($event = $this->fireSystemEvent('cms.component.runAjaxHandler', [$handler, $result])) {
            return $event;
        }

        return $result;
    }

    //
    // External properties
    //

    /*
     * Description on how to access external property names.
     *
     * # When
     * pageNumber = "7"
     * $this->propertyName('pageNumber'); // Returns NULL
     * $this->paramName('pageNumber');    // Returns NULL
     *
     * # When
     * pageNumber = "{{ :page }}"
     *
     * $this->propertyName('pageNumber'); // Returns ":page"
     * $this->paramName('pageNumber');    // Returns "page"
     *
     * # When
     * pageNumber = "{{ page }}"
     *
     * $this->propertyName('pageNumber'); // Returns "page"
     * $this->paramName('pageNumber');    // Returns NULL
     */

    /**
     * Sets names used by external properties.
     * @param array $names The key should be the property name,
     *                     the value should be the external property name.
     * @return void
     */
    public function setExternalPropertyNames(array $names)
    {
        $this->externalPropertyNames = $names;
    }

    /**
     * Sets an external property name.
     * @param string $name Property name
     * @param string $extName External property name
     * @return string
     */
    public function setExternalPropertyName($name, $extName)
    {
        return $this->externalPropertyNames[$name] = $extName;
    }

    /**
     * Returns the external property name when the property value is an external property reference.
     * Otherwise the default value specified is returned.
     * @param string $name The property name
     * @param mixed $default
     * @return string
     */
    public function propertyName($name, $default = null)
    {
        return array_get($this->externalPropertyNames, $name, $default);
    }

    /**
     * Returns the external property name when the property value is a routing parameter reference.
     * Otherwise the default value specified is returned.
     * @param string $name The property name
     * @param mixed $default
     * @return string
     */
    public function paramName($name, $default = null)
    {
        if (($extName = $this->propertyName($name)) && substr($extName, 0, 1) == ':') {
            return substr($extName, 1);
        }

        return $default;
    }

    //
    // Magic methods
    //

    /**
     * Dynamically handle calls into the controller instance.
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        try {
            return parent::__call($method, $parameters);
        }
        catch (BadMethodCallException $ex) {
        }

        if (method_exists($this->controller, $method)) {
            return call_user_func_array([$this->controller, $method], $parameters);
        }

        throw new BadMethodCallException(Lang::get('cms::lang.component.method_not_found', [
            'name' => get_class($this),
            'method' => $method
        ]));
    }

    /**
     * Returns the component's alias, used by __SELF__
     */
    public function __toString()
    {
        return $this->alias;
    }
}
