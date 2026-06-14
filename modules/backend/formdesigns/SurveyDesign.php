<?php namespace Backend\FormDesigns;

/**
 * SurveyDesign displays a form using horizontal layout with survey mode
 * enabled. Uses the same layout as BasicDesign.
 *
 * @package october\backend
 * @author Alexey Bobkov, Samuel Georges
 */
class SurveyDesign extends BasicDesign
{
    /**
     * __construct the behavior
     */
    public function __construct($controller)
    {
        parent::__construct($controller);

        // Share partials with BasicDesign
        $this->viewPath = $this->guessViewPathFrom(
            BasicDesign::class,
            '/partials'
        );
    }

    /**
     * extendFormWidgetConfig enables horizontal and survey mode
     */
    public function extendFormWidgetConfig(object $config): void
    {
        $config->horizontalMode = true;
        $config->surveyMode = true;
    }
}
