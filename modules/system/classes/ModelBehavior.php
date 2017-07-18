<?php namespace System\Classes;

use Lang;
use ApplicationException;
use October\Rain\Database\ModelBehavior as ModelBehaviorBase;

/**
 * Base class for model behaviors.
 *
 * @package october\system
 * @author Alexey Bobkov, Samuel Georges
 */
class ModelBehavior extends ModelBehaviorBase
{
    /**
     * @var array Properties that must exist in the model using this behavior.
     */
    protected $requiredProperties = [];

    /**
     * Constructor
     * @param October\Rain\Database\Model $model The extended model.
     */
    public function __construct($model)
    {
        parent::__construct($model);

        /*
         * Validate model properties
         */
        foreach ($this->requiredProperties as $property) {
            if (!isset($model->{$property})) {
                throw new ApplicationException(Lang::get('system::lang.behavior.missing_property', [
                    'class' => get_class($model),
                    'property' => $property,
                    'behavior' => get_called_class()
                ]));
            }
        }
    }
}
