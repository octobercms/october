<?php namespace Backend\Widgets;

use Input;
use October\Rain\Support\Util;
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
    /**
     * {@inheritDoc}
     */
    public $defaultAlias = 'search';

    /**
     * @var string Search placeholder text.
     */
    public $placeholder;

    /**
     * @var bool Field show grow when selected.
     */
    public $growable = true;

    /**
     * @var string Active search term pulled from session data.
     */
    public $activeTerm;

    /**
     * @var string Custom partial file definition, in context of the controller.
     */
    public $customPartial;

    /**
     * @var array List of CSS classes to apply to the list container element.
     */
    public $cssClasses = [];

    /**
     * Constructor.
     */
    public function __construct($controller, $configuration = [])
    {
        parent::__construct($controller, $configuration);

        /*
         * Process configuration
         */
        if (isset($this->config->prompt))
            $this->placeholder = trans($this->config->prompt);

        if (isset($this->config->partial))
            $this->customPartial = $this->config->partial;

        if (isset($this->config->growable))
            $this->growable = $this->config->growable;

        /*
         * Add CSS class styles
         */
        $this->cssClasses[] = 'icon search';

        if ($this->growable)
            $this->cssClasses[] = 'growable';
    }

    /**
     * Renders the widget.
     */
    public function render()
    {
        $this->prepareVars();

        if ($this->customPartial)
            return $this->controller->makePartial($this->customPartial);
        else
            return $this->makePartial('search');
    }

    /**
     * Prepares the view data
     */
    public function prepareVars()
    {
        $this->vars['cssClasses'] = implode(' ', $this->cssClasses);
        $this->vars['placeholder'] = $this->placeholder;
        $this->vars['value'] = $this->getActiveTerm();
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
        if ($result && is_array($result))
            return Util::arrayMerge($result);
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
        if (strlen($term))
            $this->putSession('term', $term);
        else
            $this->resetSession();

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