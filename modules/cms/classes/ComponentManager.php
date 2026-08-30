<?php namespace Cms\Classes;

use App;
use Str;
use System;
use Config;
use System\Classes\PluginManager;
use SystemException;

/**
 * ComponentManager
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class ComponentManager
{
    /**
     * @var array codeMap where keys are codes and values are class names.
     */
    protected $codeMap;

    /**
     * @var array classMap where keys are class names and values are codes.
     */
    protected $classMap;

    /**
     * @var array ownerDetailsMap with owner information about a component.
     */
    protected $ownerDetailsMap;

    /**
     * @var array ownerMap where keys are class name and values are owner class.
     */
    protected $ownerMap;

    /**
     * @var array detailsCache array of component details.
     */
    protected $detailsCache;

    /**
     * instance creates a new instance of this singleton
     */
    public static function instance(): static
    {
        return App::make('cms.components');
    }

    /**
     * registerComponents manually registers a component for consideration. Usage:
     *
     *     ComponentManager::registerComponents(function ($manager) {
     *         $manager->registerComponent(\October\Demo\Components\Test::class, 'testComponent');
     *     });
     *
     * @deprecated this will be removed in a later version
     * @param callable $callback A callable function.
     */
    public function registerComponents(callable $definitions)
    {
        App::extendInstance('cms.components', $definitions);
    }

    /**
     * loadComponents scans each plugin an loads it's components.
     */
    protected function loadComponents()
    {
        // Load module items
        foreach (System::listModules() as $module) {
            if ($provider = App::getProvider($module . '\\ServiceProvider')) {
                $this->loadComponentsFromArray($provider->registerComponents(), $provider);
                $this->loadComponentsFromArray($provider->registerPageSnippets());
            }
        }

        // Load plugin components
        foreach (PluginManager::instance()->getPlugins() as $plugin) {
            $this->loadComponentsFromArray($plugin->registerComponents(), $plugin);
            $this->loadComponentsFromArray($plugin->registerPageSnippets());
        }

        // Load app items
        if ($app = App::getProvider(\App\Provider::class)) {
            $this->loadComponentsFromArray($app->registerComponents(), $app);
            $this->loadComponentsFromArray($app->registerPageSnippets());
        }
    }

    /**
     * loadComponentsFromArray helper
     */
    protected function loadComponentsFromArray($items, $owner = null)
    {
        if (!is_array($items)) {
            return;
        }

        foreach ($items as $className => $code) {
            $this->registerComponent($className, $code, $owner);
        }
    }

    /**
     * registerComponent registers a single component.
     */
    public function registerComponent($className, $code = null, $owner = null)
    {
        if (!$this->classMap) {
            $this->classMap = [];
        }

        if (!$this->codeMap) {
            $this->codeMap = [];
        }

        if (!$code) {
            $code = Str::getClassId($className);
        }

        if ($code === 'viewBag' && $className !== \Cms\Components\ViewBag::class) {
            throw new SystemException(sprintf(
                'The component code viewBag is reserved. Please use another code for the component class %s.',
                $className
            ));
        }

        if ($code === 'translatable' && $className !== \Cms\Components\TranslatableBag::class) {
            throw new SystemException(sprintf(
                'The component code translatable is reserved. Please use another code for the component class %s.',
                $className
            ));
        }

        $className = Str::normalizeClassName($className);
        $this->codeMap[$code] = $className;
        $this->classMap[$className] = $code;

        if ($owner !== null) {
            if ($owner instanceof \System\Classes\PluginBase) {
                $this->setComponentOwnerAsPlugin($code, $className, $owner);
            }
            else {
                $this->setComponentOwnerAsProvider($code, $className, $owner);
            }
        }
    }

    /**
     * setComponentOwnerAsPlugin
     */
    protected function setComponentOwnerAsPlugin(string $code, string $className, $pluginObj): void
    {
        $ownerClass = get_class($pluginObj);

        if (!isset($this->ownerDetailsMap[$ownerClass])) {
            $this->ownerDetailsMap[$ownerClass] = [
                'details' => $pluginObj->pluginDetails(),
                'components' => []
            ];
        }

        $this->ownerMap[$className] = $ownerClass;
        $this->ownerDetailsMap[$ownerClass]['components'][$code] = $className;
    }

    /**
     * setComponentOwnerAsProvider
     */
    protected function setComponentOwnerAsProvider(string $code, string $className, $providerObj): void
    {
        $ownerClass = get_class($providerObj);

        if (!isset($this->ownerDetailsMap[$ownerClass])) {
            $providerName = substr($ownerClass, 0, strrpos($ownerClass, '\\'));
            $this->ownerDetailsMap[$ownerClass] = [
                'details' => [
                    'name' => class_basename($providerName),
                    'icon' => 'icon-puzzle-piece'
                ],
                'components' => []
            ];
        }

        $this->ownerMap[$className] = $ownerClass;
        $this->ownerDetailsMap[$ownerClass]['components'][$code] = $className;
    }

    /**
     * listComponents returns a list of registered components. Returns array keys
     * as codes and values as class names.
     * @return array
     */
    public function listComponents()
    {
        if ($this->codeMap === null) {
            $this->loadComponents();
        }

        return $this->codeMap;
    }

    /**
     * listComponentDetails returns an array of all component detail definitions.
     * Returns array keys as component codes and values as the details defined
     * in the component.
     * @return array
     */
    public function listComponentDetails()
    {
        if ($this->detailsCache !== null) {
            return $this->detailsCache;
        }

        $result = [];
        foreach ($this->listComponents() as $componentAlias => $componentClass) {
            $componentObj = $this->makeComponent($componentClass);
            $details = $componentObj->componentDetails();
            $details['isHidden'] = $componentObj->isHidden;
            $result[$componentAlias] = $details;
        }

        return $this->detailsCache = $result;
    }

    /**
     * listComponentOwnerDetails returns the components grouped by owner and injects the owner details.
     */
    public function listComponentOwnerDetails()
    {
        $details = $this->listComponentDetails();
        if (!$this->ownerDetailsMap) {
            return [];
        }

        $owners = $this->ownerDetailsMap;
        foreach ($this->ownerDetailsMap as $ownerClass => $ownerArr) {
            $components = $ownerArr['components'] ?? [];
            foreach ($components as $code => $className) {
                $detailsArr = $details[$code] ?? [];
                $owners[$ownerClass]['components'][$code] = ['className' => $className] + $detailsArr;
            }
        }

        return $owners;
    }

    /**
     * resolve returns a class name from a component code
     * Normalizes a class name or converts an code to it's class name.
     * @return string The class name resolved, or null.
     */
    public function resolve($name)
    {
        $codes = $this->listComponents();

        if (isset($codes[$name])) {
            return $codes[$name];
        }

        $name = Str::normalizeClassName($name);
        if (isset($this->classMap[$name])) {
            return $name;
        }

        return null;
    }

    /**
     * hasComponent checks to see if a component has been registered.
     * @param string $name A component class name or code.
     * @return bool Returns true if the component is registered, otherwise false.
     */
    public function hasComponent($name)
    {
        $className = $this->resolve($name);
        if (!$className) {
            return false;
        }

        return isset($this->classMap[$className]);
    }

    /**
     * makeComponent object with properties set.
     * @param string $name A component class name or code.
     * @param CmsObject $cmsObject The Cms object that spawned this component.
     * @param array $properties The properties set by the Page or Layout.
     * @return ComponentBase|null The component object.
     */
    public function makeComponent($name, $cmsObject = null, $properties = [])
    {
        $className = $this->resolve($name);
        if (!$className) {
            $strictMode = Config::get('cms.strict_components', false);
            if ($strictMode) {
                throw new SystemException(sprintf(
                    'Class name is not registered for the component "%s". Check the component plugin.',
                    $name
                ));
            }
            else {
                return null;
            }
        }

        if (!class_exists($className)) {
            throw new SystemException(sprintf(
                'Component class not found "%s". Check the component plugin.',
                $className
            ));
        }

        $component = App::make($className, [
            'cmsObject' => $cmsObject,
            'properties' => $properties
        ]);

        $component->name = $name;

        return $component;
    }

    /**
     * findComponentOwnerDetails returns details about the component owner as an array.
     */
    public function findComponentOwnerDetails($component): array
    {
        $className = Str::normalizeClassName(get_class($component));

        if (isset($this->ownerMap[$className])) {
            $ownerClass = $this->ownerMap[$className];
            return $this->ownerDetailsMap[$ownerClass]['details'] ?? [];
        }

        return [];
    }
}
