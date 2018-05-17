<?php namespace Backend\Classes;

use Str;
use System\Classes\PluginManager;
use Event;

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
     * @var array An array of form widgets. Stored in the form of ['FormWidgetClass' => $formWidgetInfo].
     */
    protected $formWidgets;

    /**
     * @var array Cache of form widget registration callbacks.
     */
    protected $formWidgetCallbacks = [];

    /**
     * @var array An array of form widgets keyed by their code. Stored in the form of ['formwidgetcode' => 'FormWidgetClass'].
     */
    protected $formWidgetHints;

    /**
     * @var array An array of report widgets.
     */
    protected $reportWidgets;

    /**
     * @var array Cache of report widget registration callbacks.
     */
    protected $reportWidgetCallbacks = [];

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
                if (!is_array($widgets = $plugin->registerFormWidgets())) {
                    continue;
                }

                foreach ($widgets as $className => $widgetInfo) {
                    $this->registerFormWidget($className, $widgetInfo);
                }
            }
        }

        return $this->formWidgets;
    }

    /**
     * Registers a single form widget.
     * @param string $className Widget class name.
     * @param array $widgetInfo Registration information, can contain a `code` key.
     * @return void
     */
    public function registerFormWidget($className, $widgetInfo = null)
    {
        if (!is_array($widgetInfo)) {
            $widgetInfo = ['code' => $widgetInfo];
        }

        $widgetCode = isset($widgetInfo['code']) ? $widgetInfo['code'] : null;

        if (!$widgetCode) {
            $widgetCode = Str::getClassId($className);
        }

        $this->formWidgets[$className] = $widgetInfo;
        $this->formWidgetHints[$widgetCode] = $className;
    }

    /**
     * Manually registers form widget for consideration.
     * Usage:
     *
     *     WidgetManager::registerFormWidgets(function($manager){
     *         $manager->registerFormWidget('Backend\FormWidgets\CodeEditor', 'codeeditor');
     *     });
     *
     */
    public function registerFormWidgets(callable $definitions)
    {
        $this->formWidgetCallbacks[] = $definitions;
    }

    /**
     * Returns a class name from a form widget code
     * Normalizes a class name or converts an code to its class name.
     * @param string $name Class name or form widget code.
     * @return string The class name resolved, or the original name.
     */
    public function resolveFormWidget($name)
    {
        if ($this->formWidgets === null) {
            $this->listFormWidgets();
        }

        $hints = $this->formWidgetHints;

        if (isset($hints[$name])) {
            return $hints[$name];
        }

        $_name = Str::normalizeClassName($name);
        if (isset($this->formWidgets[$_name])) {
            return $_name;
        }

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
                if (!is_array($widgets = $plugin->registerReportWidgets())) {
                    continue;
                }

                foreach ($widgets as $className => $widgetInfo) {
                    $this->registerReportWidget($className, $widgetInfo);
                }
            }
        }

        /**
         * @event system.reportwidgets.extendItems
         * Enables adding or removing report widgets.
         *
         * You will have access to the WidgetManager instance and be able to call the appropiate methods
         * $manager->registerReportWidget();
         * $manager->removeReportWidget();
         *
         * Example usage:
         *
         *     Event::listen('system.reportwidgets.extendItems', function($manager) {
         *          $manager->removeReportWidget('Acme\ReportWidgets\YourWidget');
         *     });
         *
         */
        Event::fire('system.reportwidgets.extendItems', [$this]);

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
     *
     *     WidgetManager::registerReportWidgets(function($manager){
     *         $manager->registerReportWidget('RainLab\GoogleAnalytics\ReportWidgets\TrafficOverview', [
     *             'name' => 'Google Analytics traffic overview',
     *             'context' => 'dashboard'
     *         ]);
     *     });
     *
     */
    public function registerReportWidgets(callable $definitions)
    {
        $this->reportWidgetCallbacks[] = $definitions;
    }

    /**
     * Remove a registered ReportWidget.
     * @param string $className Widget class name.
     * @return void
     */
    public function removeReportWidget($className)
    {
        if (!$this->reportWidgets) {
            throw new SystemException('Unable to remove a widget before widgets are loaded.');
        }

        unset($this->reportWidgets[$className]);
    }

}
