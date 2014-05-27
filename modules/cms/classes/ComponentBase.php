<?php namespace Cms\Classes;

use Str;
use Lang;
use Config;
use Cms\Classes\CodeBase;
use Cms\Classes\CmsException;
use October\Rain\Extension\Extendable;

/**
 * Component base class
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class ComponentBase extends Extendable
{
    use \System\Traits\AssetMaker;
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
     * @var string Icon of the plugin that defines the component. 
     * This field is used by the CMS internally.
     */
    public $pluginIcon;

    /**
     * @var string Specifies the component directory name.
     */
    protected $dirName;

    /**
     * @var Cms\Classes\Controller Controller object.
     */
    protected $controller;

    /**
     * @var Cms\Classes\PageCode Page object object.
     */
    protected $page;

    /**
     * @var array Cache of linked Component objects, used for page links.
     */
    protected $pageLinkCache = [];

    /**
     * Component constructor. Takes in the page or layout code section object
     * and properties set by the page or layout.
     */
    public function __construct(CodeBase $cmsObject = null, $properties = [])
    {
        if ($cmsObject !== null) {
            $this->controller = $cmsObject->controller;
            $this->page = $cmsObject;
        }

        $this->properties = $this->validateProperties($properties);

        $className = Str::normalizeClassName(get_called_class());
        $this->dirName = strtolower(str_replace('\\', '/', $className));
        $this->assetPath = Config::get('cms.pluginsDir') . dirname(dirname($this->dirName));

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
        return base_path() . Config::get('cms.pluginsDir') . $this->dirName;
    }

    /**
     * Executed when this component is first initialized, before AJAX requests.
     */
    public function onInit() {}

    /**
     * Executed when this component is bound to a page or layout, part of 
     * the page life cycle.
     */
    public function onRun() {}

    /**
     * Executed when this component is rendered on a page or layout.
     */
    public function onRender() {}

    /**
     * Dynamically handle calls into the controller instance.
     * @param string $method
     * @param array $parameters
     * @return mixed
     */
    public function __call($method, $parameters)
    {
        if (method_exists($this, $method))
            return call_user_func_array([$this, $method], $parameters);

        if (method_exists($this->controller, $method))
            return call_user_func_array([$this->controller, $method], $parameters);

        throw new CmsException(Lang::get('cms::lang.component.method_not_found', [
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

    /**
     * Returns a defined property or parameter value.
     * @param $name The property or parameter name to look for.
     * @param $default A default value to return if no value is found.
     * @return string
     */
    public function propertyOrParam($name, $default =  null)
    {
        $value = $this->property($name, $default);

        if (substr($value, 0, 1) == ':')
            return $this->param(substr($value, 1), $default);

        return $value;
    }

    /**
     * Creates a page link to another page. Allows mapping to the other page's
     * component properties for the purpose of extracting URL routing parameters.
     * @param  string $page  Page name or page file name
     * @param  string $class Component class name
     * @param  array $mappings ['componentProperty' => 'routed value']
     * @return string
     */
    // protected function makePageLink($page, $class, $mappings = [])
    // {
    //     if (!isset($this->pageLinkCache[$page.$class])) {
    //         $this->pageLinkCache[$page.$class] = $this->getOtherPageComponent($page, $class);
    //     }

    //     if (!$component = $this->pageLinkCache[$page.$class])
    //         return null;

    //     $params = [];
    //     foreach ($mappings as $property => $value) {

    //         if (!$param = $component->property($property))
    //             continue;

    //         if (substr($param, 0, 1) == ':')
    //             $param = substr($param, 1);

    //         $params[$param] = $value;
    //     }

    //     return $this->pageUrl($page, $params);
    // }

}