<?php namespace Backend\Widgets;

use Backend\Classes\WidgetBase;

/**
 * Toolbar Widget
 * Used for building a toolbar, renders a toolbar.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Toolbar extends WidgetBase
{
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'toolbar';

    /**
     * @var WidgetBase Reference to the search widget object.
     */
    protected $searchWidget;

    /**
     * @var string Name of partial containing control panel.
     */
    public $controlPanel;

    /**
     * @var array List of CSS classes to apply to the toolbar container element
     */
    public $cssClasses = [];

    /**
     * Constructor.
     */
    public function __construct($controller, $configuration = [])
    {
        parent::__construct($controller, $configuration);

        /*
         * Prepare the search widget (optional)
         */
        if (isset($this->config->search)) {

            if (is_string($this->config->search))
                $searchConfig = $this->makeConfig(['partial' => $this->config->search]);
            else
                $searchConfig = $this->makeConfig($this->config->search);

            $searchConfig->alias = $this->alias . 'Search';
            $this->searchWidget = $this->makeWidget('Backend\Widgets\Search', $searchConfig);
            $this->searchWidget->bindToController();
        }
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();
        return $this->makePartial('toolbar');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->vars['search'] = $this->searchWidget ? $this->searchWidget->render() : '';
        $this->vars['cssClasses'] = implode(' ', $this->cssClasses);
        $this->vars['controlPanel'] = $this->makeControlPanel();
    }

    public function getSearchWidget()
    {
        return $this->searchWidget;
    }

    public function makeControlPanel()
    {
        if (!isset($this->config->buttons))
            return false;

        return $this->controller->makePartial($this->config->buttons, $this->vars);
    }
}