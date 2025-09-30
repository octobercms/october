<?php namespace Cms\Twig\TokenParser;

/**
 * AjaxPartialTokenParser for the `{% ajaxPartial %}` Twig tag.
 *
 *     {% ajaxPartial "sidebar" %}
 *
 * @package october\cms
 * @author Alexey Bobkov, Samuel Georges
 */
class AjaxPartialTokenParser extends PartialTokenParser
{
    /**
     * getTag name associated with this token parser
     */
    public function getTag()
    {
        return 'ajaxPartial';
    }
}
