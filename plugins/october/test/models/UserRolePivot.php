<?php namespace October\Test\Models;

use October\Rain\Database\Pivot;

/**
 * User-Role Pivot Model
 */
class UserRolePivot extends Pivot
{

    use \October\Rain\Database\Traits\Validation;

    /**
     * @var array Rules
     */
    public $rules = [
        'clearance_level' => 'required|min:3',
    ];

}