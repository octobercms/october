<?php namespace Dashboard\Classes;

use System\Classes\VueComponentBase;
use Dashboard\Classes\ReportFetchData;
use SystemException;

/**
 * VueReportWidgetBase is a base class for Vue-based dashboard widgets
 *
 * @package october\dashboard
 * @author Alexey Bobkov, Samuel Georges
 */
abstract class VueReportWidgetBase extends VueComponentBase
{
    use \System\Traits\PropertyContainer;

    /**
     * @var DashReport dashReport object containing general dash report information.
     */
    protected $dashReport;

    /**
     * @var string alias defined for this widget.
     */
    public $alias;

    /**
     * @var string defaultAlias to identify this widget.
     */
    protected $defaultAlias = 'widget';

    /**
     * __construct
     */
    public function __construct($controller, $dashReport = null, $properties = [])
    {
        $this->dashReport = $dashReport;
        $this->properties = $this->validateProperties($properties);

        // Ensure the provided alias (if present) takes effect as the widget configuration is
        // not passed to the WidgetBase constructor which would normally take care of that
        if (!isset($this->alias)) {
            $this->alias = $properties['alias'] ?? $this->defaultAlias;
        }

        parent::__construct($controller);
    }

    /**
     * bindToController binds a widget to the controller for safe use.
     * @return void
     */
    public function bindToController()
    {
        $this->controller->registerVueComponent($this::class);
    }

    /**
     * getData
     */
    abstract public function getData(ReportFetchData $data): mixed;

    /**
     * runHandler
     */
    public function runHandler(array $widgetConfig, string $handlerName, array $extraData): mixed
    {
        if (!preg_match('/^on[a-z0-9_]+/i', $handlerName)) {
            throw new SystemException('Invalid handler name');
        }

        if (!method_exists($this, $handlerName)) {
            throw new SystemException('Handler does not exist');
        }

        return $this->{$handlerName}($widgetConfig, $extraData);
    }
}
