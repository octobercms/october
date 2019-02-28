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

        parent::__construct($controller);
    }
}
