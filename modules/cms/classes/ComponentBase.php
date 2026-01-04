<?php namespace Cms\Classes;

use Str;
use Lang;
use Config;
use October\Rain\Extension\Extendable;
use October\Contracts\Twig\CallsAnyMethod;
use Larajax\Contracts\ViewComponentInterface;
use BadMethodCallException;

/**
 * ComponentBase class
 *
 * @mixin \Cms\Classes\Controller
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ComponentBase extends Extendable implements ViewComponentInterface, CallsAnyMethod
{
    use \System\Traits\AssetMaker;
    use \System\Traits\EventEmitter;
    use \System\Traits\DependencyMaker;
    use \System\Traits\PropertyContainer;
    use \Larajax\Traits\ViewComponent;

    /**
     * @var string id is a unique identifier for this component.
     */
    public $id;

    /**
     * @var string name as a class name or class alias used in the component declaration in a template.
     */
    public $name;

    /**
     * @var boolean isHidden determines whether the component is hidden from the backend UI.
     */
    public $isHidden = false;

    /**
     * @var string pluginIcon of the plugin that defines the component.
     * This field is used by the CMS internally.
     */
    public $pluginIcon;

    /**
     * @var string componentCssClass name for the backend page/layout component list.
     * This field is used by the CMS internally.
     */
    public $componentCssClass;

    /**
     * @var boolean inspectorEnabled determines whether Inspector can be used with the component.
     * This field is used by the CMS internally.
     */
    public $inspectorEnabled = true;

    /**
     * @var string dirName specifies the component directory name.
     */
    protected $dirName;

    /**
     * @var \Cms\Classes\PageCode page object object.
     */
    protected $page;

    /**
     * @var array externalPropertyNames is a collection of external property names used by this component.
     */
    protected $externalPropertyNames = [];

    /**
     * @var string componentGetPathCache
     */
    protected $componentGetPathCache;

    /**
     * __construct the component, which takes in the page or layout code section object
     * and properties set by the page or layout.
     * @param CodeBase|null $cmsObject
     * @param array $properties
     */
    public function __construct($cmsObject = null, $properties = [])
    {
        if ($cmsObject !== null) {
            $this->page = $cmsObject;
            $this->controller = $cmsObject->controller;
        }

        $this->properties = $this->validateProperties($properties);

        $className = Str::normalizeClassName(get_called_class());
        $this->dirName = strtolower(str_replace('\\', '/', $className));

        $this->assetPath = $this->getComponentAssetRelativePath();
        $this->assetUrlPath = $this->getComponentAssetUrlPath();

        parent::__construct();
    }

    /**
     * componentDetails returns information about this component, including name and description
     */
    public function componentDetails()
    {
        return [
            'name' => Str::title(str_replace('_', ' ', Str::snake(class_basename(static::class)))),
            'description' => __("No description provided.")
        ];
    }

    /**
     * makePrimaryAccessor returns the PHP object variable for the Twig view layer.
     */
    public function makePrimaryAccessor()
    {
        return $this;
    }

    /**
     * getPath returns the absolute component path
     */
    public function getPath()
    {
        if ($this->componentGetPathCache !== null) {
            return $this->componentGetPathCache;
        }

        return $this->componentGetPathCache = strpos(static::class, 'App\\') === 0
            ? base_path($this->dirName)
            : plugins_path($this->dirName);
    }

    /**
     * init is executed when this component is first initialized, before AJAX requests.
     */
    public function init()
    {
    }

    /**
     * onRun is executed when this component is bound to a page or layout, part of
     * the page life cycle.
     */
    public function onRun()
    {
    }

    /**
     * onRender is executed when this component is rendered on a page or layout.
     */
    public function onRender()
    {
    }

    /**
     * renderPartial renders a requested partial in context of this component,
     * see Cms\Classes\Controller@renderPartial for usage.
     */
    public function renderPartial(...$args)
    {
        /** @var \Cms\Classes\Controller $controller */
        $controller = $this->controller;

        return $controller->inComponentContext($this, function() use ($controller, $args) {
            return $controller->renderPartial(...$args);
        });
    }

    /**
     * runLifeCycle executes the life cycle for the component.
     */
    public function runLifeCycle()
    {
        if ($event = $this->fireEvent('component.beforeRun', [], true)) {
            return $event;
        }

        if ($result = $this->onRun()) {
            return $result;
        }

        if ($event = $this->fireEvent('component.run', [], true)) {
            return $event;
        }
    }

    /**
     * runAjaxHandler executes the event cycle when running an AJAX handler.
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
         *             [$componentAlias, $handlerName] = explode('::', $handler);
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
         *             [$componentAlias, $handlerName] = explode('::', $handler);
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

        $result = $this->makeCallMethod($this, $handler);

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
         *     $this->controller->bindEvent('component.beforeRunAjaxHandler', function ((string) $handler, (mixed) $result) {
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
     * setExternalPropertyNames sets names used by external properties.
     * @param array $names The key should be the property name,
     *                     the value should be the external property name.
     * @return void
     */
    public function setExternalPropertyNames(array $names)
    {
        $this->externalPropertyNames = $names;
    }

    /**
     * setExternalPropertyName sets an external property name.
     * @param string $name Property name
     * @param string $extName External property name
     * @return void
     */
    public function setExternalPropertyName($name, $extName)
    {
        array_set($this->externalPropertyNames, $name, $extName);
    }

    /**
     * propertyName returns the external property name when the property value is an external
     * property reference. Otherwise the default value specified is returned.
     * @param string $name
     * @param mixed $default
     * @return string
     */
    public function propertyName($name, $default = null)
    {
        return array_get($this->externalPropertyNames, $name, $default);
    }

    /**
     * paramName returns the external property name when the property value is a routing
     * parameter reference. Otherwise the default value specified is returned.
     * @param string $name
     * @param mixed $default
     * @return string
     */
    public function paramName($name, $default = null)
    {
        if (($extName = $this->propertyName($name)) && substr($extName, 0, 1) === ':') {
            return substr($extName, 1);
        }

        return $default;
    }

    /**
     * getController returns the controller using this component.
     */
    public function getController()
    {
        return $this->controller;
    }

    //
    // Magic methods
    //

    /**
     * __call dynamically handles calls into the controller instance.
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
     * __toString returns the component's alias, used by __SELF__
     */
    public function __toString()
    {
        return $this->alias;
    }

    //
    // Internals
    //

    /**
     * getComponentAssetRelativePath
     */
    protected function getComponentAssetRelativePath(): string
    {
        $dirName = dirname(dirname($this->dirName));

        return "/plugins/{$dirName}";
    }

    /**
     * getComponentAssetUrlPath returns the public directory for the component assets
     */
    protected function getComponentAssetUrlPath(): string
    {
        // Configuration for theme asset location, default to relative path
        $assetUrl = (string) Config::get('system.plugins_asset_url') ?: '/plugins';

        // Build path
        $dirName = dirname(dirname($this->dirName));

        return $assetUrl . '/' . $dirName;
    }
}
