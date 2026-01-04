<?php namespace Cms\Classes\Controller;

use Lang;
use Config;
use Cms\Classes\ComponentManager;
use Cms\Classes\CmsException;
use Cms\Classes\ComponentPartial;
use Cms\Classes\ComponentBase;
use Larajax\Contracts\ViewComponentInterface;
use Throwable;

/**
 * HasComponentHelpers
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
trait HasComponentHelpers
{
    /**
     * addComponentInstance
     */
    public function addComponentInstance(string $alias, ViewComponentInterface $instance)
    {
        $this->page->components[$alias] = $instance;
    }

    /**
     * getComponentInstance returns an instance of a component based on its alias
     */
    public function getComponentInstance(string $alias): ViewComponentInterface
    {
        return $this->findComponentByName($alias);
    }

    /**
     * addComponent class or short name to the page or layout object, assigning
     * it an alias with configuration as properties.
     * @param mixed  $name
     * @param string $alias
     * @param array  $properties
     * @param bool   $addToLayout
     * @return ComponentBase|null
     */
    public function addComponent($name, $alias, $properties = [], $addToLayout = false)
    {
        $manager = ComponentManager::instance();

        if ($addToLayout) {
            $componentObj = $manager->makeComponent($name, $this->layoutObj, $properties);
        }
        else {
            $componentObj = $manager->makeComponent($name, $this->pageObj, $properties);
        }

        if (!$componentObj) {
            $strictMode = Config::get('cms.strict_components', false);
            if ($strictMode) {
                throw new CmsException(Lang::get('cms::lang.component.not_found', ['name' => $name]));
            }
            else {
                return $this->vars[$alias] = null;
            }
        }

        $componentObj->alias = $alias;

        if ($addToLayout) {
            $this->layout->components[$alias] = $componentObj;
        }
        else {
            $this->page->components[$alias] = $componentObj;
        }

        $this->vars[$alias] = $componentObj->makePrimaryAccessor();

        $this->parseRouteParamsOnComponent($componentObj, $this->router->getParameters());

        try {
            $componentObj->init();
        }
        catch (Throwable $e) {
            unset($this->vars[$alias]);

            if ($addToLayout) {
                unset($this->layout->components[$alias]);
            }
            else {
                unset($this->page->components[$alias]);
            }

            throw $e;
        }

        return $componentObj;
    }

    /**
     * addPartialComponent adds a component to a partial object, used internally by
     * the public renderPartial method
     */
    protected function addPartialComponent($partial, &$vars, $name, $alias, $properties = [])
    {
        $manager = ComponentManager::instance();

        $componentObj = $manager->makeComponent($name, $this->pageObj, $properties);

        if (!$componentObj) {
            $strictMode = Config::get('cms.strict_components', false);
            if ($strictMode) {
                throw new CmsException(Lang::get('cms::lang.component.not_found', ['name' => $name]));
            }
            else {
                return $vars[$alias] = null;
            }
        }

        $componentObj->alias = $alias;

        $partial->components[$alias] = $componentObj;

        $vars[$alias] = $componentObj->makePrimaryAccessor();

        $this->partialStack->addComponent($alias, $componentObj);

        $this->parseRouteParamsOnComponent($componentObj, $this->router->getParameters());

        $componentObj->init();

        $this->parseEnvironmentVarsOnComponent($componentObj, $vars + $this->vars);

        return $componentObj;
    }

    /**
     * findComponentByName searches the layout and page components by an alias
     * and returns the component object if found.
     * @param $name
     * @return ComponentBase|null
     */
    public function findComponentByName($name)
    {
        if (isset($this->page->components[$name])) {
            return $this->page->components[$name];
        }

        if (isset($this->layout->components[$name])) {
            return $this->layout->components[$name];
        }

        if ($this->partialStack) {
            $partialComponent = $this->partialStack->getComponent($name);
            if ($partialComponent !== null) {
                return $partialComponent;
            }
        }

        return null;
    }

    /**
     * findComponentByHandler searches the layout and page components by an AJAX handler
     * and returns the component object if found.
     * @param string $handler
     * @return ComponentBase|null
     */
    public function findComponentByHandler($handler)
    {
        foreach ($this->page->components as $component) {
            if ($component->methodExists($handler)) {
                return $component;
            }
        }

        foreach ($this->layout->components as $component) {
            if ($component->methodExists($handler)) {
                return $component;
            }
        }

        if ($this->partialStack) {
            foreach ($this->partialStack->getComponents() as $component) {
                if ($component->methodExists($handler)) {
                    return $component;
                }
            }
        }

        return null;
    }

    /**
     * findComponentByPartial searches the layout and page components by a partial file
     * and returns the component object if found.
     * @param string $partial
     * @return ComponentBase|null
     */
    public function findComponentByPartial($partial)
    {
        foreach ($this->page->components as $component) {
            if (ComponentPartial::check($component, $partial)) {
                return $component;
            }
        }

        foreach ($this->layout->components as $component) {
            if (ComponentPartial::check($component, $partial)) {
                return $component;
            }
        }

        if ($this->partialStack) {
            foreach ($this->partialStack->getComponents() as $component) {
                if (ComponentPartial::check($component, $partial)) {
                    return $component;
                }
            }
        }

        return null;
    }
}
