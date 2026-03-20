<?php namespace Backend\Classes;

use File;
use SystemException;
use October\Rain\Extension\Extendable;
use Backend\Classes\Controller;

/**
 * VueComponentBase class.
 *
 * Each component must include two files:
 *   vuecomponents/mycomponents
 *   - partials/_mycomponents.php
 *   - assets/js/mycomponents.js
 *
 * The optional CSS file is loaded automatically if presented:
 *   vuecomponents/mycomponents
 *   - assets/css/mycomponents.css
 *
 * Components can have subcomponents. Each subcomponent
 * must be presented with a JavaScript file and partial.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class VueComponentBase extends Extendable
{
    use \System\Traits\ViewMaker;
    use \System\Traits\AssetMaker;

    /**
     * @var \Backend\Classes\Controller controller object
     */
    protected $controller;

    /**
     * @var string componentName is the Vue component tag name.
     * Must be defined in each component class.
     */
    protected $componentName;

    /**
     * @var array require Vue component class names for this component.
     */
    protected $require = [];

    /**
     * @var array subcomponents this component provides
     */
    private $subcomponents = [];

    /**
     * @var array esmModules are JavaScript-only ESM modules (no template)
     */
    private $esmModules = [];

    /**
     * __construct
     * @param \Backend\Classes\Controller $controller
     */
    public function __construct(Controller $controller)
    {
        $this->controller = $controller;
        $this->viewPath = $this->guessViewPath('/partials');
        $this->assetPath = $this->guessViewPath('/assets', true);

        // Prepare assets used by this widget.
        $this->loadDependencyAssets();
        $this->loadDefaultAssets();
        $this->loadAssets();
        $this->registerSubcomponents();
        $this->prepareVars();

        parent::__construct();
    }

    /**
     * render the default component partial.
     */
    public function render()
    {
        return $this->makePartial($this->getComponentBaseName());
    }

    /**
     * renderSubcomponent
     */
    public function renderSubcomponent($name)
    {
        if (!array_key_exists($name, $this->subcomponents)) {
            throw new SystemException(sprintf('Subcomponent not registered: %s', $name));
        }

        return $this->makePartial($name);
    }

    /**
     * getDependencies
     */
    public function getDependencies()
    {
        return $this->require;
    }

    /**
     * getSubcomponents
     */
    public function getSubcomponents()
    {
        return array_keys($this->subcomponents);
    }

    /**
     * getEsmModules returns JS-only ESM modules (no templates)
     */
    public function getEsmModules()
    {
        return array_keys($this->esmModules);
    }

    /**
     * getEsmModulePath returns the ESM module path for this component.
     * By default, derived from the component's asset path.
     */
    public function getEsmModulePath(): string
    {
        $baseName = $this->getComponentBaseName();
        return $this->assetPath . "/js/{$baseName}.js";
    }

    /**
     * getSubcomponentEsmPath returns the ESM path for a specific subcomponent.
     */
    public function getSubcomponentEsmPath(string $name): string
    {
        return $this->assetPath . "/js/{$name}.js";
    }

    /**
     * loadDefaultAssets adds the default CSS file for this component.
     * JavaScript is loaded via ESM imports in VueMaker::outputVueComponentTemplates()
     */
    protected function loadDefaultAssets()
    {
        $baseName = $this->getComponentBaseName();

        $cssPath = "css/{$baseName}.css";
        if (File::exists(base_path($this->assetPath.'/'.$cssPath))) {
            $this->addCss($cssPath);
        }
    }

    /**
     * prepareVars required by the component's partials
     */
    protected function prepareVars()
    {
    }

    /**
     * loadAssets adds component specific asset files. Use $this->addJs() and
     * $this->addCss() to register new assets to include on the page.
     * The default component script and CSS file are loaded automatically.
     * @return void
     */
    protected function loadAssets()
    {
    }

    /**
     * loadDependencyAssets adds dependency assets required for the component.
     * This method is called before the component's default resources are loaded.
     * Use $this->addJs() and $this->addCss() to register new assets to include
     * on the page.
     * @return void
     */
    protected function loadDependencyAssets()
    {
    }

    /**
     * getComponentBaseName
     */
    protected function getComponentBaseName()
    {
        $classNameArray = explode('\\', get_class($this));
        return strtolower(end($classNameArray));
    }

    /**
     * getComponentName returns the Vue component tag name.
     */
    public function getComponentName(): string
    {
        if (!$this->componentName) {
            throw new SystemException(sprintf(
                'Vue component [%s] must define a $componentName property.',
                get_class($this)
            ));
        }

        return $this->componentName;
    }

    /**
     * getSubcomponentName returns the Vue component tag name for a subcomponent.
     */
    public function getSubcomponentName(string $subcomponent): string
    {
        return $this->getComponentName() . '-' . $subcomponent;
    }

    /**
     * registerSubcomponent adds a subcomponent.
     * @param string $name The component name.
     * A JavaScript file and partial with the same name must exist.
     * JavaScript is loaded via ESM imports in VueMaker::outputVueComponentTemplates()
     */
    protected function registerSubcomponent($name)
    {
        $name = strtolower($name);
        $this->subcomponents[$name] = true;
    }

    /**
     * registerEsmModule adds a JavaScript-only ESM module (no template).
     * Use this for utility/helper modules that don't have Vue templates.
     * @param string $name The module name (without .js extension).
     */
    protected function registerEsmModule($name)
    {
        $name = strtolower($name);
        $this->esmModules[$name] = true;
    }

    /**
     * registerSubcomponents
     */
    protected function registerSubcomponents()
    {
    }
}
