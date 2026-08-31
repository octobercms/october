<?php namespace Tailor\VueComponents;

use System\Classes\VueComponentBase;

/**
 * SubmissionControls for Tailor submission entries as a Vue component.
 *
 * Provides approve, reject and spam actions in place of the standard
 * publishing controls, which do not apply to the submission workflow.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class SubmissionControls extends VueComponentBase
{
    /**
     * @var string componentName is the Vue component tag name.
     */
    protected $componentName = 'tailor-component-submissioncontrols';

    /**
     * @var array require
     */
    protected $require = [
        \Backend\VueComponents\Popover::class
    ];
}
