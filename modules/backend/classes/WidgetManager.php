<?php namespace Backend\Classes;

use Str;
use File;
use Lang;
use Closure;
use October\Rain\Support\Yaml;
use Illuminate\Container\Container;
use System\Classes\PluginManager;
use System\Classes\SystemException;

/**
 * Widget manager
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class WidgetManager
{
    use \October\Rain\Support\Traits\Singleton;

    /**
     * @var array An array of report widgets.
     */
    protected $formWidgets;

    /**
     * @var array Cache of report widget registration callbacks.
     */
    private $formWidgetCallbacks = [];

    /**
     * @var array An array of report widgets.
     */
    protected $formWidgetAliases;

    /**
     * @var array An array of report widgets.
     */
    protected $reportWidgets;

    /**
     * @var array Cache of report widget registration callbacks.
     */
    private $reportWidgetCallbacks = [];

    /**
     * @var array An array where keys are aliases and values are class names.
     */
    protected $aliasMap;

    /**
     * @var array An array where keys are class names and values are aliases.
     */
    protected $classMap;

    /**
     * @var array A cached array of widget details.
     */
    protected $detailsCache;

    /**
     * @var System\Classes\PluginManager
     */
    protected $pluginManager;

    /**
     * Initialize this singleton.
     */
    protected function init()
    {
        $this->pluginManager = PluginManager::instance();
    }

    /**
     * Makes a widget object with configuration set.
     * @param string $className A widget class name.
     * @param Controller $controller The Backend controller that spawned this widget.
     * @param array $configuration Configuration values.
     * @return WidgetBase The widget object.
     */
    public function makeWidget($className, $controller = null, $configuration = null)
    {
        /*
         * Build configuration
         */
        if ($configuration === null)
            $configuration = [];

        /*
         * Create widget object
         */
        if (!class_exists($className)) {
            throw new SystemException(Lang::get('backend::lang.widget.not_registered', [
                'name' => $className
            ]));
        }

        return new $className($controller, $configuration);
    }

    //
    // Form Widgets
    //

    /**
     * Returns a list of registered form widgets.
     * @return array Array keys are class names.
     */
    public function listFormWidgets()
    {
        if ($this->formWidgets === null) {
            $this->formWidgets = [];

            /*
             * Load module widgets
             */
            foreach ($this->formWidgetCallbacks as $callback) {
                $callback($this);
            }

            /*
             * Load plugin widgets
             */
            $plugins = $this->pluginManager->getPlugins();

            foreach ($plugins as $plugin) {
                if (!is_array($widgets = $plugin->registerFormWidgets()))
                    continue;

                foreach ($widgets as $className => $widgetInfo)
                    $this->registerFormWidget($className, $widgetInfo);
            }
        }

        return $this->formWidgets;
    }

    /*
     * Registers a single form form widget.
     */
    public function registerFormWidget($className, $widgetInfo = null)
    {
        $widgetAlias = isset($widgetInfo['alias']) ? $widgetInfo['alias'] : null;
        if (!$widgetAlias)
            $widgetAlias = Str::getClassId($className);

        $this->formWidgets[$className] = $widgetInfo;
        $this->formWidgetAliases[$widgetAlias] = $className;
    }

    /**
     * Manually registers form widget for consideration.
     * Usage:
     * <pre>
     *   WidgetManager::registerFormWidgets(function($manager){
     *       $manager->registerFormWidget('Backend\FormWidgets\CodeEditor', 'codeeditor');
     *       $manager->registerFormWidget('Backend\FormWidgets\RichEditor', 'richeditor');
     *   });
     * </pre>
     */
    public function registerFormWidgets(callable $definitions)
    {
        $this->formWidgetCallbacks[] = $definitions;
    }

    /**
     * Returns a class name from a form widget alias
     * Normalizes a class name or converts an alias to it's class name.
     * @param string $name Class name or form widget alias.
     * @return string The class name resolved, or the original name.
     */
    public function resolveFormWidget($name)
    {
        if ($this->formWidgets === null)
            $this->listFormWidgets();

        $aliases = $this->formWidgetAliases;

        if (isset($aliases[$name]))
            return $aliases[$name];

        $_name = Str::normalizeClassName($name);
        if (isset($this->formWidgets[$_name]))
            return $_name;

        return $name;
    }

    //
    // Report Widgets
    //

    /**
     * Returns a list of registered report widgets.
     * @return array Array keys are class names.
     */
    public function listReportWidgets()
    {
        if ($this->reportWidgets === null) {
            $this->reportWidgets = [];

            /*
             * Load module widgets
             */
            foreach ($this->reportWidgetCallbacks as $callback) {
                $callback($this);
            }

            /*
             * Load plugin widgets
             */
            $plugins = $this->pluginManager->getPlugins();

            foreach ($plugins as $plugin) {
                if (!is_array($widgets = $plugin->registerReportWidgets()))
                    continue;

                foreach ($widgets as $className => $widgetInfo)
                    $this->registerReportWidget($className, $widgetInfo);
            }
        }

        return $this->reportWidgets;
    }

    /*
     * Registers a single report widget.
     */
    public function registerReportWidget($className, $widgetInfo)
    {
        $this->reportWidgets[$className] = $widgetInfo;
    }

    /**
     * Manually registers report widget for consideration.
     * Usage:
     * <pre>
     *   WidgetManager::registerReportWidgets(function($manager){
     *       $manager->registerReportWidget('RainLab\GoogleAnalytics\ReportWidgets\TrafficOverview', [
     *           'name'=>'Google Analytics traffic overview',
     *           'context'=>'dashboard'
     *       ]);
     *   });
     * </pre>
     */
    public function registerReportWidgets(callable $definitions)
    {
        $this->reportWidgetCallbacks[] = $definitions;
    }
}