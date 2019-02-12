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
         * If no alias is set by the backend_user_preferences configuration.
         */
        if (!isset($this->alias)) {
            $this->alias = $properties['alias'] ?? $this->defaultAlias;
        }

        parent::__construct($controller);
    }
}
