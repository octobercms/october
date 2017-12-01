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
    //
    // Configurable properties
    //

    /**
     * @var string Partial name containing the toolbar buttons
     */
    public $buttons;

    /**
     * @var array|string Search widget configuration or partial name, optional.
     */
    public $search;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'toolbar';

    /**
     * @var WidgetBase Reference to the search widget object.
     */
    protected $searchWidget;

    /**
     * @var array List of CSS classes to apply to the toolbar container element
     */
    public $cssClasses = [];

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->fillFromConfig([
            'buttons',
            'search',
        ]);

        /*
         * Prepare the search widget (optional)
         */
        if (isset($this->search)) {

            if (is_string($this->search)) {
                $searchConfig = $this->makeConfig(['partial' => $this->search]);
            }
            else {
                $searchConfig = $this->makeConfig($this->search);
            }

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
        if (!isset($this->buttons)) {
            return false;
        }

        return $this->controller->makePartial($this->buttons, $this->vars);
    }
}
