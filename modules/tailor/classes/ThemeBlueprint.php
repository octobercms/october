<?php namespace Tailor\Classes;

use Cms\Classes\Theme;

/**
 * ThemeBlueprint represents a blueprint file object, residing within a theme.
 * This is needed so the Editor can differentiate between file locations.
 *
 * @package october\tailor
 * @author Alexey Bobkov, Samuel Georges
 */
class ThemeBlueprint extends Blueprint
{
    /**
     * __construct
     */
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        if ($theme = Theme::getEditTheme() ?: Theme::getActiveTheme()) {
            $this->datasource = $theme->getPath() . '/blueprints';
            $this->datasourceTheme = $theme->getDirName();
        }
    }
}
