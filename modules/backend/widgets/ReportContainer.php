<?php namespace Backend\Widgets;

use Lang;
use Flash;
use Request;
use Backend\Classes\WidgetBase;
use Backend\Classes\DashManager;
use Backend\Models\UserPreference;
use System\Models\Parameter as SystemParameters;
use ApplicationException;
use ForbiddenException;

/**
 * ReportContainer has been deprecated
 * @deprecated this has been replaced by the `Backend\Widgets\Dash` widget
 */
class ReportContainer extends WidgetBase
{
    //
    // Configurable Properties
    //

    /**
     * @var string context is a unique name that defines the context where the container is used.
     * Widget settings are saved in a specific context. This allows to
     * have multiple report containers on different pages that have
     * different widgets and widget settings. Context names can contain
     * only Latin letters.
     */
    public $context = 'dashboard';

    /**
     * @var bool showReorder allows the user to reorder the widgets.
     */
    public $showReorder = true;

    /**
     * @var bool showConfigure allows the user to configure the widgets.
     */
    public $showConfigure = true;

    /**
     * @var bool showAddRemove determines whether widgets could be added and deleted.
     */
    public $showAddRemove = true;

    /**
     * @var bool showMakeDefault displays the "Make Default" button.
     */
    public $showMakeDefault = true;

    /**
     * @var array defaultWidgets to load.
     * This structure could be defined in the widget configuration file,
     * (for example config_report_container.yaml), example YAML structure:
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

    /**
     * @deprecated use showAddRemove
     */
    public $canAddAndDelete;

    //
    // Object Properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'reportContainer';

    /**
     * @var array reportWidgets used by this container.
     */
    protected $reportWidgets = [];

    /**
     * @var boolean reportsDefined determines if report widgets have been created.
     */
    protected $reportsDefined = false;

    /**
     * @inheritDoc
     */
    public function init()
    {
        $this->fillFromConfig([
            'context',
            'showReorder',
            'showConfigure',
            'showAddRemove',
            'showMakeDefault',
            'defaultWidgets',
            'canAddAndDelete', // @deprecated
        ]);

        // @deprecated
        if ($this->canAddAndDelete !== null) {
            $this->showAddRemove = (bool) $this->canAddAndDelete;
        }
    }

    /**
     * bindToController ensures report widgets are registered so they can also be bound to
     * the controller this allows their AJAX features to operate.
     * @return void
     */
    public function bindToController()
    {
        $this->defineReportWidgets();
        parent::bindToController();
    }

    /**
     * render this widget along with its collection of report widgets.
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
        $this->addCss('css/reportcontainer.css');
        $this->addJs('vendor/isotope/jquery.isotope.min.js');
        $this->addJs('js/reportcontainer.js');
    }

    //
    // AJAX handlers
    //

    /**
     * onResetWidgets
     */
    public function onResetWidgets()
    {
        if (!$this->showAddRemove) {
            throw new ForbiddenException;
        }

        $this->resetWidgets();

        $this->vars['widgets'] = $this->reportWidgets;

        Flash::success(__("Layout has been reset"));

        return ['#'.$this->getId('container-list') => $this->makePartial('widget_list')];
    }

    /**
     * onMakeLayoutDefault
     */
    public function onMakeLayoutDefault()
    {
        if (!$this->showMakeDefault) {
            throw new ForbiddenException;
        }

        $widgets = $this->getWidgetsFromUserPreferences();

        SystemParameters::set($this->getSystemParametersKey(), $widgets);

        Flash::success(__("Current layout is now the default"));
    }

    /**
     * onUpdateWidget
     */
    public function onUpdateWidget()
    {
        if (!$this->showConfigure) {
            throw new ForbiddenException;
        }

        $alias = Request::input('alias');

        $widget = $this->findWidgetByAlias($alias);

        $widget->setProperties(json_decode(Request::input('fields'), true));

        $this->saveWidgetProperties($alias, $widget->getProperties());

        return [
            '#'.$alias => $widget->render()
        ];
    }

    /**
     * onRemoveWidget
     */
    public function onRemoveWidget()
    {
        if (!$this->showAddRemove) {
            throw new ForbiddenException;
        }

        $alias = Request::input('alias');

        $this->removeWidget($alias);
    }

    /**
     * onLoadAddPopup
     */
    public function onLoadAddPopup()
    {
        if (!$this->showAddRemove) {
            throw new ForbiddenException;
        }

        $sizes = [];
        for ($i = 1; $i <= 12; $i++) {
            $sizes[$i] = $i < 12 ? $i : $i.' (' . __("full width") . ')';
        }

        $this->vars['sizes'] = $sizes;
        $this->vars['widgets'] = DashManager::instance()->listReportWidgets();

        return $this->makePartial('new_widget_popup');
    }

    /**
     * onAddWidget
     */
    public function onAddWidget()
    {
        if (!$this->showAddRemove) {
            throw new ForbiddenException;
        }

        $className = trim(Request::input('className'));
        $size = trim(Request::input('size'));

        if (!$className) {
            throw new ApplicationException("Please select a widget to add.");
        }

        if (!class_exists($className)) {
            throw new ApplicationException("The selected class doesn't exist.");
        }

        $widget = new $className($this->controller);
        if (!($widget instanceof \Backend\Classes\ReportWidgetBase)) {
            throw new ApplicationException("The selected class is not a report widget.");
        }

        $widgetInfo = $this->addWidget($widget, $size);

        return [
            '@#'.$this->getId('container-list') => $this->makePartial('widget', [
                'widget' => $widget,
                'widgetAlias' => $widgetInfo['alias'],
                'sortOrder' => $widgetInfo['sortOrder']
            ])
        ];
    }

    /**
     * onSetWidgetOrders
     */
    public function onSetWidgetOrders()
    {
        if (!$this->showReorder) {
            throw new ForbiddenException;
        }

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
    // Widget API
    //

    /**
     * addWidget
     */
    public function addWidget($widget, $size)
    {
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
            'class' => get_class($widget),
            'configuration' => $widget->getProperties(),
            'sortOrder' => $sortOrder
        ];

        $this->setWidgetsToUserPreferences($widgets);

        return [
            'alias' => $alias,
            'sortOrder' => $widgets[$alias]['sortOrder']
        ];
    }

    /**
     * removeWidget
     */
    protected function removeWidget($alias)
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        if (isset($widgets[$alias])) {
            unset($widgets[$alias]);
        }

        $this->setWidgetsToUserPreferences($widgets);
    }

    //
    // Methods for internal use
    //

    /**
     * defineReportWidgets registers the report widgets that will be included in this container.
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
     * makeReportWidget makes a single report widget object, returned array index:
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
        $availableReportWidgets = array_keys(DashManager::instance()->listReportWidgets());
        if (!class_exists($className) || !in_array($className, $availableReportWidgets)) {
            return;
        }

        $widget = new $className($this->controller, $configuration);
        $widget->bindToController();

        return ['widget' => $widget, 'sortOrder' => $widgetInfo['sortOrder']];
    }

    /**
     * resetWidgets
     */
    protected function resetWidgets()
    {
        $this->resetWidgetsUserPreferences();

        $this->reportsDefined = false;

        $this->defineReportWidgets();
    }

    /**
     * findWidgetByAlias
     */
    protected function findWidgetByAlias($alias)
    {
        $this->defineReportWidgets();

        $widgets = $this->reportWidgets;
        if (!isset($widgets[$alias])) {
            throw new ApplicationException('The specified widget is not found.');
        }

        return $widgets[$alias]['widget'];
    }

    /**
     * getWidgetPropertyConfig
     */
    protected function getWidgetPropertyConfig($widget)
    {
        $properties = $widget->defineProperties();

        $property = [
            'property' => 'ocWidgetWidth',
            'title' => __("Width :columns", ['columns' => '(1-12)']),
            'description' => __("The widget width, a number between 1 and 10."),
            'type' => 'dropdown',
            'validationPattern' => '^[0-9]+$',
            'validationMessage' => __("Please enter the widget width as a number between 1 and 10."),
            'options' => [
                1  => '1 ' . trans_choice("{1} column|[2,Inf] columns", 1),
                2  => '2 ' . trans_choice("{1} column|[2,Inf] columns", 2),
                3  => '3 ' . trans_choice("{1} column|[2,Inf] columns", 3),
                4  => '4 ' . trans_choice("{1} column|[2,Inf] columns", 4),
                5  => '5 ' . trans_choice("{1} column|[2,Inf] columns", 5),
                6  => '6 ' . trans_choice("{1} column|[2,Inf] columns", 6),
                7  => '7 ' . trans_choice("{1} column|[2,Inf] columns", 7),
                8  => '8 ' . trans_choice("{1} column|[2,Inf] columns", 8),
                9  => '9 ' . trans_choice("{1} column|[2,Inf] columns", 9),
                10 => '10 ' . trans_choice("{1} column|[2,Inf] columns", 10),
                11 => '11 ' . trans_choice("{1} column|[2,Inf] columns", 11),
                12 => '12 ' . trans_choice("{1} column|[2,Inf] columns", 12)
            ]
        ];
        $result[] = $property;

        $property = [
            'property' => 'ocWidgetNewRow',
            'title' => __("Force new row"),
            'description' => __("Put the widget in a new row."),
            'type' => 'checkbox'
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

    /**
     * getWidgetPropertyValues
     */
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

    /**
     * getWidgetsFromUserPreferences
     */
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

    /**
     * setWidgetsToUserPreferences
     */
    protected function setWidgetsToUserPreferences($widgets)
    {
        UserPreference::forUser()->set($this->getUserPreferencesKey(), $widgets);
    }

    /**
     * resetWidgetsUserPreferences
     */
    protected function resetWidgetsUserPreferences()
    {
        UserPreference::forUser()->reset($this->getUserPreferencesKey());
    }

    /**
     * saveWidgetProperties
     */
    protected function saveWidgetProperties($alias, $properties)
    {
        $widgets = $this->getWidgetsFromUserPreferences();

        if (isset($widgets[$alias])) {
            $widgets[$alias]['configuration'] = $properties;

            $this->setWidgetsToUserPreferences($widgets);
        }
    }

    /**
     * getUserPreferencesKey
     */
    protected function getUserPreferencesKey()
    {
        return 'backend::reportwidgets.'.$this->context;
    }

    /**
     * getSystemParametersKey
     */
    protected function getSystemParametersKey()
    {
        return 'backend::reportwidgets.default.'.$this->context;
    }
}
