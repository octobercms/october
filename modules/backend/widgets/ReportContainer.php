<?php namespace Backend\Widgets;

use File;
use Lang;
use Flash;
use Request;
use BackendAuth;
use Backend\Classes\WidgetBase;
use Backend\Classes\WidgetManager;
use Backend\Models\UserPreference;
use System\Models\Parameter as SystemParameters;
use ApplicationException;

/**
 * Report Container Widget
 * Creates an area hosting report widgets.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ReportContainer extends WidgetBase
{
    //
    // Configurable properties
    //

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
     *
     * defaultWidgets:
     *     trafficOverview:
     *         class: RainLab\GoogleAnalytics\ReportWidgets\TrafficOverview
     *         sortOrder: 1
     *         configuration:
     *             title: 'Traffic overview'
     *             ocWidgetWidth: 12
     */
    public $defaultWidgets = [];

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'reportContainer';

    /**
     * @var array Collection of all report widgets used by this container.
     */
    protected $reportWidgets = [];

    /**
     * @var boolean Determines if report widgets have been created.
     */
    protected $reportsDefined = false;

    /**
     * Constructor.
     */
    public function __construct($controller, $configuration = null)
    {
        if (!$configuration) {
            $configuration = 'config_report_container.yaml';
        }

        if (!is_array($configuration)) {
            $path = $controller->getConfigPath($configuration);
            if (File::isFile($path)) {
                $configuration = $this->makeConfig($path);
            }
            else {
                $configuration = [];
            }
        }

        parent::__construct($controller, $configuration);

        $this->fillFromConfig();
        $this->bindToController();
    }

    /**
     * Ensure report widgets are registered so they can also be bound to
     * the controller this allows their AJAX features to operate.
     * @return void
     */
    public function bindToController()
    {
        $this->defineReportWidgets();
        parent::bindToController();
    }

    /**
     * Renders this widget along with its collection of report widgets.
     */
    public function render()
    {
        $this->defineReportWidgets();
        $this->vars['widgets'] = $this->reportWidgets;
        return $this->makePartial('container');
    }

    /**
     * @inheritDoc
     */
    protected function loadAssets()
    {
        $this->addCss('css/reportcontainer.css', 'core');
        $this->addJs('vendor/isotope/jquery.isotope.min.js', 'core');
        $this->addJs('js/reportcontainer.js', 'core');
    }

    //
    // Event handlers
    //

    public function onResetWidgets()
    {
        $this->resetWidgets();

        $this->vars['widgets'] = $this->reportWidgets;

        Flash::success(Lang::get('backend::lang.dashboard.reset_layout_success'));

        return ['#'.$this->getId('container-list') => $this->makePartial('widget_list')];
    }

    public function onMakeLayoutDefault()
    {
        if (!BackendAuth::getUser()->hasAccess('backend.manage_default_dashboard')) {
            throw new ApplicationException("You do not have permission to do that.");
        }

        $widgets = $this->getWidgetsFromUserPreferences();

        SystemParameters::set($this->getSystemParametersKey(), $widgets);

        Flash::success(Lang::get('backend::lang.dashboard.make_default_success'));
    }

    public function onUpdateWidget()
    {
        $alias = Request::input('alias');

        $widget = $this->findWidgetByAlias($alias);

        $widget->setProperties(json_decode(Request::input('fields'), true));

        $this->saveWidgetProperties($alias, $widget->getProperties());

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
        for ($i = 1; $i <= 12; $i++) {
            $sizes[$i] = $i < 12 ? $i : $i.' (' . Lang::get('backend::lang.dashboard.full_width') . ')';
        }

        $this->vars['sizes'] = $sizes;
        $this->vars['widgets'] = WidgetManager::instance()->listReportWidgets();

        return $this->makePartial('new_widget_popup');
    }

    public function onAddWidget()
    {
        $className = trim(Request::input('className'));
        $size = trim(Request::input('size'));

        if (!$className) {
            throw new ApplicationException('Please select a widget to add.');
        }

        if (!class_exists($className)) {
            throw new ApplicationException('The selected class doesn\'t exist.');
        }

        $widget = new $className($this->controller);
        if (!($widget instanceof \Backend\Classes\ReportWidgetBase)) {
            throw new ApplicationException('The selected class is not a report widget.');
        }

        $widgetInfo = $this->addWidget($widget, $size);

        return [
            '@#'.$this->getId('container-list') => $this->makePartial('widget', [
                'widget'      => $widget,
                'widgetAlias' => $widgetInfo['alias'],
                'sortOrder'   => $widgetInfo['sortOrder']
            ])
        ];
    }

    public function addWidget($widget, $size)
    {
        if (!$this->canAddAndDelete) {
            throw new ApplicationException('Access denied.');
        }

        $widgets = $this->getWidgetsFromUserPreferences();

        $num = count($widgets);
        do {
            $num++;
            $alias = 'report_container_'.$this->context.'_'.$num;
        }
        while (array_key_exists($alias, $widgets));

        // Ensure that the widget's alias is correctly set for this request
        $widget->alias = $alias;

        $sortOrder = 0;
        foreach ($widgets as $widgetInfo) {
            $sortOrder = max($sortOrder, $widgetInfo['sortOrder']);
        }

        $sortOrder++;

        $widget->setProperty('ocWidgetWidth', $size);

        $widgets[$alias] = [
            'class'         => get_class($widget),
            'configuration' => $widget->getProperties(),
            'sortOrder'     => $sortOrder
        ];

        $this->setWidgetsToUserPreferences($widgets);

        return [
            'alias'     => $alias,
            'sortOrder' => $widgets[$alias]['sortOrder']
        ];
    }

    public function onSetWidgetOrders()
    {
        $aliases = trim(Request::input('aliases'));
        $orders = trim(Request::input('orders'));

        if (!$aliases) {
            throw new ApplicationException('Invalid aliases string.');
        }

        if (!$orders) {
            throw new ApplicationException('Invalid orders string.');
        }

        $aliases = explode(',', $aliases);
        $orders = explode(',', $orders);

        if (count($aliases) != count($orders)) {
            throw new ApplicationException('Invalid data posted.');
        }

        $widgets = $this->getWidgetsFromUserPreferences();
        foreach ($aliases as $index => $alias) {
            if (isset($widgets[$alias])) {
                $widgets[$alias]['sortOrder'] = $orders[$index];
            }
        }

        $this->setWidgetsToUserPreferences($widgets);
    }

    //
    // Methods for internal use
    //

    /**
     * Registers the report widgets that will be included in this container.
     * The chosen widgets are based on the user preferences.
     */
    protected function defineReportWidgets()
    {
        if ($this->reportsDefined) {
            return;
        }

        $result = [];
        $widgets = $this->getWidgetsFromUserPreferences();

        foreach ($widgets as $alias => $widgetInfo) {
            if ($widget = $this->makeReportWidget($alias, $widgetInfo)) {
                $result[$alias] = $widget;
            }
        }

        uasort($result, function ($a, $b) {
            return $a['sortOrder'] - $b['sortOrder'];
        });

        $this->reportWidgets = $result;

        $this->reportsDefined = true;
    }

    /**
     * Makes a single report widget object, returned array index:
     * - widget: The widget object (Backend\Classes\ReportWidgetBase)
     * - sortOrder: The current sort order
     *
     * @param  string $alias
     * @param  array $widgetInfo
     * @return array
     */
    protected function makeReportWidget($alias, $widgetInfo)
    {
        $configuration = $widgetInfo['configuration'];
        $configuration['alias'] = $alias;

        $className = $widgetInfo['class'];
        $availableReportWidgets = array_keys(WidgetManager::instance()->listReportWidgets());
        if (!class_exists($className) || !in_array($className, $availableReportWidgets)) {
            return;
        }

        $widget = new $className($this->controller, $configuration);
        $widget->bindToController();

        return ['widget' => $widget, 'sortOrder' => $widgetInfo['sortOrder']];
    }

    protected function resetWidgets()
    {
        $this->resetWidgetsUserPreferences();

        $this->reportsDefined = false;

        $this->defineReportWidgets();
    }

    protected function removeWidget($alias)
    {
        if (!$this->canAddAndDelete) {
            throw new ApplicationException('Access denied.');
        }

        $widgets = $this->getWidgetsFromUserPreferences();

        if (isset($widgets[$alias])) {
            unset($widgets[$alias]);
        }

        $this->setWidgetsToUserPreferences($widgets);
    }

    protected function findWidgetByAlias($alias)
    {
        $this->defineReportWidgets();

        $widgets = $this->reportWidgets;
        if (!isset($widgets[$alias])) {
            throw new ApplicationException('The specified widget is not found.');
        }

        return $widgets[$alias]['widget'];
    }

    protected function getWidgetPropertyConfig($widget)
    {
        $properties = $widget->defineProperties();

        $property = [
            'property'          => 'ocWidgetWidth',
            'title'             => Lang::get('backend::lang.dashboard.widget_columns_label', ['columns' => '(1-12)']),
            'description'       => Lang::get('backend::lang.dashboard.widget_columns_description'),
            'type'              => 'dropdown',
            'validationPattern' => '^[0-9]+$',
            'validationMessage' => Lang::get('backend::lang.dashboard.widget_columns_error'),
            'options'           => [
                1  => '1 ' . Lang::choice('backend::lang.dashboard.columns', 1),
                2  => '2 ' . Lang::choice('backend::lang.dashboard.columns', 2),
                3  => '3 ' . Lang::choice('backend::lang.dashboard.columns', 3),
                4  => '4 ' . Lang::choice('backend::lang.dashboard.columns', 4),
                5  => '5 ' . Lang::choice('backend::lang.dashboard.columns', 5),
                6  => '6 ' . Lang::choice('backend::lang.dashboard.columns', 6),
                7  => '7 ' . Lang::choice('backend::lang.dashboard.columns', 7),
                8  => '8 ' . Lang::choice('backend::lang.dashboard.columns', 8),
                9  => '9 ' . Lang::choice('backend::lang.dashboard.columns', 9),
                10 => '10 ' . Lang::choice('backend::lang.dashboard.columns', 10),
                11 => '11 ' . Lang::choice('backend::lang.dashboard.columns', 11),
                12 => '12 ' . Lang::choice('backend::lang.dashboard.columns', 12)
            ]
        ];
        $result[] = $property;

        $property = [
            'property'    => 'ocWidgetNewRow',
            'title'       => Lang::get('backend::lang.dashboard.widget_new_row_label'),
            'description' => Lang::get('backend::lang.dashboard.widget_new_row_description'),
            'type'        => 'checkbox'
        ];

        $result[] = $property;
        foreach ($properties as $name => $params) {
            $property = [
                'property' => $name,
                'title'    => isset($params['title']) ? Lang::get($params['title']) : $name,
                'type'     => $params['type'] ?? 'string'
            ];

            foreach ($params as $name => $value) {
                if (isset($property[$name])) {
                    continue;
                }

                $property[$name] = !is_array($value) ? Lang::get($value) : $value;
            }

            $result[] = $property;
        }

        return json_encode($result);
    }

    protected function getWidgetPropertyValues($widget)
    {
        $result = [];

        $properties = $widget->defineProperties();
        foreach ($properties as $name => $params) {
            $value = $widget->property($name);
            if (is_string($value)) {
                $value = Lang::get($value);
            }
            $result[$name] = $value;
        }

        $result['ocWidgetWidth'] = $widget->property('ocWidgetWidth');
        $result['ocWidgetNewRow'] = $widget->property('ocWidgetNewRow');

        return json_encode($result);
    }

    //
    // User and system value storage
    //

    protected function getWidgetsFromUserPreferences()
    {
        $defaultWidgets = SystemParameters::get($this->getSystemParametersKey(), $this->defaultWidgets);

        $widgets = UserPreference::forUser()
            ->get($this->getUserPreferencesKey(), $defaultWidgets);

        if (!is_array($widgets)) {
            return [];
        }

        return $widgets;
    }

    protected function setWidgetsToUserPreferences($widgets)
    {
        UserPreference::forUser()->set($this->getUserPreferencesKey(), $widgets);
    }

    protected function resetWidgetsUserPreferences()
    {
        UserPreference::forUser()->reset($this->getUserPreferencesKey());
    }

    protected function saveWidgetProperties($alias, $properties)
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        if (isset($widgets[$alias])) {
            $widgets[$alias]['configuration'] = $properties;

            $this->setWidgetsToUserPreferences($widgets);
        }
    }

    protected function getUserPreferencesKey()
    {
        return 'backend::reportwidgets.'.$this->context;
    }

    protected function getSystemParametersKey()
    {
        return 'backend::reportwidgets.default.'.$this->context;
    }
}
