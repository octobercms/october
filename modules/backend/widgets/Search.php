<?php namespace Backend\Widgets;

use Lang;
use Backend\Classes\WidgetBase;

/**
 * Search Widget
 * Used for building a toolbar, Renders a search container.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class Search extends WidgetBase
{
    //
    // Configurable properties
    //

    /**
     * @var string Search placeholder text.
     */
    public $prompt;

    /**
     * @var bool Field show grow when selected.
     */
    public $growable = true;

    /**
     * @var string Custom partial file definition, in context of the controller.
     */
    public $partial;

    /**
     * @var string Defines the search mode. Commonly passed to the searchWhere() query.
     */
    public $mode;

    /**
     * @var string Custom scope method name. Commonly passed to the query.
     */
    public $scope;

    /**
     * @var bool Search on enter key instead of every key stroke.
     */
    public $searchOnEnter = false;

    //
    // Object properties
    //

    /**
     * @inheritDoc
     */
    protected $defaultAlias = 'search';

    /**
     * @var string Active search term pulled from session data.
     */
    protected $activeTerm;

    /**
     * @var array List of CSS classes to apply to the list container element.
     */
    public $cssClasses = [];

    /**
     * Initialize the widget, called by the constructor and free from its parameters.
     */
    public function init()
    {
        $this->fillFromConfig([
            'prompt',
            'partial',
            'growable',
            'scope',
            'mode',
            'searchOnEnter',
        ]);

        /*
         * Add CSS class styles
         */
        $this->cssClasses[] = 'icon search';

        if ($this->growable) {
            $this->cssClasses[] = 'growable';
        }
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();

        if ($this->partial) {
            return $this->controller->makePartial($this->partial);
        }

        return $this->makePartial('search');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->vars['cssClasses'] = implode(' ', $this->cssClasses);
        $this->vars['placeholder'] = Lang::get($this->prompt);
        $this->vars['value'] = $this->getActiveTerm();
        $this->vars['searchOnEnter'] = $this->searchOnEnter;
    }

    /**
     * Search field has been submitted.
     */
    public function onSubmit()
    {
        /*
         * Save or reset search term in session
         */
        $this->setActiveTerm(post($this->getName()));

        /*
         * Trigger class event, merge results as viewable array
         */
        $params = func_get_args();
        $result = $this->fireEvent('search.submit', [$params]);
        if ($result && is_array($result)) {
            return call_user_func_array('array_merge', $result);
        }
    }

    /**
     * Returns an active search term for this widget instance.
     */
    public function getActiveTerm()
    {
        return $this->activeTerm = $this->getSession('term', '');
    }

    /**
     * Sets an active search term for this widget instance.
     */
    public function setActiveTerm($term)
    {
        if (strlen($term)) {
            $this->putSession('term', $term);
        } else {
            $this->resetSession();
        }

        $this->activeTerm = $term;
    }

    /**
     * Returns a value suitable for the field name property.
     * @return string
     */
    public function getName()
    {
        return $this->alias . '[term]';
    }
}
