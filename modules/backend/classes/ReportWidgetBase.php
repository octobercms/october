<?php namespace Backend\Classes;

/**
 * Report Widget base class
 * Report widgets are used inside the ReportContainer.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class ReportWidgetBase extends WidgetBase
{
    use \System\Traits\PropertyContainer;

    public function __construct($controller, $properties = [])
    {
        $this->properties = $this->validateProperties($properties);

        /*
         * Ensure the provided alias (if present) takes effect as the widget configuration is
         * not passed to the WidgetBase constructor which would normally take care of that
         */
        if (!isset($this->alias)) {
            $this->alias = $properties['alias'] ?? $this->defaultAlias;
        }

        parent::__construct($controller);
    }
}
