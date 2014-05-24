<?php namespace Backend\Widgets;

use Backend\Classes\WidgetBase;
use System\Classes\ApplicationException;
use Request;
use Backend\Classes\WidgetManager;
use Backend\Models\UserPreferences;
use File;

/**
 * Report Container Widget
 * Creates an area hosting report widgets.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ReportContainer extends WidgetBase
{
    /**
     * @var string The unique report context name
     * Defines the context where the container is used.
     * Widget settings are saved in a specific context. This allows to
     * have multiple report containers on different pages that have
     * different widgets and widget settings. Context names can contain
     * only Latin letters.
     */
    public $context = 'dashboard';

    /**
     * @var string Determines whether widgets could be added and deleted.
     */
    public $canAddAndDelete = true;

    /**
     * @var array A list of default widgets to load.
     * This structure could be defined in the widget configuration file (for example config_report_container.yaml).
     * Example YAML structure:
     * defaultWidgets:
     *   trafficOverview:
     *     class: RainLab\GoogleAnalytics\ReportWidgets\TrafficOverview
     *     sortOrder: 1
     *     configuration: 
     *       title: 'Traffic overview'
     *       ocWidgetWidth: 10
     */
    public $defaultWidgets = [];

    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'reportContainer';

    public function __construct($controller)
    {
        parent::__construct($controller, []);
        $this->bindToController();

        $configFile = 'config_' . snake_case($this->alias) . '.yaml';

        $path = $controller->getConfigPath($configFile);
        if (File::isFile($path)) {
            $config = $this->makeConfig($configFile);

            foreach ($config as $field=>$value) {
                if (property_exists($this, $field))
                    $this->$field = $value;
            }
        }
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->vars['widgets'] = $this->loadWidgets();
        return $this->makePartial('container');
    }

    /**
     * {@inheritDoc}
     */
    public function loadAssets()
    {
        $this->addCss('css/reportcontainer.css', 'core');
        $this->addJs('vendor/isotope/jquery.isotope.min.js', 'core');
        $this->addJs('js/reportcontainer.js', 'core');
    }

    //
    // Event handlers
    //

    public function onUpdateWidget()
    {
        $alias = Request::input('alias');

        $widget = $this->findWidgetByAlias($alias);
        $this->saveWidgetProperties($alias, $widget->setProperties(
            json_decode(Request::input('fields'), true)
        ));

        return [
            '#'.$alias => $widget->render()
        ];
    }

    public function onRemoveWidget()
    {
        $alias = Request::input('alias');

        $this->removeWidget($alias);
    }

    public function onLoadAddPopup()
    {
        $sizes = [];
        for ($i = 1; $i <= 10; $i++)
            $sizes[$i] = $i < 10 ? $i : $i.' (full width)';

        $this->vars['sizes'] = $sizes;
        $this->vars['widgets'] = WidgetManager::instance()->listReportWidgets();

        return $this->makePartial('new_widget_popup');
    }

    public function onAddWidget()
    {
        $className = trim(Request::input('className'));
        $size = trim(Request::input('size'));

        if (!$className)
            throw new ApplicationException('Please select a widget to add.');

        if (!class_exists($className))
            throw new ApplicationException('The selected class doesn\'t exist.');

        $widget = new $className($this->controller);
        if (!($widget instanceof \Backend\Classes\ReportWidgetBase))
            throw new ApplicationException('The selected class is not a report widget.');

        $widgetInfo = $this->addWidget($widget, $size);

        return [
            '@#'.$this->getId('container-list') => $this->makePartial('widget', [
                'widget' => $widget,
                'widgetAlias' => $widgetInfo['alias'],
                'sortOrder' => $widgetInfo['sortOrder']
            ])
        ];
    }

    public function addWidget($widget, $size)
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        $num =  count($widgets);
        do {
            $num++;
            $alias = 'report_container_'.$this->context.'_'.$num;
        } while (array_key_exists($alias, $widgets));

        $sortOrder = 0;
        foreach ($widgets as $widgetInfo)
            $sortOrder = max($sortOrder, $widgetInfo['sortOrder']);

        $sortOrder++;

        $widget->setProperty('ocWidgetWidth', $size);

        $widgets[$alias] = [
            'class'         => get_class($widget),
            'configuration' => $widget->getProperties(),
            'sortOrder'     => $sortOrder
        ];

        $this->setWidgetsToUserPreferences($widgets);
        return ['alias'=>$alias, 'sortOrder'=>$widgets[$alias]['sortOrder']];
    }

    public function onSetWidgetOrders()
    {
        $aliases = trim(Request::input('aliases'));
        $orders = trim(Request::input('orders'));

        if (!$aliases)
            throw new ApplicationException('Invalid aliases string.');

        if (!$orders)
            throw new ApplicationException('Invalid orders string.');

        $aliases = explode(',', $aliases);
        $orders = explode(',', $orders);

        if (count($aliases) != count($orders))
            throw new ApplicationException('Invalid data posted.');

        $widgets = $this->getWidgetsFromUserPreferences();
        foreach ($aliases as $index=>$alias) {
            if (isset($widgets[$alias]))
                $widgets[$alias]['sortOrder'] = $orders[$index];
        }

        $this->setWidgetsToUserPreferences($widgets);
    }

    //
    // Methods for the internal use
    //

    protected function loadWidgets()
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        $result = [];
        foreach ($widgets as $alias => $widgetInfo) {
            $configuration = $widgetInfo['configuration'];
            $configuration['alias'] = $alias;

            $className = $widgetInfo['class'];
            if (!class_exists($className))
                continue;

            $widget = new $className($this->controller, $configuration);
            $widget->bindToController();

            $result[$alias] = ['widget' => $widget, 'sortOrder' => $widgetInfo['sortOrder']];
        }

        uasort($result, function($a, $b){
            return $a['sortOrder'] - $b['sortOrder'];
        });

        return $result;
    }

    protected function getWidgetsFromUserPreferences()
    {
        return UserPreferences::forUser()->get($this->getUserPreferencesKey(), $this->defaultWidgets);
    }

    protected function setWidgetsToUserPreferences($widgets)
    {
        UserPreferences::forUser()->set($this->getUserPreferencesKey(), $widgets);
    }

    protected function saveWidgetProperties($alias, $properties)
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        if (isset($widgets[$alias])) {
            $widgets[$alias]['configuration'] = $properties;

            $this->setWidgetsToUserPreferences($widgets);
        }
    }

    protected function removeWidget($alias)
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        if (isset($widgets[$alias]))
            unset($widgets[$alias]);

        $this->setWidgetsToUserPreferences($widgets);
    }

    protected function findWidgetByAlias($alias)
    {
        $widgets = $this->loadWidgets();
        if (!isset($widgets[$alias]))
            throw new ApplicationException('The specified widget is not found.');

        return $widgets[$alias]['widget'];
    }

    protected function getWidgetPropertyConfig($widget)
    {
        $properties = $widget->defineProperties();

        $property = [
            'property'          => 'ocWidgetWidth',
            'title'             => 'Width (1-10)',
            'description'       => 'The widget width, a number between 1 and 10.',
            'type'              => 'dropdown',
            'validationPattern' => '^[0-9]+$',
            'validationMessage' => 'Please enter the widget width as a number between 1 and 10.',
            'options'           => [
                1  => '1 column',
                2  => '2 columns',
                3  => '3 columns',
                4  => '4 columns',
                5  => '5 columns',
                6  => '6 columns',
                7  => '7 columns',
                8  => '8 columns',
                9  => '9 columns',
                10 => '10 columns'
            ]
        ];
        $result[] = $property;

        $property = [
            'property'    => 'ocWidgetNewRow',
            'title'       => 'Force new row',
            'description' => 'Put the widget in a new row.',
            'type'        => 'checkbox'
        ];

        $result[] = $property;
        foreach ($properties as $name=>$params) {
            $property = [
                'property'          => $name,
                'title'             => isset($params['title']) ? $params['title'] : $name,
                'description'       => isset($params['description']) ? $params['description'] : null,
                'type'              => isset($params['type']) ? $params['type'] : 'string',
                'validationPattern' => isset($params['validationPattern']) ? $params['validationPattern'] : null,
                'validationMessage' => isset($params['validationMessage']) ? $params['validationMessage'] : null
            ];

            $result[] = $property;
        }

        return json_encode($result);
    }

    protected function getWidgetPropertyValues($widget)
    {
        $result = [];

        $properties = $widget->defineProperties();
        foreach ($properties as $name=>$params)
            $result[$name] = $widget->property($name);

        $result['ocWidgetWidth'] = $widget->property('ocWidgetWidth');
        $result['ocWidgetNewRow'] = $widget->property('ocWidgetNewRow');

        return json_encode($result);
    }

    protected function getUserPreferencesKey()
    {
        return 'backend::reportwidgets.'.$this->context;
    }
}